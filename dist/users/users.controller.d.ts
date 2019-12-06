import { UpdatePasswordDto } from './dto/update-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<unknown>;
    changePassword(updatePasswordDto: UpdatePasswordDto): Promise<string>;
    resetPassword(email: string): Promise<void>;
    resendRemailConfirmation(email: string): Promise<void>;
}
