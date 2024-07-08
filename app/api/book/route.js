import connectToDB from "@/utils/database";
import Book from "@/models/book";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export const GET = async (req, res) => {
    try {
        await connectToDB();

        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        console.log("Session:", session);

        let userId;

        if (session.user.id) {
            // If the id is already in the session, use it
            userId = session.user.id;
        } else if (session.user.email) {
            // If we have an email, find the user by email
            const user = await User.findOne({ email: session.user.email });
            if (!user) {
                return new Response("User not found", { status: 404 });
            }
            userId = user._id.toString();
        } else {
            return new Response("Invalid session data", { status: 400 });
        }

        console.log("User ID:", userId);

        const books = await Book.find({ userId }).populate('userId');

        // console.log("Books:", JSON.stringify(books));

        return new Response(JSON.stringify(books), { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}