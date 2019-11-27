import { PasswordResetService } from './../password-reset/password-reset.service';
import { ModuleRef } from '@nestjs/core';
import { ActivationService } from './../activation/activation.service';
import { CreateUserDto } from './../users/dto/create-user.dto';
import { ConfigService } from './../config/config.service';
import { Injectable, Logger } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { Nodemailer } from '@crowdlinker/nestjs-mailer';
import { NodemailerDrivers } from '@crowdlinker/nestjs-mailer';

@Injectable()
export class MailService {
  private logger = new Logger('MailService');
  transporter: Transporter;
  private activationService: ActivationService;

  constructor(private configService: ConfigService,
    private readonly nodemailer: Nodemailer<NodemailerDrivers.SMTP>,
    private readonly moduleRef: ModuleRef,
    private passwordResetService: PasswordResetService) { }

  onModuleInit() {
    this.activationService = this.moduleRef.get(ActivationService, { strict: false });
  }

  async sendActivationLink(email: string) {
    const token = await this.activationService.createOrUpdateActivationKeyForUser(email);
    await this.sendEmail(email, 'Email confirmation', '', `
    <h1>Welcome to Web Highlighter</h1>
    <a target="_blank" href="https://marius96.uber.space/activation?token=${token}">Activate your account</a>
    `);
    this.logger.log(`Activation link sent to ${email}!`);
  }

  async sendForgotEmailPassword(email: string) {
    const token = await this.passwordResetService.createPasswordResetToken(email);

    if (token) {
      await this.sendEmail(email, 'Password reset', '', `
      <h1>Reset your password</h1>
      <a target="_blank" href="https://marius96.uber.space/reset-password?token=${token}">Follow this link to create a new password</a>
      `)
      this.logger.log(`Forgot password link sent to ${email}!`);
    }
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
