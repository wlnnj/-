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
exports.CalendarService = exports.CreateEventDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const calendar_event_entity_1 = require("../entities/calendar-event.entity");
const class_validator_1 = require("class-validator");
class CreateEventDto {
}
exports.CreateEventDto = CreateEventDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "endTime", void 0);
let CalendarService = class CalendarService {
    constructor(eventRepository) {
        this.eventRepository = eventRepository;
    }
    async create(userId, dto) {
        const event = this.eventRepository.create({
            userId,
            title: dto.title,
            description: dto.description,
            startTime: new Date(dto.startTime),
            endTime: new Date(dto.endTime),
        });
        return this.eventRepository.save(event);
    }
    async findByMonth(userId, year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        return this.eventRepository.find({
            where: {
                userId,
                startTime: (0, typeorm_2.Between)(startDate, endDate),
            },
            order: { startTime: 'ASC' },
        });
    }
    async findOne(userId, id) {
        const event = await this.eventRepository.findOne({
            where: { id, userId },
        });
        if (!event) {
            throw new common_1.NotFoundException('日程不存在');
        }
        return event;
    }
    async update(userId, id, dto) {
        const event = await this.findOne(userId, id);
        Object.assign(event, {
            title: dto.title ?? event.title,
            description: dto.description ?? event.description,
            startTime: dto.startTime ? new Date(dto.startTime) : event.startTime,
            endTime: dto.endTime ? new Date(dto.endTime) : event.endTime,
        });
        return this.eventRepository.save(event);
    }
    async remove(userId, id) {
        const event = await this.findOne(userId, id);
        await this.eventRepository.remove(event);
    }
    getHolidays(year) {
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
};
exports.CalendarService = CalendarService;
exports.CalendarService = CalendarService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(calendar_event_entity_1.CalendarEvent)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CalendarService);
//# sourceMappingURL=calendar.service.js.map