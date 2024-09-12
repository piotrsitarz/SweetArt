export const authConfig = {
  pages: {
    signIn: "/", // Redirect to this page if not authenticated
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnSignInPage = nextUrl.pathname === "/";

      if (isOnDashboard) {
        if (isLoggedIn) return true; // Allow access to the dashboard if logged in
        return false; // Redirect unauthenticated users to the sign-in page
      } else if (isOnSignInPage && isLoggedIn) {
        // If the user is on the sign-in page and already logged in, redirect to the dashboard
        return Response.redirect(new URL("/dashboard/home", nextUrl));
      }

      // For all other routes, allow access
      return true;
    },
  },
  providers: [],
};
