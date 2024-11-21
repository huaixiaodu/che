let lastNotifyTime = 0;  // 上次通知时间（时间戳）
let notificationHistory = [];  // 存储通知记录

// 发送通知
function notifyOwner() {
    const currentTime = Date.now();
    const message = document.getElementById("customMessage").value || "您好，有人需要您挪车，请及时处理。";

    // 防止过于频繁发送
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

    // 模拟发送通知的请求
    fetch("https://wxpusher.zjiecode.com/api/send/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            appToken: "AT_8FQFDxpI2qvtDTrQG7jUCj6aTHOjgi2W",
            content: message,
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

            // 保存通知记录
            saveNotification(message);
            lastNotifyTime = currentTime;
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

// 保存通知记录
function saveNotification(message) {
    const currentDate = new Date().toLocaleString();
    notificationHistory.push({ message, time: currentDate });
    updateHistoryUI();  // 更新历史记录显示
}

// 更新历史记录UI
function updateHistoryUI() {
    const historyDiv = document.getElementById("history");
    historyDiv.innerHTML = "";  // 清空历史记录内容
    notificationHistory.forEach(item => {
        const record = document.createElement("p");
        record.textContent = `${item.time}: ${item.message}`;
        historyDiv.appendChild(record);
    });
}

// 切换显示/隐藏历史记录
function toggleHistory() {
    const historyDiv = document.getElementById("history");
    if (historyDiv.style.display === "none") {
        historyDiv.style.display = "block";
    } else {
        historyDiv.style.display = "none";
    }
}

// 拨打车主电话
function callOwner() {
    Swal.fire({
        title: '确认拨打车主电话?',
        text: '您确定要拨打电话给车主吗?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "tel:17896021990";
        }
    });
}
