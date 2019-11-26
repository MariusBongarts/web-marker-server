import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<unknown>;
    testAuthRoute(userJwt: any): Promise<{
        message: string;
    }>;
}
