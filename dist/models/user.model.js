"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    fullname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 50,
    },
    profilePicture: {
        type: String,
        required: false,
    },
    bio: {
        type: String,
        required: false,
        maxlength: 500, // Optional bio with a maximum length
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    mobile: {
        type: String,
        required: false,
        minlength: 10,
        maxlength: 15,
    },
    roleId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
    },
    roleName: {
        type: String,
        ref: 'Role',
        required: true,
    },
    category: {
        type: [String],
        required: false
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});
// UserSchema.index({ email: 1 });
// UserSchema.index({ username: 1 });
// UserSchema.index({ roleId: 1 });
exports.User = mongoose_1.default.model('User', UserSchema);
exports.default = exports.User;
