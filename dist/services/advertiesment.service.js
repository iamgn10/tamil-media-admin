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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertiesmentService = void 0;
const tsyringe_1 = require("tsyringe");
const advertiesment_repository_1 = require("../repositories/advertiesment.repository");
let AdvertiesmentService = class AdvertiesmentService {
    constructor(advertiesmentRepository) {
        this.advertiesmentRepository = advertiesmentRepository;
    }
    async createAdvertiesment(advertiesmentData) {
        return await this.advertiesmentRepository.createAdvertiesment(advertiesmentData);
    }
    async getAllAdvertiesments() {
        return await this.advertiesmentRepository.getAllAdvertiesments();
    }
    async findAdvertiesmentById(advertiesmentId) {
        return await this.advertiesmentRepository.findAdvertiesmentById(advertiesmentId);
    }
    async findOneByPositionAndStatus(position, status) {
        return await this.advertiesmentRepository.findOneByPositionAndStatus(position, status);
    }
    async updateAdvertiesment(advertiesmentId, updateData) {
        return await this.advertiesmentRepository.updateAdvertiesment(advertiesmentId, updateData);
    }
    async deleteAdvertiesment(advertiesmentId) {
        return await this.advertiesmentRepository.deleteAdvertiesment(advertiesmentId);
    }
};
exports.AdvertiesmentService = AdvertiesmentService;
exports.AdvertiesmentService = AdvertiesmentService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(advertiesment_repository_1.AdvertiesmentRepository)),
    __metadata("design:paramtypes", [advertiesment_repository_1.AdvertiesmentRepository])
], AdvertiesmentService);
