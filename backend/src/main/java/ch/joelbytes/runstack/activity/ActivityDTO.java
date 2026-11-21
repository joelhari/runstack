package ch.joelbytes.runstack.activity;

import java.time.Duration;
import java.time.Instant;

public record ActivityDTO(
        Long id,
        String fitFileHash,
        String name,
        Instant date,
        Float distance,
        Duration duration,
        Duration averagePace
) {
}
