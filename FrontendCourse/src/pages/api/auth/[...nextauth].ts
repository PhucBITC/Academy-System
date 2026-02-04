import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from 'next-auth/providers/facebook';
import GitHubProvider from "next-auth/providers/github";


export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID!,
      clientSecret: process.env.FACEBOOK_SECRET!
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    }),

  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account) {
        if (account.provider === "google" && profile && (profile as any).email_verified) {
          return true;
        } else if (account.provider === "facebook") {
          return true;
        } else if (account.provider === "github" && profile) {
          return true;
        }
      }
      return false;
    },


  },
  pages: {
    signIn: '/',
    error: '/',
  }
});
