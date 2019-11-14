/// <reference types="mongodb" />
import { MarkGateway } from './mark.gateway';
import { JwtPayload } from './../auth/interfaces/jwt-payload.interface';
import { Mark } from './mark.interface';
import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { ModuleRef } from '@nestjs/core';
export declare class MarksService implements OnModuleInit {
    private markModel;
    private markGateway;
    private readonly moduleRef;
    private bookmarkService;
    private tagService;
    constructor(markModel: Model<Mark>, markGateway: MarkGateway, moduleRef: ModuleRef);
    onModuleInit(): void;
    getMarksForUser(user: JwtPayload): Promise<Mark[]>;
    getMarksForUrl(user: JwtPayload, url: string): Promise<Mark[]>;
    getMarksForBookmarkId(user: JwtPayload, bookmarkId: string): Promise<Mark[]>;
    findMarkById(user: JwtPayload, markId: string): Promise<Mark>;
    createMark(user: JwtPayload, mark: Mark): Promise<Mark>;
    deleteMark(user: JwtPayload, markId: string): Promise<{
        ok?: number;
        n?: number;
    } & {
        deletedCount?: number;
    }>;
    updateMark(user: JwtPayload, mark: Mark): Promise<any>;
    deleteBookmarkIfNoMarks(user: JwtPayload, mark: Mark): Promise<void>;
}
