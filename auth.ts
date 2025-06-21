import {
    jwt,
    openAPI,
    oAuthProxy,
    multiSession,
    organization,
    admin,
    apiKey,
    twoFactor,
    username,
    magicLink,
    emailOTP,
    genericOAuth,
    bearer,
    oidcProvider,
    oneTap,
} from "better-auth/plugins";
import { sso } from "better-auth/plugins/sso";
import { passkey } from "better-auth/plugins/passkey";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";

export const auth = betterAuth({
    appName: "assistant-ui-starter",
    plugins: [
        oneTap(),
        oidcProvider({
            loginPage: "/login", // Updated to the new login page
        }),
        bearer(),
        genericOAuth({
            config: [
                {
                    id: "google",
                    name: "Google",
                    authorization_endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
                    token_endpoint: "https://oauth2.googleapis.com/token",
                    userinfo_endpoint: "https://www.googleapis.com/oauth2/v3/userinfo",
                    scope: "openid email profile",
                    client_id: process.env.GOOGLE_CLIENT_ID!,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                    redirect_uri: "http://localhost:3000/api/auth/callback/google", // Adjust if your callback URL is different
                },
            ],
        }),
        passkey(),
        emailOTP({
            async sendVerificationOTP({ email, otp, type }, request) {
                // Send email with OTP
            },
        }),
        magicLink({
            sendMagicLink({ email, token, url }, request) {
                // Send email with magic link
            },
        }),
        username(),
        twoFactor(),
        apiKey(),
        admin(),
        organization(),
        sso(),
        multiSession(),
        oAuthProxy(),
        openAPI(),
        jwt(),
        nextCookies(),
    ],
});
