import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB= async () => {

    try {
        const connectionInstance = await mongoose.connect(`${process.env.mongodb_uri}/${DB_NAME}`); // use awit while connection because database is another continent

        console.log(`\n "Mongodb data base is connect:", ${connectionInstance.connection.host}`)

        
    } catch (error) {
        console.log("error: ", error);
        process.exit(1); //procces is refrence to node js process of file it use to .exit is use to out from that process same work as throw err
        
    }
    
}

export default connectDB 