import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { MemosService, CreateMemoDto, UpdateMemoDto } from './memos.service';
import { Memo } from '../entities/memo.entity';

@Controller('memos')
export class MemosController {
    constructor(private readonly memosService: MemosService) { }

    @Post()
    create(@Request() req: any, @Body() dto: CreateMemoDto): Promise<Memo> {
        return this.memosService.create(req.user.id, dto);
    }

    @Get()
    findAll(@Request() req: any): Promise<Memo[]> {
        return this.memosService.findAllByUser(req.user.id);
    }

    @Get(':id')
    findOne(@Request() req: any, @Param('id') id: string): Promise<Memo> {
        return this.memosService.findOne(req.user.id, id);
    }

    @Put(':id')
    update(
        @Request() req: any,
        @Param('id') id: string,
        @Body() dto: UpdateMemoDto,
    ): Promise<Memo> {
        return this.memosService.update(req.user.id, id, dto);
    }

    @Delete(':id')
    remove(@Request() req: any, @Param('id') id: string): Promise<void> {
        return this.memosService.remove(req.user.id, id);
    }
}
