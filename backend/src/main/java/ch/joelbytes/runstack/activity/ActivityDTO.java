package ch.joelbytes.runstack.activity;

import java.time.Duration;
import java.time.Instant;

public class ActivityDTO {

    private Long id;
    private String fitFileHash;
    private String name;
    private Instant date;
    private Float distance;
    private Duration duration;
    private Duration averagePace;

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

    @Override
    public String toString() {
        return "ActivityDTO [id=" + id + ", name=" + name + ", date=" + date + ", distance=" + distance
                + ", duration=" + duration + ", averagePace=" + averagePace + "]";
    }
}
