package ch.joelbytes.runstack.activity;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/activity")
public class ActivityController {

    private final ActivityMapper activityMapper;
    private final ActivityService activityService;

    public ActivityController(
        ActivityMapper activityMapper,
        ActivityService activityService
    ) {
        this.activityMapper = activityMapper;
        this.activityService = activityService;
    }

    @GetMapping
    public ResponseEntity<List<ActivityDTO>> getAllActivities() {
        List<Activity> activities = activityService.getAllActivities();
        List<ActivityDTO> activityDTOs = activities.stream().map(activityMapper::toActivityDTO).collect(Collectors.toList());
        return ResponseEntity.ok().body(activityDTOs);
    }
}
