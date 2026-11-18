package ch.joelbytes.runstack.activity;

import java.time.Instant;

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
@Table(name = "activity_record")
public class ActivityRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    @Column(name = "recorded_at")
    private Instant recordedAt;

    private Double latitude;
    private Double longitude;
    private Float altitude;

    @Column(name = "heart_rate")
    private Integer heartRate;

    private Float speed;
    private Float distance;
    private Integer cadence;
    private Integer power;
    private Integer temperature;

    @Column(name = "vertical_oscillation")
    private Float verticalOscillation;

    @Column(name = "ground_contact_time_ms")
    private Float groundContactTimeMs;

    @Column(name = "respiration_rate")
    private Integer respirationRate;

    public Long getId() {
        return id;
    }
    public Activity getActivity() {
        return activity;
    }
    public void setActivity(Activity activity) {
        this.activity = activity;
    }
    public Instant getRecordedAt() {
        return recordedAt;
    }
    public void setRecordedAt(Instant recordedAt) {
        this.recordedAt = recordedAt;
    }
    public Double getLatitude() {
        return latitude;
    }
    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }
    public Double getLongitude() {
        return longitude;
    }
    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
    public Float getAltitude() {
        return altitude;
    }
    public void setAltitude(Float altitude) {
        this.altitude = altitude;
    }
    public Integer getHeartRate() {
        return heartRate;
    }
    public void setHeartRate(Integer heartRate) {
        this.heartRate = heartRate;
    }
    public Float getSpeed() {
        return speed;
    }
    public void setSpeed(Float speed) {
        this.speed = speed;
    }
    public Float getDistance() {
        return distance;
    }
    public void setDistance(Float distance) {
        this.distance = distance;
    }
    public Integer getCadence() {
        return cadence;
    }
    public void setCadence(Integer cadence) {
        this.cadence = cadence;
    }
    public Integer getPower() {
        return power;
    }
    public void setPower(Integer power) {
        this.power = power;
    }
    public Integer getTemperature() {
        return temperature;
    }
    public void setTemperature(Integer temperature) {
        this.temperature = temperature;
    }
    public Float getVerticalOscillation() {
        return verticalOscillation;
    }
    public void setVerticalOscillation(Float verticalOscillation) {
        this.verticalOscillation = verticalOscillation;
    }
    public Float getGroundContactTimeMs() {
        return groundContactTimeMs;
    }
    public void setGroundContactTimeMs(Float groundContactTimeMs) {
        this.groundContactTimeMs = groundContactTimeMs;
    }
    public Integer getRespirationRate() {
        return respirationRate;
    }
    public void setRespirationRate(Integer respirationRate) {
        this.respirationRate = respirationRate;
    }
}
