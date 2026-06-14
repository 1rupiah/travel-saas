import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TravelPackage } from './package.entity';

@Injectable()
export class PackagesService {
  constructor(@InjectRepository(TravelPackage) private repo: Repository<TravelPackage>) {}

  findAll(tenantId?: string, filters?: any) {
    const query = this.repo.createQueryBuilder('pkg')
      .where('pkg.isActive = :active', { active: true });
    
    if (tenantId) query.andWhere('pkg.tenantId = :tenantId', { tenantId });
    if (filters?.type) query.andWhere('pkg.type = :type', { type: filters.type });
    if (filters?.destination) query.andWhere('pkg.destination ILIKE :dest', { dest: `%${filters.destination}%` });
    if (filters?.featured) query.andWhere('pkg.isFeatured = :featured', { featured: true });

    return query.orderBy('pkg.createdAt', 'DESC').getMany();
  }

  async findOne(id: string) {
    const pkg = await this.repo.findOne({ where: { id } });
    if (!pkg) throw new NotFoundException('Package not found');
    return pkg;
  }

  create(tenantId: string, dto: Partial<TravelPackage>) {
    const pkg = this.repo.create({ ...dto, tenantId });
    return this.repo.save(pkg);
  }

  async update(id: string, dto: Partial<TravelPackage>) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.repo.update(id, { isActive: false });
    return { message: 'Package deleted' };
  }
}
