const notifyButton = document.getElementById('notify-btn');
const callButton = document.getElementById('call-btn');
let countdownInterval;

// 通知车主挪车功能
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
            timer: 2000,
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
            uids: ["UID_AIQ8tkck5ulReU0umP6rNfOJ10lw"]
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
                timer: 2000,
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
                timer: 2000,
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

// 启动倒计时
function startCountdown(seconds) {
    const cooldownEndTime = Date.now() + seconds * 1000;
    localStorage.setItem('cooldownEndTime', cooldownEndTime); // 保存冷却结束时间

    updateButtonState(cooldownEndTime);
    countdownInterval = setInterval(() => {
        updateButtonState(cooldownEndTime);
    }, 1000);
}

// 更新按钮状态
function updateButtonState(cooldownEndTime) {
    const remainingTime = Math.ceil((cooldownEndTime - Date.now()) / 1000);

    if (remainingTime > 0) {
        notifyButton.disabled = true;
        notifyButton.textContent = `请稍候 ${remainingTime} 秒`;
    } else {
        clearInterval(countdownInterval);
        notifyButton.disabled = false;
        notifyButton.textContent = '通知车主挪车';
        localStorage.removeItem('cooldownEndTime');
    }
}

// 拨打车主电话功能
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
    callButton.addEventListener('click', callOwner);
};
