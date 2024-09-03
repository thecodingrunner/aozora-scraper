import connectToDB from "@/utils/database";
import Book from "@/models/book";

export const GET = async (req, { params }) => {
    try {
        await connectToDB();

        const book = await Book.findById(params.id).populate('userId');
        if (!book) return new Response("Book not found", { status: 404 })

        return new Response(JSON.stringify(book), { status: 200 })
    } catch (error) {
        return new Reponse(error, { status: 500 })
    }
}

export const DELETE = async (req, { params }) => {
    try {
        await connectToDB()

        await Book.findByIdAndDelete(params.id);

        return new Response("Book deleted successfully", { status: 200 })
    } catch (error) {
        return new Response("Failed to delete book", { status: 500 })
    }
}


export const PATCH = async (req, { params }) => {

    const { words, page } = await req.json()
    // console.log(words)
    try {
        await connectToDB()

        let existingBook = await Book.findById(params.id)
        // console.log(existingBook)

        if (!existingBook) {
            return new Response('Prompt not found', { status: 404 })
        }

        existingBook.words = words
        existingBook.page = page

        await existingBook.save()

        return new Response(JSON.stringify(existingBook), { status: 200 })
    } catch (error) {
        return new Response("Failed to update book", { status: 500 })
    }
}