import { User } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<User>;
    testAuthRoute(userJwt: any): Promise<{
        message: string;
    }>;
}
