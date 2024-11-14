import { defineStore } from "pinia";
import type { components as Components } from "#open-fetch-schemas/previewenvironments";

export const usePreviewEnvironmentStore = defineStore(
  "previewEnvironment",
  () => {
    const envs = ref<Components["schemas"]["server.environmentModel"][]>([]);

    async function refreshEnvs() {
      const { user } = useOidcAuth();

      const { data } = await usePreviewenvironments(
        "/environment/list",
        {
          headers: {
            authentication: user.value.accessToken,
          },
        },
      );

      envs.value = data.value;
    }

    async function createEnv(
      env: Components["schemas"]["server.environmentModel"],
    ) {
      const { user } = useOidcAuth();
      await usePreviewenvironments("/environment", {
        method: "POST",
        body: env,
        headers: {
          authentication: user.value.accessToken,
        },
      });
      await refreshEnvs();
    }

    return {
      envs,
      refreshEnvs,
      createEnv,
    };
  },
);
