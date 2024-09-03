import Book from "@/models/book";
import connectToDB from "@/utils/database";

export const POST = async (req) => {
    const book = await req.json();

    console.log(book)

    try {
        await connectToDB()
        const newBook = new Book({
            userId: book.userId,
            title: book.title,
            author: book.author,
            link: book.link,
            score: book.score,
            words: book.savedWords,
            page: 1,
        })

        await newBook.save();

        return new Response('Successful', { status: 201 })
    } catch (error) {
        return new Response(error, { status: 500 })
    }
}