import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto } from 'src/dto/sign-up.dto';
import { Users } from 'src/model/users.entity';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/role.enum';
import { ChangePasswordDto } from 'src/dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  findOneByUserName(username: string): Promise<Users | null> {
    return this.usersRepository.findOneBy({ username });
  }

  findOneByEmail(email: string): Promise<Users | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async findOneById(id: number): Promise<Partial<Users> | null> {
    // Select only the required fields
    return this.usersRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'userType', 'disabled'],
    });
  }

  async comparePassword(
    userId: number,
    inputPassword: string,
  ): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['password'],
    });
    if (!user) {
      return false;
    }
    const isMatch = await bcrypt.compare(inputPassword, user.password);
    return isMatch;
  }

  async createUser(signUpDto: SignUpDto): Promise<any> {
    const { username, email, password } = signUpDto;

    // Check if the email already exists
    const existingUser = await this.findOneByEmail(email);
    if (existingUser) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'Email already in use',
        data: null,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
      userType: Role.User,
    });

    await this.usersRepository.save(newUser);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    };
  }

  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<any> {
    const { oldPassword, newPassword, confirmPassword } = changePasswordDto;

    const passwordMatch = await this.comparePassword(userId, oldPassword);
    if (!passwordMatch) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Your password is incorrect',
      };
    }

    if (newPassword != confirmPassword) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'New password and confirm password do not match',
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await this.findOneById(userId);
    user.password = hashedPassword;

    await this.usersRepository.save(user);

    // Return success response
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Password changed successfully',
    };
  }

  async disableUser(id: number): Promise<any> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      };
    }

    if (user.userType === Role.Admin) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Cannot disable an admin user',
      };
    }

    user.disabled = !user.disabled; // Update the user’s `disabled` field to !disabled
    await this.usersRepository.save(user);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User disable status changed successfully',
    };
  }

  async getAllUsers(): Promise<
    { username: string; email: string; userType: Role }[]
  > {
    try {
      const users = await this.usersRepository.find({
        where: { userType: Role.User },
        select: ['id', 'username', 'email', 'userType', 'disabled'],
      });

      return users;
    } catch (error) {
      // Handle errors
      console.error('Error fetching users:', error);

      throw new HttpException(
        'Failed to retrieve users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
