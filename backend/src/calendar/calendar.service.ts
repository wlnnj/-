import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CalendarEvent } from '../entities/calendar-event.entity';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    @IsNotEmpty()
    startTime: string; // ISO String

    @IsString()
    @IsNotEmpty()
    endTime: string; // ISO String
}

export interface UpdateEventDto {
    title?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
}

@Injectable()
export class CalendarService {
    constructor(
        @InjectRepository(CalendarEvent)
        private eventRepository: Repository<CalendarEvent>,
    ) { }

    async create(userId: string, dto: CreateEventDto): Promise<CalendarEvent> {
        const event = this.eventRepository.create({
            userId,
            title: dto.title,
            description: dto.description,
            startTime: new Date(dto.startTime),
            endTime: new Date(dto.endTime),
        });
        return this.eventRepository.save(event);
    }

    async findByMonth(userId: string, year: number, month: number): Promise<CalendarEvent[]> {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        return this.eventRepository.find({
            where: {
                userId,
                startTime: Between(startDate, endDate),
            },
            order: { startTime: 'ASC' },
        });
    }

    async findOne(userId: string, id: string): Promise<CalendarEvent> {
        const event = await this.eventRepository.findOne({
            where: { id, userId },
        });
        if (!event) {
            throw new NotFoundException('日程不存在');
        }
        return event;
    }

    async update(userId: string, id: string, dto: UpdateEventDto): Promise<CalendarEvent> {
        const event = await this.findOne(userId, id);
        Object.assign(event, {
            title: dto.title ?? event.title,
            description: dto.description ?? event.description,
            startTime: dto.startTime ? new Date(dto.startTime) : event.startTime,
            endTime: dto.endTime ? new Date(dto.endTime) : event.endTime,
        });
        return this.eventRepository.save(event);
    }

    async remove(userId: string, id: string): Promise<void> {
        const event = await this.findOne(userId, id);
        await this.eventRepository.remove(event);
    }

    // 获取中国节假日 (示例 - 可替换为真实 API)
    getHolidays(year: number): { date: string; name: string; isHoliday: boolean }[] {
        // 这里返回示例数据，实际可接入节假日 API
        const holidays = [
            { date: `${year}-01-01`, name: '元旦', isHoliday: true },
            { date: `${year}-02-10`, name: '春节', isHoliday: true },
            { date: `${year}-04-04`, name: '清明节', isHoliday: true },
            { date: `${year}-05-01`, name: '劳动节', isHoliday: true },
            { date: `${year}-06-10`, name: '端午节', isHoliday: true },
            { date: `${year}-09-17`, name: '中秋节', isHoliday: true },
            { date: `${year}-10-01`, name: '国庆节', isHoliday: true },
        ];
        return holidays;
    }
}
