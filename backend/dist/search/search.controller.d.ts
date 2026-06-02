import { SearchService, SearchResult } from './search.service';
export declare class SearchController {
    private searchService;
    constructor(searchService: SearchService);
    search(query: string, req: any): Promise<SearchResult>;
    searchUsers(query: string): Promise<Array<{
        id: string;
        username: string;
    }>>;
}
