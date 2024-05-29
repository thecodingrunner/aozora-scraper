import { connectToDB } from "@/utils/database";
import Book from "@/models/book";
import { getSession, useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import User from "@/models/user";

export const GET = async (req) => {
    try {
        await connectToDB();

        const session = await getServerSession();

        const sessionUser = await User.findOne({
            email: session.user.email
        })

        session.user.id = sessionUser._id.toString();

        console.log(session.user.id)

        const userId = session.user.id

        const books = await Book.find({ userId }).populate('userId');

        // _id: session.user.id
        console.log(JSON.stringify(books))

        return new Response(JSON.stringify(books), { status: 200 })
    } catch (error) {
        return new Response(error, { status: 500 })
    }
}