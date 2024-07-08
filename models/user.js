import mongoose, { Schema, model, models } from 'mongoose'

const UserSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    email: {
        type: String,
        unique: false,
    },
    username: {
        type: String,
        required: [true, 'Username is required!'],
        unique: [true, 'Username must be unique!'],
    },
    password: {
        type: String,
    },
    image: {
        type: String
    }
})

const User = models?.User || model("User", UserSchema)

export default User