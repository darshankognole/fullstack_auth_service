package com.substring.auth.auth_app_backend.auth.entities;

import java.time.Instant;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
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
@Entity
@Table(name = "users")
public class User implements UserDetails{
	@Id
	@GeneratedValue
	@org.hibernate.annotations.UuidGenerator
	@Column(name = "user_id")
	private UUID id;

	@Column(name = "user_email", unique = true, length = 300)
	private String email;

	@Column(name = "user_name", length = 500)
	private String name;

	@Column(name = "password", length = 300)
	private String password;

	private String image;

	@Builder.Default
	@Column(nullable = false, columnDefinition = "boolean default true")
	private Boolean enabled = true;

	private Instant createdAt;
	private Instant updatedAt;

	@Builder.Default
	@Enumerated(EnumType.STRING)
	private Provider provider = Provider.LOCAL;
	private String providerId;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(
	    name = "user_roles",
	    joinColumns = @JoinColumn(name = "user_id"),
	    inverseJoinColumns = @JoinColumn(name = "role_id")
	)
	private Set<Role> roles = new HashSet<>();
	
	@PrePersist
	protected void onCreate() {
		Instant now = Instant.now();
		if(createdAt == null) createdAt = now;
		updatedAt = now;
	}
	
	@PreUpdate
	protected void onUpdate() {
		updatedAt = Instant.now();
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
	    if (roles == null || roles.isEmpty()) {
	        return List.of(); // return empty list instead of null
	    }
		return roles
				.stream()
				.map(role -> new SimpleGrantedAuthority(role.getName()))
				.toList();
	}

	@Override
	public String getUsername() {
		return this.email;
	}
	
	public boolean isEnabled() {
	    return Boolean.TRUE.equals(this.enabled);
	}


}
