export default defineNuxtPlugin({
  enforce: "pre", // clients will be ready to use by other plugins, Pinia stores etc.
  setup() {
    const clients = useRuntimeConfig().public.openFetch;
    const localFetch = useRequestFetch();

    return {
      provide: Object.entries(clients).reduce((acc, [name, options]) => ({
        ...acc,
        [name]: createOpenFetch(options, localFetch),
        onRequest(ctx) {
          console.log(`custom log: ${ctx.request}`);
        },
      })),
    };
  },
});
