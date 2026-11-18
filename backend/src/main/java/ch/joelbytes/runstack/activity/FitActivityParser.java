package ch.joelbytes.runstack.activity;

import java.io.InputStream;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.garmin.fit.FitRuntimeException;
import com.garmin.fit.MesgBroadcaster;
import com.garmin.fit.RecordMesg;
import com.garmin.fit.SessionMesg;

@Component
public class FitActivityParser {

    private static final double SEMICIRCLES_TO_DEGREES = 180D / 2_147_483_648D;

    public Activity parse(InputStream inputStream) {
        List<SessionMesg> sessions = new ArrayList<>();
        List<ActivityRecord> records = new ArrayList<>();

        try {
            MesgBroadcaster broadcaster = new MesgBroadcaster();
            broadcaster.addListener((SessionMesg session) -> sessions.add(session));
            broadcaster.addListener((RecordMesg record) -> records.add(fromRecord(record)));
            broadcaster.run(inputStream);
        } catch (FitRuntimeException exception) {
            throw new InvalidFitFileException("The uploaded file is not a valid FIT file", exception);
        }

        if (sessions.isEmpty()) {
            throw new InvalidFitFileException("The FIT file does not contain an activity session");
        }

        Activity activity = fromSession(sessions.getFirst());
        records.forEach(activity::addRecord);
        return activity;
    }

    Activity fromSession(SessionMesg session) {
        if (session.getStartTime() == null
                || session.getTotalDistance() == null
                || session.getTotalElapsedTime() == null) {
            throw new InvalidFitFileException("The FIT session is missing its time, distance, or duration");
        }

        float distanceInMetres = session.getTotalDistance();
        float elapsedSeconds = session.getTotalElapsedTime();

        Activity activity = new Activity();
        activity.setName(defaultName(session));
        activity.setDate(session.getStartTime().getInstant());
        activity.setDistance(distanceInMetres / 1_000F);
        activity.setDuration(durationFromSeconds(elapsedSeconds));
        if (distanceInMetres > 0) {
            activity.setAveragePace(Duration.ofMillis(
                    Math.round(elapsedSeconds * 1_000_000D / distanceInMetres)));
        }
        return activity;
    }

    ActivityRecord fromRecord(RecordMesg message) {
        ActivityRecord record = new ActivityRecord();
        if (message.getTimestamp() != null) {
            record.setRecordedAt(message.getTimestamp().getInstant());
        }
        record.setLatitude(toDegrees(message.getPositionLat()));
        record.setLongitude(toDegrees(message.getPositionLong()));
        record.setAltitude(message.getAltitude());
        record.setHeartRate(toInteger(message.getHeartRate()));
        record.setSpeed(message.getSpeed());
        record.setDistance(message.getDistance());
        record.setCadence(toInteger(message.getCadence()));
        record.setPower(message.getPower());
        record.setTemperature(toInteger(message.getTemperature()));
        record.setVerticalOscillation(message.getVerticalOscillation());
        record.setGroundContactTimeMs(message.getStanceTime());
        record.setRespirationRate(toInteger(message.getRespirationRate()));
        return record;
    }

    private Double toDegrees(Integer semicircles) {
        return semicircles == null ? null : semicircles * SEMICIRCLES_TO_DEGREES;
    }

    private Integer toInteger(Number value) {
        return value == null ? null : value.intValue();
    }

    private Duration durationFromSeconds(float seconds) {
        return Duration.ofMillis(Math.round(seconds * 1_000));
    }

    private String defaultName(SessionMesg session) {
        if (session.getSportProfileName() != null && !session.getSportProfileName().isBlank()) {
            return session.getSportProfileName();
        }
        if (session.getSport() != null) {
            String sport = session.getSport().name().toLowerCase().replace('_', ' ');
            return "Garmin " + sport;
        }
        return "Garmin activity";
    }
}
