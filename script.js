let lastNotifyTime = 0;  // 上次通知时间（时间戳）
let countdownTimer;      // 倒计时定时器变量
let countdown = 0;       // Countdown time
let notificationCount = 0; // Track how many notifications have been sent
let lastVisitTime = 0;    // The timestamp of the last visit

// Initialize the notification state on page load
window.onload = function () {
    // Retrieve the stored state from localStorage
    const savedState = localStorage.getItem('notificationState');
    const savedLastVisitTime = localStorage.getItem('lastVisitTime');
    
    // Get the current time
    const currentTime = Date.now();
    
    // If there's a last visit timestamp in localStorage, check if an hour has passed
    if (savedLastVisitTime) {
        lastVisitTime = parseInt(savedLastVisitTime);
        
        // If an hour has passed since the last visit, reset the notification count
        if (currentTime - lastVisitTime >= 60 * 60 * 1000) {
            notificationCount = 0;  // Reset the notification count
            localStorage.setItem('notificationCount', notificationCount);  // Store reset count
        }
    }

    // Store the current time as the last visit time in localStorage
    localStorage.setItem('lastVisitTime', currentTime);

    // Retrieve the stored notification count and countdown state from localStorage
    const savedNotificationCount = localStorage.getItem('notificationCount');
    if (savedNotificationCount) {
        notificationCount = parseInt(savedNotificationCount);
    }

    const savedStateParsed = JSON.parse(savedState || '{}');
    countdown = savedStateParsed.countdown || 0;
    
    // If countdown is greater than 0, set the button state and start the countdown
    if (countdown > 0) {
        const notifyButton = document.querySelector(".notify-btn");
        notifyButton.disabled = true;
        startCountdown(countdown);
    }

    // Listen to visibility change events to resume countdown
    document.addEventListener("visibilitychange", function () {
        if (!document.hidden) {
            // If the page comes back into focus, resume countdown
            if (countdown > 0) {
                startCountdown(countdown);
            }
        }
    });
};

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

    // Disable the button and calculate the countdown for the next notification
    const notifyButton = document.querySelector(".notify-btn");
    notifyButton.disabled = true;
    
    // Calculate delay: First 1 minute, then add 1 minute each time
    countdown = 60 + (notificationCount * 60);  // 1 minute + (notificationCount * 1 minute)

    notificationCount++;  // Increase the notification count
    startCountdown(countdown);

    // Store the new notification count and countdown state in localStorage
    localStorage.setItem('notificationCount', notificationCount);
    localStorage.setItem('notificationState', JSON.stringify({ countdown: countdown, notificationCount: notificationCount }));

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

function startCountdown(initialCountdown) {
    const notifyButton = document.querySelector(".notify-btn");

    // Start the countdown timer
    countdownTimer = setInterval(() => {
        initialCountdown--;
        notifyButton.textContent = `重新发送（${initialCountdown}秒）`;
        
        // Update countdown state in localStorage
        localStorage.setItem('notificationState', JSON.stringify({ countdown: initialCountdown, notificationCount: notificationCount }));

        // If countdown reaches 0, reset the button
        if (initialCountdown <= 0) {
            clearInterval(countdownTimer);
            notifyButton.disabled = false; // Enable the button
            notifyButton.textContent = "通知车主挪车"; // Reset the button text
            
            // Clear the stored state after countdown ends
            localStorage.removeItem('notificationState');
        }
    }, 1000);  // Update every second
}

function callOwner() {
    window.location.href = "tel:17896021990";
}
