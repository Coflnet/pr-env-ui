import { defineStore } from "pinia";
import type { PreviewEnvironment } from "../types/index.d.ts";

export const usePreviewEnvironmentInstanceStore = defineStore(
  "previewEnvironmentInstance",
  () => {
    const instances = ref<PreviewEnvironment[]>([]);

    async function loadInstances(envId: string) {
      const user = useOidcAuth();
      const { data } = await usePreviewenvironments(
        "/environment-instance/{id}/list",
        {
          path: {
            id: envId,
          },
          headers: {
            authentication: user.user.value.accessToken,
          },
        },
      );

      instances.value = data.value as [];
    }

    return {
      instances,
      loadInstances,
    };
  },
);
