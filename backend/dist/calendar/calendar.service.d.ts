import { Repository } from 'typeorm';
import { CalendarEvent } from '../entities/calendar-event.entity';
export declare class CreateEventDto {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
}
export interface UpdateEventDto {
    title?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
}
export declare class CalendarService {
    private eventRepository;
    constructor(eventRepository: Repository<CalendarEvent>);
    create(userId: string, dto: CreateEventDto): Promise<CalendarEvent>;
    findByMonth(userId: string, year: number, month: number): Promise<CalendarEvent[]>;
    findOne(userId: string, id: string): Promise<CalendarEvent>;
    update(userId: string, id: string, dto: UpdateEventDto): Promise<CalendarEvent>;
    remove(userId: string, id: string): Promise<void>;
    getHolidays(year: number): {
        date: string;
        name: string;
        isHoliday: boolean;
    }[];
}
