import * as mongoose from 'mongoose';

export const BookmarkSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    _user: { type: mongoose.Schema.ObjectId, ref: 'User'},
    createdAt: Number,
    isStarred: Boolean,
    origin: String,
    tags: [String],
    title: String,
    url: String
});
