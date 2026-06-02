"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongRequestsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const song_request_entity_1 = require("../entities/song-request.entity");
const song_requests_service_1 = require("./song-requests.service");
const song_requests_controller_1 = require("./song-requests.controller");
let SongRequestsModule = class SongRequestsModule {
};
exports.SongRequestsModule = SongRequestsModule;
exports.SongRequestsModule = SongRequestsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([song_request_entity_1.SongRequest])],
        controllers: [song_requests_controller_1.SongRequestsController],
        providers: [song_requests_service_1.SongRequestsService],
        exports: [song_requests_service_1.SongRequestsService],
    })
], SongRequestsModule);
//# sourceMappingURL=song-requests.module.js.map