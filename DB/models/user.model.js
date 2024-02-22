import { Schema, model, Types } from "mongoose";

const userSchema = new Schema({

    name: {
        type: String,
        required: [true, "name is required"],
        minLength: 2,
        maxLength: 15,
        trim: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email is unique"],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    loggedIn: {
        type: Boolean,
        default: false
    },
    forgetCode: {
        type: String,
    },
    changePasswordAt: {
        type: Date,
    },
    role: {
        type: String,
        default: "User",
        enum: ["User", "Admin"]
    },
    wishList: [{
        type:Types.ObjectId,
        ref:"product"
    }]

}, {
    timestamps: true
})


const userModel = model("user", userSchema)
export default userModel
