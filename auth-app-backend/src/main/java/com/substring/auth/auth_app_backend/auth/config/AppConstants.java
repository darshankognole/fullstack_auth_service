package com.substring.auth.auth_app_backend.auth.config;

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
    
    public static final String[] AUTH_ADMIN_URLS= {
    		"/api/v1/users/**"
    };
    
    public static final String[] AUTH_GUEST_URLS= {
    		
    };
    
    public static final String ADMIN_ROLE ="ADMIN";
    public static final String GUEST_ROLE ="GUEST";
}
