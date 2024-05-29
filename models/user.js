import mongoose, { Schema, model, models } from 'mongoose'

const UserSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    email: {
        type: String,
        unique: [true, 'Email already exists!'],
        required: [true, 'Email is required!'],
    },
    username: {
        type: String,
        required: [true, 'Username is required!'],
    },
    image: {
        type: String
    }
})

const User = models?.User || model("User", UserSchema)

export default User