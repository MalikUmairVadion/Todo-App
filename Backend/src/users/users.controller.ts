import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { UsersService } from './users.service';
import { RolesGuard } from 'src/roles/roles.guard';

@Controller('users')
@UseGuards(RolesGuard) // Applying RolesGuard globally
export class UsersController {
  constructor(private userService: UsersService) {}

  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  @Get('all')
  getAllUsers() {
    // return this.userService.getAllUsers();
    return 'getAllUsers';
  }
}
