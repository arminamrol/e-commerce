// src/auth/auth.controller.ts
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    const user = await this.usersService.findOneByEmail(body.email);
    if (user) {
      throw new BadRequestException('User already exists');
    }
    if (!user) {
      const user = await this.usersService.create(body.email, body.password);
      return user;
    }
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.login(body);
    return user;
  }
}
