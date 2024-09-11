import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  identifier: string; // Can be username or email

  @IsString()
  @IsNotEmpty()
  password: string;
}
