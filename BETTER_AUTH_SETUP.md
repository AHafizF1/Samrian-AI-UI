# Better Auth Setup Guide

This document outlines the steps to configure Better Auth for this application, including setting up Google Sign-In and integrating with a custom Morphik Core based backend API for multi-tenant SaaS.

## 1. Environment Variables

You need to set up the following environment variables. Create a `.env.local` file in the root of your project if it doesn't exist and add the following:

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"

# Better Auth Configuration (Update if necessary)
# Example: If your app is hosted at a different URL in production
# BETTER_AUTH_APP_URL="http://localhost:3000" # Default or your production URL

# Your Custom Backend API URL
BACKEND_API_URL="YOUR_MORPHIK_CORE_BACKEND_URL"

# You might need other variables for Better Auth depending on the plugins used.
# Refer to Better Auth documentation for more details.
```

**To get Google OAuth Credentials:**

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project or select an existing one.
3.  Navigate to "APIs & Services" > "Credentials".
4.  Click "Create Credentials" > "OAuth client ID".
5.  Choose "Web application" as the application type.
6.  Give it a name (e.g., "App Web Client").
7.  Under "Authorized JavaScript origins", add your application's URL (e.g., `http://localhost:3000` for development).
8.  Under "Authorized redirect URIs", add your application's callback URL. Based on the current setup in `auth.ts`, this is `http://localhost:3000/api/auth/callback/google`.
9.  Click "Create". Copy the "Client ID" and "Client Secret" into your `.env.local` file.

## 2. Better Auth Configuration (`auth.ts`)

The primary configuration for Better Auth resides in `auth.ts`. We have already configured it to support Google Sign-In via the `genericOAuth` plugin.

Key parts of the configuration:

*   **`genericOAuth` for Google:**
    ```typescript
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
                redirect_uri: "http://localhost:3000/api/auth/callback/google", // Ensure this matches your Google Cloud Console setup
            },
        ],
    })
    ```
*   **`oidcProvider` Login Page:**
    ```typescript
    oidcProvider({
        loginPage: "/login",
    })
    ```
    This ensures users are redirected to our custom login page.

## 3. Integrating with Custom Backend API (Morphik Core)

To integrate Better Auth with your Morphik Core based backend, you'll primarily use Better Auth's token capabilities and potentially custom plugin logic or hooks if deep integration is needed. The goal is to securely pass the authenticated user's identity and permissions to your backend.

### 3.1. Token Strategy

Better Auth issues JWTs (JSON Web Tokens) by default when the `jwt()` plugin is enabled (which it is in the current `auth.ts`). This JWT can be sent to your backend API with each request.

**Frontend (Client-side):**

When making requests to your backend:

1.  Retrieve the session token using `authClient.session.get()`. This token is managed by Better Auth.
2.  Include this token in the `Authorization` header of your requests to the backend, typically as a Bearer token.

```typescript
// Example: Fetching data from your custom backend
async function fetchDataFromMyApi(endpoint: string) {
  try {
    const session = await authClient.session.get();
    if (!session || !session.token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/${endpoint}`, { // Ensure BACKEND_API_URL is available client-side via NEXT_PUBLIC_
      headers: {
        'Authorization': `Bearer ${session.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
```

**Backend (Morphik Core API):**

1.  **Token Validation:** Your Morphik Core backend needs to validate the JWT received from the frontend.
    *   It should verify the token's signature using the public key or secret that Better Auth uses to sign the tokens. You'll need to configure how Better Auth signs tokens (e.g., HS256 with a secret, or RS256 with a key pair) and ensure your backend has the corresponding verification key/secret. This is typically configured within the `jwt()` plugin in `auth.ts`.
    *   Verify other claims like `iss` (issuer), `aud` (audience), and `exp` (expiration time).

2.  **Extracting User and Tenant Information:**
    *   Once validated, the JWT payload will contain user information (e.g., user ID, email).
    *   For multi-tenancy (organizations, apps, folders, user scopes), this information needs to be present in the JWT or fetched based on the user ID.

### 3.2. Customizing JWT Claims for Multi-Tenancy

Better Auth allows customization of JWT claims. You can use the `hooks` within the `jwt()` plugin or other relevant plugins (like `organization()`) to add custom claims to the JWT.

**Example in `auth.ts` (conceptual):**

```typescript
// Inside auth.ts
// ...
jwt({
  // ... other jwt options
  hooks: {
    async beforeTokenSign(payload, { user, organization /* other context */ }) {
      // Assuming 'user' object has organization, apps, folders info
      // or you fetch it here based on user.id
      // This is highly dependent on how your user/org data is structured and accessed

      let customClaims = {};
      if (organization) { // If organization plugin is used and user belongs to one
        customClaims.org_id = organization.id;
        // Potentially fetch and add app_ids, folder_ids relevant to the user within this org
      }
      // Add other user-specific scopes or permissions
      // customClaims.scopes = await fetchUserScopes(user.id);

      return { ...payload, ...customClaims };
    }
  }
}),
// ...
```

**Important Considerations for Morphik Core & Multi-Tenancy:**

*   **Organization Plugin:** The `organization()` plugin in Better Auth is crucial. Ensure it's configured to manage organization memberships. When a user logs in, their active organization context should ideally be part of the session.
*   **Mapping Better Auth Users/Orgs to Morphik Core:**
    *   Your Morphik Core backend will have its own representation of users, organizations, apps, and folders.
    *   You need a strategy to map the Better Auth user ID (and potentially organization ID from the token) to your backend's entities. This might involve:
        *   Using the Better Auth user ID as the primary key in your backend's user table.
        *   Storing the Better Auth user ID as an external ID in your backend.
*   **API Connectors (If needed for User Provisioning/Sync):**
    *   While the primary interaction is via JWT, if you need Better Auth to directly call your backend API for events like user creation, updates, or org changes (user provisioning), you would configure an API connector.
    *   Better Auth doesn't have a dedicated "Morphik Core API Connector." You'd use a generic webhook/API call feature if available within a plugin, or implement custom logic using Better Auth's server-side hooks to call your API.
    *   **This is an advanced use case.** For most scenarios, validating the JWT on your backend and then looking up user/org details within your Morphik Core database using the IDs from the token is sufficient and often simpler.

### 3.3. Backend API Logic for Scopes

Your Morphik Core API endpoints will need to:

1.  Receive the request with the Bearer token.
2.  Validate the token (as described above).
3.  Extract user ID, organization ID, and any other relevant custom claims (app IDs, folder IDs, scopes) from the token payload.
4.  Use these identifiers to query its own database and enforce business logic:
    *   Verify the user belongs to the specified organization.
    *   Verify the user has access to the requested app or folder.
    *   Apply user-specific scopes to filter data or restrict actions.

## 4. Setting up API Routes for Better Auth

Better Auth typically requires API routes to handle various authentication flows (e.g., callbacks, logout, session management). In Next.js, these are often set up as `app/api/auth/[...betterauth]/route.ts`.

Ensure you have this file and it's correctly exporting handlers from your `auth` object:

```typescript
// app/api/auth/[...betterauth]/route.ts
import { auth } from "../../../../auth"; // Adjust path to your auth.ts

export const { GET, POST } = auth;
```
*(Self-correction: The user's initial message implied `npx @better-auth/cli@latest init` was run, which should have set up these routes. This section is a reminder/check).*

## 5. Testing

1.  **Google Sign-In:**
    *   Ensure your environment variables `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correctly set.
    *   Verify the redirect URI in `auth.ts` and your Google Cloud Console OAuth client configuration match.
    *   Attempt to sign in using the Google button on the `/login` page.
    *   Check for successful redirection and session creation.
    *   Inspect the JWT token (e.g., using jwt.io) to see the claims.
2.  **Backend Integration:**
    *   Set up a test endpoint on your Morphik Core backend that requires authentication.
    *   Make a request from the frontend to this endpoint, including the JWT.
    *   Verify that your backend can successfully validate the token and extract the necessary user/tenant information.
    *   Test access control based on the claims (e.g., a user from Org A cannot access data from Org B).

This guide provides a starting point. You may need to adapt configurations and logic based on the specific details of your Morphik Core implementation and the desired depth of integration with Better Auth. Always refer to the official Better Auth documentation for plugin-specific details and advanced configurations.
