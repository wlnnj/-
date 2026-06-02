import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request } from '@nestjs/common';
import { CalendarService, CreateEventDto, UpdateEventDto } from './calendar.service';
import { CalendarEvent } from '../entities/calendar-event.entity';

@Controller('calendar')
export class CalendarController {
    constructor(private readonly calendarService: CalendarService) { }

    @Post()
    create(@Request() req: any, @Body() dto: CreateEventDto): Promise<CalendarEvent> {
        return this.calendarService.create(req.user.id, dto);
    }

    @Get()
    findByMonth(
        @Request() req: any,
        @Query('year') year: string,
        @Query('month') month: string,
    ): Promise<CalendarEvent[]> {
        const y = parseInt(year) || new Date().getFullYear();
        const m = parseInt(month) || new Date().getMonth() + 1;
        return this.calendarService.findByMonth(req.user.id, y, m);
    }

    @Get('holidays')
    getHolidays(@Query('year') year: string): { date: string; name: string; isHoliday: boolean }[] {
        const y = parseInt(year) || new Date().getFullYear();
        return this.calendarService.getHolidays(y);
    }

    @Get(':id')
    findOne(@Request() req: any, @Param('id') id: string): Promise<CalendarEvent> {
        return this.calendarService.findOne(req.user.id, id);
    }

    @Put(':id')
    update(
        @Request() req: any,
        @Param('id') id: string,
        @Body() dto: UpdateEventDto,
    ): Promise<CalendarEvent> {
        return this.calendarService.update(req.user.id, id, dto);
    }

    @Delete(':id')
    remove(@Request() req: any, @Param('id') id: string): Promise<void> {
        return this.calendarService.remove(req.user.id, id);
    }
}
