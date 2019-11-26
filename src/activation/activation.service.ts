import { ModuleRef } from '@nestjs/core';
import { UsersService } from './../users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activation } from './activation.model';
import { CreateUserDto } from './../users/dto/create-user.dto';
import { Injectable, Logger } from '@nestjs/common';
const cryptoRandomString = require('crypto-random-string');

@Injectable()
export class ActivationService {
  private logger = new Logger('ActivationService');
  private userService: UsersService;

  constructor(
    @InjectModel('Activation') private activationModel: Model<Activation>,
    private readonly moduleRef: ModuleRef
  ) { }

  onModuleInit() {
    this.userService = this.moduleRef.get(UsersService, { strict: false });
  }


  /**
   * Creates a email activation token for a user. This token will be sent by email.
   *
   * @param {CreateUserDto} user
   * @returns
   * @memberof ActivationService
   */
  async createOrUpdateActivationKeyForUser(user: CreateUserDto) {
    const token = cryptoRandomString({ length: 16, type: 'url-safe' });
    const activation: Partial<Activation> = {
      email: user.email,
      token: token,
    };
    const existingToken = await this.activationModel.findOne({ email: user.email }).exec();
    if (!existingToken) {
      const createdActivation = new this.activationModel(activation);
      await createdActivation.save();
    }
    return token;
  }


  /**
   * Find a activation entry by the given access token. If a entry can be found
   * the user will be activated in the UserService and the activation token will be deleted
   * Either true or false will be returned
   *
   * @param {string} token
   * @memberof ActivationService
   */
  async confirmActivation(token: string) {
    try {
      const existingActivation = await this.activationModel.findOne({ token: token }).exec();
      if (existingActivation) {
        const activated = await this.userService.activateUser(existingActivation.email);
        if (activated) {
          await existingActivation.remove();
          this.logger.log(`Email confirmation of ${existingActivation.email}!`);
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }

  }
}
