import * as mongoose from 'mongoose';

export const BookmarkSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    _directory: { type: mongoose.Schema.Types.ObjectId, ref: 'Directory'},
    createdAt: Number,
    isStarred: Boolean,
    origin: String,
    tags: [String],
    title: String,
    url: String
});
