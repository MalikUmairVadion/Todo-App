import {
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from 'src/dto/create-todo.dto';
import { UpdateTodoDto } from 'src/dto/update-todo.dto';
import { Todos } from 'src/model/todos.entity';
import { UsersService } from './users.service';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todos) private todoRepository: Repository<Todos>,
    @Inject(UsersService)
    private userService: UsersService,
  ) {}

  async getTodosByUserId(userId: number): Promise<any> {
    try {
      const todos = await this.todoRepository.find({
        where: { user: { id: userId } },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'List of Todos',
        data: {
          todos,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to retrieve todos for user with id ${userId}: ${error.message}`,
      );
    }
  }

  async createTodo(userId: number, createTodoDto: CreateTodoDto): Promise<any> {
    try {
      const user = await this.userService.findOneById(userId);
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }

      const newTodo = this.todoRepository.create({
        ...createTodoDto,
        user,
      });
      await this.todoRepository.save(newTodo);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Todo created successfully',
        data: {
          id: newTodo.id,
          title: newTodo.title,
          description: newTodo.description,
          status: newTodo.status,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create todo for user with id ${userId}: ${error.message}`,
      );
    }
  }

  async updateTodo(
    userId: number,
    todoId: number,
    updateTodoDto: UpdateTodoDto,
  ): Promise<any> {
    try {
      const todo = await this.todoRepository.findOne({
        where: { id: todoId, user: { id: userId } },
      });

      if (!todo) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Todo not found',
          data: null,
        };
      }

      Object.assign(todo, updateTodoDto);
      await this.todoRepository.save(todo);
      return {
        statusCode: HttpStatus.OK,
        message: 'Todo updated successfully',
        data: {
          id: todo.id,
          title: todo.title,
          description: todo.description,
          status: todo.status,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update todo for user with id ${userId}: ${error.message}`,
      );
    }
  }

  async deleteTodo(userId: number, todoId: number): Promise<any> {
    try {
      const todo = await this.todoRepository.findOne({
        where: { id: todoId, user: { id: userId } },
      });

      if (!todo) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Todo Not Found',
          data: null,
        };
      }

      await this.todoRepository.remove(todo);
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: 'Todo Deleted successfully',
        data: {
          id: todo.id,
          title: todo.title,
          description: todo.description,
          status: todo.status,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete todo for user with id ${userId}: ${error.message}`,
      );
    }
  }
}
