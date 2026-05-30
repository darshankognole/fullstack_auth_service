package com.substring.auth.auth_app_backend.config;

public class AppConstants {
    public static final String[] AUTH_PUBLIC_URLS= {
    		"/api/v1/auth/**",
    		"/oauth2/**",
    	    "/login/oauth2/**",
    	    "/error",
    		"/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html"
    };
}
