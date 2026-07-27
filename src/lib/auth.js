import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db("legal-ease-db");

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        // Optional: if you don't provide a client, database transactions won't be enabled.
        client
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    user: {
        additionalFields: {
            requestedRole: {
                type: "string",
                required: false,
                defaultValue: "user",
                input: true
            }
        }
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    const chosenRole = user.requestedRole === "lawyer" ? "lawyer" : "user";

                    return {
                        data: {
                            ...user,
                            role: chosenRole, 
                        },
                    };
                },
            },
        },
    },
    plugins: [
        admin({
            defaultRole: 'user'
        })
    ]
});