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
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var GlassCard_vue_1 = require("../components/GlassCard.vue");
var gsap_1 = require("gsap");
var axios_1 = require("axios");
var auth_1 = require("../stores/auth");
var config_1 = require("../config");
var authStore = (0, auth_1.useAuthStore)();
var memos = (0, vue_1.ref)([]); // Start empty, fetch from API
var showEditor = (0, vue_1.ref)(false);
var editingMemo = (0, vue_1.ref)(null);
var newTitle = (0, vue_1.ref)('');
var newContent = (0, vue_1.ref)('');
var containerRef = (0, vue_1.ref)(null);
(0, vue_1.onMounted)(function () {
    fetchMemos();
});
function fetchMemos() {
    return __awaiter(this, void 0, void 0, function () {
        var res, cards, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get("".concat(config_1.API_BASE, "/memos"), {
                            headers: { Authorization: "Bearer ".concat(authStore.token) }
                        })];
                case 1:
                    res = _a.sent();
                    // Backend returns entities, map if necessary, or just use. 
                    // Assuming backend returns { id, title, content, updatedAt }
                    memos.value = res.data.map(function (m) { return (__assign(__assign({}, m), { updatedAt: new Date(m.updatedAt).toLocaleDateString() })); });
                    // Animate after fetch
                    return [4 /*yield*/, (0, vue_1.nextTick)()];
                case 2:
                    // Animate after fetch
                    _a.sent();
                    if (containerRef.value) {
                        cards = containerRef.value.querySelectorAll('.memo-card');
                        if (cards.length > 0) {
                            gsap_1.gsap.fromTo(cards, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' });
                        }
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Failed to fetch memos:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function openEditor(memo) {
    if (memo) {
        editingMemo.value = memo;
        newTitle.value = memo.title;
        newContent.value = memo.content;
    }
    else {
        editingMemo.value = null;
        newTitle.value = '';
        newContent.value = '';
    }
    showEditor.value = true;
}
function saveMemo() {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!newTitle.value.trim())
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    if (!editingMemo.value) return [3 /*break*/, 3];
                    // Update
                    return [4 /*yield*/, axios_1.default.put("".concat(config_1.API_BASE, "/memos/").concat(editingMemo.value.id), {
                            title: newTitle.value,
                            content: newContent.value
                        }, {
                            headers: { Authorization: "Bearer ".concat(authStore.token) }
                        })];
                case 2:
                    // Update
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: 
                // Create
                return [4 /*yield*/, axios_1.default.post("".concat(config_1.API_BASE, "/memos"), {
                        title: newTitle.value,
                        content: newContent.value
                    }, {
                        headers: { Authorization: "Bearer ".concat(authStore.token) }
                    })];
                case 4:
                    // Create
                    _a.sent();
                    _a.label = 5;
                case 5: return [4 /*yield*/, fetchMemos()];
                case 6:
                    _a.sent();
                    showEditor.value = false;
                    return [3 /*break*/, 8];
                case 7:
                    error_2 = _a.sent();
                    console.error('Failed to save memo:', error_2);
                    alert('保存失败');
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function deleteMemo(id) {
    return __awaiter(this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('确定要删除这条备忘录吗？'))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.delete("".concat(config_1.API_BASE, "/memos/").concat(id), {
                            headers: { Authorization: "Bearer ".concat(authStore.token) }
                        })];
                case 2:
                    _a.sent();
                    memos.value = memos.value.filter(function (m) { return m.id !== id; });
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('Failed to delete memo:', error_3);
                    alert('删除失败');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['editor-input']} */ ;
/** @type {__VLS_StyleScopedClasses['editor-textarea']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "memos-page" }));
/** @type {__VLS_StyleScopedClasses['memos-page']} */ ;
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
        __VLS_ctx.openEditor();
        // @ts-ignore
        [openEditor,];
    } }, { class: "btn btn-primary" }));
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "memos-grid" }, { ref: "containerRef" }));
/** @type {__VLS_StyleScopedClasses['memos-grid']} */ ;
var _loop_1 = function (memo) {
    var __VLS_0 = GlassCard_vue_1.default || GlassCard_vue_1.default;
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign(__assign(__assign({ 'onClick': {} }, { key: (memo.id) }), { class: "memo-card" }), { clickable: (true) })));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign(__assign(__assign({ 'onClick': {} }, { key: (memo.id) }), { class: "memo-card" }), { clickable: (true) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
    var __VLS_5 = void 0;
    var __VLS_6 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                __VLS_ctx.openEditor(memo);
                // @ts-ignore
                [openEditor, memos,];
            } });
    /** @type {__VLS_StyleScopedClasses['memo-card']} */ ;
    var __VLS_7 = __VLS_3.slots.default;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)(__assign({ class: "memo-title" }));
    /** @type {__VLS_StyleScopedClasses['memo-title']} */ ;
    (memo.title);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "memo-preview" }));
    /** @type {__VLS_StyleScopedClasses['memo-preview']} */ ;
    (memo.content.slice(0, 100));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "memo-footer" }));
    /** @type {__VLS_StyleScopedClasses['memo-footer']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "memo-date" }));
    /** @type {__VLS_StyleScopedClasses['memo-date']} */ ;
    (memo.updatedAt);
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.deleteMemo(memo.id);
            // @ts-ignore
            [deleteMemo,];
        } }, { class: "delete-btn" }));
    /** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
    // @ts-ignore
    [];
    // @ts-ignore
    [];
};
var __VLS_3, __VLS_4;
for (var _i = 0, _a = __VLS_vFor((__VLS_ctx.memos)); _i < _a.length; _i++) {
    var memo = _a[_i][0];
    _loop_1(memo);
}
if (__VLS_ctx.showEditor) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "editor-modal" }));
    /** @type {__VLS_StyleScopedClasses['editor-modal']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showEditor))
                return;
            __VLS_ctx.showEditor = false;
            // @ts-ignore
            [showEditor, showEditor,];
        } }, { class: "editor-backdrop" }));
    /** @type {__VLS_StyleScopedClasses['editor-backdrop']} */ ;
    var __VLS_8 = GlassCard_vue_1.default || GlassCard_vue_1.default;
    // @ts-ignore
    var __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8(__assign({ class: "editor-card" }, { hoverable: (false) })));
    var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([__assign({ class: "editor-card" }, { hoverable: (false) })], __VLS_functionalComponentArgsRest(__VLS_9), false));
    /** @type {__VLS_StyleScopedClasses['editor-card']} */ ;
    var __VLS_13 = __VLS_11.slots.default;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "editor-title" }));
    /** @type {__VLS_StyleScopedClasses['editor-title']} */ ;
    (__VLS_ctx.editingMemo ? '编辑备忘录' : '新建备忘录');
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)(__assign({ class: "editor-input" }, { placeholder: "标题" }));
    (__VLS_ctx.newTitle);
    /** @type {__VLS_StyleScopedClasses['editor-input']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.textarea, __VLS_intrinsics.textarea)(__assign(__assign({ value: (__VLS_ctx.newContent) }, { class: "editor-textarea" }), { placeholder: "支持 Markdown 格式..." }));
    /** @type {__VLS_StyleScopedClasses['editor-textarea']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "editor-actions" }));
    /** @type {__VLS_StyleScopedClasses['editor-actions']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showEditor))
                return;
            __VLS_ctx.showEditor = false;
            // @ts-ignore
            [showEditor, editingMemo, newTitle, newContent,];
        } }, { class: "btn btn-secondary" }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.saveMemo) }, { class: "btn btn-primary" }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
    // @ts-ignore
    [saveMemo,];
    var __VLS_11;
}
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
