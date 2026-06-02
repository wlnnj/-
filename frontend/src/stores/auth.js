"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthStore = void 0;
var pinia_1 = require("pinia");
var vue_1 = require("vue");
var axios_1 = require("axios");
var config_1 = require("../config");
exports.useAuthStore = (0, pinia_1.defineStore)('auth', function () {
    var token = (0, vue_1.ref)(localStorage.getItem('zky-token'));
    var refreshToken = (0, vue_1.ref)(localStorage.getItem('zky-refresh-token'));
    var user = (0, vue_1.ref)(localStorage.getItem('zky-user')
        ? JSON.parse(localStorage.getItem('zky-user'))
        : null);
    var isAuthenticated = (0, vue_1.computed)(function () { return !!token.value; });
    var isAdmin = (0, vue_1.computed)(function () { var _a; return ((_a = user.value) === null || _a === void 0 ? void 0 : _a.role) === 'admin'; });
    // 设置 axios 默认头
    if (token.value) {
        axios_1.default.defaults.headers.common['Authorization'] = "Bearer ".concat(token.value);
    }
    // 暴露刷新 Token 方法
    function refreshAccessToken() {
        return __awaiter(this, void 0, void 0, function () {
            var data, newAccessToken, newRefreshToken, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!refreshToken.value)
                            return [2 /*return*/, null];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.post("".concat(config_1.API_BASE, "/auth/refresh"), {
                                refreshToken: refreshToken.value
                            })];
                    case 2:
                        data = (_a.sent()).data;
                        newAccessToken = data.accessToken, newRefreshToken = data.refreshToken;
                        token.value = newAccessToken;
                        refreshToken.value = newRefreshToken;
                        localStorage.setItem('zky-token', newAccessToken);
                        localStorage.setItem('zky-refresh-token', newRefreshToken);
                        axios_1.default.defaults.headers.common['Authorization'] = "Bearer ".concat(newAccessToken);
                        return [2 /*return*/, newAccessToken];
                    case 3:
                        error_1 = _a.sent();
                        logout();
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    // Axios 拦截器：处理 401 自动刷新
    axios_1.default.interceptors.response.use(function (response) { return response; }, function (error) { return __awaiter(void 0, void 0, void 0, function () {
        var originalRequest, newToken;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    originalRequest = error.config;
                    if (!(((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401 && !originalRequest._retry && refreshToken.value)) return [3 /*break*/, 2];
                    originalRequest._retry = true;
                    return [4 /*yield*/, refreshAccessToken()];
                case 1:
                    newToken = _b.sent();
                    if (newToken) {
                        originalRequest.headers['Authorization'] = "Bearer ".concat(newToken);
                        return [2 /*return*/, (0, axios_1.default)(originalRequest)];
                    }
                    else {
                        window.location.href = '/login';
                        return [2 /*return*/, Promise.reject(error)];
                    }
                    _b.label = 2;
                case 2: return [2 /*return*/, Promise.reject(error)];
            }
        });
    }); });
    function login(username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a, accessToken, newRefreshToken, userData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, axios_1.default.post("".concat(config_1.API_BASE, "/auth/login"), {
                            username: username,
                            password: password,
                        })];
                    case 1:
                        response = _b.sent();
                        _a = response.data, accessToken = _a.accessToken, newRefreshToken = _a.refreshToken, userData = _a.user;
                        token.value = accessToken;
                        refreshToken.value = newRefreshToken;
                        user.value = userData;
                        localStorage.setItem('zky-token', accessToken);
                        localStorage.setItem('zky-refresh-token', newRefreshToken);
                        localStorage.setItem('zky-user', JSON.stringify(userData));
                        axios_1.default.defaults.headers.common['Authorization'] = "Bearer ".concat(accessToken);
                        return [2 /*return*/, userData];
                }
            });
        });
    }
    function register(username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a, accessToken, newRefreshToken, userData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, axios_1.default.post("".concat(config_1.API_BASE, "/auth/register"), {
                            username: username,
                            password: password,
                        })];
                    case 1:
                        response = _b.sent();
                        _a = response.data, accessToken = _a.accessToken, newRefreshToken = _a.refreshToken, userData = _a.user;
                        token.value = accessToken;
                        refreshToken.value = newRefreshToken;
                        user.value = userData;
                        localStorage.setItem('zky-token', accessToken);
                        localStorage.setItem('zky-refresh-token', newRefreshToken);
                        localStorage.setItem('zky-user', JSON.stringify(userData));
                        axios_1.default.defaults.headers.common['Authorization'] = "Bearer ".concat(accessToken);
                        return [2 /*return*/, userData];
                }
            });
        });
    }
    function logout() {
        if (refreshToken.value) {
            // 尝试后端登出
            axios_1.default.post("".concat(config_1.API_BASE, "/auth/logout"), { refreshToken: refreshToken.value }).catch(function () { });
        }
        token.value = null;
        refreshToken.value = null;
        user.value = null;
        localStorage.removeItem('zky-token');
        localStorage.removeItem('zky-refresh-token');
        localStorage.removeItem('zky-user');
        delete axios_1.default.defaults.headers.common['Authorization'];
    }
    function updateAccentColor(color) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.put("".concat(config_1.API_BASE, "/auth/accent-color"), { accentColor: color })];
                    case 1:
                        _a.sent();
                        if (user.value) {
                            user.value.accentColor = color;
                            localStorage.setItem('zky-user', JSON.stringify(user.value));
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    return {
        token: token,
        refreshToken: refreshToken,
        user: user,
        isAuthenticated: isAuthenticated,
        isAdmin: isAdmin,
        login: login,
        register: register,
        logout: logout,
        updateAccentColor: updateAccentColor,
        refreshAccessToken: refreshAccessToken,
    };
});
