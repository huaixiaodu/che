let lastNotifyTime = 0; // 上次通知时间（时间戳）
let countdownTimer; // 倒计时定时器变量
let countdown = 0; // 当前倒计时剩余秒数
let notificationCount = 0; // 已发送通知次数
const RESET_INTERVAL = 60 * 60 * 1000; // 每小时重置发送次数的间隔

// 初始化
window.onload = function () {
    const currentTime = Date.now();
    
    // 从 localStorage 恢复状态
    const savedState = JSON.parse(localStorage.getItem('notificationState') || '{}');
    const savedLastVisitTime = parseInt(localStorage.getItem('lastVisitTime') || 0);
    notificationCount = parseInt(localStorage.getItem('notificationCount') || 0);
    countdown = savedState.countdown || 0;

    // 如果超过 1 小时，重置发送次数
    if (savedLastVisitTime && currentTime - savedLastVisitTime >= RESET_INTERVAL) {
        notificationCount = 0;
        localStorage.setItem('notificationCount', notificationCount);
    }

    // 更新最后访问时间
    localStorage.setItem('lastVisitTime', currentTime);

    // 如果还有倒计时剩余，恢复按钮状态
    if (countdown > 0) {
        startCountdown(countdown);
    }
};

// 通知车主功能
function notifyOwner() {
    const currentTime = Date.now();
    if (currentTime - lastNotifyTime < 60 * 1000) {
        Swal.fire({
            icon: 'warning',
            title: '发送过于频繁',
            text: '请稍后再试！',
            position: 'top',
            toast: true,
            timer: 3000,
            showConfirmButton: false
        });
        return;
    }

    // 禁用按钮并开始倒计时
    const notifyButton = document.querySelector(".notify-btn");
    notifyButton.disabled = true;

    // 计算当前倒计时（初始 60 秒，每次增加 60 秒）
    countdown = 60 + (notificationCount * 60);
    notificationCount++; // 增加发送次数
    localStorage.setItem('notificationCount', notificationCount);

    // 启动倒计时
    startCountdown(countdown);

    // 模拟通知车主
    Swal.fire({
        icon: 'success',
        title: '通知已发送！',
        text: '车主已收到您的通知。',
        position: 'top',
        toast: true,
        timer: 2000,
        showConfirmButton: false
    });

    // 存储状态
    localStorage.setItem(
        'notificationState',
        JSON.stringify({ countdown: countdown })
    );
    lastNotifyTime = currentTime;
    localStorage.setItem('lastVisitTime', currentTime);
}

// 倒计时逻辑
function startCountdown(initialCountdown) {
    const notifyButton = document.querySelector(".notify-btn");

    clearInterval(countdownTimer); // 清除之前的计时器

    countdownTimer = setInterval(() => {
        initialCountdown--;
        countdown = initialCountdown; // 更新全局倒计时
        notifyButton.textContent = `重新发送（${initialCountdown}秒）`;

        // 更新 localStorage 状态
        localStorage.setItem(
            'notificationState',
            JSON.stringify({ countdown: initialCountdown })
        );

        // 倒计时结束，恢复按钮状态
        if (initialCountdown <= 0) {
            clearInterval(countdownTimer);
            notifyButton.disabled = false;
            notifyButton.textContent = "通知车主挪车";
            localStorage.removeItem('notificationState'); // 清除倒计时状态
        }
    }, 1000);
}

// 拨打车主电话
function callOwner() {
    window.location.href = "tel:17896021990";
}
