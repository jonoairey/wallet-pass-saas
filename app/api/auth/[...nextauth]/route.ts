import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { DefaultSession, User as NextAuthUser } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcrypt"
import { Role, User } from "@prisma/client"

interface CustomUser extends NextAuthUser {
  role?: Role;
  id: string;
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });

          if (!user || !user.password) {
            throw new Error('User not found');
          }

          const isValidPassword = await compare(credentials.password, user.password);

          if (!isValidPassword) {
            throw new Error('Invalid password');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          } as CustomUser;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as CustomUser).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: '/auth/error',
  },
  session: {
    strategy: "jwt"
  },
  debug: process.env.NODE_ENV === 'development',
})

export { handler as GET, handler as POST }