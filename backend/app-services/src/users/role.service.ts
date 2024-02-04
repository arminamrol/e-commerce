import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async createRole(name: string): Promise<Role> {
    const role = this.roleRepository.create({ name });
    return this.roleRepository.save(role);
  }

  async findRoleByName(name: string): Promise<Role | undefined> {
    return this.roleRepository.findOne({ where: { name } });
  }
  async findRoleById(id: number): Promise<Role | undefined> {
    return this.roleRepository.findOne({ where: { id } });
  }
  async onModuleInit() {
    // Initialize roles during application startup
    await this.initializeRoles();
  }

  async initializeRoles() {
    // Create roles if they don't exist
    await this.createRoleIfNotExists('admin');
    await this.createRoleIfNotExists('user');
    // Add more roles as needed
  }

  private async createRoleIfNotExists(roleName: string) {
    const existingRole = await this.findRoleByName(roleName);

    if (!existingRole) {
      await this.createRole(roleName);
    }
  }
}
