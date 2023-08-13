const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/LoginSignup")
.then(() => {
    console.log('Connected to MongoDB')
})
.catch(()=>{
    console.log("failed to connect")
}) 

const LoginSchema = new mongoose.Schema({
    name:{
        type : String,
        required:[true,"Please enter your Name"]
    },
    email:{
        type: String,
        required:[true,"Please enter your Name"]
    },
    password:{
        type: String,
        required:[true,"Please enter your password"]
    }
})

const Inputschema = new mongoose.Schema({

    input:{
        type : String,
        required:[true,"Please enter your values"]

    }

})

const collection = new mongoose.model("Collection-1",LoginSchema)
const collection2 = new mongoose.model("Collection-2",Inputschema)


module.exports = {
    collection,
    collection2
};