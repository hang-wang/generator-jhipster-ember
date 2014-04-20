package <%=packageName%>.web.rest;

import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 *
 */
@Data
public class RestError {
    private final LocalDateTime timeStamp = LocalDateTime.now();
    private final String error;
    private Integer status;
    private String message;
    private List<String> detailMessages = new ArrayList<>();

    public RestError(ErrorCode error) {
        this.error = error.message;
        this.message = error.message;
        this.status = error.status;
    }

    public static enum ErrorCode {
        NOT_FOUND("Not found", HttpStatus.NOT_FOUND.value()),
        INVALID("Invalid", HttpStatus.BAD_REQUEST.value()),
        UNAUTHORIZED_ACCESS("Unauthorized", HttpStatus.UNAUTHORIZED.value()),
        DUPLICATE("Duplicate", HttpStatus.CONFLICT.value()),
        METHOD_NOT_ALLOWED("Method not allowed", HttpStatus.METHOD_NOT_ALLOWED.value());

        final String message;
        final Integer status;

        ErrorCode(String message, Integer status) {
            this.message = message;
            this.status = status;
        }
    }
}
