import { ref, watch } from 'vue';

export type ThemeColor = 'cyber-blue' | 'neon-green' | 'lava-red';

const THEME_STORAGE_KEY = 'zky-theme';

const currentTheme = ref<ThemeColor>(
    (localStorage.getItem(THEME_STORAGE_KEY) as ThemeColor) || 'cyber-blue'
);

export function useTheme() {
    // 应用主题到 DOM
    function applyTheme(theme: ThemeColor) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }

    // 切换主题
    function setTheme(theme: ThemeColor) {
        currentTheme.value = theme;
        applyTheme(theme);
    }

    // 获取主题色 RGB 值
    function getAccentRgb(): string {
        const themeColors: Record<ThemeColor, string> = {
            'cyber-blue': '0, 200, 255',
            'neon-green': '0, 255, 128',
            'lava-red': '255, 60, 60',
        };
        return themeColors[currentTheme.value];
    }

    // 获取主题显示名称
    function getThemeName(): string {
        const names: Record<ThemeColor, string> = {
            'cyber-blue': '赛博蓝',
            'neon-green': '荧光绿',
            'lava-red': '岩浆红',
        };
        return names[currentTheme.value];
    }

    // 初始化时应用保存的主题
    applyTheme(currentTheme.value);

    // 监听主题变化
    watch(currentTheme, (newTheme) => {
        applyTheme(newTheme);
    });

    return {
        currentTheme,
        setTheme,
        getAccentRgb,
        getThemeName,
        themes: ['cyber-blue', 'neon-green', 'lava-red'] as ThemeColor[],
    };
}
