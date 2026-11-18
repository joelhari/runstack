package ch.joelbytes.runstack.activity;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidFitFileException extends RuntimeException {

    public InvalidFitFileException(String message) {
        super(message);
    }

    public InvalidFitFileException(String message, Throwable cause) {
        super(message, cause);
    }
}
