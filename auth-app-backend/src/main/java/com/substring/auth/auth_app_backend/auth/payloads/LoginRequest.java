package com.substring.auth.auth_app_backend.auth.payloads;

public record LoginRequest(
		String email,
		String password
) {
	

}
