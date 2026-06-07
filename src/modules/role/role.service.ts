import {
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../entities/role.entity';

@Injectable()
export class RoleService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Role)
    private readonly repo: Repository<Role>,
  ) {}

  async onApplicationBootstrap() {
    for (const name of ['user', 'admin']) {
      const exists = await this.repo.findOne({ where: { name } });
      if (!exists) await this.repo.save(this.repo.create({ name }));
    }
  }

  findAll(): Promise<Role[]> {
    return this.repo.find();
  }

  async findById(id: string): Promise<Role> {
    const role = await this.repo.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Role #${id} not found`);
    return role;
  }

  async findByName(name: string): Promise<Role> {
    const role = await this.repo.findOne({ where: { name } });
    if (!role) throw new NotFoundException(`Role "${name}" not found`);
    return role;
  }
}
