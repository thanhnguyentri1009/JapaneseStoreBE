import {
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../entities/role.entity';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

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

  async findAll(page = 1, perPage = 10): Promise<PaginatedResult<Role>> {
    const [data, total] = await this.repo.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
    });
    return { data, page, perPage, total };
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

  async create(dto: CreateRoleDto): Promise<Role> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.findById(id);
    return this.repo.save({ ...role, ...dto });
  }
}
