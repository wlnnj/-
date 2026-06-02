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
export declare class MemosService {
    private memoRepository;
    constructor(memoRepository: Repository<Memo>);
    create(userId: string, dto: CreateMemoDto): Promise<Memo>;
    findAllByUser(userId: string): Promise<Memo[]>;
    findOne(userId: string, id: string): Promise<Memo>;
    update(userId: string, id: string, dto: UpdateMemoDto): Promise<Memo>;
    remove(userId: string, id: string): Promise<void>;
}
