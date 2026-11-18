package ch.joelbytes.runstack.activity;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "activity")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fit_file_hash", length = 64, unique = true)
    private String fitFileHash;

    private String name;

    @CreationTimestamp
    @JdbcTypeCode(SqlTypes.TIMESTAMP)
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @JdbcTypeCode(SqlTypes.TIMESTAMP)
    @Column(name = "updated_at", nullable = false, updatable = true)
    private Instant updatedAt;

    @JdbcTypeCode(SqlTypes.TIMESTAMP)
    @Column
    private Instant date;

    private Float distance;

    @JdbcTypeCode(SqlTypes.INTERVAL_SECOND)
    @Column(columnDefinition = "INTERVAL")
    private Duration duration;

    @JdbcTypeCode(SqlTypes.INTERVAL_SECOND)
    @Column(name = "average_pace", columnDefinition = "INTERVAL")
    private Duration averagePace;

    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ActivityRecord> records = new ArrayList<>();

    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ActivityLap> laps = new ArrayList<>();

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getFitFileHash() {
        return fitFileHash;
    }
    public void setFitFileHash(String fitFileHash) {
        this.fitFileHash = fitFileHash;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Instant getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
    public Instant getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
    public Instant getDate() {
        return date;
    }
    public void setDate(Instant date) {
        this.date = date;
    }
    public Float getDistance() {
        return distance;
    }
    public void setDistance(Float distance) {
        this.distance = distance;
    }
    public Duration getDuration() {
        return duration;
    }
    public void setDuration(Duration duration) {
        this.duration = duration;
    }
    public Duration getAveragePace() {
        return averagePace;
    }
    public void setAveragePace(Duration averagePace) {
        this.averagePace = averagePace;
    }
    public List<ActivityRecord> getRecords() {
        return records;
    }
    public void addRecord(ActivityRecord record) {
        records.add(record);
        record.setActivity(this);
    }
    public void replaceRecords(List<ActivityRecord> newRecords) {
        records.clear();
        newRecords.forEach(this::addRecord);
    }
    public List<ActivityLap> getLaps() {
        return laps;
    }
    public void addLap(ActivityLap lap) {
        laps.add(lap);
        lap.setActivity(this);
    }
    public void replaceLaps(List<ActivityLap> newLaps) {
        laps.clear();
        newLaps.forEach(this::addLap);
    }
}
