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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Advertiesment = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const AdvertiesmentSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    adImage: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    countries: [{
            code: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        }],
    isWebsiteHave: {
        type: Boolean,
        required: true,
    },
    adUrl: {
        type: String,
    },
    email: {
        type: String,
    },
    whatsappNo: {
        type: String,
    },
    phoneNo: {
        type: String,
    },
    fbProfile: {
        type: String,
    },
    startDatetime: {
        type: Date,
        required: true,
    },
    endDatetime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'expired', 'toPublish'],
        required: true,
    },
}, {
    timestamps: true,
});
exports.Advertiesment = mongoose_1.default.model('Advertiesment', AdvertiesmentSchema);
exports.default = exports.Advertiesment;
