import "next-auth"
import { Role } from "@prisma/client"

declare module "next-auth" {
  interface User {
    role?: Role
    id: string
  }

  interface Session {
    user: {
      role?: Role
      id: string
      email?: string | null
      name?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role
    id: string
  }
} 