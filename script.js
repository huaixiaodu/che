let lastNotifyTime = 0; // 上次通知时间（时间戳）

// Function to save notification to local storage
function saveNotification(message) {
    const timestamp = new Date().toLocaleString();
    const history = JSON.parse(localStorage.getItem('notificationHistory')) || [];
    history.push({ message, time: timestamp });
    localStorage.setItem('notificationHistory', JSON.stringify(history));

    // Display the updated history
    displayNotificationHistory();
}

// Function to display notification history
function displayNotificationHistory() {
    const historyList = document.getElementById("history-list");
    const history = JSON.parse(localStorage.getItem('notificationHistory')) || [];

    historyList.innerHTML = '';  // Clear the history list first
    history.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.time}: ${item.message}`;
        historyList.appendChild(listItem);
    });
}

// Call this function when the page loads to show any previous history
window.onload = displayNotificationHistory;

// Function to toggle visibility of the notification section
function toggleNotificationSection() {
    const section = document.getElementById("notification-section");
    const currentDisplay = section.style.display;

    // Toggle between showing and hiding the section
    if (currentDisplay === "none" || currentDisplay === "") {
        section.style.display = "block";
    } else {
        section.style.display = "none";
    }
}

function notifyOwner() {
    const message = "您好，有人需要您挪车，请及时处理。"; // You can customize the message or get it from an input
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

    fetch("https://wxpusher.zjiecode.com/api/send/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            appToken: "AT_8FQFDxpI2qvtDTrQG7jUCj6aTHOjgi2W",
            content: message,
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
            lastNotifyTime = currentTime;
            saveNotification(message);  // Save this notification to history
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
