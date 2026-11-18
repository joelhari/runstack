package ch.joelbytes.runstack.activity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;

import java.time.Duration;
import java.time.Instant;

import org.junit.jupiter.api.Test;

import com.garmin.fit.DateTime;
import com.garmin.fit.RecordMesg;
import com.garmin.fit.SessionMesg;
import com.garmin.fit.Sport;

class FitActivityParserTests {

    @Test
    void mapsSessionSummaryToActivity() {
        SessionMesg session = new SessionMesg();
        session.setStartTime(DateTime.from(Instant.parse("2026-11-17T07:30:00Z")));
        session.setSport(Sport.RUNNING);
        session.setTotalDistance(10_000F);
        session.setTotalElapsedTime(3_000F);

        Activity result = new FitActivityParser().fromSession(session);

        assertThat(result.getName()).isEqualTo("Garmin running");
        assertThat(result.getDate()).isEqualTo(Instant.parse("2026-11-17T07:30:00Z"));
        assertThat(result.getDistance()).isEqualTo(10F);
        assertThat(result.getDuration()).isEqualTo(Duration.ofMinutes(50));
        assertThat(result.getAveragePace()).isEqualTo(Duration.ofMinutes(5));
    }

    @Test
    void mapsRecordedSample() {
        RecordMesg message = new RecordMesg();
        message.setTimestamp(DateTime.from(Instant.parse("2026-11-17T07:30:01Z")));
        message.setPositionLat(536_870_912);
        message.setPositionLong(1_073_741_824);
        message.setAltitude(512.5F);
        message.setHeartRate((short) 154);
        message.setSpeed(3.5F);
        message.setDistance(125.4F);
        message.setCadence((short) 86);
        message.setPower(275);
        message.setTemperature((byte) 18);
        message.setVerticalOscillation(82F);
        message.setStanceTime(242.5F);
        message.setRespirationRate((short) 34);

        ActivityRecord result = new FitActivityParser().fromRecord(message);

        assertThat(result.getRecordedAt()).isEqualTo(Instant.parse("2026-11-17T07:30:01Z"));
        assertThat(result.getLatitude()).isEqualTo(45D);
        assertThat(result.getLongitude()).isEqualTo(90D);
        assertThat(result.getAltitude()).isCloseTo(512.5F, within(0.11F));
        assertThat(result.getHeartRate()).isEqualTo(154);
        assertThat(result.getSpeed()).isEqualTo(3.5F);
        assertThat(result.getDistance()).isEqualTo(125.4F);
        assertThat(result.getCadence()).isEqualTo(86);
        assertThat(result.getPower()).isEqualTo(275);
        assertThat(result.getTemperature()).isEqualTo(18);
        assertThat(result.getVerticalOscillation()).isEqualTo(82F);
        assertThat(result.getGroundContactTimeMs()).isEqualTo(242.5F);
        assertThat(result.getRespirationRate()).isEqualTo(34);
    }
}
