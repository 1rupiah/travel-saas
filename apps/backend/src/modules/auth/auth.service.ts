import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../users/user.entity';
import { Tenant } from '../tenants/tenant.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Tenant) private tenantRepo: Repository<Tenant>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepo.findOne({
      where: { email, isActive: true },
      select: ['id', 'email', 'password', 'role', 'name', 'tenantId'],
    });
    if (!user) return null;
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;
    return user;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role, tenantId: user.tenantId };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, name: user.name, email: user.email, role: user.role, tenantId: user.tenantId },
    };
  }

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 12);
    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashed,
      phone: dto.phone,
      role: UserRole.CUSTOMER,
    });
    const saved = await this.userRepo.save(user);
    return this.login(saved);
  }

  async registerTenant(dto: any) {
    const tenantExists = await this.tenantRepo.findOne({ where: { slug: dto.slug } });
    if (tenantExists) throw new ConflictException('Slug already taken');

    const tenant = this.tenantRepo.create({
      slug: dto.slug,
      name: dto.companyName,
      email: dto.email,
      phone: dto.phone,
    });
    const savedTenant = await this.tenantRepo.save(tenant);

    const hashed = await bcrypt.hash(dto.password, 12);
    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashed,
      role: UserRole.TENANT_ADMIN,
      tenantId: savedTenant.id,
    });
    const savedUser = await this.userRepo.save(user);
    return this.login(savedUser);
  }
}
