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
        activity.setFitFileHash("abc123");
        activity.setName("Morning run");
        activity.setDate(Instant.parse("2026-11-17T07:30:00Z"));
        activity.setDistance(10.24F);
        activity.setDuration(Duration.ofMinutes(50).plusSeconds(21));
        activity.setAveragePace(Duration.ofMinutes(4).plusSeconds(55));

        ActivityDTO result = activityMapper.toActivityDTO(activity);

        assertThat(result.id()).isEqualTo(42L);
        assertThat(result.fitFileHash()).isEqualTo("abc123");
        assertThat(result.name()).isEqualTo("Morning run");
        assertThat(result.date()).isEqualTo(activity.getDate());
        assertThat(result.distance()).isEqualTo(activity.getDistance());
        assertThat(result.duration()).isEqualTo(activity.getDuration());
        assertThat(result.averagePace()).isEqualTo(activity.getAveragePace());
    }

    @Test
    void mapsDtoToActivity() {
        ActivityDTO activityDTO = new ActivityDTO(
                42L,
                "abc123",
                "Morning run",
                Instant.parse("2026-11-17T07:30:00Z"),
                10.24F,
                Duration.ofMinutes(50).plusSeconds(21),
                Duration.ofMinutes(4).plusSeconds(55));

        Activity result = activityMapper.toActivity(activityDTO);

        assertThat(result.getId()).isEqualTo(42L);
        assertThat(result.getFitFileHash()).isEqualTo("abc123");
        assertThat(result.getName()).isEqualTo("Morning run");
        assertThat(result.getDate()).isEqualTo(activityDTO.date());
        assertThat(result.getDistance()).isEqualTo(activityDTO.distance());
        assertThat(result.getDuration()).isEqualTo(activityDTO.duration());
        assertThat(result.getAveragePace()).isEqualTo(activityDTO.averagePace());
    }
}
