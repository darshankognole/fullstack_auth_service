package com.substring.auth.auth_app_backend.dtos;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import com.substring.auth.auth_app_backend.entities.Provider;
import com.substring.auth.auth_app_backend.entities.Role;
import com.substring.auth.auth_app_backend.entities.User;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
	
	private UUID id;
	private String email;
	private String name;
	private String password;
	private String image;
	
	@Builder.Default
	private Boolean enabled = true;
	private Instant createdAt;
	private Instant updatedAt;
	@Builder.Default
	private Provider provider = Provider.LOCAL;
	private Set<RoleDto> roles = new HashSet<>();
}
