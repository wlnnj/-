"use strict";
/// <reference types="C:/Users/lujia/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/lujia/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var GlassCard_vue_1 = require("../components/GlassCard.vue");
var axios_1 = require("axios");
var auth_1 = require("../stores/auth");
var config_1 = require("../config");
var authStore = (0, auth_1.useAuthStore)();
var currentDate = (0, vue_1.ref)(new Date());
var selectedDate = (0, vue_1.ref)(null);
// Event Modal
var showAddEvent = (0, vue_1.ref)(false);
var newEventTitle = (0, vue_1.ref)('');
var newEventDesc = (0, vue_1.ref)('');
var newEventDate = (0, vue_1.ref)('');
var calendarRef = (0, vue_1.ref)(null);
// 获取当前月份的天数
var daysInMonth = (0, vue_1.computed)(function () {
    var year = currentDate.value.getFullYear();
    var month = currentDate.value.getMonth();
    return new Date(year, month + 1, 0).getDate();
});
// 获取当月第一天是星期几
var firstDayOfMonth = (0, vue_1.computed)(function () {
    var year = currentDate.value.getFullYear();
    var month = currentDate.value.getMonth();
    return new Date(year, month, 1).getDay();
});
// 生成日历格子
var calendarDays = (0, vue_1.computed)(function () {
    var days = [];
    var prevMonthDays = firstDayOfMonth.value;
    // 上月填充
    for (var i = 0; i < prevMonthDays; i++) {
        days.push({ day: null, isCurrentMonth: false });
    }
    // 当月
    for (var i = 1; i <= daysInMonth.value; i++) {
        days.push({ day: i, isCurrentMonth: true });
    }
    return days;
});
var monthNames = ['一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'];
var currentMonthYear = (0, vue_1.computed)(function () {
    return "".concat(currentDate.value.getFullYear(), "\u5E74 ").concat(monthNames[currentDate.value.getMonth()]);
});
var isToday = function (day) {
    if (!day)
        return false;
    var today = new Date();
    return today.getDate() === day &&
        today.getMonth() === currentDate.value.getMonth() &&
        today.getFullYear() === currentDate.value.getFullYear();
};
function prevMonth() {
    var newDate = new Date(currentDate.value);
    newDate.setMonth(newDate.getMonth() - 1);
    currentDate.value = newDate;
}
function nextMonth() {
    var newDate = new Date(currentDate.value);
    newDate.setMonth(newDate.getMonth() + 1);
    currentDate.value = newDate;
}
function selectDate(day) {
    if (!day)
        return;
    selectedDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day);
    // Pre-fill date string
    var m = (selectedDate.value.getMonth() + 1).toString().padStart(2, '0');
    var d = selectedDate.value.getDate().toString().padStart(2, '0');
    newEventDate.value = "".concat(selectedDate.value.getFullYear(), "-").concat(m, "-").concat(d);
}
(0, vue_1.onMounted)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        fetchEvents();
        return [2 /*return*/];
    });
}); });
var events = (0, vue_1.ref)([]);
function fetchEvents() {
    return __awaiter(this, void 0, void 0, function () {
        var res, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get("".concat(config_1.API_BASE, "/calendar"), {
                            headers: { Authorization: "Bearer ".concat(authStore.token) }
                        })];
                case 1:
                    res = _a.sent();
                    events.value = res.data;
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.error(err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function addEvent() {
    return __awaiter(this, void 0, void 0, function () {
        var start, end, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!newEventTitle.value || !newEventDate.value)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    start = new Date(newEventDate.value);
                    start.setHours(9, 0, 0);
                    end = new Date(newEventDate.value);
                    end.setHours(10, 0, 0);
                    return [4 /*yield*/, axios_1.default.post("".concat(config_1.API_BASE, "/calendar"), {
                            title: newEventTitle.value,
                            description: newEventDesc.value,
                            startTime: start.toISOString(),
                            endTime: end.toISOString()
                        }, {
                            headers: { Authorization: "Bearer ".concat(authStore.token) }
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fetchEvents()];
                case 3:
                    _a.sent();
                    showAddEvent.value = false;
                    newEventTitle.value = '';
                    newEventDesc.value = '';
                    return [3 /*break*/, 5];
                case 4:
                    err_2 = _a.sent();
                    alert('添加失败');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
var displayEvents = (0, vue_1.computed)(function () {
    return events.value.map(function (e) { return ({
        id: e.id,
        date: new Date(e.startTime).toLocaleDateString(),
        title: e.title
    }); }).slice(0, 5);
});
function deleteEvent(id) {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('确定要删除这个日程吗？'))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, axios_1.default.delete("".concat(config_1.API_BASE, "/calendar/").concat(id), {
                            headers: { Authorization: "Bearer ".concat(authStore.token) }
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fetchEvents()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Delete event failed:', error_1);
                    alert('删除失败');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['weekdays']} */ ;
/** @type {__VLS_StyleScopedClasses['day-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['day-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['day-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['day-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "calendar-page" }));
/** @type {__VLS_StyleScopedClasses['calendar-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "page-header" }));
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)(__assign({ class: "page-title" }));
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.showAddEvent = true;
        // @ts-ignore
        [showAddEvent,];
    } }, { class: "btn btn-primary" }));
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "calendar-container" }));
/** @type {__VLS_StyleScopedClasses['calendar-container']} */ ;
var __VLS_0 = GlassCard_vue_1.default || GlassCard_vue_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ class: "calendar-card" }, { ref: "calendarRef", hoverable: (false) })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "calendar-card" }, { ref: "calendarRef", hoverable: (false) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5 = {};
/** @type {__VLS_StyleScopedClasses['calendar-card']} */ ;
var __VLS_7 = __VLS_3.slots.default;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "calendar-header" }));
/** @type {__VLS_StyleScopedClasses['calendar-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.prevMonth) }, { class: "nav-btn" }));
/** @type {__VLS_StyleScopedClasses['nav-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "current-month" }));
/** @type {__VLS_StyleScopedClasses['current-month']} */ ;
(__VLS_ctx.currentMonthYear);
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.nextMonth) }, { class: "nav-btn" }));
/** @type {__VLS_StyleScopedClasses['nav-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "weekdays" }));
/** @type {__VLS_StyleScopedClasses['weekdays']} */ ;
for (var _i = 0, _c = __VLS_vFor((['日', '一', '二', '三', '四', '五', '六'])); _i < _c.length; _i++) {
    var day = _c[_i][0];
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        key: (day),
    });
    (day);
    // @ts-ignore
    [prevMonth, currentMonthYear, nextMonth,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "days-grid" }));
/** @type {__VLS_StyleScopedClasses['days-grid']} */ ;
var _loop_1 = function (item, idx) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.selectDate(item.day);
            // @ts-ignore
            [calendarDays, selectDate,];
        } }, { key: (idx) }), { class: "day-cell" }), { class: ({
            'other-month': !item.isCurrentMonth,
            'today': __VLS_ctx.isToday(item.day),
            'selected': ((_a = __VLS_ctx.selectedDate) === null || _a === void 0 ? void 0 : _a.getDate()) === item.day &&
                ((_b = __VLS_ctx.selectedDate) === null || _b === void 0 ? void 0 : _b.getMonth()) === __VLS_ctx.currentDate.getMonth()
        }) }));
    /** @type {__VLS_StyleScopedClasses['day-cell']} */ ;
    /** @type {__VLS_StyleScopedClasses['other-month']} */ ;
    /** @type {__VLS_StyleScopedClasses['today']} */ ;
    /** @type {__VLS_StyleScopedClasses['selected']} */ ;
    if (item.day) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (item.day);
    }
    // @ts-ignore
    [isToday, selectedDate, selectedDate, currentDate,];
};
for (var _d = 0, _e = __VLS_vFor((__VLS_ctx.calendarDays)); _d < _e.length; _d++) {
    var _f = _e[_d], item = _f[0], idx = _f[1];
    _loop_1(item, idx);
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_8 = GlassCard_vue_1.default || GlassCard_vue_1.default;
// @ts-ignore
var __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8(__assign({ class: "events-card" }, { hoverable: (false) })));
var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([__assign({ class: "events-card" }, { hoverable: (false) })], __VLS_functionalComponentArgsRest(__VLS_9), false));
/** @type {__VLS_StyleScopedClasses['events-card']} */ ;
var __VLS_13 = __VLS_11.slots.default;
__VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)(__assign({ class: "events-title" }));
/** @type {__VLS_StyleScopedClasses['events-title']} */ ;
if (__VLS_ctx.displayEvents.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "events-list" }));
    /** @type {__VLS_StyleScopedClasses['events-list']} */ ;
    var _loop_2 = function (event_1) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: (event_1.id) }, { class: "event-item" }));
        /** @type {__VLS_StyleScopedClasses['event-item']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "event-info" }));
        /** @type {__VLS_StyleScopedClasses['event-info']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "event-date" }));
        /** @type {__VLS_StyleScopedClasses['event-date']} */ ;
        (event_1.date);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "event-title" }));
        /** @type {__VLS_StyleScopedClasses['event-title']} */ ;
        (event_1.title);
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.displayEvents.length))
                    return;
                __VLS_ctx.deleteEvent(event_1.id);
                // @ts-ignore
                [displayEvents, displayEvents, deleteEvent,];
            } }, { class: "delete-btn" }));
        /** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
        // @ts-ignore
        [];
    };
    for (var _g = 0, _h = __VLS_vFor((__VLS_ctx.displayEvents)); _g < _h.length; _g++) {
        var event_1 = _h[_g][0];
        _loop_2(event_1);
    }
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "no-events" }));
    /** @type {__VLS_StyleScopedClasses['no-events']} */ ;
}
// @ts-ignore
[];
var __VLS_11;
if (__VLS_ctx.showAddEvent) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "modal" }));
    /** @type {__VLS_StyleScopedClasses['modal']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showAddEvent))
                return;
            __VLS_ctx.showAddEvent = false;
            // @ts-ignore
            [showAddEvent, showAddEvent,];
        } }, { class: "modal-backdrop" }));
    /** @type {__VLS_StyleScopedClasses['modal-backdrop']} */ ;
    var __VLS_14 = GlassCard_vue_1.default || GlassCard_vue_1.default;
    // @ts-ignore
    var __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14(__assign({ class: "modal-card" }, { hoverable: (false) })));
    var __VLS_16 = __VLS_15.apply(void 0, __spreadArray([__assign({ class: "modal-card" }, { hoverable: (false) })], __VLS_functionalComponentArgsRest(__VLS_15), false));
    /** @type {__VLS_StyleScopedClasses['modal-card']} */ ;
    var __VLS_19 = __VLS_17.slots.default;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "modal-title" }));
    /** @type {__VLS_StyleScopedClasses['modal-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "form-group" }));
    /** @type {__VLS_StyleScopedClasses['form-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)(__assign({ type: "date" }, { class: "form-input" }));
    (__VLS_ctx.newEventDate);
    /** @type {__VLS_StyleScopedClasses['form-input']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "form-group" }));
    /** @type {__VLS_StyleScopedClasses['form-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)(__assign({ type: "text", value: (__VLS_ctx.newEventTitle), placeholder: "日程标题" }, { class: "form-input" }));
    /** @type {__VLS_StyleScopedClasses['form-input']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "form-group" }));
    /** @type {__VLS_StyleScopedClasses['form-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.textarea, __VLS_intrinsics.textarea)(__assign({ value: (__VLS_ctx.newEventDesc), placeholder: "备注..." }, { class: "form-textarea" }));
    /** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "modal-actions" }));
    /** @type {__VLS_StyleScopedClasses['modal-actions']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showAddEvent))
                return;
            __VLS_ctx.showAddEvent = false;
            // @ts-ignore
            [showAddEvent, newEventDate, newEventTitle, newEventDesc,];
        } }, { class: "btn btn-secondary" }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.addEvent) }, { class: "btn btn-primary" }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
    // @ts-ignore
    [addEvent,];
    var __VLS_17;
}
// @ts-ignore
var __VLS_6 = __VLS_5;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
