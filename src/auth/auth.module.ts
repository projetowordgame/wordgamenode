import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module'; // 🔹 Importando o UserModule
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UserModule, // 🔹 Agora o AuthModule tem acesso ao UserService
    PassportModule,
    JwtModule.register({
      secret: 'wordgame', //colocar em um .env esse token e chamar aqui
      signOptions: { expiresIn: '5h' }, //colocar em um .env esse tempo e chamar aqui
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
