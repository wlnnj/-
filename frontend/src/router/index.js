"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_router_1 = require("vue-router");
var routes = [
    {
        path: '/',
        name: 'Home',
        component: function () { return Promise.resolve().then(function () { return require('../views/HomeView.vue'); }); },
        meta: { requiresAuth: false },
    },
    {
        path: '/login',
        name: 'Login',
        component: function () { return Promise.resolve().then(function () { return require('../views/LoginView.vue'); }); },
        meta: { requiresAuth: false },
    },
    {
        path: '/register',
        name: 'Register',
        component: function () { return Promise.resolve().then(function () { return require('../views/RegisterView.vue'); }); },
        meta: { requiresAuth: false },
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: function () { return Promise.resolve().then(function () { return require('../views/DashboardView.vue'); }); },
        meta: { requiresAuth: true },
        redirect: '/dashboard/home',
        children: [
            {
                path: 'home',
                name: 'DashboardHome',
                component: function () { return Promise.resolve().then(function () { return require('../views/HomeOverview.vue'); }); },
            },
            {
                path: 'memos',
                name: 'Memos',
                component: function () { return Promise.resolve().then(function () { return require('../views/MemosView.vue'); }); },
            },
            {
                path: 'posts',
                name: 'Posts',
                component: function () { return Promise.resolve().then(function () { return require('../views/PostsView.vue'); }); },
            },
            {
                path: 'media',
                name: 'Media',
                component: function () { return Promise.resolve().then(function () { return require('../views/MediaView.vue'); }); },
            },
            {
                path: 'drive',
                name: 'Drive',
                component: function () { return Promise.resolve().then(function () { return require('../views/DriveView.vue'); }); },
            },
            {
                path: 'calendar',
                name: 'Calendar',
                component: function () { return Promise.resolve().then(function () { return require('../views/CalendarView.vue'); }); },
            },
            {
                path: 'messages',
                name: 'Messages',
                component: function () { return Promise.resolve().then(function () { return require('../views/MessagesView.vue'); }); },
            },
            {
                path: 'whiteboard',
                name: 'Whiteboard',
                component: function () { return Promise.resolve().then(function () { return require('../views/WhiteboardView.vue'); }); },
            },
            {
                path: 'music',
                name: 'Music',
                component: function () { return Promise.resolve().then(function () { return require('../views/MusicView.vue'); }); },
            },
        ],
    },
    {
        path: '/admin',
        name: 'Admin',
        component: function () { return Promise.resolve().then(function () { return require('../views/AdminView.vue'); }); },
        meta: { requiresAuth: true, requiresAdmin: true },
    },
];
var router = (0, vue_router_1.createRouter)({
    history: (0, vue_router_1.createWebHistory)(),
    routes: routes,
});
// 路由守卫
router.beforeEach(function (to, _from, next) {
    var token = localStorage.getItem('zky-token');
    var user = localStorage.getItem('zky-user');
    if (to.meta.requiresAuth && !token) {
        next('/login');
        return;
    }
    if (to.meta.requiresAdmin && user) {
        var userData = JSON.parse(user);
        if (userData.role !== 'admin') {
            next('/dashboard');
            return;
        }
    }
    next();
});
exports.default = router;
