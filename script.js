const notifyButton = document.getElementById('notify-btn');
let countdownInterval;

function notifyOwner() {
    const currentTime = Date.now();
    const cooldownEndTime = localStorage.getItem('cooldownEndTime');

    // 如果冷却未结束，阻止发送
    if (cooldownEndTime && currentTime < cooldownEndTime) {
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

    fetch("https://wxpusher.zjiecode.com/api/send/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            appToken: "AT_8FQFDxpI2qvtDTrQG7jUCj6aTHOjgi2W",
            content: "您好，有人需要您挪车，请及时处理。",
            contentType: 1,
            uids: ["UID_AIQ8tkck5ulReU0umP6rNfOJ10lw", "UID_AIQ8tkck5ulReU0umP6rNfOJ10lw1"]
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 1000) {
            Swal.fire({
                icon: 'success',
                title: '通知已发送！',
                text: '车主已收到您的通知。',
                position: 'top',
                toast: true,
                timer: 4000,
                showConfirmButton: false
            });
            startCountdown(60); // 启动倒计时（60秒）
        } else {
            Swal.fire({
                icon: 'error',
                title: '通知发送失败',
                text: '请稍后重试。',
                position: 'top',
                toast: true,
                timer: 3000,
                showConfirmButton: false
            });
        }
    })
    .catch(error => {
        console.error("Error sending notification:", error);
        Swal.fire({
            icon: 'error',
            title: '网络错误',
            text: '通知发送出错，请检查网络连接。',
            position: 'top',
            toast: true,
            timer: 3000,
            showConfirmButton: false
        });
    });
}

function startCountdown(seconds) {
    const cooldownEndTime = Date.now() + seconds * 1000; // 设置倒计时结束时间
    localStorage.setItem('cooldownEndTime', cooldownEndTime); // 存储到 localStorage

    updateButtonState(cooldownEndTime);
    countdownInterval = setInterval(() => {
        updateButtonState(cooldownEndTime);
    }, 1000);
}

function updateButtonState(cooldownEndTime) {
    const remainingTime = Math.ceil((cooldownEndTime - Date.now()) / 1000);

    if (remainingTime > 0) {
        notifyButton.disabled = true;
        notifyButton.textContent = ` ${remainingTime} 秒`;
    } else {
        clearInterval(countdownInterval);
        notifyButton.disabled = false;
        notifyButton.textContent = '微信通知';
        localStorage.removeItem('cooldownEndTime'); // 倒计时结束后清除
    }
}

function callOwner() {
    window.location.href = "tel:17896021990";
}

// 页面加载时检查是否需要继续倒计时
window.onload = function () {
    const cooldownEndTime = localStorage.getItem('cooldownEndTime');
    if (cooldownEndTime) {
        const remainingTime = Math.ceil((cooldownEndTime - Date.now()) / 1000);
        if (remainingTime > 0) {
            startCountdown(remainingTime);
        }
    }
    // 绑定按钮点击事件
    notifyButton.addEventListener('click', notifyOwner);
};
