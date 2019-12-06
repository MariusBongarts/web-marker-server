"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmailAlreadyRegisteredException_1 = require("./../exceptions/EmailAlreadyRegisteredException");
const mail_service_1 = require("./../mail/mail.service");
const core_1 = require("@nestjs/core");
const auth_service_1 = require("./../auth/auth.service");
const config_service_1 = require("./../config/config.service");
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("@nestjs/mongoose");
let UsersService = class UsersService {
    constructor(userModel, configService, moduleRef, mailService) {
        this.userModel = userModel;
        this.configService = configService;
        this.moduleRef = moduleRef;
        this.mailService = mailService;
        this.logger = new common_1.Logger('UsersService');
    }
    onModuleInit() {
        this.authService = this.moduleRef.get(auth_service_1.AuthService, { strict: false });
    }
    create(createUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            createUserDto.activated = false;
            const createdUser = new this.userModel(createUserDto);
            yield createdUser.save().catch(error => {
                this.logger.log(`FAIL: Registration of Email ${createUserDto.email} failed because it is already registered!`);
                throw new EmailAlreadyRegisteredException_1.EmailAlreadyRegisteredException();
            });
            yield this.mailService.sendActivationLink(createUserDto.email);
            this.logger.log(`SUCCESSS: Registration of new user ${createUserDto.email}!`);
            return yield this.authService.validateUserByPassword(createUserDto, true);
        });
    }
    findOneByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userModel.findOne({ email: email });
            return user;
        });
    }
    sendEmailConfirmationLink(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mailService.sendActivationLink(email);
        });
    }
    updatePassword(updateUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.authService.validateUserByPassword({ email: updateUserDto.email, password: updateUserDto.oldPassword }, false);
                if (result) {
                    const user = yield this.findOneByEmail(updateUserDto.email);
                    user['password'] = updateUserDto.newPassword;
                    this.logger.log(`SUCCEED: ${updateUserDto.email} successfully updated password`);
                    yield user.save();
                    return true;
                }
                else {
                    this.logger.log(`FAIL: ${updateUserDto.email} failed updating password`);
                    return false;
                }
            }
            catch (error) {
                this.logger.log(`FAIL: ${updateUserDto.email} failed updating password`);
            }
        });
    }
    sendForgotEmailPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mailService.sendForgotEmailPassword(email);
            this.logger.log(`Succeed: Reset password link sent to ${email}`);
        });
    }
    activateUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.findOneByEmail(email);
                if (user) {
                    user.activated = true;
                    yield user.save();
                }
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
};
UsersService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_2.InjectModel('User')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        config_service_1.ConfigService,
        core_1.ModuleRef,
        mail_service_1.MailService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map