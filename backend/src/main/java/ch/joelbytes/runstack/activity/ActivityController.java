package ch.joelbytes.runstack.activity;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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

    @GetMapping("/{id}")
    public ResponseEntity<ActivityDTO> getActivity(@PathVariable long id) {
        Activity activity = activityService.getActivity(id);
        return ResponseEntity.ok(activityMapper.toActivityDTO(activity));
    }

    @GetMapping("/{id}/laps")
    public ResponseEntity<List<ActivityLapDTO>> getActivityLaps(@PathVariable long id) {
        List<ActivityLapDTO> laps = activityService.getActivityLaps(id).stream()
                .map(activityMapper::toActivityLapDTO)
                .toList();
        return ResponseEntity.ok(laps);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ActivityDTO> importFitFile(@RequestPart("file") MultipartFile file) {
        Activity activity = activityService.importFitFile(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(activityMapper.toActivityDTO(activity));
    }
}
