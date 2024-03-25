import mongoose from "mongoose";
import colors from 'colors';

const connectDB = async() => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL)
        console.log(`mongo is connected ${connect.connection.host}`.bgMagenta)
    } catch (error) {
        console.log(colors.bgRed.white(`error in mongo db: ${error}`))
    }
}

export default connectDB;
