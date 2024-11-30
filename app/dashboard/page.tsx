import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to dashboard for now
  redirect('/dashboard')
  
  // Later we can build a landing page here instead of redirecting
  return null
}