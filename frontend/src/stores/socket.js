"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSocketStore = void 0;
var pinia_1 = require("pinia");
var vue_1 = require("vue");
var socket_io_client_1 = require("socket.io-client");
var config_1 = require("../config");
var auth_1 = require("./auth");
exports.useSocketStore = (0, pinia_1.defineStore)('socket', function () {
    var socket = (0, vue_1.ref)(null);
    var isConnected = (0, vue_1.ref)(false);
    function connect() {
        var _a;
        var authStore = (0, auth_1.useAuthStore)();
        if (!authStore.token || ((_a = socket.value) === null || _a === void 0 ? void 0 : _a.connected))
            return;
        socket.value = (0, socket_io_client_1.io)("".concat(config_1.WS_BASE, "/chat"), {
            auth: { token: authStore.token },
            transports: ['websocket'],
        });
        socket.value.on('connect', function () {
            isConnected.value = true;
            console.log('Socket connected globally');
        });
        socket.value.on('disconnect', function () {
            isConnected.value = false;
            console.log('Socket disconnected globally');
        });
    }
    function disconnect() {
        if (socket.value) {
            socket.value.disconnect();
            socket.value = null;
            isConnected.value = false;
        }
    }
    return {
        socket: socket,
        isConnected: isConnected,
        connect: connect,
        disconnect: disconnect
    };
});
