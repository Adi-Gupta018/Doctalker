import mongoose from  'mongoose';

export const connectDB = async() =>{
    if(mongoose.connections[0].readyState){
        console.log("existing connection available");
        return
    }

    const MONGO_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@demo.antwhfs.mongodb.net/Doctalker?retryWrites=true&w=majority `;

    try {
        await mongoose.connect(MONGO_URL,{
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        console.log("Connected to mongo");
    } catch (error) {
        throw new Error(error);
        
    }
}

export const disconnectDB = async() => {
    if(mongoose.connections[0].readyState){
        await mongoose.disconnect();
        console.log("Disconnected from Mongo");
    }
}
