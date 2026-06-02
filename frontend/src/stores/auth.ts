import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { API_BASE } from '../config';

export interface User {
    id: string;
    username: string;
    role: 'admin' | 'user';
    accentColor: 'cyber-blue' | 'neon-green' | 'lava-red';
}

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem('zky-token'));
    const refreshToken = ref<string | null>(localStorage.getItem('zky-refresh-token'));
    const user = ref<User | null>(
        localStorage.getItem('zky-user')
            ? JSON.parse(localStorage.getItem('zky-user')!)
            : null
    );

    const isAuthenticated = computed(() => !!token.value);
    const isAdmin = computed(() => user.value?.role === 'admin');

    // 设置 axios 默认头
    if (token.value) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
    }

    // 暴露刷新 Token 方法
    async function refreshAccessToken(): Promise<string | null> {
        if (!refreshToken.value) return null;
        try {
            const { data } = await axios.post(`${API_BASE}/auth/refresh`, {
                refreshToken: refreshToken.value
            });
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data;

            token.value = newAccessToken;
            refreshToken.value = newRefreshToken;

            localStorage.setItem('zky-token', newAccessToken);
            localStorage.setItem('zky-refresh-token', newRefreshToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

            return newAccessToken;
        } catch (error) {
            logout();
            return null;
        }
    }

    // Axios 拦截器：处理 401 自动刷新
    axios.interceptors.response.use(
        response => response,
        async error => {
            const originalRequest = error.config;

            // 如果是 401 且未重试过
            if (error.response?.status === 401 && !originalRequest._retry && refreshToken.value) {
                originalRequest._retry = true;
                const newToken = await refreshAccessToken();
                if (newToken) {
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return axios(originalRequest);
                } else {
                    window.location.href = '/login';
                    return Promise.reject(error);
                }
            }
            return Promise.reject(error);
        }
    );

    async function login(username: string, password: string) {
        const response = await axios.post(`${API_BASE}/auth/login`, {
            username,
            password,
        });

        const { accessToken, refreshToken: newRefreshToken, user: userData } = response.data;

        token.value = accessToken;
        refreshToken.value = newRefreshToken;
        user.value = userData;

        localStorage.setItem('zky-token', accessToken);
        localStorage.setItem('zky-refresh-token', newRefreshToken);
        localStorage.setItem('zky-user', JSON.stringify(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        return userData;
    }

    async function register(username: string, password: string) {
        const response = await axios.post(`${API_BASE}/auth/register`, {
            username,
            password,
        });

        const { accessToken, refreshToken: newRefreshToken, user: userData } = response.data;

        token.value = accessToken;
        refreshToken.value = newRefreshToken;
        user.value = userData;

        localStorage.setItem('zky-token', accessToken);
        localStorage.setItem('zky-refresh-token', newRefreshToken);
        localStorage.setItem('zky-user', JSON.stringify(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        return userData;
    }

    function logout() {
        if (refreshToken.value) {
            // 尝试后端登出
            axios.post(`${API_BASE}/auth/logout`, { refreshToken: refreshToken.value }).catch(() => { });
        }

        token.value = null;
        refreshToken.value = null;
        user.value = null;

        localStorage.removeItem('zky-token');
        localStorage.removeItem('zky-refresh-token');
        localStorage.removeItem('zky-user');
        delete axios.defaults.headers.common['Authorization'];
    }

    async function updateAccentColor(color: User['accentColor']) {
        await axios.put(`${API_BASE}/auth/accent-color`, { accentColor: color });
        if (user.value) {
            user.value.accentColor = color;
            localStorage.setItem('zky-user', JSON.stringify(user.value));
        }
    }

    return {
        token,
        refreshToken,
        user,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateAccentColor,
        refreshAccessToken,
    };
});
