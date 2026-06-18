import mongoose from 'mongoose';

const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true,
        expires: 0  // MongoDB will automatically delete this doc when expiresAt is reached
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const TokenBlacklist = mongoose.model('TokenBlacklist', tokenBlacklistSchema);
export default TokenBlacklist;
