import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID as string,
    //   clientSecret: process.env.GITHUB_SECRET as string,
    // }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' }, // Add email field
        Username: {
          type: 'text',
          label: 'Uživatelské jméno',
          placeholder: 'Uživatelské heslo',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Password',
        },
      },
      async authorize(credentials) {
        // Example authorization logic to assign roles
        if (!credentials || !credentials.email) {
          return null;
        }

        if (['ondralukes06@seznam.cz', 'bauerova@gopat.cz'].includes(credentials.email)) {
          // Add role to user object
          return { id: '1', name: 'ondra', email: credentials.email, role: 'admin' };
        } else {
          return null; // Reject non-admin users
        }
      },
    }),
  ],
  callbacks: {
    // async redirect({ url, baseUrl }) {
    //   // Allows relative callback URLs
    //   if (url.startsWith('/')) return `${baseUrl}${url}`;
    //   // Allows callback URLs on the same origin
    //   else if (new URL(url).origin === baseUrl) return url;
    //   return baseUrl;
    // },
    // session({ session, user }) {
    //     // if ( session.user && user&&['ondralukes06@seznam.cz', 'bauerova@gopat.cz'].includes(user.email) ) {
    //     //  session.user.role = 'admin'

    //     // }
    //     return session
    //   }
  },

};

// async authorize(credentials) {
//     const user = { id: '123', name: 'test', password: 'auth' };

//     if (credentials?.Username === user.name && credentials?.password === user.password) {
//       return user;
//     } else {
//       return null; // Returning null or false rejects the sign-in
//     }
//   },
      // callbacks: {
        //     async signIn({ account, profile }) {
        //       if (account.provider === "google") {
        //         return profile.email_verified && profile.email.endsWith("@zaci.gopat.cz")
        //       }
        //       return true // Do different verification for other providers that don't have `email_verified`
        //     },
        //   }