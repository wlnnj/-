<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { gsap } from 'gsap';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const heroTextRef = ref<HTMLElement | null>(null);
const sectionsRef = ref<HTMLElement[]>([]);

// Scroll Animation Logic
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add visible class to section
            entry.target.classList.add('visible');
            
            // Animate text elements
            gsap.to(entry.target.querySelectorAll('.anim-text'), {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.1,
                ease: 'power3.out'
            });

            // Animate visual mockups (scale/fade in)
            gsap.to(entry.target.querySelectorAll('.mockup-container'), {
                scale: 1,
                opacity: 1,
                duration: 1.2,
                ease: 'back.out(1.7)',
                delay: 0.2
            });
        }
    });
}, { threshold: 0.15, rootMargin: '-50px' });

onMounted(() => {
    // Hero Animation
    if (heroTextRef.value) {
        gsap.from(heroTextRef.value.children, {
            y: 60, 
            opacity: 0, 
            duration: 1.4, 
            stagger: 0.1, 
            ease: 'power4.out', 
            delay: 0.2 
        });
    }

    // Observe sections
    sectionsRef.value.forEach(section => {
        if (section) observer.observe(section);
    });
});

onUnmounted(() => {
    observer.disconnect();
});

const features = [
    {
        id: 'memos',
        title: "备忘录\n灵感，随手捕捉。",
        desc: "支持 Markdown 的纯粹写作体验。无论是瞬间的念头，还是深思熟虑的文章，都能在这里完美安放。",
        color: "#FF2D55", // Pink
        type: 'memo-mock'
    },
    {
        id: 'media',
        title: "媒体库\n回忆，鲜活如初。",
        desc: "沉浸式瀑布流布局，智能展示你的照片与视频。每一刻精彩，都值得被郑重对待。",
        color: "#5E5CE6", // Purple
        type: 'media-mock'
    },
    {
        id: 'drive',
        title: "私有云盘\n数据，掌控之中。",
        desc: "支持大文件存储与断点续传。你的数据安放在自家服务器，安全、私密、随取随用。",
        color: "#007AFF", // Blue
        type: 'drive-mock'
    },
    {
        id: 'chat',
        title: "即时通讯\n连接，即刻触达。",
        desc: "内置实时聊天系统。与家人好友私密畅聊，消息端到端加密，不仅是存储，更是连接。",
        color: "#30D158", // Green
        type: 'chat-mock'
    },
    {
        id: 'calendar',
        title: "日程日历\n时间，井井有条。",
        desc: "可视化的时间管理工具。标记重要时刻，规划未来行程，让生活与工作张弛有度。",
        color: "#FF9F0A", // Orange
        type: 'calendar-mock'
    },
    {
        id: 'posts',
        title: "社区动态\n分享，遇见共鸣。",
        desc: "在私有圈子里分享生活点滴。点赞、评论、互动，构建属于你的温馨社交圈。",
        color: "#64D2FF", // Cyan
        type: 'post-mock'
    }
];

function scrollToContent() {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
}
</script>

<template>
  <div class="apple-home">
    <div class="nav-spacer"></div>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="hero-content" ref="heroTextRef">
            <h1 class="hero-title">ZKY</h1>
            <p class="hero-subtitle">您的私有数字生活空间</p>
            <div class="hero-actions">
                <template v-if="authStore.isAuthenticated">
                    <button class="cta-btn primary" @click="router.push('/dashboard')">进入我的空间</button>
                </template>
                <template v-else>
                    <button class="cta-btn primary" @click="router.push('/register')">创建账户</button>
                    <a class="text-link" @click="router.push('/login')">登录 ></a>
                </template>
            </div>
        </div>
        <div class="hero-glow"></div>
        
        <div class="scroll-hint anim-fade" @click="scrollToContent">
            <span class="hint-text">探索功能</span>
            <svg class="hint-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
        </div>
    </section>

    <div class="feature-flow">
        <section 
            v-for="(feat, index) in features" 
            :key="feat.id"
            class="feature-section"
            :class="{ 'align-right': index % 2 !== 0 }"
            ref="sectionsRef"
        >
            <div class="feature-text">
                <h2 class="feature-title anim-text" :style="{ '--glow-color': feat.color }">
                    {{ feat.title }}
                </h2>
                <p class="feature-desc anim-text">{{ feat.desc }}</p>
            </div>
            
            <div class="feature-visual">
                <div class="mockup-container" :class="feat.type">
                    <!-- CSS UI Mocks -->
                    
                    <!-- Memo Mock -->
                    <div v-if="feat.type === 'memo-mock'" class="ui-card memo-ui">
                        <div class="ui-line title-line"></div>
                        <div class="ui-line text-line" style="width: 90%"></div>
                        <div class="ui-line text-line" style="width: 80%"></div>
                        <div class="ui-line text-line" style="width: 85%"></div>
                        <div class="ui-tag">Markdown</div>
                    </div>

                    <!-- Media Mock -->
                    <div v-if="feat.type === 'media-mock'" class="ui-grid media-ui">
                        <div class="photo-item p1"></div>
                        <div class="photo-item p2"></div>
                        <div class="photo-item p3"></div>
                        <div class="photo-item p4"></div>
                        <div class="play-btn">▶</div>
                    </div>

                    <!-- Drive Mock -->
                    <div v-if="feat.type === 'drive-mock'" class="ui-card drive-ui">
                        <div class="folder-row">
                            <div class="folder-icon"></div>
                            <div class="file-info"></div>
                        </div>
                        <div class="folder-row">
                            <div class="folder-icon" style="background: var(--accent-color)"></div>
                            <div class="file-info" style="width: 60%"></div>
                        </div>
                        <div class="progress-bar-ui">
                            <div class="progress-fill-ui"></div>
                        </div>
                    </div>

                    <!-- Chat Mock -->
                    <div v-if="feat.type === 'chat-mock'" class="ui-card chat-ui">
                        <div class="msg-bubble left">Hello! 👋</div>
                        <div class="msg-bubble right">最近怎么样？</div>
                        <div class="msg-bubble left">我在体验 ZKY 云相册...</div>
                    </div>

                    <!-- Calendar Mock -->
                    <div v-if="feat.type === 'calendar-mock'" class="ui-card calendar-ui">
                        <div class="cal-header">OCT 24</div>
                        <div class="cal-grid">
                            <div class="cal-day"></div><div class="cal-day"></div><div class="cal-day dots"></div>
                            <div class="cal-day"></div><div class="cal-day active"></div><div class="cal-day"></div>
                        </div>
                        <div class="event-pill">会议: 产品讨论</div>
                    </div>

                    <!-- Post Mock -->
                    <div v-if="feat.type === 'post-mock'" class="ui-card post-ui">
                        <div class="post-header">
                            <div class="avatar-circle"></div>
                            <div class="name-line"></div>
                        </div>
                        <div class="post-content-box"></div>
                        <div class="post-actions">
                            <div class="action-icon heart"></div>
                            <div class="action-icon comment"></div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    </div>

    <!-- Footer -->
    <section class="footer-cta">
        <div class="footer-content anim-text visible-default">
            <h2>开启您的私有云之旅</h2>
            <button class="cta-btn big" @click="router.push('/register')">免费加入</button>
            <p class="footer-note">© 2026 Zero doubts, Keep loving, You are the one.</p>
        </div>
    </section>
  </div>
</template>

<style scoped>
.apple-home {
    background: #000;
    color: #fff;
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", "Segoe UI", Roboto, sans-serif;
    overflow-x: hidden;
}

.nav-spacer { height: 60px; }

/* Hero */
.hero-section {
    height: 90vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.hero-title {
    font-size: clamp(80px, 15vw, 180px);
    font-weight: 700;
    letter-spacing: -2px;
    color: #fff;
    background: linear-gradient(135deg, #fff 30%, #444 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 20px;
}

.hero-subtitle {
    font-size: clamp(20px, 4vw, 32px);
    color: #a1a1a6;
    margin-bottom: 50px;
    letter-spacing: 1px;
    font-weight: 300;
}

.hero-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    z-index: 10;
}

.hero-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60vw;
    height: 60vw;
    background: radial-gradient(circle, rgba(20, 20, 40, 0.8) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    filter: blur(100px);
}

/* Feature Flow */
.feature-section {
    min-height: 60vh; /* Reduced from 100vh */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 80px 10%; /* Explicit padding */
    gap: 80px;
    margin-bottom: 20px; /* Slight buffer */
}

.feature-section.align-right {
    flex-direction: row-reverse;
}

.feature-text {
    flex: 1;
    z-index: 2;
    padding: 20px;
}

.feature-title {
    font-size: clamp(36px, 5vw, 64px);
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 24px;
    white-space: pre-line; /* Handle \n */
    color: #f5f5f7;
}

.feature-desc {
    font-size: 20px;
    color: #86868b;
    line-height: 1.6;
    max-width: 480px;
}

.anim-text {
    transform: translateY(30px);
    opacity: 0; /* JS handles fade in, fallback handled by .visible-default if needed */
}
.visible-default { opacity: 1; transform: none; }


/* Visual Mockups Area */
.feature-visual {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
}

.mockup-container {
    width: 320px;
    height: 320px;
    position: relative;
    opacity: 0;
    transform: scale(0.9);
}

/* Base UI Card */
.ui-card {
    background: rgba(28, 28, 30, 0.6);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    padding: 24px;
    width: 100%;
    height: 100%;
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    display: flex;
    flex-direction: column;
}

/* --- Specific Mocks --- */

/* Memo */
.memo-ui {
    background: linear-gradient(145deg, rgba(25,25,25,0.8), rgba(20,20,20,0.8));
}
.ui-line {
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
    margin-bottom: 16px;
}
.title-line { height: 24px; width: 60%; margin-bottom: 32px; background: rgba(255,255,255,0.2); }
.text-line { height: 12px; }
.ui-tag {
    margin-top: auto;
    align-self: flex-start;
    padding: 6px 12px;
    background: #FF2D55;
    color: white;
    font-size: 12px;
    border-radius: 100px;
    font-weight: 600;
}

/* Media */
.media-ui {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 12px;
    position: relative;
}
.photo-item {
    background: rgba(255,255,255,0.1);
    border-radius: 16px;
    transition: transform 0.3s;
}
.photo-item:hover { transform: scale(1.02); background: rgba(255,255,255,0.15); }
.p1 { grid-row: span 2; background: linear-gradient(to bottom right, #5E5CE6, #333); }
.play-btn {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 48px; height: 48px;
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(10px);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
}

/* Drive */
.drive-ui { justify-content: center; gap: 20px; }
.folder-row {
    display: flex; align-items: center; gap: 16px;
    padding: 16px; background: rgba(255,255,255,0.05);
    border-radius: 16px;
}
.folder-icon { width: 40px; height: 40px; background: #007AFF; border-radius: 8px; }
.file-info { height: 10px; width: 40%; background: rgba(255,255,255,0.2); border-radius: 4px; }
.progress-bar-ui {
    height: 6px; background: rgba(255,255,255,0.1); border-radius: 10px; margin-top: 10px; overflow: hidden;
}
.progress-fill-ui {
    height: 100%; width: 60%; background: #007AFF;
}

/* Chat */
.chat-ui { justify-content: center; gap: 16px; }
.msg-bubble {
    padding: 12px 18px;
    border-radius: 20px;
    font-size: 14px;
    max-width: 80%;
    line-height: 1.4;
}
.left {
    background: rgba(255,255,255,0.1);
    align-self: flex-start;
    border-bottom-left-radius: 4px;
}
.right {
    background: #30D158;
    color: #000;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
    font-weight: 500;
}

/* Calendar */
.calendar-ui { align-items: center; }
.cal-header { font-size: 24px; font-weight: 700; margin-bottom: 24px; color: #FF9F0A; }
.cal-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
.cal-day {
    width: 40px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 50%;
}
.cal-day.active { background: #FF9F0A; box-shadow: 0 0 10px rgba(255,159,10,0.4); }
.event-pill {
    background: rgba(255,159,10,0.2); color: #FF9F0A; padding: 10px 20px; border-radius: 12px; font-size: 14px; width: 100%; text-align: center;
}

/* Post */
.post-ui { gap: 16px; }
.post-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.avatar-circle { width: 36px; height: 36px; background: #64D2FF; border-radius: 50%; }
.name-line { width: 100px; height: 10px; background: rgba(255,255,255,0.3); border-radius: 4px; }
.post-content-box { flex: 1; background: rgba(255,255,255,0.05); border-radius: 12px; }
.post-actions { display: flex; gap: 12px; }
.action-icon { width: 20px; height: 20px; background: rgba(255,255,255,0.2); border-radius: 50%; }


/* Scroll */
.scroll-hint {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #86868b;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.3s;
    animation: bounce 2s infinite;
}
.scroll-hint:hover { opacity: 1; color: #fff; }
.hint-text { font-size: 14px; margin-bottom: 8px; }
@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {transform: translateX(-50%) translateY(0);}
    40% {transform: translateX(-50%) translateY(-10px);}
    60% {transform: translateX(-50%) translateY(-5px);}
}

/* Buttons */
.cta-btn {
    padding: 14px 32px;
    border-radius: 980px;
    font-size: 17px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}
.cta-btn.primary {
    background: #fff;
    color: #000;
}
.cta-btn.primary:hover {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}
.cta-btn.big {
    padding: 18px 48px;
    font-size: 20px;
    background: #007AFF;
    color: white;
}
.text-link {
    color: #a1a1a6;
    margin-top: 10px;
    font-size: 15px;
    text-decoration: none;
    cursor: pointer;
} 
.text-link:hover { color: #fff; text-decoration: underline; }

/* Footer */
.footer-cta {
    height: 60vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to top, #111, #000);
    text-align: center;
}
.footer-note { margin-top: 30px; color: #444; font-size: 12px; }

/* Responsive */
@media (max-width: 900px) {
    .feature-section {
        flex-direction: column !important;
        text-align: center;
        gap: 40px;
        margin-bottom: 10vh;
        padding-top: 60px;
        min-height: auto;
    }
    
    .feature-visual { height: 300px; }
    .mockup-container { width: 280px; height: 280px; }
    
    .hero-title { font-size: 60px; }
    .hero-subtitle { font-size: 18px; }
}
</style>
