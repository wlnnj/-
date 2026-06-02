import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Memo } from '../entities/memo.entity';

export interface CreateMemoDto {
    title?: string;
    content?: string;
    isMarkdown?: boolean;
}

export interface UpdateMemoDto {
    title?: string;
    content?: string;
    isMarkdown?: boolean;
}

@Injectable()
export class MemosService {
    constructor(
        @InjectRepository(Memo)
        private memoRepository: Repository<Memo>,
    ) { }

    async create(userId: string, dto: CreateMemoDto): Promise<Memo> {
        const memo = this.memoRepository.create({
            userId,
            title: dto.title || '未命名备忘录',
            content: dto.content || '',
            isMarkdown: dto.isMarkdown ?? true,
        });
        return this.memoRepository.save(memo);
    }

    async findAllByUser(userId: string): Promise<Memo[]> {
        return this.memoRepository.find({
            where: { userId },
            order: { updatedAt: 'DESC' },
        });
    }

    async findOne(userId: string, id: string): Promise<Memo> {
        const memo = await this.memoRepository.findOne({
            where: { id, userId },
        });
        if (!memo) {
            throw new NotFoundException('备忘录不存在');
        }
        return memo;
    }

    async update(userId: string, id: string, dto: UpdateMemoDto): Promise<Memo> {
        const memo = await this.findOne(userId, id);
        Object.assign(memo, dto);
        return this.memoRepository.save(memo);
    }

    async remove(userId: string, id: string): Promise<void> {
        const memo = await this.findOne(userId, id);
        await this.memoRepository.remove(memo);
    }
}
