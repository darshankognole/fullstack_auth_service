package com.substring.auth.auth_app_backend.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.substring.auth.auth_app_backend.entities.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID>{
	Optional<Role> findByName(String name); 
}
