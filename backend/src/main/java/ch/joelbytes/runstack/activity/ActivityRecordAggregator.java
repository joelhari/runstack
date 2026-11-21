package ch.joelbytes.runstack.activity;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

final class ActivityRecordAggregator {

    private ActivityRecordAggregator() {
    }

    static AggregatedActivityRecordsDTO aggregate(
            Activity activity,
            ActivityRecordAxis axis,
            double from,
            double to,
            int maxPoints) {
        double bucketWidth = (to - from) / maxPoints;
        List<Bucket> buckets = new ArrayList<>(maxPoints);
        for (int index = 0; index < maxPoints; index++) {
            buckets.add(new Bucket());
        }

        long sourceRecordCount = 0;
        for (ActivityRecord record : activity.getRecords()) {
            Double x = axisValue(activity, record, axis);
            if (x == null || !Double.isFinite(x) || x < from || x > to) {
                continue;
            }

            int bucketIndex = Math.min((int) ((x - from) / bucketWidth), maxPoints - 1);
            buckets.get(bucketIndex).add(x, record);
            sourceRecordCount++;
        }

        List<AggregatedActivityRecordDTO> points = buckets.stream()
                .filter(Bucket::isNotEmpty)
                .map(Bucket::toDTO)
                .toList();
        return new AggregatedActivityRecordsDTO(
                axis, from, to, bucketWidth, sourceRecordCount, points);
    }

    private static Double axisValue(
            Activity activity,
            ActivityRecord record,
            ActivityRecordAxis axis) {
        if (axis == ActivityRecordAxis.DISTANCE) {
            return record.getDistance() == null ? null : record.getDistance().doubleValue();
        }

        Instant activityStart = activity.getDate();
        Instant recordedAt = record.getRecordedAt();
        if (activityStart == null || recordedAt == null) {
            return null;
        }
        return (double) Duration.between(activityStart, recordedAt).toMillis();
    }

    private static final class Bucket {
        private final ValueAccumulator x = new ValueAccumulator();
        private final ValueAccumulator latitude = new ValueAccumulator();
        private final ValueAccumulator longitude = new ValueAccumulator();
        private final ValueAccumulator altitude = new ValueAccumulator();
        private final ValueAccumulator heartRate = new ValueAccumulator();
        private final ValueAccumulator speed = new ValueAccumulator();
        private final ValueAccumulator distance = new ValueAccumulator();
        private final ValueAccumulator cadence = new ValueAccumulator();
        private final ValueAccumulator power = new ValueAccumulator();
        private final ValueAccumulator temperature = new ValueAccumulator();
        private final ValueAccumulator verticalOscillation = new ValueAccumulator();
        private final ValueAccumulator groundContactTimeMs = new ValueAccumulator();
        private final ValueAccumulator respirationRate = new ValueAccumulator();

        void add(double xValue, ActivityRecord record) {
            x.add(xValue);
            add(latitude, record, ActivityRecord::getLatitude);
            add(longitude, record, ActivityRecord::getLongitude);
            add(altitude, record, ActivityRecord::getAltitude);
            add(heartRate, record, ActivityRecord::getHeartRate);
            add(speed, record, ActivityRecord::getSpeed);
            add(distance, record, ActivityRecord::getDistance);
            add(cadence, record, ActivityRecord::getCadence);
            add(power, record, ActivityRecord::getPower);
            add(temperature, record, ActivityRecord::getTemperature);
            add(verticalOscillation, record, ActivityRecord::getVerticalOscillation);
            add(groundContactTimeMs, record, ActivityRecord::getGroundContactTimeMs);
            add(respirationRate, record, ActivityRecord::getRespirationRate);
        }

        boolean isNotEmpty() {
            return x.count > 0;
        }

        AggregatedActivityRecordDTO toDTO() {
            return new AggregatedActivityRecordDTO(
                    x.average(),
                    x.count,
                    latitude.toDTO(),
                    longitude.toDTO(),
                    altitude.toDTO(),
                    heartRate.toDTO(),
                    speed.toDTO(),
                    distance.toDTO(),
                    cadence.toDTO(),
                    power.toDTO(),
                    temperature.toDTO(),
                    verticalOscillation.toDTO(),
                    groundContactTimeMs.toDTO(),
                    respirationRate.toDTO());
        }

        private static <T extends Number> void add(
                ValueAccumulator accumulator,
                ActivityRecord record,
                Function<ActivityRecord, T> getter) {
            T value = getter.apply(record);
            if (value != null) {
                accumulator.add(value.doubleValue());
            }
        }
    }

    private static final class ValueAccumulator {
        private double sum;
        private double minimum = Double.POSITIVE_INFINITY;
        private double maximum = Double.NEGATIVE_INFINITY;
        private long count;

        void add(double value) {
            if (!Double.isFinite(value)) {
                return;
            }
            sum += value;
            minimum = Math.min(minimum, value);
            maximum = Math.max(maximum, value);
            count++;
        }

        double average() {
            return sum / count;
        }

        AggregatedValueDTO toDTO() {
            if (count == 0) {
                return new AggregatedValueDTO(null, null, null, 0);
            }
            return new AggregatedValueDTO(average(), minimum, maximum, count);
        }
    }
}
