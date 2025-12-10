import { UserResponseDto } from './auth-response.dto';

export interface AuthenticatedRequest {
  user: UserResponseDto & { userId: string };
}
