package ch.joelbytes.runstack.activity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;

import java.time.Duration;
import java.time.Instant;

import org.junit.jupiter.api.Test;

import com.garmin.fit.DateTime;
import com.garmin.fit.LapMesg;
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

    @Test
    void mapsLapSummary() {
        LapMesg message = new LapMesg();
        message.setMessageIndex(2);
        message.setStartTime(DateTime.from(Instant.parse("2026-11-17T07:40:00Z")));
        message.setTimestamp(DateTime.from(Instant.parse("2026-11-17T07:45:00Z")));
        message.setTotalElapsedTime(310F);
        message.setTotalTimerTime(300F);
        message.setTotalDistance(1_000F);
        message.setAvgSpeed(3.333F);
        message.setMaxSpeed(4.5F);
        message.setAvgHeartRate((short) 150);
        message.setMaxHeartRate((short) 170);
        message.setAvgCadence((short) 85);
        message.setMaxCadence((short) 92);
        message.setAvgPower(260);
        message.setMaxPower(410);
        message.setTotalCalories(75);
        message.setTotalAscent(20);
        message.setTotalDescent(15);

        ActivityLap result = new FitActivityParser().fromLap(message);

        assertThat(result.getLapIndex()).isEqualTo(2);
        assertThat(result.getStartedAt()).isEqualTo(Instant.parse("2026-11-17T07:40:00Z"));
        assertThat(result.getEndedAt()).isEqualTo(Instant.parse("2026-11-17T07:45:00Z"));
        assertThat(result.getElapsedDuration()).isEqualTo(Duration.ofSeconds(310));
        assertThat(result.getTimerDuration()).isEqualTo(Duration.ofMinutes(5));
        assertThat(result.getDistance()).isEqualTo(1_000F);
        assertThat(result.getAveragePace()).isEqualTo(Duration.ofMinutes(5));
        assertThat(result.getAverageSpeed()).isEqualTo(3.333F);
        assertThat(result.getMaximumSpeed()).isEqualTo(4.5F);
        assertThat(result.getAverageHeartRate()).isEqualTo(150);
        assertThat(result.getMaximumHeartRate()).isEqualTo(170);
        assertThat(result.getAverageCadence()).isEqualTo(85);
        assertThat(result.getMaximumCadence()).isEqualTo(92);
        assertThat(result.getAveragePower()).isEqualTo(260);
        assertThat(result.getMaximumPower()).isEqualTo(410);
        assertThat(result.getCalories()).isEqualTo(75);
        assertThat(result.getAscent()).isEqualTo(20);
        assertThat(result.getDescent()).isEqualTo(15);
    }
}
