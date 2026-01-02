import { NextResponse, type NextRequest } from "next/server"
import { getServerUser } from "./server"

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  // Get token from cookie
  const token = request.cookies.get("api_token")?.value

  // Only protect /auth-cp routes (admin panel)
  if (request.nextUrl.pathname.startsWith("/auth-cp")) {
    const publicAdminPaths = ["/auth-cp/login", "/auth-cp/setup"]
    const isPublicPath = publicAdminPaths.includes(request.nextUrl.pathname)

    if (!token && !isPublicPath) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth-cp/login"
      return NextResponse.redirect(url)
    } else if (token && !isPublicPath) {
      // Verify user and check if admin
      try {
        // Note: Admin check would need to be implemented based on your API
        // For now, we'll just check if user exists
        // You may need to add an admin endpoint or check user role
        const user = await getServerUser()
        if (!user) {
          const url = request.nextUrl.clone()
          url.pathname = "/auth-cp/login"
          return NextResponse.redirect(url)
        }
        // TODO: Add admin role check when API supports it
        // if (user.role_code !== 'ADMIN') {
        //   return NextResponse.redirect(new URL('/auth-cp/login', request.url))
        // }
      } catch {
        const url = request.nextUrl.clone()
        url.pathname = "/auth-cp/login"
        return NextResponse.redirect(url)
      }
    }
  }

  return response
}

