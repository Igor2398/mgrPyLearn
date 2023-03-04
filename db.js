const mongoose = require('mongoose');

module.exports = async() => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    try {
        console.log("Connecting to MongoDB...")
        await mongoose.connect(process.env.DB, connectionParams)
        .then(()=> {
            console.log("Connected with MongoDB")
        });
    } catch (error) {
        console.log(error);
        console.log('Could not connect to database');
    }
}