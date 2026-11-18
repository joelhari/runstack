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
        existing.setName(parsed.getName());
        existing.setDate(parsed.getDate());
        existing.setDistance(parsed.getDistance());
        existing.setDuration(parsed.getDuration());
        existing.setAveragePace(parsed.getAveragePace());
        existing.replaceRecords(parsed.getRecords());
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
