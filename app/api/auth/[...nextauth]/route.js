import User from "@/models/user";
import connectToDB from "@/utils/database";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // authorization: {
      //     params: {
      //       prompt: "consent",
      //       access_type: "offline",
      //       response_type: "code"
      //     }
      //   }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        console.log(credentials.username)

        await connectToDB();

        const user = await User.findOne({ username: credentials.username });

        if (!user) {
          return null;
        }

        console.log(credentials.password)
        console.log(user)
        console.log(user.password)

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          username: user.username,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async session({ session, token }) {
        // Check if we have a token (which we should for both Google and credentials auth)
        if (token) {
          // For Google auth, we'll have an email
          // For credentials auth, we'll have a username
          const sessionUser = await User.findOne({
            $or: [
              { email: token.email },
              { username: token.username }
            ]
          });
    
          if (sessionUser) {
            session.user = {
              ...session.user,
              id: sessionUser._id.toString(),
              username: sessionUser.username
            };
          }
        }
    
        return session;
      },
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.username = user.username;
        }
        return token;
      },
    async signIn({ profile }) {
      try {
        await connectToDB();

        if (profile) {
          const userExists = await User.findOne({
            email: profile.email,
          });

          if (!userExists) {
            await User.create({
              email: profile.email,
              username: profile.name,
              image: profile.picture,
            });
          }
        }

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
}


const handler = NextAuth(authOptions)

export { handler as GET, handler as POST, authOptions };
