package com.substring.auth.auth_app_backend.config;

import java.util.List;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.substring.auth.auth_app_backend.Security.JwtAuthenticationFilter;
import com.substring.auth.auth_app_backend.dtos.ApiError;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	private JwtAuthenticationFilter jwtAuthenticationFilter;

	@Autowired
	private AuthenticationSuccessHandler successHandler;

	@Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:3000}")
	private String allowedOrigins;

//	@Bean
//	public UserDetailsService users() {
//		User.UserBuilder userBuilder = User.withDefaultPasswordEncoder();
//		UserDetails user = userBuilder.username("darshan").password("abc").roles("ADMIN").build();
//		return new InMemoryUserDetailsManager(user);
//	}

	@Bean
	public SecurityFilterChain securityFilterChain(
	        HttpSecurity http,
	        @Qualifier("corsConfigurationSource") CorsConfigurationSource corsConfigurationSource
	) throws Exception {
	
	    http
//	         Disable CSRF (required for REST APIs)
	        .csrf(AbstractHttpConfigurer::disable)
//	        Enable CORS with your config
	        .cors(cors -> cors.configurationSource(corsConfigurationSource))
//	        No sessions (JWT based)
	        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//	        Authorization rules
	        .authorizeHttpRequests(auth -> auth
	        		.requestMatchers(AppConstants.AUTH_PUBLIC_URLS).permitAll()
	        	    .anyRequest().authenticated()
	        	)
	        	.oauth2Login(oauth -> oauth.successHandler(successHandler).failureHandler(null))
	        	.logout(AbstractHttpConfigurer::disable)
	        .exceptionHandling(ex -> ex.authenticationEntryPoint((request, response, e) -> {
	            response.setStatus(401);
	            response.setContentType("application/json");
	
	            String msg = "Unauthorized Access !!! " + e.getMessage();
	            String error = (String) request.getAttribute("error");
	
	            if (error != null) {
	                msg = error;
	            }
	
	            var apiError = ApiError.of(
	                    HttpStatus.UNAUTHORIZED.value(),
	                    "Unauthorized Access",
	                    msg,
	                    request.getRequestURI()
	            );
	
	            var objectMapper = new ObjectMapper();
	            response.getWriter().write(objectMapper.writeValueAsString(apiError));
	        }))
	        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
	
	    return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
	    return configuration.getAuthenticationManager();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
	    CorsConfiguration config = new CorsConfiguration();

	    config.setAllowedOrigins(Stream.of(allowedOrigins.split(","))
	            .map(String::trim)
	            .filter(origin -> !origin.isBlank())
	            .toList());

	    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
	    config.setAllowedHeaders(List.of("*"));

	    config.setAllowCredentials(true);

	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", config);

	    return source;
	}

}
