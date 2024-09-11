import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/common/role.enum';
import { UsersService } from '../service/users.service';
import { RolesGuard } from 'src/roles/roles.guard';
import { SignUpDto } from 'src/dto/sign-up.dto';
import { SkipAuth } from 'src/guards/SkipAuth.guard';
import { ChangePasswordDto } from 'src/dto/change-password.dto';

@Controller('users')
@UseGuards(RolesGuard) // Applying RolesGuard globally
export class UsersController {
  constructor(private userService: UsersService) {}

  @SkipAuth()
  @Post('signup')
  @HttpCode(HttpStatus.OK)
  RegisterUser(@Body() signUpDto: SignUpDto) {
    return this.userService.createUser(signUpDto);
  }

  @Put('change-password')
  @HttpCode(HttpStatus.OK)
  changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.userService.changePassword(req.user.sub, changePasswordDto);
  }

  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  @Put(':id/disable') // You may want to use a more descriptive route like ':id/disable'
  async disableUser(@Param('id') id: number) {
    return this.userService.disableUser(id);
  }

  @Roles(Role.Admin)
  @Get('all')
  @HttpCode(HttpStatus.OK)
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
}
