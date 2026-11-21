package ch.joelbytes.runstack.activity;

public record AggregatedValueDTO(
        Double average,
        Double minimum,
        Double maximum,
        long count
) {
}
