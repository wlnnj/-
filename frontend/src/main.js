"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var pinia_1 = require("pinia");
var router_1 = require("./router");
var App_vue_1 = require("./App.vue");
// 样式
require("./assets/css/variables.css");
require("./style.css");
var app = (0, vue_1.createApp)(App_vue_1.default);
app.use((0, pinia_1.createPinia)());
app.use(router_1.default);
app.mount('#app');
