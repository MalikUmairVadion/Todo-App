import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const { username, password } = signInDto;

    const user = await this.usersService.findOneByUserName(username);
    if (!user) {
      throw new UnauthorizedException('Invalid username');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('Invalid Password');
    }
    const payload = {
      sub: user.userId,
      username: user.username,
      roles: [user.userType],
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
