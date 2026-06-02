import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { SearchService, SearchResult } from './search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@Controller('search')
export class SearchController {
    constructor(private searchService: SearchService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async search(
        @Query('q') query: string,
        @Request() req: any,
    ): Promise<SearchResult> {
        if (!query || query.trim().length < 2) {
            return { users: [], posts: [], memos: [] };
        }
        return this.searchService.search(query.trim(), req.user?.id);
    }

    @Public()
    @Get('users')
    async searchUsers(@Query('q') query: string): Promise<Array<{ id: string; username: string }>> {
        if (!query || query.trim().length < 2) {
            return [];
        }
        return this.searchService.searchUsers(query.trim());
    }
}
