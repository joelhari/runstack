package ch.joelbytes.runstack.activity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;

import java.io.InputStream;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

class ActivityServiceTests {

    @Test
    void getsAllActivitiesFromRepository() {
        ActivityRepository repository = mock(ActivityRepository.class);
        Activity activity = new Activity();
        when(repository.findAll()).thenReturn(List.of(activity));
        ActivityService service = new ActivityService(repository, mock(FitActivityParser.class));

        List<Activity> result = service.getAllActivities();

        assertThat(result).containsExactly(activity);
        verify(repository).findAll();
    }

    @Test
    void getsActivityByIdFromRepository() {
        ActivityRepository repository = mock(ActivityRepository.class);
        Activity activity = new Activity();
        when(repository.findById(42L)).thenReturn(Optional.of(activity));
        ActivityService service = new ActivityService(repository, mock(FitActivityParser.class));

        Activity result = service.getActivity(42L);

        assertThat(result).isSameAs(activity);
        verify(repository).findById(42L);
    }

    @Test
    void throwsNotFoundForUnknownActivity() {
        ActivityRepository repository = mock(ActivityRepository.class);
        when(repository.findById(99L)).thenReturn(Optional.empty());
        ActivityService service = new ActivityService(repository, mock(FitActivityParser.class));

        assertThatThrownBy(() -> service.getActivity(99L))
                .isInstanceOf(ActivityNotFoundException.class)
                .hasMessage("Activity with id 99 was not found");
    }

    @Test
    void getsActivityLaps() {
        ActivityRepository repository = mock(ActivityRepository.class);
        Activity activity = new Activity();
        ActivityLap lap = new ActivityLap();
        lap.setLapIndex(0);
        activity.addLap(lap);
        when(repository.findById(42L)).thenReturn(Optional.of(activity));
        ActivityService service = new ActivityService(repository, mock(FitActivityParser.class));

        List<ActivityLap> result = service.getActivityLaps(42L);

        assertThat(result).containsExactly(lap);
    }

    @Test
    void importsAndSavesFitActivity() {
        ActivityRepository repository = mock(ActivityRepository.class);
        FitActivityParser parser = mock(FitActivityParser.class);
        MockMultipartFile file = new MockMultipartFile(
                "file", "run.fit", "application/octet-stream", new byte[] { 1 });
        Activity parsed = new Activity();
        Activity saved = new Activity();
        when(parser.parse(any(InputStream.class))).thenReturn(parsed);
        when(repository.findByFitFileHash(any(String.class))).thenReturn(Optional.empty());
        when(repository.save(parsed)).thenReturn(saved);
        ActivityService service = new ActivityService(repository, parser);

        Activity result = service.importFitFile(file);

        assertThat(result).isSameAs(saved);
        assertThat(parsed.getFitFileHash()).hasSize(64);
        verify(repository).save(parsed);
    }

    @Test
    void reimportUpdatesExistingActivityAndReplacesRecords() {
        ActivityRepository repository = mock(ActivityRepository.class);
        FitActivityParser parser = mock(FitActivityParser.class);
        byte[] content = new byte[] { 1, 2, 3 };
        MockMultipartFile file = new MockMultipartFile(
                "file", "run.fit", "application/octet-stream", content);

        Activity existing = new Activity();
        existing.setId(10L);
        existing.setFitFileHash("039058c6f2c0cb492c533b0a4d14ef77cc0f78abccced5287d84a1a2011cfb81");
        existing.setName("Old name");
        existing.addRecord(new ActivityRecord());
        ActivityLap oldLap = new ActivityLap();
        oldLap.setLapIndex(0);
        existing.addLap(oldLap);

        Activity parsed = new Activity();
        parsed.setName("Updated name");
        parsed.setDistance(10F);
        ActivityRecord newRecord = new ActivityRecord();
        newRecord.setHeartRate(155);
        parsed.addRecord(newRecord);
        ActivityLap newLap = new ActivityLap();
        newLap.setLapIndex(1);
        parsed.addLap(newLap);

        when(parser.parse(any(InputStream.class))).thenReturn(parsed);
        when(repository.findByFitFileHash(existing.getFitFileHash())).thenReturn(Optional.of(existing));
        when(repository.save(existing)).thenReturn(existing);
        ActivityService service = new ActivityService(repository, parser);

        Activity result = service.importFitFile(file);

        assertThat(result.getId()).isEqualTo(10L);
        assertThat(result.getName()).isEqualTo("Updated name");
        assertThat(result.getDistance()).isEqualTo(10F);
        assertThat(result.getRecords()).containsExactly(newRecord);
        assertThat(newRecord.getActivity()).isSameAs(existing);
        assertThat(result.getLaps()).containsExactly(newLap);
        assertThat(newLap.getActivity()).isSameAs(existing);
        verify(repository).save(existing);
    }
}
