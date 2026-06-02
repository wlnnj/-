"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = require("express");
const multer_1 = require("multer");
const uuid_1 = require("uuid");
const path = __importStar(require("path"));
const files_service_1 = require("./files.service");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const throttler_1 = require("@nestjs/throttler");
const jwt_1 = require("@nestjs/jwt");
let FilesController = class FilesController {
    constructor(filesService, jwtService) {
        this.filesService = filesService;
        this.jwtService = jwtService;
    }
    async upload(req, file) {
        if (!file) {
            throw new common_1.BadRequestException('请选择要上传的文件');
        }
        return this.filesService.create(req.user.id, {
            fileName: file.originalname,
            filePath: file.filename,
            fileSize: file.size,
            mimeType: file.originalname.endsWith('.lrc') ? 'text/plain' : file.mimetype,
        });
    }
    async uploadChunk(req, chunk, identifier, index) {
        if (!chunk || !identifier || index === undefined) {
            throw new common_1.BadRequestException('Invalid chunk data: missing chunk, identifier or index');
        }
        return this.filesService.saveChunk(identifier, parseInt(index.toString()), chunk.buffer);
    }
    async mergeChunks(req, identifier, fileName, totalChunks, fileSize, mimeType) {
        if (!identifier || !fileName || !totalChunks) {
            throw new common_1.BadRequestException('Invalid merge data');
        }
        return this.filesService.mergeChunks(req.user.id, identifier, fileName, parseInt(totalChunks.toString()), fileSize, mimeType);
    }
    async scanMusic(req) {
        return this.filesService.scanSystemMusic(req.user.id);
    }
    findAll(req, type, includePublic) {
        const isPublic = includePublic === 'true';
        return this.filesService.findAllByUser(req.user.id, type, isPublic);
    }
    findOne(req, id) {
        return this.filesService.findOne(req.user.id, id);
    }
    async remove(req, id) {
        return this.filesService.remove(req.user.id, id);
    }
    async getContent(req, id, token, res) {
        let userId;
        if (req.user) {
            userId = req.user.id;
        }
        else if (token) {
            try {
                const payload = this.jwtService.verify(token);
                userId = payload.sub;
            }
            catch (e) {
                throw new common_1.BadRequestException('无效的访问令牌');
            }
        }
        else {
            throw new common_1.BadRequestException('未授权访问');
        }
        const { file, filePath } = await this.filesService.getFile(userId, id);
        const dangerousMimes = [
            'text/html', 'application/xhtml+xml',
            'text/javascript', 'application/javascript',
            'text/xml', 'application/xml',
            'image/svg+xml',
        ];
        if (file.fileName.endsWith('.lrc') || file.mimeType === 'text/plain') {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        }
        else {
            res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
        }
        const isSafe = !dangerousMimes.includes(file.mimeType?.toLowerCase() || '');
        if (isSafe) {
            res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(file.fileName)}"`);
        }
        else {
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.fileName)}"`);
        }
        res.setHeader('X-Content-Type-Options', 'nosniff');
        const absolutePath = path.resolve(filePath);
        res.sendFile(absolutePath);
    }
    async generateQrCode(req, id) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        return this.filesService.generateQrCode(req.user.id, id, baseUrl);
    }
    async downloadByToken(token, mode, res) {
        const { file, filePath } = await this.filesService.downloadByToken(token);
        const dangerousMimes = [
            'text/html', 'application/xhtml+xml',
            'text/javascript', 'application/javascript',
            'text/xml', 'application/xml',
            'image/svg+xml',
        ];
        const isDangerous = dangerousMimes.includes(file.mimeType?.toLowerCase() || '');
        if (isDangerous || mode !== 'preview') {
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.fileName)}"`);
        }
        else {
            res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
            res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(file.fileName)}"`);
        }
        res.setHeader('X-Content-Type-Options', 'nosniff');
        const absolutePath = path.resolve(filePath);
        res.sendFile(absolutePath);
    }
    async getStorageUsage(req) {
        return this.filesService.getStorageUsage(req.user.id);
    }
};
exports.FilesController = FilesController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueName = `${(0, uuid_1.v4)()}${path.extname(file.originalname)}`;
                cb(null, uniqueName);
            },
        }),
        limits: {
            fileSize: 1073741824,
        },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof Express !== "undefined" && (_a = Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "upload", null);
__decorate([
    (0, common_1.Post)('upload/chunk'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('chunk')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('identifier')),
    __param(3, (0, common_1.Body)('index')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof Express !== "undefined" && (_c = Express.Multer) !== void 0 && _c.File) === "function" ? _d : Object, String, Number]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "uploadChunk", null);
__decorate([
    (0, common_1.Post)('upload/merge'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('identifier')),
    __param(2, (0, common_1.Body)('fileName')),
    __param(3, (0, common_1.Body)('totalChunks')),
    __param(4, (0, common_1.Body)('fileSize')),
    __param(5, (0, common_1.Body)('mimeType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "mergeChunks", null);
__decorate([
    (0, common_1.Post)('music/scan'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "scanMusic", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('includePublic')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "remove", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, throttler_1.SkipThrottle)(),
    (0, common_1.Get)(':id/content'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('token')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, typeof (_e = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "getContent", null);
__decorate([
    (0, common_1.Post)(':id/qrcode'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "generateQrCode", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('download/:token'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Query)('mode')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, typeof (_f = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "downloadByToken", null);
__decorate([
    (0, common_1.Get)('storage/usage'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "getStorageUsage", null);
exports.FilesController = FilesController = __decorate([
    (0, common_1.Controller)('files'),
    __metadata("design:paramtypes", [files_service_1.FilesService,
        jwt_1.JwtService])
], FilesController);
//# sourceMappingURL=files.controller.js.map