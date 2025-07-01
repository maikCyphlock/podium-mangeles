import { auth } from '@clerk/nextjs/server'
import { UserProfile } from '@clerk/nextjs'
export default async function Page() {
  const { userId, redirectToSignIn } = await auth()

  if (!userId) return redirectToSignIn()

  return <h1>Hello, {userId} <UserProfile/> </h1>
}