import { defineStore } from 'pinia';
import { ref } from 'vue';
import { io, Socket } from 'socket.io-client';
import { WS_BASE } from '../config';
import { useAuthStore } from './auth';

export const useSocketStore = defineStore('socket', () => {
    const socket = ref<Socket | null>(null);
    const isConnected = ref(false);

    function connect() {
        const authStore = useAuthStore();
        if (!authStore.token || socket.value?.connected) return;

        socket.value = io(`${WS_BASE}/chat`, {
            auth: { token: authStore.token },
            transports: ['websocket'],
        });

        socket.value.on('connect', () => {
            isConnected.value = true;
            console.log('Socket connected globally');
        });

        socket.value.on('disconnect', () => {
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
        socket,
        isConnected,
        connect,
        disconnect
    };
});
