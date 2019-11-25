import { ConfigService } from './../config/config.service';
import { ConfigModule } from './../config/config.module';
import { AuthModule } from './../auth/auth.module';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from './user.schema';
import { NodemailerModule } from '@crowdlinker/nestjs-mailer';
import { NodemailerDrivers } from '@crowdlinker/nestjs-mailer';
import { NodemailerOptions } from '@crowdlinker/nestjs-mailer';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    forwardRef(() => AuthModule),
    NodemailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        ({
          transport: {
            host: configService.get('EMAIL_HOST'),
            port: configService.get('EMAIL_PORT'),
            secure: false,
            auth: {
              user: configService.get('EMAIL_USERNAME'),
              pass: configService.get('EMAIL_PASSWORD'),
            },
          },
          defaults: {
            from: `Hello @${configService.get('EMAIL_USERNAME')}
            <${configService.get('EMAIL_USERNAME')}>`,
          },
        } as NodemailerOptions<NodemailerDrivers.SENDMAIL>),
      inject: [ConfigService],
    }),
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule { }
