import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findAll(tenantId?: string) {
    return this.repo.find({ where: tenantId ? { tenantId } : undefined });
  }

  async findOne(id: string) {
    const u = await this.repo.findOne({ where: { id } });
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  async update(id: string, dto: any) {
    if (dto.password) dto.password = await bcrypt.hash(dto.password, 12);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async createStaff(tenantId: string, dto: any) {
    const hashed = await bcrypt.hash(dto.password, 12);
    const user = this.repo.create({ ...dto, password: hashed, role: UserRole.STAFF, tenantId });
    return this.repo.save(user);
  }
}
