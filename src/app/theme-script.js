// 这个脚本用于处理主题的持久化
export function initTheme() {
    // 检查本地存储中是否有主题设置
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.dataset.theme = savedTheme;

    // 设置切换按钮的初始状态
    const themeController = document.querySelector('.theme-controller');
    if (themeController) {
        themeController.checked = savedTheme === 'dark';
    }

    // 监听主题切换按钮的变化
    window.addEventListener('theme-change', (e) => {
        const newTheme = e.detail.theme;
        localStorage.setItem('theme', newTheme);
    });
} 