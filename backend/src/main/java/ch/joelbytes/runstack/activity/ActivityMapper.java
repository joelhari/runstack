package ch.joelbytes.runstack.activity;

import org.springframework.stereotype.Component;

@Component
public class ActivityMapper {
    
    public Activity toActivity(ActivityDTO activityDTO) {
        Activity activity = new Activity();
        activity.setId(activityDTO.getId());
        activity.setFitFileHash(activityDTO.getFitFileHash());
        activity.setName(activityDTO.getName());
        activity.setDate(activityDTO.getDate());
        activity.setDistance(activityDTO.getDistance());
        activity.setDuration(activityDTO.getDuration());
        activity.setAveragePace(activityDTO.getAveragePace());
        return activity;
    }

    public ActivityDTO toActivityDTO(Activity activity) {
        ActivityDTO activityDTO = new ActivityDTO();
        activityDTO.setId(activity.getId());
        activityDTO.setFitFileHash(activity.getFitFileHash());
        activityDTO.setName(activity.getName());
        activityDTO.setDate(activity.getDate());
        activityDTO.setDistance(activity.getDistance());
        activityDTO.setDuration(activity.getDuration());
        activityDTO.setAveragePace(activity.getAveragePace());
        return activityDTO;
    }
}
