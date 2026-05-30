package com.substring.auth.auth_app_backend.Security;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.substring.auth.auth_app_backend.helpers.UserHelper;
import com.substring.auth.auth_app_backend.repositories.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
	
	private final JwtService jwtService;
	private final UserRepository userRepository;
	private Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
	
	@Override
	protected void doFilterInternal(HttpServletRequest request,
	                               HttpServletResponse response,
	                               FilterChain filterChain)
	        throws ServletException, IOException {

	    String header = request.getHeader("Authorization");
	    logger.info("Authorization Header: {}", header);

	    if (header == null || !header.startsWith("Bearer ")) {
	        filterChain.doFilter(request, response);
	        return;
	    }if (header == null || !header.startsWith("Bearer ")) {
	        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
	        response.setContentType("application/json");
	        response.getWriter().write("{\"error\": \"Missing Authorization Token\"}");
	        return;
	    }

	    String token = header.substring(7);

	    try {

	        if (!jwtService.isAccessToken(token)) {
	            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
	            response.getWriter().write("{\"error\": \"Invalid Token Type\"}");
	            return;
	        }

	        Jws<Claims> parse = jwtService.parse(token);
	        Claims payload = parse.getPayload();

	        UUID userUuid = UserHelper.parseUUID(payload.getSubject());

	        userRepository.findById(userUuid).ifPresent(user -> {
	            if (user.isEnabled()) {
	                List<GrantedAuthority> authorities =
	                        user.getRoles() == null ? List.of() :
	                                user.getRoles().stream()
	                                        .map(role -> new SimpleGrantedAuthority(role.getName()))
	                                        .collect(Collectors.toList());

	                UsernamePasswordAuthenticationToken authentication =
	                        new UsernamePasswordAuthenticationToken(
	                                user.getId(),
	                                null,
	                                authorities
	                        );

	                authentication.setDetails(
	                        new WebAuthenticationDetailsSource().buildDetails(request)
	                );

	                SecurityContextHolder.getContext().setAuthentication(authentication);
	            }
	        });

	    } catch (ExpiredJwtException e) {
	        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
	        response.getWriter().write("{\"error\": \"Token Expired\"}");
	        return;
	    } catch (JwtException e) {
	        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
	        response.getWriter().write("{\"error\": \"Invalid Token\"}");
	        return;
	    }

	
	    filterChain.doFilter(request, response);
	}

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
	    String path = request.getRequestURI();
	    return path.startsWith("/api/v1/auth") || path.startsWith("/error");
	}
	
}
