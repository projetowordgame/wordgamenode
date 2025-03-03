import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async createUser(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ name, email, password: hashedPassword });
    return this.userRepo.save(user);
  }

  async update(userId: number, name?: string, email?: string, password?: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
  
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
  
    return this.userRepo.save(user);
  }

  async getUserProfile(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'name', 'email'], // 🔹 Evita retornar a senha
    });
  
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
  
    return user;
  }

  async deleteUser(userId: number): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
  
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
  
    await this.userRepo.delete(userId);
    return { message: 'Usuário deletado com sucesso' };
  }

  async getAllUsers() {
    return this.userRepo.find({
      select: ['id', 'name', 'email'], // Evita expor senhas
    });
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }
}
