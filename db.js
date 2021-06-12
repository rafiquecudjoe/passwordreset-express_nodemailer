const mongoose = require('mongoose')



module.exports = async function connection() {
    try {
        await mongoose.connect(process.env.DB_URL, {  useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
            autoIndex: true,
            
        },
            (error) => {
                if (error) return new Error("Failed to connect to database");
                console.log("connected");

            }

        )

        
    } catch (error) {
        console.log(error)
        
    }
}