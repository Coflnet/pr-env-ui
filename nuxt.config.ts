export default defineNuxtConfig({
  extends: ["@nuxt/ui-pro"],

  $development: {
    oidc: {
      defaultProvider: "keycloak",
      providers: {
        keycloak: {
          clientId: '',
          clientSecret: '',
          baseUrl: '',
          logoutRedirectUri: "https://tmpenv.app",
          exposeAccessToken: true,
          redirectUri: "http://localhost:3000/auth/keycloak/callback",
        },
      },
      middleware: {
        globalMiddlewareEnabled: true,
        customLoginPage: false,
      },
    },
  },
  $production: {
    oidc: {
      defaultProvider: "keycloak",
      providers: {
        keycloak: {
          clientId: '',
          clientSecret: '',
          baseUrl: '',
          logoutRedirectUri: "https://tmpenv.app",
          exposeAccessToken: true,
          redirectUri: "https://dash.tmpenv.app/auth/keycloak/callback",
        },
      },
      middleware: {
        globalMiddlewareEnabled: true,
        customLoginPage: false,
      },
    },
  },

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
