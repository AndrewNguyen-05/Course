
export const OAuthConfig = {
  google: {
    clientId: "1063674841920-mtlapuiv2d8gc3rgf6b4oi4vlaa31pah.apps.googleusercontent.com",
    redirectUri: "http://localhost:3000/authenticate",
    authUri: "https://accounts.google.com/o/oauth2/auth",

  },
  github: {
    clientId: "Ov23liYKvBAfzCvqcWfE",
    redirectUri: "http://localhost:3000/process-login-github",
    authUri: "https://github.com/login/oauth/authorize",
    scope: "read:user user:email"
  }
};
