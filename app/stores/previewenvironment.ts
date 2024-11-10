import { defineStore } from "pinia";
import type { PreviewEnvironment } from "../types/index.d.ts";

export const usePreviewEnvironmentStore = defineStore(
  "previewEnvironment",
  () => {
    const envs = ref<PreviewEnvironment[]>([]);

    async function refreshEnvs() {
      const user = useOidcAuth();
      console.log({ v: user.user.value });
      console.log({ a: user.user.value.accessToken });
      const { data } = await usePreviewenvironments(
        "/environment/list",
        {
          headers: {
            "authentication": user.user.value.accessToken,
          },
        },
      );
      envs.value = data.value as PreviewEnvironment[];
    }

    async function createEnv(env: PreviewEnvironment) {
      const user = useOidcAuth();
      await usePreviewenvironments("/environment", {
        method: "POST",
        body: env,
        headers: {
          "authentication": user.user.value.accessToken,
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
