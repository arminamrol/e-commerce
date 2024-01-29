import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }
  findOneById(id: number) {
    const user = this.repo.findOne({ where: { id } });
    return user;
  }
  findOneByEmail(email: string) {
    const user = this.repo.findOne({ where: { email } });
    return user;
  }
  findOneByUserName(userName: string) {
    const user = this.repo.findOne({ where: { userName } });
    return user;
  }
  findOneByPhone(phone: number) {
    const user = this.repo.findOne({ where: { phone } });
    return user;
  }
  async findUserByField(
    field: 'email' | 'userName' | 'phone',
    value: string | number,
  ): Promise<User | null> {
    const query: { [key: string]: any } = {};
    query[field] = value;

    const user = await this.repo.findOne({ where: query });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  async find() {
    const count = await this.repo.count();
    const users = await this.repo.find();
    const response = {
      count,
      users,
    };
    return response;
  }
  async deleteById(id: number) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.repo.remove(user);
  }
}
