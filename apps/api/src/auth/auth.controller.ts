import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser, type AuthUser } from './current-user.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('me')
  syncUser(@CurrentUser() user: AuthUser) {
    console.log('Syncing user:', user);
    return this.authService.syncUser(user.userId, user.email);
  }
}
