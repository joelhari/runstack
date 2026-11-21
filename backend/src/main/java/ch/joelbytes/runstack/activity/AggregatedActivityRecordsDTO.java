package ch.joelbytes.runstack.activity;

import java.util.List;

public record AggregatedActivityRecordsDTO(
        ActivityRecordAxis axis,
        double from,
        double to,
        double bucketWidth,
        long sourceRecordCount,
        List<AggregatedActivityRecordDTO> points
) {
}
