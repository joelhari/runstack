package ch.joelbytes.runstack.activity;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final FitActivityParser fitActivityParser;

    public ActivityService(
        ActivityRepository activityRepository,
        FitActivityParser fitActivityParser
    ) {
        this.activityRepository = activityRepository;
        this.fitActivityParser = fitActivityParser;
    }

    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }

    public Activity getActivity(long id) {
        return activityRepository.findById(id)
                .orElseThrow(() -> new ActivityNotFoundException(id));
    }

    @Transactional(readOnly = true)
    public List<ActivityLap> getActivityLaps(long id) {
        return List.copyOf(getActivity(id).getLaps());
    }

    @Transactional(readOnly = true)
    public AggregatedActivityRecordsDTO getActivityRecords(
        long id,
        String axisValue,
        double from,
        double to,
        int maxPoints
    ) {
        ActivityRecordAxis axis;
        try {
            axis = ActivityRecordAxis.from(axisValue);
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, exception.getMessage(), exception);
        }
        if (!Double.isFinite(from) || !Double.isFinite(to) || to <= from) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "to must be greater than from");
        }
        if (maxPoints < 1 || maxPoints > 2_000) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "maxPoints must be between 1 and 2000");
        }

        return ActivityRecordAggregator.aggregate(getActivity(id), axis, from, to, maxPoints);
    }

    @Transactional
    public Activity importFitFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFitFileException("A non-empty FIT file is required");
        }

        try {
            byte[] fileContent = file.getBytes();
            String fileHash = sha256(fileContent);
            Activity parsedActivity = fitActivityParser.parse(new ByteArrayInputStream(fileContent));

            return activityRepository.findByFitFileHash(fileHash)
                    .map(existingActivity -> update(existingActivity, parsedActivity))
                    .orElseGet(() -> {
                        parsedActivity.setFitFileHash(fileHash);
                        return activityRepository.save(parsedActivity);
                    });
        } catch (IOException exception) {
            throw new InvalidFitFileException("The uploaded FIT file could not be read", exception);
        }
    }

    private Activity update(Activity existing, Activity parsed) {
        List<ActivityLap> newLaps = List.copyOf(parsed.getLaps());

        existing.setName(parsed.getName());
        existing.setDate(parsed.getDate());
        existing.setDistance(parsed.getDistance());
        existing.setDuration(parsed.getDuration());
        existing.setAveragePace(parsed.getAveragePace());
        existing.replaceRecords(parsed.getRecords());

        existing.clearLaps();
        activityRepository.flush();
        newLaps.forEach(existing::addLap);

        return activityRepository.save(existing);
    }

    private String sha256(byte[] content) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(content));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is not available", exception);
        }
    }
}
