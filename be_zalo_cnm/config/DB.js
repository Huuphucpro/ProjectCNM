import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

// Lấy URL từ .env và xóa tham số appName nếu có
const url = process.env.URL_DB?.replace('&appName=Cluster0', '');
// Tắt log URL
// console.log("MongoDB Connection URL:", url?.substring(0, 60) + "..."); 

// Tùy chọn cho mongoose v5.x
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    poolSize: 10,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 30000,
    // Thêm tùy chọn để tắt cảnh báo về URL không hợp lệ
    autoIndex: true,
    autoCreate: true,
    // Tắt cảnh báo về URL không hợp lệ
    deprecationErrors: false
}

// Tắt debug mode
mongoose.set('debug', false);

// Tắt cảnh báo về URL không hợp lệ
process.emitWarning = function() {};

export default async function ConnectToDB(){
    try {
        // console.time('MongoDB Connection Time');
        await mongoose.connect(url, options);
        // console.timeEnd('MongoDB Connection Time');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}