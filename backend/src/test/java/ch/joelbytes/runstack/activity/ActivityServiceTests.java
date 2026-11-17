package ch.joelbytes.runstack.activity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;

class ActivityServiceTests {

    @Test
    void getsAllActivitiesFromRepository() {
        ActivityRepository repository = mock(ActivityRepository.class);
        Activity activity = new Activity();
        when(repository.findAll()).thenReturn(List.of(activity));
        ActivityService service = new ActivityService(repository);

        List<Activity> result = service.getAllActivities();

        assertThat(result).containsExactly(activity);
        verify(repository).findAll();
    }
}
