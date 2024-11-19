export default defineNuxtConfig({
  extends: ["@nuxt/ui-pro"],

  alias: {
    "#openapi-services": "./app/client/services.gen.ts",
    "#openapi-types": "./app/client/types.gen.ts",
  },

  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "nuxt-open-fetch",
    "@pinia/nuxt",
    "nuxt-oidc-auth-flou",
  ],

  ui: {
    safelistColors: ["primary", "red", "orange", "green"],
  },

  colorMode: {
    disableTransition: true,
  },

  ssr: true,

  oidc: {
    defaultProvider: "keycloak",

    // TODO: figure out how to read this from the env
    providers: {
      keycloak: {
        clientId: "frontend",
        clientSecret: "A4ALzb6rlwhHaHj8AzXPfq6SaptLABH5",
        baseUrl: "https://auth.coflnet.com/realms/pr-env",
        logoutRedirectUri: "https://tmpenv.app",
        exposeAccessToken: true,
        redirectUri: "https://tmpenv.app/auth/keycloak/callback",
      },
    },
    middleware: {
      globalMiddlewareEnabled: true,
      customLoginPage: false,
    },
  },

  pinia: {
    storesDirs: ["./stores/**", "./app/stores/**"],
  },

  routeRules: {
    // Temporary workaround for prerender regression. see https://github.com/nuxt/nuxt/issues/27490
    "/": {
      prerender: false,
    },
  },

  devtools: {
    enabled: true,
  },

  typescript: {
    strict: false,
  },

  future: {
    compatibilityVersion: 4,
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },

  compatibilityDate: "2024-07-11",
});
