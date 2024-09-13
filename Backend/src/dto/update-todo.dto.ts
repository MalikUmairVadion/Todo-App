import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Status of todo completion',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
