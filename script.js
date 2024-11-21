let lastNotifyTime = 0;  // 上次通知时间（时间戳）
let countdownTimer;      // 倒计时定时器变量

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

    // Disable the button and start the countdown
    const notifyButton = document.querySelector(".notify-btn");
    notifyButton.disabled = true;
    notifyButton.textContent = "重新发送（60秒）";

    let countdown = 60;  // Countdown in seconds

    // Start the countdown timer
    countdownTimer = setInterval(() => {
        countdown--;
        notifyButton.textContent = `重新发送（${countdown}秒）`;
        
        // If countdown reaches 0, reset the button
        if (countdown <= 0) {
            clearInterval(countdownTimer);
            notifyButton.disabled = false; // Enable the button
            notifyButton.textContent = "通知车主挪车"; // Reset the button text
        }
    }, 1000);  // Update every second

    // Send the notification via fetch
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
                timer: 2000,
                showConfirmButton: false
            });
            lastNotifyTime = currentTime;  // 更新最后发送时间
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
            timer: 2000,
            showConfirmButton: false
        });
    });
}

function callOwner() {
    window.location.href = "tel:17896021990";
}
