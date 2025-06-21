import { createAuthClient } from "better-auth/react";
import type { auth } from "./\auth.ts";
import {
    inferAdditionalFields,
    multiSessionClient,
    ssoClient,
    organizationClient,
    adminClient,
    apiKeyClient,
    twoFactorClient,
    usernameClient,
    magicLinkClient,
    emailOTPClient,
    passkeyClient,
    genericOAuthClient,
    oidcClient,
    oneTapClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000",
    plugins: [
        inferAdditionalFields<typeof auth>(),
        multiSessionClient(),
        ssoClient(),
        organizationClient(),
        adminClient(),
        apiKeyClient(),
        twoFactorClient(),
        usernameClient(),
        magicLinkClient(),
        emailOTPClient(),
        passkeyClient(),
        genericOAuthClient(),
        oidcClient(),
        oneTapClient({ clientId: "MY_CLIENT_ID" }),
    ],
});
