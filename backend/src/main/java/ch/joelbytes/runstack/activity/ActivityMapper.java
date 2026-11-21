package ch.joelbytes.runstack.activity;

import org.springframework.stereotype.Component;

@Component
public class ActivityMapper {
    
    public Activity toActivity(ActivityDTO activityDTO) {
        Activity activity = new Activity();
        activity.setId(activityDTO.id());
        activity.setFitFileHash(activityDTO.fitFileHash());
        activity.setName(activityDTO.name());
        activity.setDate(activityDTO.date());
        activity.setDistance(activityDTO.distance());
        activity.setDuration(activityDTO.duration());
        activity.setAveragePace(activityDTO.averagePace());
        return activity;
    }

    public ActivityDTO toActivityDTO(Activity activity) {
        return new ActivityDTO(
                activity.getId(),
                activity.getFitFileHash(),
                activity.getName(),
                activity.getDate(),
                activity.getDistance(),
                activity.getDuration(),
                activity.getAveragePace());
    }

    public ActivityLapDTO toActivityLapDTO(ActivityLap lap) {
        return new ActivityLapDTO(
                lap.getId(),
                lap.getLapIndex(),
                lap.getStartedAt(),
                lap.getEndedAt(),
                lap.getElapsedDuration(),
                lap.getTimerDuration(),
                lap.getDistance(),
                lap.getAveragePace(),
                lap.getAverageSpeed(),
                lap.getMaximumSpeed(),
                lap.getAverageHeartRate(),
                lap.getMaximumHeartRate(),
                lap.getAverageCadence(),
                lap.getMaximumCadence(),
                lap.getAveragePower(),
                lap.getMaximumPower(),
                lap.getCalories(),
                lap.getAscent(),
                lap.getDescent());
    }

}
