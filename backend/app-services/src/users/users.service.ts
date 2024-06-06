import {
  BadRequestException,
  ClassSerializerInterceptor,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from 'src/utils/hashingWithSalt.util';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { RoleService } from './role.service';
import { User } from './user.entity';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly roleService: RoleService,
  ) {}

  async create(email: string, password: string) {
    const defaultRole = await this.roleRepository.findOne({
      where: { name: 'user' },
    });

    if (!defaultRole) {
      console.error(
        'Default role "user" not found. Make sure it exists in the database.',
      );
      // Handle the error accordingly
      return null;
    }

    const user = this.repo.create({ email, password, roles: [defaultRole] });
    console.log(user);

    return this.repo.save(user);
  }
  findOneById(id: number) {
    const user = this.repo.findOne({ where: { id }, relations: ['roles'] });
    return user;
  }
  findOneByEmail(email: string) {
    const user = this.repo.findOne({ where: { email }, relations: ['roles'] });
    return user;
  }
  findOneByUserName(userName: string) {
    const user = this.repo.findOne({
      where: { userName },
      relations: ['roles'],
    });
    return user;
  }
  findOneByPhone(phone: number) {
    const user = this.repo.findOne({ where: { phone }, relations: ['roles'] });
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
    const users = await this.repo.find({ relations: ['roles'] });

    return users;
  }
  async deleteById(id: number) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.repo.remove(user);
  }
  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (attrs.email) {
      const emailAlreadyExists = await this.findOneByEmail(attrs.email);

      if (emailAlreadyExists && emailAlreadyExists.id !== id) {
        throw new BadRequestException('Email already exists');
      }
    }
    if (attrs.phone) {
      const phoneAlreadyExists = await this.findOneByPhone(attrs.phone);
      if (phoneAlreadyExists && phoneAlreadyExists.id !== id) {
        throw new BadRequestException('Phone already exists');
      }
    }
    if (attrs.password) {
      attrs.password = await hashPassword(attrs.password);
    }
    if (attrs.roles) {
      throw new UnauthorizedException("you can't change roles");
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }
  async assignRoleToUser(id: number, role_id: number): Promise<User> {
    const user = await this.repo.findOne({
      where: { id },
      relations: ['roles'],
    });
    const role = await this.roleService.findRoleById(role_id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (!user.roles) {
      user.roles = [];
    }
    const roleExists = user.roles.some(
      (existingRole) => existingRole.id === role.id,
    );
    if (roleExists) {
      throw new BadRequestException('User already has this role');
    }

    user.roles.push(role);
    return this.repo.save(user);
  }

  async enable2FA(userId, secret: string) {
    return this.repo.update(
      { id: userId },
      {
        twoFASecret: secret,
        enable2FA: true,
      },
    );
  }
  async disable2FA(userId) {
    return this.repo.update(
      { id: userId },
      { enable2FA: false, twoFASecret: null },
    );
  }
}
