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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var axios_1 = require("axios");
var GlassCard_vue_1 = require("../components/GlassCard.vue");
var gsap_1 = require("gsap");
var auth_1 = require("../stores/auth");
var socket_1 = require("../stores/socket");
var config_1 = require("../config");
var authStore = (0, auth_1.useAuthStore)();
var socketStore = (0, socket_1.useSocketStore)();
var vClickOutside = {
    mounted: function (el, binding) {
        el.clickOutsideEvent = function (event) {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value(event);
            }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
    },
    unmounted: function (el) {
        document.body.removeEventListener('click', el.clickOutsideEvent);
    },
};
var conversations = (0, vue_1.ref)([]);
var selectedConversation = (0, vue_1.ref)(null);
var messages = (0, vue_1.ref)([]);
var newMessage = (0, vue_1.ref)('');
// const socket = ref<Socket | null>(null); // Replaced by socketStore.socket
var isLoading = (0, vue_1.ref)(false);
var containerRef = (0, vue_1.ref)(null);
var messagesContainerRef = (0, vue_1.ref)(null);
// Search State
var showSearchModal = (0, vue_1.ref)(false);
var searchQuery = (0, vue_1.ref)('');
var searchResults = (0, vue_1.ref)([]);
var isSearching = (0, vue_1.ref)(false);
// Initialize Socket.IO connection
// Setup listeners on the shared socket
function setupSocketListeners(socket) {
    socket.off('newMessage', handleNewMessage);
    socket.on('newMessage', handleNewMessage);
    socket.off('messageSent', handleMessageSent);
    socket.on('messageSent', handleMessageSent);
    socket.off('messageRecalled', handleMessageRecalled);
    socket.on('messageRecalled', handleMessageRecalled);
    socket.off('messagesRead', handleMessagesRead);
    socket.on('messagesRead', handleMessagesRead);
}
function handleMessageSent(message) {
    var _a, _b;
    var index = messages.value.findIndex(function (m) {
        var _a;
        return m.senderId === ((_a = authStore.user) === null || _a === void 0 ? void 0 : _a.id) &&
            m.content === message.content &&
            m.id.startsWith('temp-');
    });
    if (index !== -1) {
        messages.value[index] = formatMessageTime(message);
    }
    else if (!messages.value.find(function (m) { return m.id === message.id; })) {
        if (message.receiverId === ((_a = selectedConversation.value) === null || _a === void 0 ? void 0 : _a.userId) || message.senderId === ((_b = selectedConversation.value) === null || _b === void 0 ? void 0 : _b.userId)) {
            messages.value.push(formatMessageTime(message));
            scrollToBottom();
        }
    }
}
function handleMessageRecalled(data) {
    var msg = messages.value.find(function (m) { return m.id === data.messageId; });
    if (msg) {
        msg.isRecalled = true;
    }
}
function handleMessagesRead(data) {
    var _a;
    if (((_a = selectedConversation.value) === null || _a === void 0 ? void 0 : _a.userId) === data.readerId) {
        messages.value.forEach(function (m) {
            var _a;
            if (m.senderId === ((_a = authStore.user) === null || _a === void 0 ? void 0 : _a.id)) {
                m.isRead = true;
            }
        });
    }
}
function handleNewMessage(message) {
    var _a;
    // If message belongs to current conversation, append it
    if (selectedConversation.value &&
        (message.senderId === selectedConversation.value.userId || message.senderId === ((_a = authStore.user) === null || _a === void 0 ? void 0 : _a.id))) {
        messages.value.push(formatMessageTime(message));
        scrollToBottom();
        // Mark as read immediately if window receives it
        if (message.senderId === selectedConversation.value.userId) {
            markAsRead(message.senderId);
        }
    }
    else {
        // Update conversation list (unread count, last msg)
        updateConversationList(message);
        // 通知 TopNav 刷新未读数（有新消息）
        window.dispatchEvent(new Event('messages-read'));
    }
}
function updateConversationList(_message) {
    return __awaiter(this, void 0, void 0, function () {
        var data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!authStore.token)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get("".concat(config_1.API_BASE, "/messages/conversations"), {
                            headers: { Authorization: "Bearer ".concat(authStore.token) }
                        })];
                case 2:
                    data = (_a.sent()).data;
                    conversations.value = data.map(function (c) { return (__assign(__assign({}, c), { lastTime: formatTime(c.lastTime) })); });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Failed to update conversations:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function fetchHistory(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isLoading.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios_1.default.get("".concat(config_1.API_BASE, "/messages/history/").concat(userId), {
                            headers: { Authorization: "Bearer ".concat(authStore.token) }
                        })];
                case 2:
                    data = (_a.sent()).data;
                    messages.value = data.reverse().map(function (m) { return formatMessageTime(m); });
                    scrollToBottom();
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    console.error('Failed to fetch history:', error_2);
                    return [3 /*break*/, 5];
                case 4:
                    isLoading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function markAsRead(senderId) {
    return __awaiter(this, void 0, void 0, function () {
        var conv, error_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.put("".concat(config_1.API_BASE, "/messages/read/").concat(senderId), {}, {
                            headers: { Authorization: "Bearer ".concat(authStore.token) }
                        })];
                case 1:
                    _b.sent();
                    conv = conversations.value.find(function (c) { return c.userId === senderId; });
                    if (conv)
                        conv.unreadCount = 0;
                    // 通过 WebSocket 通知发送者消息已读 (实时更新)
                    if ((_a = socketStore.socket) === null || _a === void 0 ? void 0 : _a.connected) {
                        socketStore.socket.emit('readMessages', { senderId: senderId });
                    }
                    // 通知 TopNav 刷新未读数
                    window.dispatchEvent(new Event('messages-read'));
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _b.sent();
                    console.error('Failed to mark as read:', error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function selectConversation(conv) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    selectedConversation.value = conv;
                    return [4 /*yield*/, fetchHistory(conv.userId)];
                case 1:
                    _a.sent();
                    if (!(conv.unreadCount > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, markAsRead(conv.userId)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function sendMessage() {
    var _a, _b;
    if (!newMessage.value.trim() || !selectedConversation.value || !socketStore.socket)
        return;
    var content = newMessage.value;
    var receiverId = selectedConversation.value.userId;
    // Emit event to server
    socketStore.socket.emit('sendMessage', {
        receiverId: receiverId,
        content: content
    });
    // Optimistic UI update
    var tempMsg = {
        id: "temp-".concat(Date.now()), // temporary ID
        senderId: ((_a = authStore.user) === null || _a === void 0 ? void 0 : _a.id) || 'me',
        senderName: ((_b = authStore.user) === null || _b === void 0 ? void 0 : _b.username) || '我',
        receiverId: receiverId,
        content: content,
        createdAt: new Date().toISOString(), // Use simple time for now, formatted downstream
        isRead: false,
    };
    messages.value.push(formatMessageTime(tempMsg));
    // Update conversation last message preview locally
    var conv = conversations.value.find(function (c) { return c.userId === receiverId; });
    if (conv) {
        conv.lastMessage = content;
        conv.lastTime = formatTime(new Date().toISOString());
    }
    else {
        // New conversation created by sending first message
        // Fetch latest list to get full details properly or construct one
        // For now, simple refresh
        setTimeout(function () { return updateConversationList(); }, 500);
    }
    newMessage.value = '';
    scrollToBottom();
}
function deleteConversation(conv) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!confirm('确定要删除该会话吗？删除后将不再显示历史消息。'))
                        return [2 /*return*/];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.put("".concat(config_1.API_BASE, "/messages/delete-conversation/").concat(conv.userId), {}, {
                            headers: { Authorization: "Bearer ".concat(authStore.token) }
                        })];
                case 2:
                    _b.sent();
                    // Remove from list
                    conversations.value = conversations.value.filter(function (c) { return c.userId !== conv.userId; });
                    if (((_a = selectedConversation.value) === null || _a === void 0 ? void 0 : _a.userId) === conv.userId) {
                        selectedConversation.value = null;
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _b.sent();
                    console.error('Delete conversation failed', e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function recallMessage(message) {
    // Recalling message
    if (!socketStore.socket) {
        console.error('Socket not connected');
        return;
    }
    socketStore.socket.emit('recallMessage', { messageId: message.id });
}
function canRecall(message) {
    var _a;
    if (message.senderId !== ((_a = authStore.user) === null || _a === void 0 ? void 0 : _a.id) || message.isRecalled)
        return false;
    // Check if within 2 minutes
    var msgTime = new Date(message.createdAt).getTime();
    var diff = (Date.now() - msgTime);
    // console.log(`Msg time diff: ${diff}ms`); // Debug if needed
    return diff < 2 * 60 * 1000;
}
function openMenu(msg) {
    // Close others
    messages.value.forEach(function (m) { return m.showMenu = false; });
    msg.showMenu = true;
}
// User Search Logic
function searchUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var data, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!searchQuery.value.trim())
                        return [2 /*return*/];
                    isSearching.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios_1.default.get("".concat(config_1.API_BASE, "/messages/search"), {
                            params: { q: searchQuery.value },
                            headers: { Authorization: "Bearer ".concat(authStore.token) }
                        })];
                case 2:
                    data = (_a.sent()).data;
                    searchResults.value = data.filter(function (u) { var _a; return u.id !== ((_a = authStore.user) === null || _a === void 0 ? void 0 : _a.id); }); // Exclude self
                    return [3 /*break*/, 5];
                case 3:
                    e_2 = _a.sent();
                    console.error('Search failed', e_2);
                    return [3 /*break*/, 5];
                case 4:
                    isSearching.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function startChat(user) {
    // Check if conversation exists
    var existing = conversations.value.find(function (c) { return c.userId === user.id; });
    if (existing) {
        selectConversation(existing);
    }
    else {
        // Create temporary conversation object
        var newConv = {
            userId: user.id,
            username: user.username,
            lastMessage: '',
            lastTime: '',
            unreadCount: 0
        };
        // Add to list or just set selected? 
        // Setting selected allows sending message immediately. 
        // We won't add to `conversations` array until a message is sent or we handle it otherwise.
        selectedConversation.value = newConv;
        messages.value = []; // Empty history
    }
    showSearchModal.value = false;
    searchQuery.value = '';
    searchResults.value = [];
}
function formatTime(dateStr) {
    if (!dateStr)
        return '';
    var date = new Date(dateStr);
    var now = new Date();
    // primitive logic: if today, show time; else show date
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
}
function formatMessageTime(msg) {
    return __assign(__assign({}, msg), { 
        // Ensure we keep the original createdAt for logic (e.g. recall time check)
        createdAt: msg.createdAt, displayTime: formatTime(msg.createdAt) });
}
function scrollToBottom() {
    (0, vue_1.nextTick)(function () {
        if (messagesContainerRef.value) {
            messagesContainerRef.value.scrollTop = messagesContainerRef.value.scrollHeight;
        }
    });
}
// Watch for socket changes (e.g. reconnection)
(0, vue_1.watch)(function () { return socketStore.socket; }, function (newSocket) {
    if (newSocket) {
        setupSocketListeners(newSocket);
    }
});
(0, vue_1.onMounted)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (containerRef.value) {
                    gsap_1.gsap.fromTo(containerRef.value, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power3.out' });
                }
                return [4 /*yield*/, updateConversationList()];
            case 1:
                _a.sent();
                // Ensure connected
                if (!socketStore.isConnected) {
                    socketStore.connect();
                }
                if (socketStore.socket) {
                    setupSocketListeners(socketStore.socket);
                }
                return [2 /*return*/];
        }
    });
}); });
(0, vue_1.onUnmounted)(function () {
    if (socketStore.socket) {
        socketStore.socket.off('newMessage', handleNewMessage);
        socketStore.socket.off('messageSent', handleMessageSent);
        socketStore.socket.off('messageRecalled', handleMessageRecalled);
        socketStore.socket.off('messagesRead', handleMessagesRead);
    }
});
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['conversation-item']} */ ;
/** @type {__VLS_StyleScopedClasses['conversation-item']} */ ;
/** @type {__VLS_StyleScopedClasses['conv-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['message-item']} */ ;
/** @type {__VLS_StyleScopedClasses['message-item']} */ ;
/** @type {__VLS_StyleScopedClasses['sent']} */ ;
/** @type {__VLS_StyleScopedClasses['message-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['message-item']} */ ;
/** @type {__VLS_StyleScopedClasses['sent']} */ ;
/** @type {__VLS_StyleScopedClasses['message-time']} */ ;
/** @type {__VLS_StyleScopedClasses['conversation-item']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-conv-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-conv-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['message-item']} */ ;
/** @type {__VLS_StyleScopedClasses['sent']} */ ;
/** @type {__VLS_StyleScopedClasses['message-content-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-input']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-input']} */ ;
/** @type {__VLS_StyleScopedClasses['send-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['user-result-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "messages-page" }, { ref: "containerRef" }));
/** @type {__VLS_StyleScopedClasses['messages-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "messages-container" }));
/** @type {__VLS_StyleScopedClasses['messages-container']} */ ;
var __VLS_0 = GlassCard_vue_1.default || GlassCard_vue_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ class: "conversations-panel" }, { hoverable: (false) })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "conversations-panel" }, { hoverable: (false) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
/** @type {__VLS_StyleScopedClasses['conversations-panel']} */ ;
var __VLS_5 = __VLS_3.slots.default;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "panel-header" }));
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "header-title-group" }));
/** @type {__VLS_StyleScopedClasses['header-title-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "header-subtitle" }));
/** @type {__VLS_StyleScopedClasses['header-subtitle']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.showSearchModal = true;
        // @ts-ignore
        [showSearchModal,];
    } }, { class: "icon-btn" }), { title: "新对话" }));
/** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "plus-icon" }));
/** @type {__VLS_StyleScopedClasses['plus-icon']} */ ;
var _loop_1 = function (conv) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.selectConversation(conv);
            // @ts-ignore
            [conversations, selectConversation,];
        } }, { key: (conv.userId) }), { class: "conversation-item" }), { class: ({ active: ((_a = __VLS_ctx.selectedConversation) === null || _a === void 0 ? void 0 : _a.userId) === conv.userId }) }));
    /** @type {__VLS_StyleScopedClasses['conversation-item']} */ ;
    /** @type {__VLS_StyleScopedClasses['active']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "conv-avatar" }));
    /** @type {__VLS_StyleScopedClasses['conv-avatar']} */ ;
    (conv.username[0].toUpperCase());
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "conv-info" }));
    /** @type {__VLS_StyleScopedClasses['conv-info']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "conv-header" }));
    /** @type {__VLS_StyleScopedClasses['conv-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "conv-name" }));
    /** @type {__VLS_StyleScopedClasses['conv-name']} */ ;
    (conv.username);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "conv-time" }));
    /** @type {__VLS_StyleScopedClasses['conv-time']} */ ;
    (conv.lastTime);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "conv-preview" }));
    /** @type {__VLS_StyleScopedClasses['conv-preview']} */ ;
    (conv.lastMessage);
    if (conv.unreadCount) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "unread-badge" }));
        /** @type {__VLS_StyleScopedClasses['unread-badge']} */ ;
        (conv.unreadCount);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.deleteConversation(conv);
            // @ts-ignore
            [selectedConversation, deleteConversation,];
        } }, { class: "delete-conv-btn" }));
    /** @type {__VLS_StyleScopedClasses['delete-conv-btn']} */ ;
    // @ts-ignore
    [];
};
for (var _i = 0, _e = __VLS_vFor((__VLS_ctx.conversations)); _i < _e.length; _i++) {
    var conv = _e[_i][0];
    _loop_1(conv);
}
if (__VLS_ctx.conversations.length === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "empty-state" }));
    /** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
}
// @ts-ignore
[conversations,];
var __VLS_3;
var __VLS_6 = GlassCard_vue_1.default || GlassCard_vue_1.default;
// @ts-ignore
var __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6(__assign({ class: "chat-panel" }, { hoverable: (false) })));
var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([__assign({ class: "chat-panel" }, { hoverable: (false) })], __VLS_functionalComponentArgsRest(__VLS_7), false));
/** @type {__VLS_StyleScopedClasses['chat-panel']} */ ;
var __VLS_11 = __VLS_9.slots.default;
if (__VLS_ctx.selectedConversation) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "chat-header" }));
    /** @type {__VLS_StyleScopedClasses['chat-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "chat-name" }));
    /** @type {__VLS_StyleScopedClasses['chat-name']} */ ;
    (__VLS_ctx.selectedConversation.username);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "chat-messages" }, { ref: "messagesContainerRef" }));
    /** @type {__VLS_StyleScopedClasses['chat-messages']} */ ;
    var _loop_2 = function (msg) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign({ key: (msg.id) }, { class: "message-item" }), { class: ({ 'sent': msg.senderId === ((_b = __VLS_ctx.authStore.user) === null || _b === void 0 ? void 0 : _b.id) }) }));
        /** @type {__VLS_StyleScopedClasses['message-item']} */ ;
        /** @type {__VLS_StyleScopedClasses['sent']} */ ;
        if (msg.isRecalled) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "message-system" }));
            /** @type {__VLS_StyleScopedClasses['message-system']} */ ;
            (msg.senderId === ((_c = __VLS_ctx.authStore.user) === null || _c === void 0 ? void 0 : _c.id) ? '你' : __VLS_ctx.selectedConversation.username);
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "message-content-wrapper" }));
            /** @type {__VLS_StyleScopedClasses['message-content-wrapper']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ onContextmenu: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!(__VLS_ctx.selectedConversation))
                        return;
                    if (!!(msg.isRecalled))
                        return;
                    __VLS_ctx.openMenu(msg);
                    // @ts-ignore
                    [selectedConversation, selectedConversation, selectedConversation, messages, authStore, authStore, openMenu,];
                } }, { class: "message-bubble" }));
            /** @type {__VLS_StyleScopedClasses['message-bubble']} */ ;
            (msg.content);
            if (msg.showMenu) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "context-menu" }));
                __VLS_asFunctionalDirective(__VLS_directives.vClickOutside, {})(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (function () { return msg.showMenu = false; }) }), null, null);
                /** @type {__VLS_StyleScopedClasses['context-menu']} */ ;
                if (__VLS_ctx.canRecall(msg)) {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ onClick: function () {
                            var _a = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                _a[_i] = arguments[_i];
                            }
                            var $event = _a[0];
                            if (!(__VLS_ctx.selectedConversation))
                                return;
                            if (!!(msg.isRecalled))
                                return;
                            if (!(msg.showMenu))
                                return;
                            if (!(__VLS_ctx.canRecall(msg)))
                                return;
                            __VLS_ctx.recallMessage(msg);
                            // @ts-ignore
                            [vClickOutside, canRecall, recallMessage,];
                        } }, { class: "menu-item" }));
                    /** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
                }
                else {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "menu-item disabled" }));
                    /** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
                    /** @type {__VLS_StyleScopedClasses['disabled']} */ ;
                }
            }
            if (msg.senderId === ((_d = __VLS_ctx.authStore.user) === null || _d === void 0 ? void 0 : _d.id)) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "read-status" }));
                /** @type {__VLS_StyleScopedClasses['read-status']} */ ;
                (msg.isRead ? '已读' : '未读');
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "message-time" }));
            /** @type {__VLS_StyleScopedClasses['message-time']} */ ;
            (msg.displayTime);
        }
        // @ts-ignore
        [authStore,];
    };
    for (var _f = 0, _g = __VLS_vFor((__VLS_ctx.messages)); _f < _g.length; _f++) {
        var msg = _g[_f][0];
        _loop_2(msg);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "chat-input" }));
    /** @type {__VLS_StyleScopedClasses['chat-input']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)(__assign({ onKeyup: (__VLS_ctx.sendMessage) }, { value: (__VLS_ctx.newMessage), type: "text", placeholder: "Zooming into your inbox.Keeping us connected, always.You are the reason I type." }));
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.sendMessage) }, { class: "send-btn" }));
    /** @type {__VLS_StyleScopedClasses['send-btn']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "no-chat-selected" }));
    /** @type {__VLS_StyleScopedClasses['no-chat-selected']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
}
// @ts-ignore
[sendMessage, sendMessage, newMessage,];
var __VLS_9;
if (__VLS_ctx.showSearchModal) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "modal" }));
    /** @type {__VLS_StyleScopedClasses['modal']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showSearchModal))
                return;
            __VLS_ctx.showSearchModal = false;
            // @ts-ignore
            [showSearchModal, showSearchModal,];
        } }, { class: "modal-backdrop" }));
    /** @type {__VLS_StyleScopedClasses['modal-backdrop']} */ ;
    var __VLS_12 = GlassCard_vue_1.default || GlassCard_vue_1.default;
    // @ts-ignore
    var __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12(__assign({ class: "modal-card" }, { hoverable: (false) })));
    var __VLS_14 = __VLS_13.apply(void 0, __spreadArray([__assign({ class: "modal-card" }, { hoverable: (false) })], __VLS_functionalComponentArgsRest(__VLS_13), false));
    /** @type {__VLS_StyleScopedClasses['modal-card']} */ ;
    var __VLS_17 = __VLS_15.slots.default;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "modal-title" }));
    /** @type {__VLS_StyleScopedClasses['modal-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "search-box" }));
    /** @type {__VLS_StyleScopedClasses['search-box']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)(__assign(__assign({ onKeyup: (__VLS_ctx.searchUsers) }, { placeholder: "搜索用户名..." }), { class: "search-input" }));
    (__VLS_ctx.searchQuery);
    /** @type {__VLS_StyleScopedClasses['search-input']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: (__VLS_ctx.searchUsers) }, { class: "btn btn-primary" }), { disabled: (__VLS_ctx.isSearching) }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
    (__VLS_ctx.isSearching ? '搜索中...' : '搜索');
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "search-results" }));
    /** @type {__VLS_StyleScopedClasses['search-results']} */ ;
    var _loop_3 = function (user) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.showSearchModal))
                    return;
                __VLS_ctx.startChat(user);
                // @ts-ignore
                [searchUsers, searchUsers, searchQuery, isSearching, isSearching, searchResults, startChat,];
            } }, { key: (user.id) }), { class: "user-result-item" }));
        /** @type {__VLS_StyleScopedClasses['user-result-item']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "conv-avatar sm" }));
        /** @type {__VLS_StyleScopedClasses['conv-avatar']} */ ;
        /** @type {__VLS_StyleScopedClasses['sm']} */ ;
        (user.username[0].toUpperCase());
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "user-name" }));
        /** @type {__VLS_StyleScopedClasses['user-name']} */ ;
        (user.username);
        // @ts-ignore
        [];
    };
    for (var _h = 0, _j = __VLS_vFor((__VLS_ctx.searchResults)); _h < _j.length; _h++) {
        var user = _j[_h][0];
        _loop_3(user);
    }
    if (__VLS_ctx.searchResults.length === 0 && __VLS_ctx.searchQuery && !__VLS_ctx.isSearching) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "no-results" }));
        /** @type {__VLS_StyleScopedClasses['no-results']} */ ;
    }
    // @ts-ignore
    [searchQuery, isSearching, searchResults,];
    var __VLS_15;
}
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
