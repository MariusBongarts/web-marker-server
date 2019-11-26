import { ModuleRef } from '@nestjs/core';
import { ActivationService } from './../activation/activation.service';
import { CreateUserDto } from './../users/dto/create-user.dto';
import { ConfigService } from './../config/config.service';
import { Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { Nodemailer } from '@crowdlinker/nestjs-mailer';
import { NodemailerDrivers } from '@crowdlinker/nestjs-mailer';

@Injectable()
export class MailService {
  transporter: Transporter;
  private activationService: ActivationService;

  constructor(private configService: ConfigService,
    private readonly nodemailer: Nodemailer<NodemailerDrivers.SMTP>,
    private readonly moduleRef: ModuleRef) { }

  onModuleInit() {
    this.activationService = this.moduleRef.get(ActivationService, { strict: false });
  }

  async sendActivationLink(user: CreateUserDto) {
    const token = await this.activationService.createOrUpdateActivationKeyForUser(user);
    await this.sendEmail(user.email, 'Email confirmation', '', `
    <h1>Welcome to Web Highlighter</h1>
    <a target="_blank" href="https://marius96.uber.space/activation?token=${token}">Activate your account</a>
    `)
  }

  async sendEmail(to: string, subject: string, text?: string, html?: string) {
    const email = await this.nodemailer.sendMail({
      to: to,
      subject: subject,
      text: text ? text : '',
      html: html ? html : ''
    }).catch(error => console.log(error));
    return email;
  }

}
