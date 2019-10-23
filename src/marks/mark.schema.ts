import { Bookmark } from './../bookmarks/bookmark.interface';
import * as mongoose from 'mongoose';

export const MarkSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    _user: { type: mongoose.Schema.ObjectId, ref: 'User'},
    _bookmark: { type: mongoose.Schema.ObjectId, ref: 'Bookmark'},
    _directory: { type: mongoose.Schema.ObjectId, ref: 'Directory'},
    createdAt: Number,
    url: String,
    origin: String,
    text: String,
    tags: [String],
    anchorOffset: Number,
    nodeTagName: String,
    startOffset: Number,
    endOffset: Number,
    nodeData: String,
    startContainerText: String,
    endContainerText: String,
    completeText: String,
    title: String,
    scrollY: Number
});
