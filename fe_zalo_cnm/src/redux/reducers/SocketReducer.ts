import { io } from "socket.io-client";

const ENDPOINT: string = "http://localhost:4000";
let socket: any = null;

// Tạo socket nhưng không kết nối ngay lập tức
export const createSocket = () => {
    if (socket === null) {
        // Tắt console.log của browser
        const originalConsoleLog = console.log;
        const noop = () => {};
        
        // Tạm thời tắt log khi khởi tạo socket
        console.log = noop;
        
        // Khởi tạo socket nhưng chưa kết nối
        socket = io(ENDPOINT, {
            autoConnect: false, // Không tự động kết nối
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            transports: ['websocket', 'polling'] // Thử websocket trước, fallback to polling
        });
        
        // Khôi phục console.log
        console.log = originalConsoleLog;
        
        // Bỏ các listeners debug
        /* 
        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });
        
        socket.on('connect_error', (err: any) => {
            console.error('Socket connection error:', err);
        });
        
        socket.on('disconnect', (reason: string) => {
            console.log('Socket disconnected:', reason);
        });
        */
    }
    
    return socket;
};

// Kết nối socket khi đã có dữ liệu người dùng và thực hiện callback sau khi kết nối
export const connectSocket = (user: any, callback?: () => void) => {
    if (!socket) {
        createSocket();
    }
    
    if (socket && !socket.connected) {
        // console.log('Connecting socket with user:', user?.name || 'Unknown', user?._id || 'No ID');
        
        // Nếu chưa có event listener cho connect, thêm vào
        const connectListener = () => {
            // console.log('Socket connected in connectSocket:', socket.id);
            if (callback) callback();
        };
        
        // Xóa listener cũ nếu có để tránh duplicate
        socket.off('connect', connectListener);
        // Thêm listener mới
        socket.on('connect', connectListener);
        
        // Kết nối
        socket.connect();
    } else if (socket && socket.connected && callback) {
        // Nếu đã kết nối rồi, gọi callback ngay
        // console.log('Socket already connected:', socket.id);
        callback();
    }
    
    return socket;
};

// Ngắt kết nối socket
export const disconnectSocket = () => {
    if (socket && socket.connected) {
        // console.log('Disconnecting socket');
        socket.disconnect();
    }
    return socket;
};

// Kiểm tra trạng thái kết nối
export const isSocketConnected = () => {
    return socket && socket.connected;
};