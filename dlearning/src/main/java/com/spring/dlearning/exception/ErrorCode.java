package com.spring.dlearning.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;


@Getter
public enum ErrorCode {

    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    USER_EXISTED(400, "User existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(400, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(400, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(404, "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(401, "Username or Password wrong", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(403, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(400, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    INVALID_CREDENTIALS(400, "Invalid credentials, please try again.", HttpStatus.BAD_REQUEST),
    PASSWORD_EXISTED(409, "Password existed", HttpStatus.CONFLICT),
    ROLE_NOT_EXISTED(400, "Role not existed", HttpStatus.NOT_FOUND),
    INVALID_OTP(400, "OTP is invalid or expired", HttpStatus.BAD_REQUEST),
    COURSER_NOT_EXISTED(400, "Course not existed", HttpStatus.BAD_REQUEST),
    EMAIL_INVALID(400, "Email not existed", HttpStatus.BAD_REQUEST),
    REGISTER_TEACHER_INVALID(400, "Your request is pending review, please do not resubmit.", HttpStatus.BAD_REQUEST),
    FILE_INVALID_FORMAT(400, "Invalid file format", HttpStatus.BAD_REQUEST),
    NOTIFICATION_NOT_EXISTED(400, "Notification not existed", HttpStatus.BAD_REQUEST),
    FAVORITE_NOT_EXISTED(400, "Favorite not existed", HttpStatus.BAD_REQUEST),
    PARENT_COMMENT_NOT_EXISTED(400, "ParentComment not existed", HttpStatus.BAD_REQUEST),
    FORBIDDEN(403, "Insufficient rights", HttpStatus.FORBIDDEN),
    COMMENT_NOT_EXISTED(400, "Comment not existed", HttpStatus.BAD_REQUEST),
    DELETE_COMMENT_INVALID(403, "You can only delete your own comments.", HttpStatus.FORBIDDEN),
    UPDATE_COMMENT_INVALID(403, "You can only update your own comments.", HttpStatus.FORBIDDEN),
    ALREADY_IN_FAVORITES(400, "Course is already in the favorites list.", HttpStatus.BAD_REQUEST),
    CURRENT_PASSWORD_INVALID(400, "Current password is incorrect", HttpStatus.BAD_REQUEST),
    CONFIRM_PASSWORD_INVALID(400, "Confirmed password is incorrect", HttpStatus.BAD_REQUEST),
    INVALID_RATING(400, "Only rating greater than or equal to 0 and less than 5", HttpStatus.BAD_REQUEST),
    INVALID_COMMENT_OR_RATING(400, "Please provide at least a comment or a rating.", HttpStatus.BAD_REQUEST),
    COURSE_ALREADY_PURCHASED(400, "You already own this course", HttpStatus.BAD_REQUEST)
    ;

    private int code;
    private String message;
    private HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

}
