package ch.joelbytes.runstack.activity;

import java.util.Locale;

import com.fasterxml.jackson.annotation.JsonValue;

public enum ActivityRecordAxis {
    DISTANCE,
    TIME;

    @JsonValue
    public String value() {
        return name().toLowerCase(Locale.ROOT);
    }

    public static ActivityRecordAxis from(String value) {
        try {
            return valueOf(value.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException | NullPointerException exception) {
            throw new IllegalArgumentException("axis must be either 'distance' or 'time'");
        }
    }
}
