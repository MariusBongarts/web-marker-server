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
const tag_service_1 = require("./../tag/tag.service");
const bookmarks_service_1 = require("./../bookmarks/bookmarks.service");
const mark_gateway_1 = require("./mark.gateway");
const mongoose_1 = require("@nestjs/mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("mongoose");
const core_1 = require("@nestjs/core");
let MarksService = class MarksService {
    constructor(markModel, markGateway, moduleRef) {
        this.markModel = markModel;
        this.markGateway = markGateway;
        this.moduleRef = moduleRef;
    }
    onModuleInit() {
        this.bookmarkService = this.moduleRef.get(bookmarks_service_1.BookmarksService, { strict: false });
        this.tagService = this.moduleRef.get(tag_service_1.TagService, { strict: false });
    }
    getMarksForUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.markModel.find({ _user: user._id }).exec();
        });
    }
    getMarksForUrl(user, url) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.markModel.find({ _user: user._id, url: url }).exec();
        });
    }
    getMarksForBookmarkId(user, bookmarkId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.markModel.find({ _user: user._id, _bookmark: bookmarkId }).exec();
        });
    }
    findMarkById(user, markId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.markModel.findOne({ _user: user._id, id: markId });
        });
    }
    createMark(user, mark) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdMark = new this.markModel(mark);
            createdMark._user = user._id;
            const newBookmark = this.bookmarkService.createBookMarkFromMark(mark);
            const bookmark = yield this.bookmarkService.createBookmarkIfNotExists(user, newBookmark);
            for (const tag of mark.tags) {
                yield this.tagService.createTagIfNotExists(user, tag);
            }
            createdMark._bookmark = bookmark._id;
            return yield createdMark.save();
        });
    }
    deleteMark(user, markId) {
        return __awaiter(this, void 0, void 0, function* () {
            const mark = yield this.findMarkById(user, markId);
            const deleteResult = yield this.markModel.deleteOne({ _user: user._id, id: markId });
            yield this.deleteBookmarkIfNoMarks(user, mark);
            return deleteResult;
        });
    }
    updateMark(user, mark) {
        return __awaiter(this, void 0, void 0, function* () {
            mark.tags = [...new Set([...mark.tags])];
            for (const tag of mark.tags) {
                yield this.tagService.createTagIfNotExists(user, tag);
            }
            return yield this.markModel.updateOne({ _user: user._id, id: mark.id }, mark);
        });
    }
    deleteBookmarkIfNoMarks(user, mark) {
        return __awaiter(this, void 0, void 0, function* () {
            const marksForBookmark = yield this.getMarksForBookmarkId(user, mark._bookmark);
            if (marksForBookmark.length === 0) {
                const bookmark = yield this.bookmarkService.findBookmarkById(user, mark._bookmark);
                if (!bookmark.isStarred) {
                    yield this.bookmarkService.deleteBookmark(user, bookmark._id);
                }
            }
        });
    }
};
MarksService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('Mark')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mark_gateway_1.MarkGateway,
        core_1.ModuleRef])
], MarksService);
exports.MarksService = MarksService;
//# sourceMappingURL=marks.service.js.map