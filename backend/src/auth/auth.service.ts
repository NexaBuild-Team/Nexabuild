import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.userService.createUser(dto);
    const token = this.generateToken(user.id, user.email);

    return {
      message: 'Registration successful',
      user,
      accessToken: token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Sync agent profile on login for existing users who registered earlier
    await this.userService.syncAgentProfile(user);

    const token = this.generateToken(user.id, user.email);
    const { password, ...result } = user;

    return {
      message: 'Login successful',
      user: result,
      accessToken: token,
    };
  }

  private generateToken(userId: string, email: string) {
    return this.jwtService.sign({
      sub: userId,
      email,
    });
  }
}
