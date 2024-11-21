// 存储消息历史记录到 localStorage 的函数
function saveMessageToHistory(message) {
    const timestamp = new Date().toLocaleString();
    const history = JSON.parse(localStorage.getItem('messageHistory')) || [];
    history.push({ message, time: timestamp });
    localStorage.setItem('messageHistory', JSON.stringify(history));

    // 更新界面显示历史记录
    displayMessageHistory();
}

// 显示消息历史记录
function displayMessageHistory() {
    const historyList = document.getElementById("history-list");
    const history = JSON.parse(localStorage.getItem('messageHistory')) || [];

    historyList.innerHTML = ''; // 清空列表
    history.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.time}: ${item.message}`;
        historyList.appendChild(listItem);
    });
}

// 收纳消息功能
function storeMessage() {
    const message = "您好，有人需要您挪车，请及时处理。"; // 收纳的消息内容

    // 弹窗提示
    Swal.fire({
        icon: 'success',
        title: '消息已收纳！',
        text: '消息已保存到记录中。',
        position: 'top',
        toast: true,
        timer: 2000,
        showConfirmButton: false
    });

    // 保存消息到历史记录
    saveMessageToHistory(message);
}

// 拨打车主电话功能
function callOwner() {
    window.location.href = "tel:17896021990";
}

// 页面加载时显示历史记录
window.onload = displayMessageHistory;
