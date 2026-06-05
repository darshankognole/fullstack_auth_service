package com.substring.auth.auth_app_backend.auth.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.substring.auth.auth_app_backend.auth.entities.Provider;
import com.substring.auth.auth_app_backend.auth.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    // ================= BASIC =================

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findById(UUID id);


    // ================= AUTH / LOGIN =================

    Optional<User> findByEmailAndEnabledTrue(String email);

    Optional<User> findByEmailAndProvider(String email, Provider provider);


    // ================= ROLE FETCH (IMPORTANT FIX FOR LAZY ISSUE) =================

    @EntityGraph(attributePaths = "roles")
    Optional<User> findWithRolesByEmail(String email);

    @EntityGraph(attributePaths = "roles")
    Optional<User> findWithRolesById(UUID id);


    // ================= FILTERING =================

    List<User> findByEnabled(boolean enabled);

    List<User> findByProvider(Provider provider);

    List<User> findByNameContainingIgnoreCase(String keyword);


    // ================= COMBINED FILTER =================

    List<User> findByEnabledAndProvider(boolean enabled, Provider provider);

    List<User> findByNameContainingIgnoreCaseAndEnabled(String keyword, boolean enabled);


    // ================= BULK / ADMIN =================

    long countByEnabled(boolean enabled);

    long countByProvider(Provider provider);


    // ================= DELETE =================

    void deleteByEmail(String email);

}