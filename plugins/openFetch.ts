export default defineNuxtPlugin({
  enforce: "pre", // clients will be ready to use by other plugins, Pinia stores etc.
  setup() {
    const clients = useRuntimeConfig().public.openFetch;
    const localFetch = useRequestFetch();

    return {
      provide: Object.entries(clients).reduce((acc, [name, options]) => ({
        ...acc,
        [name]: createOpenFetch((localOptions) => ({
          ...options,
          ...localOptions,
          onRequest(ctx) {
            ctx.options.headers = {
              ...ctx.options.headers || {},
              Authorization: `Bearer what`, // Wherever your token comes from
            };
            return localOptions?.onRequest?.(ctx);
          },
        }), localFetch),
      }), {}),
    };
  },
});

