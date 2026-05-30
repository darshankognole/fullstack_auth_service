# Authentication Debug Documentation

## 1. Root Cause Analysis

### Problem 1: Logout was slow and not production-ready

#### Exact issue found
- Frontend logout waited for the `/auth/logout` API call before clearing local auth state.
- The logout button navigated immediately, but Zustand still held `accessToken`, `user`, and `authStatus` until the network call finished.
- Because the Axios client had a `10s` timeout, any slow network/logout response left stale authenticated UI visible and made logout feel delayed.
- The logout request also went through the normal auth client path, so it was not isolated from refresh logic.

#### Why the bug happened
- In `auth-app-frontend/src/auth/store.tsx`, `logout()` awaited `logoutUser()` before clearing state.
- In `auth-app-frontend/src/components/shared/Navbar.tsx`, navigation happened before store cleanup completed.
- No explicit `isLoggingOut` guard existed, so refresh logic could still try to run after logout had started.

#### Files causing it
- `auth-app-frontend/src/auth/store.tsx`
- `auth-app-frontend/src/components/shared/Navbar.tsx`
- `auth-app-frontend/src/config/ApiClient.ts`
- `auth-app-frontend/src/services/AuthService.ts`
- `auth-app-frontend/src/Pages/Users/UserLayout.tsx`

### Problem 2: Backend refresh worked, frontend refresh integration failed

#### Exact issue found
- The Axios response interceptor had a runtime bug: `error.response.this.status` instead of `error.response?.status`.
- Because of that, the refresh branch crashed before checking for `401`, so expired access tokens did not trigger a valid refresh flow.
- Even if refresh had succeeded, the interceptor retried the original request with `apiClient(original)` but did not `return` it, so callers would not receive the retried response correctly.
- Refresh/logout requests were not excluded from the auth retry mechanism, which created recursion and race-condition risk.
- Frontend logout-on-refresh-failure called the network logout flow instead of a local-only cleanup path, which could reintroduce delay.
- Backend dev cookie settings used `Secure=true` and `Domain=localhost` on HTTP localhost. In browsers, that prevents reliable refresh-cookie storage/sending during local development.
- Backend header parsing for refresh tokens had a `regionMatches(..., 0)` bug, so Authorization-header fallback never worked.

#### Why the bug happened
- The frontend interceptor logic was partially implemented but had critical runtime mistakes in the actual code path.
- The frontend relied on cookie-based refresh, but the backend dev cookie defaults were not compatible with normal `http://localhost` browser behavior.
- Refresh logic lacked a strict single-flight mechanism and endpoint exclusions.

#### Files causing it
- `auth-app-frontend/src/config/ApiClient.ts`
- `auth-app-frontend/src/services/AuthService.ts`
- `auth-app-frontend/src/auth/store.tsx`
- `auth-app-frontend/src/Pages/OAuthSuccess.tsx`
- `auth-app-backend/src/main/resources/application-dev.yaml`
- `auth-app-backend/src/main/java/com/substring/auth/auth_app_backend/controller/AuthContoller.java`

## 2. Investigation Process

### What was analyzed
- Backend security chain, JWT filter, auth controller, JWT service, cookie service, exception handler, and profile configuration.
- Frontend Axios client, auth service wrappers, Zustand auth store, protected route handling, navbar logout trigger, OAuth success flow, and build config.
- Cookie transport settings, CORS settings, request headers, `withCredentials`, token persistence, and retry behavior.

### What was verified
- `/api/v1/auth/**` is excluded from the JWT filter and publicly permitted.
- Refresh depends on the refresh token cookie in the browser flow.
- No React Query/Redux/Context auth cache exists here; auth state is managed by persisted Zustand only.
- Protected routes depend on local auth store state rather than a server-side current-user bootstrap.
- Frontend production build had a separate TypeScript config blocker (`ignoreDeprecations: "6.0"`), which would have prevented production verification.

### What tests were performed
- Traced login, refresh, logout, and OAuth success code paths file by file.
- Built frontend production bundle successfully with `npm.cmd run build`.
- Ran backend verification with `.\mvnw.cmd test` after fixing local wrapper invocation and Spring config instantiation.
- Verified backend test result: `BUILD SUCCESS`.

## 3. Fixes Implemented

### Backend changes
- Fixed refresh-token Authorization-header parsing in `AuthContoller`.
- Switched auth exception responses to `401 Unauthorized` in `GlobalExceptionHandler`.
- Made CORS origins configurable instead of hardcoding localhost-only values in `SecurityConfig`.
- Added explicit QA and production auth/cors config files so profile-specific auth settings are defined.

### Frontend changes
- Changed logout to local-state-first cleanup in Zustand.
- Added `isLoggingOut` guard to stop refresh after logout begins.
- Cleared persisted auth storage immediately during logout.
- Updated navbar/logout redirect to use `/login` with `replace`.
- Updated protected-route redirect to use `replace`.
- Fixed OAuth success page so it actually executes refresh once and stores the new auth state.

### Security changes
- Dev refresh cookie defaults now use `Secure=false` and blank `Domain` for localhost browser compatibility.
- Production/QA profile configs keep secure-cookie posture with `SameSite=None` + `Secure=true` defaults.
- Auth endpoints now bypass refresh recursion and unnecessary Authorization header attachment on the frontend.

### Token flow changes
- Added single-flight refresh behavior: one refresh request services all concurrent `401` responses.
- Prevented refresh endpoint from trying to refresh itself.
- Prevented logout endpoint from entering the refresh loop.
- Returned the retried original request correctly after refresh success.
- On refresh failure, frontend now performs immediate local auth cleanup without waiting for network logout.

## 4. Before vs After Flow

### Login flow

#### Before
1. Login succeeded and stored access token/user.
2. Refresh cookie was issued by backend, but localhost browser handling was unreliable because of cookie settings.

#### After
1. Login still stores access token/user exactly as before.
2. Refresh cookie is now usable in localhost browser flow.
3. Production/QA config keeps secure-cookie defaults.

### Refresh flow

#### Before
1. Protected request hit `401`.
2. Frontend interceptor crashed on `error.response.this.status`.
3. Refresh did not execute correctly, or request retry handling broke.
4. User got logged out or request failed.

#### After
1. Protected request hits `401`.
2. Frontend detects it safely.
3. Only one refresh request runs at a time.
4. Refresh request sends cookie with `withCredentials`.
5. Backend validates and rotates refresh token.
6. Frontend stores the new access token.
7. Original request is retried and returned correctly.
8. If refresh fails, local auth state is cleared immediately and user is redirected cleanly.

### Logout flow

#### Before
1. User clicked logout.
2. Frontend waited for `/auth/logout` before clearing auth state.
3. UI could still appear logged in during slow network/logout response.
4. Refresh logic was not explicitly blocked during logout.

#### After
1. User clicks logout.
2. Frontend immediately clears access token, user state, and persisted auth storage.
3. Protected routes redirect immediately.
4. Logout API call runs without blocking the UX.
5. Refresh is blocked once logout starts.
6. No stale auth state remains in the UI.

## 5. Files Changed

- `auth-app-frontend/src/auth/store.tsx`
- `auth-app-frontend/src/config/ApiClient.ts`
- `auth-app-frontend/src/services/AuthService.ts`
- `auth-app-frontend/src/components/shared/Navbar.tsx`
- `auth-app-frontend/src/Pages/Users/UserLayout.tsx`
- `auth-app-frontend/src/Pages/OAuthSuccess.tsx`
- `auth-app-frontend/src/Pages/Login.tsx`
- `auth-app-frontend/src/Pages/About.tsx`
- `auth-app-frontend/src/Pages/Services.tsx`
- `auth-app-frontend/src/Pages/OAuthFailure.tsx`
- `auth-app-frontend/src/Pages/Signup.tsx`
- `auth-app-frontend/src/main.tsx`
- `auth-app-frontend/tsconfig.app.json`
- `auth-app-backend/src/main/java/com/substring/auth/auth_app_backend/config/SecurityConfig.java`
- `auth-app-backend/src/main/java/com/substring/auth/auth_app_backend/controller/AuthContoller.java`
- `auth-app-backend/src/main/java/com/substring/auth/auth_app_backend/exceptions/GlobalExceptionHandler.java`
- `auth-app-backend/src/main/resources/application-dev.yaml`
- `auth-app-backend/src/main/resources/application-prod.yaml`
- `auth-app-backend/src/main/resources/application-qa.yaml`

## 6. Future Recommendations

### Potential improvements
- Add dedicated integration tests for access-token expiry and automatic refresh/retry behavior.
- Add a frontend auth bootstrap endpoint such as `/me` if you want true session restoration without relying only on persisted access-token state.
- Replace console logging in auth code with structured logging.

### Security recommendations
- Do not return the refresh token in the JSON body if the browser flow is cookie-only; keep it HttpOnly-only for stricter separation.
- Consider shortening dev access-token TTL only in explicit test scenarios, not as the default for all dev usage.
- Add refresh-token reuse-detection handling if you want stronger theft detection.

### Scalability recommendations
- Add database cleanup for expired/revoked refresh tokens.
- Add rate limiting to login and refresh endpoints.
- Move auth-flow behavior into focused unit/integration tests to prevent regressions as this service is reused by other applications.
