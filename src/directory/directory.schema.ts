import * as mongoose from 'mongoose';

export const DirectorySchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    _user: { type: mongoose.Schema.ObjectId, ref: 'User'},
    _directory: { type: mongoose.Schema.ObjectId, ref: 'Directory'},
    _parentDirectory: { type: mongoose.Schema.ObjectId, ref: 'Directory'},
    createdAt: Number,
    name: String,
    index: Number
});
