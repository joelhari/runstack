package ch.joelbytes.runstack.activity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import java.time.Duration;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

class ActivityControllerTests {

    @Test
    void getsAllActivitiesAsDtos() {
        ActivityService service = mock(ActivityService.class);
        Activity activity = new Activity();
        activity.setId(42L);
        activity.setName("Morning run");
        when(service.getAllActivities()).thenReturn(List.of(activity));
        ActivityController controller = new ActivityController(new ActivityMapper(), service);

        ResponseEntity<List<ActivityDTO>> response = controller.getAllActivities();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).singleElement().satisfies(activityDTO -> {
            assertThat(activityDTO.getId()).isEqualTo(42L);
            assertThat(activityDTO.getName()).isEqualTo("Morning run");
        });
    }

    @Test
    void getsOneActivityAsDto() {
        ActivityService service = mock(ActivityService.class);
        Activity activity = new Activity();
        activity.setId(42L);
        activity.setName("Morning run");
        when(service.getActivity(42L)).thenReturn(activity);
        ActivityController controller = new ActivityController(new ActivityMapper(), service);

        ResponseEntity<ActivityDTO> response = controller.getActivity(42L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getId()).isEqualTo(42L);
        assertThat(response.getBody().getName()).isEqualTo("Morning run");
    }

    @Test
    void getsActivityLapsAsDtos() {
        ActivityService service = mock(ActivityService.class);
        ActivityLap lap = new ActivityLap();
        lap.setLapIndex(1);
        lap.setDistance(1_000F);
        lap.setAveragePace(Duration.ofMinutes(5));
        when(service.getActivityLaps(42L)).thenReturn(List.of(lap));
        ActivityController controller = new ActivityController(new ActivityMapper(), service);

        ResponseEntity<List<ActivityLapDTO>> response = controller.getActivityLaps(42L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).singleElement().satisfies(dto -> {
            assertThat(dto.lapIndex()).isEqualTo(1);
            assertThat(dto.distance()).isEqualTo(1_000F);
            assertThat(dto.averagePace()).isEqualTo(Duration.ofMinutes(5));
        });
    }

    @Test
    void importsFitFileAndReturnsCreatedActivity() {
        ActivityService service = mock(ActivityService.class);
        MockMultipartFile file = new MockMultipartFile(
                "file", "run.fit", "application/octet-stream", new byte[] { 1 });
        Activity activity = new Activity();
        activity.setId(43L);
        activity.setName("Garmin running");
        when(service.importFitFile(file)).thenReturn(activity);
        ActivityController controller = new ActivityController(new ActivityMapper(), service);

        ResponseEntity<ActivityDTO> response = controller.importFitFile(file);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getId()).isEqualTo(43L);
        assertThat(response.getBody().getName()).isEqualTo("Garmin running");
    }
}
