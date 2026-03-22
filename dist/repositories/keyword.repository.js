"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeywordRepository = void 0;
const keyword_model_1 = __importDefault(require("../models/keyword.model"));
class KeywordRepository {
    async createKeyword(keywordData) {
        return await keyword_model_1.default.create(keywordData);
    }
    async getAllKeywords() {
        return await keyword_model_1.default.find();
    }
    async findKeywordById(keywordId) {
        return await keyword_model_1.default.findById(keywordId);
    }
    async updateKeyword(keywordId, updateData) {
        return await keyword_model_1.default.findByIdAndUpdate(keywordId, updateData, { new: true });
    }
    async deleteKeyword(keywordId) {
        const result = await keyword_model_1.default.findByIdAndDelete(keywordId);
        return result !== null;
    }
}
exports.KeywordRepository = KeywordRepository;
