# Auth DTOs Documentation

## Overview
Các Data Transfer Objects (DTOs) được sử dụng trong authentication module để đảm bảo type safety và code rõ ràng.

## DTOs List

### 1. **auth-response.dto.ts**
Chứa các response interfaces:
- `UserResponseDto` - User data trả về (không có password)
- `LoginResponseDto` - Response khi login
- `RegisterResponseDto` - Response khi register
- `RefreshTokenResponseDto` - Response khi refresh token
- `LogoutResponseDto` - Response khi logout

### 2. **jwt-payload.dto.ts**
- `JwtPayload` - Payload được encode trong JWT token
- `LoginRequest` - Request object từ LocalAuthGuard

### 3. **authenticated-request.dto.ts**
- `AuthenticatedRequest` - Request object sau khi authenticated với JwtAuthGuard

### 4. **login.dto.ts**
- `LoginDto` - Validation DTO cho login endpoint

### 5. **register.dto.ts**
- `RegisterDto` - Validation DTO cho register endpoint

### 6. **refresh-token.dto.ts**
- `RefreshTokenDto` - Validation DTO cho refresh token endpoint

## Usage Examples

### In Service
```typescript
async login(req: LoginRequest): Promise<LoginResponseDto> {
  // Implementation
}
```

### In Controller
```typescript
@Post('login')
async login(@Request() req: LoginRequest): Promise<LoginResponseDto> {
  return this.authService.login(req);
}
```

## Benefits
✅ Type safety - Compiler catches type errors
✅ IntelliSense support - Better developer experience
✅ Self-documenting code - Clear interfaces
✅ Easier refactoring - Changes propagate through types

