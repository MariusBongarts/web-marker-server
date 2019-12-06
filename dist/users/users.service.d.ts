import { UpdatePasswordDto } from './dto/update-password.dto';
import { MailService } from './../mail/mail.service';
import { ModuleRef } from '@nestjs/core';
import { ConfigService } from './../config/config.service';
import { Model } from 'mongoose';
import { User } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private userModel;
    private configService;
    private readonly moduleRef;
    private mailService;
    private logger;
    private authService;
    constructor(userModel: Model<User>, configService: ConfigService, moduleRef: ModuleRef, mailService: MailService);
    onModuleInit(): void;
    create(createUserDto: CreateUserDto): Promise<unknown>;
    findOneByEmail(email: any): Promise<User>;
    sendEmailConfirmationLink(email: string): Promise<void>;
    updatePassword(updateUserDto: UpdatePasswordDto): Promise<boolean>;
    sendForgotEmailPassword(email: string): Promise<void>;
    activateUser(email: string): Promise<boolean>;
}
