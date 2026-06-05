package com.substring.auth.auth_app_backend.auth.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.substring.auth.auth_app_backend.auth.config.AppConstants;
import com.substring.auth.auth_app_backend.auth.entities.Role;
import com.substring.auth.auth_app_backend.auth.payloads.UserDto;
import com.substring.auth.auth_app_backend.auth.repositories.RoleRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {
	
	private final UserService userService;
	private final PasswordEncoder passwordEncoder;
	
	@Override
	public UserDto registerUser(UserDto userDto) {
		
		//logic
		//verify email
		//verify password
		//default role
		userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
		
		return userService.createUser(userDto);
		
	}
}
