package ch.joelbytes.runstack.activity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

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
}
