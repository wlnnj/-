"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WS_BASE = exports.API_BASE = void 0;
// 全局配置 - 从环境变量读取
exports.API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
exports.WS_BASE = import.meta.env.VITE_WS_BASE || 'http://localhost:3000';
