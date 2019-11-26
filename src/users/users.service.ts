import { MailService } from './../mail/mail.service';
import { ModuleRef } from '@nestjs/core';
import { AuthService } from './../auth/auth.service';
import { ConfigService } from './../config/config.service';
import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';
@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');
  private authService: AuthService;

  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private configService: ConfigService,
    private readonly moduleRef: ModuleRef,
    private mailService: MailService
  ) { }

  onModuleInit() {
    this.authService = this.moduleRef.get(AuthService, { strict: false });
  }

  async create(createUserDto: CreateUserDto) {
    await this.mailService.sendActivationLink(createUserDto);
    createUserDto.activated = false;
    const createdUser = new this.userModel(createUserDto);
    this.logger.log(`Registration of new user ${createUserDto.email}!`);
    await createdUser.save();
    return await this.authService.validateUserByPassword(createUserDto, true);
  }

  async findOneByEmail(email) {
    const user = await this.userModel.findOne({ email: email });
    return user;
  }


}
