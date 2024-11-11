import { defineStore } from "pinia";
import type { PreviewEnvironment } from "../types/index.d.ts";

export const usePreviewEnvironmentStore = defineStore(
  "previewEnvironment",
  () => {
    const envs = ref<PreviewEnvironment[]>([]);

    async function refreshEnvs() {
      const { user } = useOidcAuth();
      console.log(`refresh with token ${user.value.accessToken}`);
      console.log(`refresh for user:`);
      console.log({ user });

      const { data } = await usePreviewenvironments(
        "/environment/list",
        {
          headers: {
            authentication: user.value.accessToken,
          },
        },
      );

      envs.value = data.value as PreviewEnvironment[];
    }

    async function createEnv(env: PreviewEnvironment) {
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
