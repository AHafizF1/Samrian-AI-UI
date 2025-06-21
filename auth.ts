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
            loginPage: "/sign-in",
        }),
        bearer(),
        genericOAuth({
            config: [],
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
