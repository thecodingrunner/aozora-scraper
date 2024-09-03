import { Schema, model, models } from 'mongoose'

const BookSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: [true, 'Email is required!'],
    },
    author: {
        type: String,
        required: [true, 'Username is required!'],
    },
    link: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    words: {
        type: [String],
    },
    page: {
        type: Number,
        default: 1,
    }
}, {timestamps: true})

const Book = models?.Book || model("Book", BookSchema)

export default Book