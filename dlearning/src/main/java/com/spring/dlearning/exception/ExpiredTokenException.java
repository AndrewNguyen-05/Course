package com.spring.dlearning.exception;

public class ExpiredTokenException extends AppException{
    public ExpiredTokenException() {
        super(ErrorCode.EXPIRED_TOKEN);
    }
}
