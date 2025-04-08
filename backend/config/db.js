const mongoose  = require('mongoose')
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('MongoDB connect sucessfully')
    } catch (err) {
        console.log('MOngoDB fail connection',err)
        process.exit(1);

    }

}

module.exports=connectDB