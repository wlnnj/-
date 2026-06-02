import { MemosService, CreateMemoDto, UpdateMemoDto } from './memos.service';
import { Memo } from '../entities/memo.entity';
export declare class MemosController {
    private readonly memosService;
    constructor(memosService: MemosService);
    create(req: any, dto: CreateMemoDto): Promise<Memo>;
    findAll(req: any): Promise<Memo[]>;
    findOne(req: any, id: string): Promise<Memo>;
    update(req: any, id: string, dto: UpdateMemoDto): Promise<Memo>;
    remove(req: any, id: string): Promise<void>;
}
