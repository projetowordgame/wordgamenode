import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Credenciais inválidas');
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { email: user.email, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async getUserFromToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token); // 🔹 Decodifica o token
      return await this.userService.getUserProfile(decoded.sub); // 🔹 Puxa o usuário pelo ID
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
  
}

