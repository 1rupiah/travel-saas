import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';

@Injectable()
export class TenantsService {
  constructor(@InjectRepository(Tenant) private repo: Repository<Tenant>) {}

  findAll() { return this.repo.find({ where: { isActive: true } }); }

  async findOne(id: string) {
    const t = await this.repo.findOne({ where: { id } });
    if (!t) throw new NotFoundException('Tenant not found');
    return t;
  }

  async findBySlug(slug: string) {
    return this.repo.findOne({ where: { slug, isActive: true } });
  }

  async update(id: string, dto: Partial<Tenant>) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async updateSettings(id: string, settings: any) {
    await this.repo.update(id, { settings });
    return this.findOne(id);
  }
}
