import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('USERS_REPOSITORY')
    private usersRepository: typeof Users,
  ) {}

  async findAll() {
    const users = await this.usersRepository.findAndCountAll();

    return users.rows.map((user) => new UserDto(user));
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);

    return new UserDto(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.usersRepository.findByPk(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        process.env.PASS_HASH_SALT,
      );
    }

    await this.usersRepository.update(updateUserDto, { where: { id } });

    return await this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findByPk(id);
    if (user) return await user.destroy({ force: true });
  }

  async deposit(value: number, userId: number) {
    try {
      const changeDenominations = [5, 10, 20, 50, 100];

      const user = await this.findOne(userId);

      let userDeposit = user.deposit;

      if (changeDenominations.indexOf(value) === -1) {
        throw new HttpException(
          "Machine doesn't accept these coins",
          HttpStatus.BAD_REQUEST,
        );
      }

      userDeposit += value;

      await this.usersRepository.update(
        {
          deposit: userDeposit,
        },
        { where: { id: user.id } },
      );

      return this.findOne(user.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async reset(id: number) {
    try {
      const user = await this.usersRepository.findByPk(id);

      if (user) {
        user.deposit = 0;
        await user.save();

        return this.findOne(user.id);
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
