package com.substring.auth.auth_app_backend.dtos;

public record TokenResponse(
		String accessToken,
		String refreshToken,
		long expiresIn,
		String tokenType,
		UserDto userdto
) {
	
	public static TokenResponse of(String accessToken, String refreshToken, long expiresIn, UserDto userdto) {
		return new TokenResponse(accessToken, refreshToken, expiresIn, "Bearer", userdto);
	}

}
