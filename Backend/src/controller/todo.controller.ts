import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { Role } from 'src/common/role.enum';
import { CreateTodoDto } from 'src/dto/create-todo.dto';
import { UpdateTodoDto } from 'src/dto/update-todo.dto';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { TodoService } from 'src/service/todo.service';

@Controller('todo')
@UseGuards(RolesGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async getAllUserTodos(@Request() req) {
    return await this.todoService.getTodosByUserId(req.user.sub);
  }

  @Post()
  async createTodo(@Request() req, @Body() createTodoDto: CreateTodoDto) {
    return await this.todoService.createTodo(req.user.sub, createTodoDto);
  }

  @Put(':id')
  async updateTodo(
    @Request() req,
    @Param('id') id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return await this.todoService.updateTodo(req.user.sub, id, updateTodoDto);
  }

  @Delete(':id')
  async deleteTodo(@Request() req, @Param('id') id: number) {
    return await this.todoService.deleteTodo(req.user.sub, id);
  }

  @Roles(Role.Admin)
  @Get('user/:userId')
  async getTodosByUserId(@Param('userId') userId: number) {
    return await this.todoService.getTodosByUserId(userId);
  }
}
