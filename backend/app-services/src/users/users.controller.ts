import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/gaurds/auth.gaurd';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AllUserDto } from './dtos/allUser.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Serialize(UserDto, ['/'])
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/user/:id')
  async findUserById(@Param('id') id: string) {
    const user = await this.usersService.findOneById(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get('/user')
  async findUserByEmail(@Body() body: { email: string }) {
    const user = await this.usersService.findOneByEmail(body.email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Serialize(AllUserDto)
  @Get()
  async findAllUsers(): Promise<{ count: number; users: User[] }> {
    const users = await this.usersService.find();
    return { count: users.length, users };
  }

  @Delete('/user/:id')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteById(parseInt(id));
    return { success: true, message: `user with id ${id} deleted` };
  }

  @Patch('/user/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const user = await this.usersService.findOneById(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.usersService.update(parseInt(id), body);
  }
}
