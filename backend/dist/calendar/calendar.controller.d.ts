import { CalendarService, CreateEventDto, UpdateEventDto } from './calendar.service';
import { CalendarEvent } from '../entities/calendar-event.entity';
export declare class CalendarController {
    private readonly calendarService;
    constructor(calendarService: CalendarService);
    create(req: any, dto: CreateEventDto): Promise<CalendarEvent>;
    findByMonth(req: any, year: string, month: string): Promise<CalendarEvent[]>;
    getHolidays(year: string): {
        date: string;
        name: string;
        isHoliday: boolean;
    }[];
    findOne(req: any, id: string): Promise<CalendarEvent>;
    update(req: any, id: string, dto: UpdateEventDto): Promise<CalendarEvent>;
    remove(req: any, id: string): Promise<void>;
}
