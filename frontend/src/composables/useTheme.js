"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTheme = useTheme;
var vue_1 = require("vue");
var THEME_STORAGE_KEY = 'zky-theme';
var currentTheme = (0, vue_1.ref)(localStorage.getItem(THEME_STORAGE_KEY) || 'cyber-blue');
function useTheme() {
    // 应用主题到 DOM
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
    // 切换主题
    function setTheme(theme) {
        currentTheme.value = theme;
        applyTheme(theme);
    }
    // 获取主题色 RGB 值
    function getAccentRgb() {
        var themeColors = {
            'cyber-blue': '0, 200, 255',
            'neon-green': '0, 255, 128',
            'lava-red': '255, 60, 60',
        };
        return themeColors[currentTheme.value];
    }
    // 获取主题显示名称
    function getThemeName() {
        var names = {
            'cyber-blue': '赛博蓝',
            'neon-green': '荧光绿',
            'lava-red': '岩浆红',
        };
        return names[currentTheme.value];
    }
    // 初始化时应用保存的主题
    applyTheme(currentTheme.value);
    // 监听主题变化
    (0, vue_1.watch)(currentTheme, function (newTheme) {
        applyTheme(newTheme);
    });
    return {
        currentTheme: currentTheme,
        setTheme: setTheme,
        getAccentRgb: getAccentRgb,
        getThemeName: getThemeName,
        themes: ['cyber-blue', 'neon-green', 'lava-red'],
    };
}
