package ch.joelbytes.runstack.activity;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ActivityNotFoundException extends RuntimeException {

    public ActivityNotFoundException(long id) {
        super("Activity with id " + id + " was not found");
    }
}
