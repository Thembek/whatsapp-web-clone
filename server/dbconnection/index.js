import mongoose from 'mongoose';

const DB_CONNECTION = process.env.MONGO_URL;

const connectDB = () => {
    console.log("DB trying to connect on " + new Date());

    const options = {
        keepAlive: 1,
        autoReconnect: true,
        poolSize: 10,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    return mongoose.connect(DB_CONNECTION, options);
};

export default connectDB;