import { User } from './user.entity';
export declare class CalendarEvent {
    id: string;
    userId: string;
    user: User;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    createdAt: Date;
}
