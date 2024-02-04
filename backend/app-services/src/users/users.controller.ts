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

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Serialize(AllUserDto)
  @Get()
  async findAllUsers(): Promise<{ count: number; users: User[] }> {
    const users = await this.usersService.find();
    return { count: users.length, users };
  }

  @Serialize(UserDto)
  @Get('/user')
  async findUserByEmail(@Body() body: { email: string }) {
    const user = await this.usersService.findOneByEmail(body.email);
    return user;
  }

  @Serialize(UserDto)
  @Get('/:id')
  async findUserById(@Param('id') id: string) {
    const intId = parseInt(id);
    if (intId) {
      const user = await this.usersService.findOneById(intId);
      if (!user) {
        throw new NotFoundException('user not found');
      }
      return user;
    }
  }

  @Serialize(UserDto)
  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    const intId = parseInt(id);
    if (intId) {
      await this.usersService.deleteById(intId);
      return { success: true, message: `user with id ${id} deleted` };
    }
  }

  @Serialize(UserDto)
  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const intId = parseInt(id);
    if (intId) {
      const user = await this.usersService.findOneById(intId);
      if (!user) {
        throw new NotFoundException('user not found');
      }
      return this.usersService.update(parseInt(id), body);
    }
  }
}
