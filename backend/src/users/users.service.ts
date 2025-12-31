import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './user-role.enum';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onModuleInit() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) return;

    const existed = await this.userRepo.findOne({ where: { email } });
    if (existed) return;

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = this.userRepo.create({
      email,
      passwordHash,
      displayName: 'Admin',
      role: UserRole.ADMIN,
      isActive: true,
    });
    await this.userRepo.save(admin);
    console.log('✅ Default admin user created');
  }

  async findAll() {
    return this.userRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    return this.userRepo.findOne({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  async create(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      email: dto.email,
      passwordHash,
      displayName: dto.displayName,
      role: dto.role,
      isActive: true,
    });
    return this.userRepo.save(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) throw new Error('User not found');

    if (dto.email) user.email = dto.email;
    if (dto.displayName !== undefined) user.displayName = dto.displayName;
    if (dto.role) user.role = dto.role;
    if (dto.isActive !== undefined) user.isActive = dto.isActive;
    if (dto.password) {
      user.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    return this.userRepo.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) throw new Error('User not found');
    await this.userRepo.remove(user);
    return { message: 'User deleted' };
  }
}

