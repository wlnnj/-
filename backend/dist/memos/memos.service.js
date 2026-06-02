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
exports.MemosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const memo_entity_1 = require("../entities/memo.entity");
let MemosService = class MemosService {
    constructor(memoRepository) {
        this.memoRepository = memoRepository;
    }
    async create(userId, dto) {
        const memo = this.memoRepository.create({
            userId,
            title: dto.title || '未命名备忘录',
            content: dto.content || '',
            isMarkdown: dto.isMarkdown ?? true,
        });
        return this.memoRepository.save(memo);
    }
    async findAllByUser(userId) {
        return this.memoRepository.find({
            where: { userId },
            order: { updatedAt: 'DESC' },
        });
    }
    async findOne(userId, id) {
        const memo = await this.memoRepository.findOne({
            where: { id, userId },
        });
        if (!memo) {
            throw new common_1.NotFoundException('备忘录不存在');
        }
        return memo;
    }
    async update(userId, id, dto) {
        const memo = await this.findOne(userId, id);
        Object.assign(memo, dto);
        return this.memoRepository.save(memo);
    }
    async remove(userId, id) {
        const memo = await this.findOne(userId, id);
        await this.memoRepository.remove(memo);
    }
};
exports.MemosService = MemosService;
exports.MemosService = MemosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(memo_entity_1.Memo)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MemosService);
//# sourceMappingURL=memos.service.js.map