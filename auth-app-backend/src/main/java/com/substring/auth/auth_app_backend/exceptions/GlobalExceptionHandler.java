package com.substring.auth.auth_app_backend.exceptions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.substring.auth.auth_app_backend.dtos.ApiError;
import com.substring.auth.auth_app_backend.dtos.ErrorResponse;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	private final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
	
	@ExceptionHandler({
		UsernameNotFoundException.class,
		BadCredentialsException.class,
		CredentialsExpiredException.class,
		DisabledException.class
	})
	public ResponseEntity<ApiError> handleAuthException(Exception e, HttpServletRequest request) {
		logger.info("Exception : {}", e.getClass().getName());
		ApiError apiError =  ApiError.of(HttpStatus.UNAUTHORIZED.value(), "Unauthorized", e.getMessage(), request.getRequestURI());
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(apiError);
	}
	
	//resource not found exception handler
	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException exception){
		ErrorResponse internalServerError = new ErrorResponse(exception.getMessage(), HttpStatus.NOT_FOUND);
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(internalServerError);
	}
	
	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException exception){
		ErrorResponse internalServerError = new ErrorResponse(exception.getMessage(), HttpStatus.NOT_FOUND);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(internalServerError);
	}
}
