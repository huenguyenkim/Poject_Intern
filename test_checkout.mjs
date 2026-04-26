import http from 'http';

const testCheckout = async () => {
    try {
        console.log("1. Seeding User Request to Login...");
        const loginData = JSON.stringify({ email: "admin@candy.com", password: "admin123" });
        
        let token = "";
        let userId = null;

        const loginReq = http.request('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': loginData.length
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const parsed = JSON.parse(data);
                if(parsed.accessToken) {
                    token = parsed.accessToken;
                    userId = parsed.user.id;
                    console.log("✅ Login Success! Token:", token.slice(0, 10) + "...");
                    
                    // Proceed to checkout
                    const orderData = JSON.stringify({
                        userId: userId,
                        receiverName: "System Test Bot",
                        phone: "0999999999",
                        address: "Automation Lane, 99999",
                        cartItems: [
                            { productId: 1, quantity: 2 },
                            { productId: 2, quantity: 1 }
                        ]
                    });

                    console.log("2. Sending Checkout Request...");
                    const checkoutReq = http.request('http://localhost:3000/orders', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': orderData.length,
                            'Authorization': 'Bearer ' + token
                        }
                    }, (cRes) => {
                        let cData = '';
                        cRes.on('data', chunk => cData += chunk);
                        cRes.on('end', () => {
                            console.log("✅ Checkout Success! DB Response:");
                            console.log(JSON.stringify(JSON.parse(cData), null, 2));
                        });
                    });
                    checkoutReq.write(orderData);
                    checkoutReq.end();
                } else {
                    console.error("Login Failed:", data);
                }
            });
        });
        
        loginReq.write(loginData);
        loginReq.end();
        
    } catch (error) {
        console.error(error);
    }
};

testCheckout();
