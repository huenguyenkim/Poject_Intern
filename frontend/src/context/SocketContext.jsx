import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { token, user } = useSelector(state => state.auth);

    useEffect(() => {
        // Only connect if user is admin or staff
        if (!token || !user || (user.role !== 'admin' && user.role !== 'staff')) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        // Initialize Socket
        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
            auth: {
                token: token
            }
        });

        newSocket.on('connect', () => {
            console.log('✅ WebSocket Connected');
        });

        newSocket.on('connect_error', (err) => {
            console.error('❌ WebSocket Connection Error:', err.message);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [token, user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
