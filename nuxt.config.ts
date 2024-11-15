import type Previewenvironments from "~/pages/previewenvironments.vue";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ["@nuxt/ui-pro"],

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
    providers: {
      keycloak: {
        clientId: process.env.NUXT_OIDC_PROVIDERS_KEYCLOAK_CLIENT_ID,
        clientSecret: process.env.NUXT_OIDC_PROVIDERS_KEYCLOAK_CLIENT_SECRET,
        baseUrl: process.env.NUXT_OIDC_PROVIDERS_KEYCLOAK_BASE_URL,
        logoutRedirectUri: process.env.OIDC_PROVIDERS_KEYCLOAK_LOGOUT_URI,
        exposeAccessToken: true,
        redirectUri: process.env.OIDC_PROVIDERS_KEYCLOAK_REDIRECT_URI,
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

  openFetch: {
    clients: {
      Previewenvironments: {
        schema: "https://dash.tmpenv.app/api/openapi/openapi.yaml",
        baseURL: "https://dash.tmpenv.app/api/v1",
      },
    },
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
