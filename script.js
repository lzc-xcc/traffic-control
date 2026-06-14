/**
 * 郑州地铁8号线课程报告网站
 * 交互脚本
 */

// 移动端菜单切换
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// 点击导航链接后关闭移动端菜单
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                const navLinksContainer = document.getElementById('navLinks');
                navLinksContainer.classList.remove('active');
            }
        });
    });

    // 可展开卡片功能
    const expandableCards = document.querySelectorAll('.expandable-card');
    expandableCards.forEach(card => {
        card.addEventListener('click', function() {
            // 关闭其他已展开的卡片
            expandableCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('expanded');
                }
            });
            // 切换当前卡片状态
            card.classList.toggle('expanded');
        });
    });
});

// 滚动动画 - 当元素进入视口时添加动画类
function initScrollAnimations() {
    const scrollElements = document.querySelectorAll('.scroll-animate');
    
    const elementInView = (el, offset = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        return elementTop <= (window.innerHeight || document.documentElement.clientHeight) - offset;
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 100)) {
                displayScrollElement(el);
            }
        });
    };
    
    // 初始检查
    handleScrollAnimation();
    
    // 滚动时检查
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    
    // 添加导航栏滚动效果
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
        } else {
            navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.08)';
        }
        
        lastScroll = currentScroll;
    });
});

// 平滑滚动到锚点
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// 站点数据（供其他页面引用）
window.metro8Data = {
    stations: [
        { id: 1, name: '天健湖', transfer: null, type: '起点站' },
        { id: 2, name: '轻工业大学', transfer: null, type: '中间站' },
        { id: 3, name: '祥营', transfer: null, type: '中间站' },
        { id: 4, name: '郑州大学', transfer: ['1号线'], type: '换乘站' },
        { id: 5, name: '银屏路', transfer: null, type: '中间站' },
        { id: 6, name: '冬青街', transfer: null, type: '中间站' },
        { id: 7, name: '南流', transfer: null, type: '中间站' },
        { id: 8, name: '大学科技园', transfer: null, type: '中间站' },
        { id: 9, name: '五龙口', transfer: null, type: '中间站' },
        { id: 10, name: '同乐', transfer: ['3号线'], type: '换乘站' },
        { id: 11, name: '省中医院', transfer: null, type: '中间站' },
        { id: 12, name: '白庙', transfer: ['7号线'], type: '换乘站' },
        { id: 13, name: '东风路', transfer: ['2号线'], type: '换乘站' },
        { id: 14, name: '枣庄', transfer: null, type: '中间站' },
        { id: 15, name: '小营', transfer: ['6号线'], type: '换乘站' },
        { id: 16, name: '龙湖中环南', transfer: ['4号线'], type: '换乘站' },
        { id: 17, name: '郑大一附院东区', transfer: null, type: '中间站' },
        { id: 18, name: '高铁公园', transfer: ['12号线'], type: '换乘站' },
        { id: 19, name: '畅和街', transfer: null, type: '中间站' },
        { id: 20, name: '郑州东站', transfer: ['1号线', '5号线'], type: '换乘站' },
        { id: 21, name: '圃田西', transfer: ['3号线'], type: '换乘站' },
        { id: 22, name: '圃田', transfer: null, type: '中间站' },
        { id: 23, name: '省社科院', transfer: null, type: '中间站' },
        { id: 24, name: '福泽路', transfer: null, type: '中间站' },
        { id: 25, name: '李湖桥', transfer: null, type: '中间站' },
        { id: 26, name: '龙王庙', transfer: null, type: '中间站' },
        { id: 27, name: '绿博园', transfer: null, type: '中间站' },
        { id: 28, name: '鲁庙', transfer: null, type: '终点站' }
    ],
    operation: {
        startTime: '06:00',
        endTime: '23:00',
        duration: 17,
        peakInterval: 5,
        offPeakInterval: 10,
        weekendInterval: 7.5,
        weekdayTrips: 163,
        weekendTrips: 145
    },
    transferStations: [
        { name: '郑州大学', lines: ['1号线'] },
        { name: '同乐', lines: ['3号线'] },
        { name: '白庙', lines: ['7号线'] },
        { name: '东风路', lines: ['2号线'] },
        { name: '小营', lines: ['6号线'] },
        { name: '龙湖中环南', lines: ['4号线'] },
        { name: '高铁公园', lines: ['12号线'] },
        { name: '郑州东站', lines: ['1号线', '5号线'] },
        { name: '圃田西', lines: ['3号线'] }
    ]
};
