package com.spring.dlearning.exception;

public class InvalidTokenException extends AppException {
    public InvalidTokenException() {
        super(ErrorCode.UNAUTHENTICATED);
    }
}
