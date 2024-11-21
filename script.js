let lastNotifyTime = 0;  // Last notification time (timestamp)
let countdownTimer;      // Countdown timer variable
let notificationHistory = []; // History of notifications

function notifyOwner() {
    const currentTime = Date.now();

    // Check if the last notification was sent within the last minute
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

            // Show the message input after the countdown
            document.querySelector(".message-container").style.display = "block";
        }
    }, 1000);  // Update every second

    // Send the notification via fetch
    fetch("https://wxpusher.zjiecode.com/api/send/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            appToken: "AT_8FQFDxpI2qvtDTrQG7jUCj6aTHOjgi2W", // Your API token
            content: "您好，有人需要您挪车，请及时处理。",
            contentType: 1, // Type of content (text in this case)
            uids: ["UID_AIQ8tkck5ulReU0umP6rNfOJ10lw", "UID_AIQ8tkck5ulReU0umP6rNfOJ10lw1"] // The user IDs to notify
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
            lastNotifyTime = currentTime;  // Update last sent time

            // Record the notification in history
            notificationHistory.push({
                time: new Date(),
                status: '成功',
            });
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

            notificationHistory.push({
                time: new Date(),
                status: '失败',
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

        notificationHistory.push({
            time: new Date(),
            status: '失败',
        });
    });
}

function callOwner() {
    window.location.href = "tel:17896021990";
}

function submitMessage() {
    const phoneNumber = document.getElementById("messageInput").value;

    // Validate phone number length
    if (phoneNumber.length !== 11 || isNaN(phoneNumber)) {
        Swal.fire({
            icon: 'error',
            title: '电话号码无效',
            text: '请输入11位有效的电话号码。',
            position: 'top',
            toast: true,
            timer: 2000,
            showConfirmButton: false
        });
        return;
    }

    // Create the message content, which includes the phone number
    const messageContent = `您好，以下是车主的电话号码：${phoneNumber}。请及时联系车主。`;

    // Use fetch to send the message
    fetch("https://wxpusher.zjiecode.com/api/send/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            appToken: "AT_8FQFDxpI2qvtDTrQG7jUCj6aTHOjgi2W", // Your API token
            content: messageContent, // The content of the message including the phone number
            contentType: 1, // Type of content (text in this case)
            uids: ["UID_AIQ8tkck5ulReU0umP6rNfOJ10lw", "UID_AIQ8tkck5ulReU0umP6rNfOJ10lw1"] // The user IDs to notify
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 1000) {
            Swal.fire({
                icon: 'success',
                title: '留言已提交！',
                text: '车主会尽快联系您。',
                position: 'top',
                toast: true,
                timer: 2000,
                showConfirmButton: false
            });

            // Hide the message input container after successful submission
            document.querySelector(".message-container").style.display = "none";
            
            // Optionally, you can store the message in history
            notificationHistory.push({
                time: new Date(),
                status: '留言已提交',
                message: messageContent
            });

            // Reset the input field
            document.getElementById("messageInput").value = "";
        } else {
            Swal.fire({
                icon: 'error',
                title: '留言发送失败',
                text: '请稍后重试。',
                position: 'top',
                toast: true,
                timer: 2000,
                showConfirmButton: false
            });
        }
    })
    .catch(error => {
        console.error("Error sending message:", error);
        Swal.fire({
            icon: 'error',
            title: '网络错误',
            text: '留言发送出错，请检查网络连接。',
            position: 'top',
            toast: true,
            timer: 2000,
            showConfirmButton: false
        });
    });
}
