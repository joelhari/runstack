package ch.joelbytes.runstack.activity;

import java.time.Duration;
import java.time.Instant;

public record ActivityLapDTO(
        Long id,
        Integer lapIndex,
        Instant startedAt,
        Instant endedAt,
        Duration elapsedDuration,
        Duration timerDuration,
        Float distance,
        Duration averagePace,
        Float averageSpeed,
        Float maximumSpeed,
        Integer averageHeartRate,
        Integer maximumHeartRate,
        Integer averageCadence,
        Integer maximumCadence,
        Integer averagePower,
        Integer maximumPower,
        Integer calories,
        Integer ascent,
        Integer descent
) {
}
