async function testRaceCondition() {
    const orderUuid = 'test-order-uuid-12345';
    console.log(`[Test] Bắn đồng thời 2 request tạo task cho đơn hàng: ${orderUuid}`);

    // Sử dụng 127.0.0.1 thay cho localhost để tránh xung đột IPv6 trên Node 22
    const url = 'http://127.0.0.1:3000/api/tasks/trigger';

    const requests = [
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderUuid })
        }),
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderUuid })
        })
    ];

    try {
        const responses = await Promise.all(requests);

        for (let i = 0; i < responses.length; i++) {
            const status = responses[i].status;
            console.log(`Request ${i + 1}: HTTP Status ${status}`);
        }
    } catch (error) {
        console.error("Lỗi khi gọi API. Chi tiết lỗi:", error.cause?.message || error.message);
    }
}

testRaceCondition();