package ch.joelbytes.runstack.activity;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Duration;
import java.time.Instant;

import org.junit.jupiter.api.Test;

class ActivityMapperTests {

    private final ActivityMapper activityMapper = new ActivityMapper();

    @Test
    void mapsActivityToDto() {
        Activity activity = new Activity();
        activity.setId(42L);
        activity.setName("Morning run");
        activity.setDate(Instant.parse("2026-11-17T07:30:00Z"));
        activity.setDistance(10.24F);
        activity.setDuration(Duration.ofMinutes(50).plusSeconds(21));
        activity.setAveragePace(Duration.ofMinutes(4).plusSeconds(55));

        ActivityDTO result = activityMapper.toActivityDTO(activity);

        assertThat(result.getId()).isEqualTo(42L);
        assertThat(result.getName()).isEqualTo("Morning run");
        assertThat(result.getDate()).isEqualTo(activity.getDate());
        assertThat(result.getDistance()).isEqualTo(activity.getDistance());
        assertThat(result.getDuration()).isEqualTo(activity.getDuration());
        assertThat(result.getAveragePace()).isEqualTo(activity.getAveragePace());
    }

    @Test
    void mapsDtoToActivity() {
        ActivityDTO activityDTO = new ActivityDTO();
        activityDTO.setId(42L);
        activityDTO.setName("Morning run");
        activityDTO.setDate(Instant.parse("2026-11-17T07:30:00Z"));
        activityDTO.setDistance(10.24F);
        activityDTO.setDuration(Duration.ofMinutes(50).plusSeconds(21));
        activityDTO.setAveragePace(Duration.ofMinutes(4).plusSeconds(55));

        Activity result = activityMapper.toActivity(activityDTO);

        assertThat(result.getId()).isEqualTo(42L);
        assertThat(result.getName()).isEqualTo("Morning run");
        assertThat(result.getDate()).isEqualTo(activityDTO.getDate());
        assertThat(result.getDistance()).isEqualTo(activityDTO.getDistance());
        assertThat(result.getDuration()).isEqualTo(activityDTO.getDuration());
        assertThat(result.getAveragePace()).isEqualTo(activityDTO.getAveragePace());
    }
}
