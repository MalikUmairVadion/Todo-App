import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/enums/role.enum';
import { Users } from 'src/model/users.entity';
import { Repository } from 'typeorm';

export interface User {
  userId: number;
  username: string;
  password: string;
  userType: Role;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private users: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.users.find();
  }

  findOneByUserName(username: string): Promise<User | null> {
    return this.users.findOneBy({ username });
  }

  findOneById(userId: number): Promise<User | null> {
    return this.users.findOneBy({ userId });
  }

  // async getAllUsers() {
  //   return this.users
  //     .filter((user) => user.userType !== Role.Admin)
  //     .map((user) => ({
  //       userId: user.userId,
  //       username: user.username,
  //     }));
  // }

  async remove(id: number): Promise<void> {
    await this.users.delete(id);
  }
}
