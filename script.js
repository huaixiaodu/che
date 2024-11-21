let lastNotifyTime = 0;  // 上次通知时间（时间戳）
let countdownTimer;      // 倒计时定时器变量
let countdown = 0;       // Countdown time

// Initialize the countdown state on page load
window.onload = function () {
    // Retrieve the stored countdown state from localStorage
    const savedState = localStorage.getItem('countdownState');
    
    if (savedState) {
        const parsedState = JSON.parse(savedState);
        countdown = parsedState.countdown;
        
        // If countdown is greater than 0, set the button state and start the countdown
        if (countdown > 0) {
            const notifyButton = document.querySelector(".notify-btn");
            notifyButton.disabled = true;
            startCountdown(countdown);
        }
    }
}

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
    
    countdown = 60;  // Set countdown to 60 seconds
    startCountdown(countdown);
    
    // Store countdown state in localStorage
    localStorage.setItem('countdownState', JSON.stringify({ countdown: countdown }));

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
                timer: 5000,
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

function startCountdown(initialCountdown) {
    const notifyButton = document.querySelector(".notify-btn");
    
    // Start the countdown timer
    countdownTimer = setInterval(() => {
        initialCountdown--;
        notifyButton.textContent = `重新发送（${initialCountdown}秒）`;
        
        // Update countdown state in localStorage
        localStorage.setItem('countdownState', JSON.stringify({ countdown: initialCountdown }));

        // If countdown reaches 0, reset the button
        if (initialCountdown <= 0) {
            clearInterval(countdownTimer);
            notifyButton.disabled = false; // Enable the button
            notifyButton.textContent = "通知车主挪车"; // Reset the button text
            
            // Clear the stored state
            localStorage.removeItem('countdownState');
        }
    }, 1000);  // Update every second
}

function callOwner() {
    window.location.href = "tel:17896021990";
}
