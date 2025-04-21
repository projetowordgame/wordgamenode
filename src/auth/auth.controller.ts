import { Controller, Post, Body, Req, Res, Put, Get, Delete, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Post('register')
  async register(@Body() body: { name: string, email: string; password: string; role: string }) {
    return this.userService.createUser(body.name, body.email, body.password, body.role);
  }

  @Put('update')
  async updateUser(@Body() body: { id: number, name: string, email: string; password: string }) {
    return this.userService.update(body.id, body.name, body.email, body.password);
  }

  @Get('profile')
  async getProfile(@Req() req) {
    const token = req.headers.authorization?.split(' ')[1]; // 🔹 Remove "Bearer"
    return this.authService.getUserFromToken(token);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Req() req) {
    const userId = parseInt(id, 10);

    return this.userService.deleteUser(userId);
  }

  @Get('users')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('teachers')
  async getAllTeachers() {
    return this.userService.getAllTeachers();
  }

  @Get('students')
  async getAllStudents() {
    return this.userService.getAllStudents();
  }


  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    return res.json({ message: 'Logout realizado com sucesso' });
  }
}

