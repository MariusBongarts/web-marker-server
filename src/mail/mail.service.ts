import { CreateUserDto } from './../users/dto/create-user.dto';
import { ConfigService } from './../config/config.service';
import { Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { Nodemailer } from '@crowdlinker/nestjs-mailer';
import { NodemailerDrivers } from '@crowdlinker/nestjs-mailer';

@Injectable()
export class MailService {
  transporter: Transporter;

  constructor(private configService: ConfigService,
    private readonly nodemailer: Nodemailer<NodemailerDrivers.SMTP>) { }

  async sendActivationLink(user: CreateUserDto) {
    await this.sendEmail(user.email, 'Email confirmation', '', `
    <h1>Welcome to Web Highlighter</h1>
    `)
  }


  async sendEmail(to: string, subject: string, text?: string, html?: string) {
    const email = await this.nodemailer.sendMail({
      to: to,
      subject: subject,
      text: text ? text : '',
      html: html ? html : ''
    }).catch(error => console.log(error));
    console.log(email);
    return email;
  }

}
