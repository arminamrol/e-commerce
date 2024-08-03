import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ValidateDto } from './dtos/validate2fa.dto';
import { JwtAuthGuard } from './gaurds/auth.gaurd';
import { ApiTags } from '@nestjs/swagger';
import {
  Disable2FASwagger,
  Enable2FASwagger,
  LoginSwagger,
  RegisterSwagger,
  Verify2FASwagger,
} from 'src/auth/auth.swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @RegisterSwagger()
  async register(@Body() body: CreateUserDto) {
    const user = await this.authService.register(body);
    return user;
  }
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @LoginSwagger()
  async login(@Body() body: LoginDto) {
    const user = await this.authService.login(body);
    return user;
  }

  @Get('/enable2fa')
  @UseGuards(JwtAuthGuard)
  @Enable2FASwagger()
  async enable2FA(@Request() req) {
    const userId = req.user.userId;
    const user = await this.authService.enable2FA(userId);
    return user;
  }

  @Get('/disable2fa')
  @UseGuards(JwtAuthGuard)
  @Disable2FASwagger()
  async disable2FA(@Request() req) {
    const userId = req.user.userId;
    const user = await this.authService.disable2FA(userId);
    return user;
  }

  @Post('/verify2fa')
  @Verify2FASwagger()
  async verify2FA(@Body() body: ValidateDto) {
    const { token, userId } = body;
    const result = await this.authService.validate2FA(userId, token);
    return result;
  }
}
