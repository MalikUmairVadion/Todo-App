import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { SignInDto } from 'src/dto/sign-in.dto';
import { isEmail } from 'class-validator'; // Helper to check if identifier is an email

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const { identifier, password } = signInDto;

    let user;

    // Check if the identifier is an email or username
    if (isEmail(identifier)) {
      user = await this.usersService.findOneByEmail(identifier);
    } else {
      user = await this.usersService.findOneByUserName(identifier);
    }

    // If the user is not found, throw an error
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    if (user.disabled) {
      throw new UnauthorizedException(
        'User is disabled, Kindly contact admin to Enable it first',
      );
    }

    // Generate the JWT payload and token
    const payload = {
      sub: user.id,
      username: user.username,
      useremail: user.useremail,
      roles: [user.userType],
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
