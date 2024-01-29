import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
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

  @Get()
  findAllUsers() {
    return this.usersService.find();
  }

  @Delete('/user/:id')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteById(parseInt(id));
    return { success: true, message: `user with id ${id} deleted` };
  }
}
