import { auth } from "@/auth";

export default auth((req) => {
  // Auth is checked but anonymous access to chat is allowed.
  // Protected routes check session in their own handlers.
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|fonts|images|_next/data).*)",
  ],
};
