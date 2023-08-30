import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';

import { connectToDB } from "@database";
import User from '@models/users';


const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    async session({ session }) {
        // store the user id from MongoDB to session
        const sessionUser = await User.findOne({ email: session.user.email });
        session.user.id = sessionUser._id.toString();

        return session;

    },
    async signIn({ profile }) {
        try {
            await connectToDB()

            // check if user already exists
            const userExists = await User.findOne({ email: profile.email });

            // if not, create a new document and save user in MongoDB
            if (!userExists) {
                await User.create({
                    email: profile.email,
                    username: profile.name.replace(" ", "").toLowerCase(),
                    image: profile.picture,
                });
            }

            return true;

        } catch (error) {

            console.log("error when sign in => ", error)
            return false;
        }
    }
})

export { handler as GET, handler as POST }