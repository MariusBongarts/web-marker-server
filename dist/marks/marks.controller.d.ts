/// <reference types="mongodb" />
/// <reference types="mongoose" />
import { LoggerService } from './../logger/logger.service';
import { MarkGateway } from './mark.gateway';
import { JwtPayload } from './../auth/interfaces/jwt-payload.interface';
import { UsersService } from './../users/users.service';
import { Mark } from './mark.interface';
import { MarksService } from './marks.service';
export declare class MarksController {
    private marksService;
    private usersService;
    private loggerService;
    private markGateway;
    private logger;
    constructor(marksService: MarksService, usersService: UsersService, loggerService: LoggerService, markGateway: MarkGateway);
    getMarks(userJwt: JwtPayload, req: any): Promise<Mark[]>;
    getMarksForUrl(userJwt: JwtPayload, query: any): Promise<Mark[]>;
    getMarkById(userJwt: JwtPayload, markId: any, req: any): Promise<Mark>;
    createMark(userJwt: JwtPayload, mark: any, req: any): Promise<Mark>;
    deleteMark(userJwt: JwtPayload, markId: any, req: any): Promise<{
        ok?: number;
        n?: number;
    } & {
        deletedCount?: number;
    }>;
    updateMark(userJwt: JwtPayload, mark: any, req: any): Promise<any>;
}
