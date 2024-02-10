import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRegisterDto } from './dto/user-register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../users/entities/user.entity';
import { UserDto } from '../users/dto/user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { Repository } from 'sequelize-typescript';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('USERS_REPOSITORY')
    private readonly usersModel: Repository<Users>,
  ) {}

  async register(userRegisterDto: UserRegisterDto) {
    try {
      if (!userRegisterDto.username || !userRegisterDto.password) {
        throw new HttpException(
          'Missing data username or password',
          HttpStatus.BAD_REQUEST,
        );
      }
      let existingUser = await this.checkUserExisting(userRegisterDto.username);
      if (existingUser) {
        throw new HttpException(
          'Username already exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      userRegisterDto.password = await bcrypt.hash(
        userRegisterDto.password,
        process.env.PASS_HASH_SALT,
      );

      let createdUser = await this.usersModel.create({
        ...userRegisterDto,
      });

      return new UserDto(createdUser);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async checkUserExisting(username: string): Promise<UserDto> {
    const user = await this.usersModel.findOne({
      where: { username },
    });
    if (user) return new UserDto(user);
    else return null;
  }

  async login(userLoginDto: UserLoginDto): Promise<UserDto> {
    try {
      const user = await this.findByUserName(
        userLoginDto.username,
        userLoginDto.password,
      );

      if (!user) {
        throw new UnauthorizedException();
      }

      const payload = {
        username: user.username,
        sub: user.id,
        role: user.role,
      };

      const accessToken = await this.jwtService.signAsync(payload);

      user.token = accessToken;

      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findByUserName(username: string, password: string): Promise<UserDto> {
    let hashedPassword = await bcrypt.hash(
      password,
      process.env.PASS_HASH_SALT,
    );
    const user = await this.usersModel.findOne({
      where: { username: username, password: hashedPassword },
    });
    if (!user)
      throw new HttpException(
        'Invalid UserName or Password',
        HttpStatus.NOT_FOUND,
      );
    return new UserDto(user);
  }
}
