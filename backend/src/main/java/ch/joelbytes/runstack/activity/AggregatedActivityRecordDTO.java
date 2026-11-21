package ch.joelbytes.runstack.activity;

public record AggregatedActivityRecordDTO(
        double x,
        long sourceRecordCount,
        AggregatedValueDTO latitude,
        AggregatedValueDTO longitude,
        AggregatedValueDTO altitude,
        AggregatedValueDTO heartRate,
        AggregatedValueDTO speed,
        AggregatedValueDTO distance,
        AggregatedValueDTO cadence,
        AggregatedValueDTO power,
        AggregatedValueDTO temperature,
        AggregatedValueDTO verticalOscillation,
        AggregatedValueDTO groundContactTimeMs,
        AggregatedValueDTO respirationRate
) {
}
