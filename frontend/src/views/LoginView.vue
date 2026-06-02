<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { gsap } from 'gsap';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const formRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (formRef.value) {
    gsap.fromTo(formRef.value,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
    );
  }
});

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = '请输入用户名和密码';
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    await authStore.login(username.value, password.value);
    router.push('/dashboard');
  } catch (err: any) {
    error.value = err.response?.data?.message || '登录失败，请检查用户名和密码';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card glass-card" ref="formRef">
      <h2 class="login-title">
        <span class="accent-text">ZKY</span> 登录
      </h2>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="请输入用户名"
            autocomplete="username"
          />
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="请输入密码"
            autocomplete="current-password"
          />
        </div>
        
        <p v-if="error" class="error-message">{{ error }}</p>
        
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      
      <p class="register-link">
        还没有账号？
        <router-link to="/register">立即注册</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  background: var(--bg-primary);
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: var(--spacing-2xl);
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-group label {
  font-size: 14px;
  color: var(--text-secondary);
}

.form-group input {
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--accent-color-20);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 16px;
  transition: all var(--transition-normal);
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent-color-40);
  box-shadow: 0 0 10px var(--accent-color-20);
}

.form-group input::placeholder {
  color: var(--text-muted);
}

.error-message {
  color: rgb(255, 100, 100);
  font-size: 14px;
  text-align: center;
}

.btn {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  border: none;
}

.btn-primary {
  background: var(--accent-color);
  color: #000;
}

.btn-primary:hover:not(:disabled) {
  box-shadow: var(--accent-glow);
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  margin-top: var(--spacing-lg);
  color: var(--text-secondary);
  font-size: 14px;
}

.register-link a {
  color: var(--accent-color);
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
