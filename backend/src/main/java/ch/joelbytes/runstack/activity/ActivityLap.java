package ch.joelbytes.runstack.activity;

import java.time.Duration;
import java.time.Instant;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "activity_lap")
public class ActivityLap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    @Column(name = "lap_index", nullable = false)
    private Integer lapIndex;

    @JdbcTypeCode(SqlTypes.TIMESTAMP)
    @Column(name = "started_at")
    private Instant startedAt;

    @JdbcTypeCode(SqlTypes.TIMESTAMP)
    @Column(name = "ended_at")
    private Instant endedAt;

    @JdbcTypeCode(SqlTypes.INTERVAL_SECOND)
    @Column(name = "elapsed_duration", columnDefinition = "INTERVAL")
    private Duration elapsedDuration;

    @JdbcTypeCode(SqlTypes.INTERVAL_SECOND)
    @Column(name = "timer_duration", columnDefinition = "INTERVAL")
    private Duration timerDuration;

    private Float distance;

    @JdbcTypeCode(SqlTypes.INTERVAL_SECOND)
    @Column(name = "average_pace", columnDefinition = "INTERVAL")
    private Duration averagePace;

    @Column(name = "average_speed")
    private Float averageSpeed;

    @Column(name = "maximum_speed")
    private Float maximumSpeed;

    @Column(name = "average_heart_rate")
    private Integer averageHeartRate;

    @Column(name = "maximum_heart_rate")
    private Integer maximumHeartRate;

    @Column(name = "average_cadence")
    private Integer averageCadence;

    @Column(name = "maximum_cadence")
    private Integer maximumCadence;

    @Column(name = "average_power")
    private Integer averagePower;

    @Column(name = "maximum_power")
    private Integer maximumPower;

    private Integer calories;
    private Integer ascent;
    private Integer descent;

    public Long getId() {
        return id;
    }
    public Activity getActivity() {
        return activity;
    }
    public void setActivity(Activity activity) {
        this.activity = activity;
    }
    public Integer getLapIndex() {
        return lapIndex;
    }
    public void setLapIndex(Integer lapIndex) {
        this.lapIndex = lapIndex;
    }
    public Instant getStartedAt() {
        return startedAt;
    }
    public void setStartedAt(Instant startedAt) {
        this.startedAt = startedAt;
    }
    public Instant getEndedAt() {
        return endedAt;
    }
    public void setEndedAt(Instant endedAt) {
        this.endedAt = endedAt;
    }
    public Duration getElapsedDuration() {
        return elapsedDuration;
    }
    public void setElapsedDuration(Duration elapsedDuration) {
        this.elapsedDuration = elapsedDuration;
    }
    public Duration getTimerDuration() {
        return timerDuration;
    }
    public void setTimerDuration(Duration timerDuration) {
        this.timerDuration = timerDuration;
    }
    public Float getDistance() {
        return distance;
    }
    public void setDistance(Float distance) {
        this.distance = distance;
    }
    public Duration getAveragePace() {
        return averagePace;
    }
    public void setAveragePace(Duration averagePace) {
        this.averagePace = averagePace;
    }
    public Float getAverageSpeed() {
        return averageSpeed;
    }
    public void setAverageSpeed(Float averageSpeed) {
        this.averageSpeed = averageSpeed;
    }
    public Float getMaximumSpeed() {
        return maximumSpeed;
    }
    public void setMaximumSpeed(Float maximumSpeed) {
        this.maximumSpeed = maximumSpeed;
    }
    public Integer getAverageHeartRate() {
        return averageHeartRate;
    }
    public void setAverageHeartRate(Integer averageHeartRate) {
        this.averageHeartRate = averageHeartRate;
    }
    public Integer getMaximumHeartRate() {
        return maximumHeartRate;
    }
    public void setMaximumHeartRate(Integer maximumHeartRate) {
        this.maximumHeartRate = maximumHeartRate;
    }
    public Integer getAverageCadence() {
        return averageCadence;
    }
    public void setAverageCadence(Integer averageCadence) {
        this.averageCadence = averageCadence;
    }
    public Integer getMaximumCadence() {
        return maximumCadence;
    }
    public void setMaximumCadence(Integer maximumCadence) {
        this.maximumCadence = maximumCadence;
    }
    public Integer getAveragePower() {
        return averagePower;
    }
    public void setAveragePower(Integer averagePower) {
        this.averagePower = averagePower;
    }
    public Integer getMaximumPower() {
        return maximumPower;
    }
    public void setMaximumPower(Integer maximumPower) {
        this.maximumPower = maximumPower;
    }
    public Integer getCalories() {
        return calories;
    }
    public void setCalories(Integer calories) {
        this.calories = calories;
    }
    public Integer getAscent() {
        return ascent;
    }
    public void setAscent(Integer ascent) {
        this.ascent = ascent;
    }
    public Integer getDescent() {
        return descent;
    }
    public void setDescent(Integer descent) {
        this.descent = descent;
    }
}
