import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/HomeView.vue'),
        meta: { requiresAuth: false },
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginView.vue'),
        meta: { requiresAuth: false },
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/RegisterView.vue'),
        meta: { requiresAuth: false },
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../views/DashboardView.vue'),
        meta: { requiresAuth: true },
        redirect: '/dashboard/home',
        children: [
            {
                path: 'home',
                name: 'DashboardHome',
                component: () => import('../views/HomeOverview.vue'),
            },
            {
                path: 'memos',
                name: 'Memos',
                component: () => import('../views/MemosView.vue'),
            },
            {
                path: 'posts',
                name: 'Posts',
                component: () => import('../views/PostsView.vue'),
            },
            {
                path: 'media',
                name: 'Media',
                component: () => import('../views/MediaView.vue'),
            },
            {
                path: 'drive',
                name: 'Drive',
                component: () => import('../views/DriveView.vue'),
            },
            {
                path: 'calendar',
                name: 'Calendar',
                component: () => import('../views/CalendarView.vue'),
            },
            {
                path: 'messages',
                name: 'Messages',
                component: () => import('../views/MessagesView.vue'),
            },
            {
                path: 'whiteboard',
                name: 'Whiteboard',
                component: () => import('../views/WhiteboardView.vue'),
            },
            {
                path: 'music',
                name: 'Music',
                component: () => import('../views/MusicView.vue'),
            },
        ],
    },
    {
        path: '/admin',
        name: 'Admin',
        component: () => import('../views/AdminView.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 路由守卫
router.beforeEach((to, _from, next) => {
    const token = localStorage.getItem('zky-token');
    const user = localStorage.getItem('zky-user');

    if (to.meta.requiresAuth && !token) {
        next('/login');
        return;
    }

    if (to.meta.requiresAdmin && user) {
        const userData = JSON.parse(user);
        if (userData.role !== 'admin') {
            next('/dashboard');
            return;
        }
    }

    next();
});

export default router;
