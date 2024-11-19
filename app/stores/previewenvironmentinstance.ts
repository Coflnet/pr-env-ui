import { defineStore } from "pinia";
import { getEnvironmentInstanceByIdList } from "#openapi-services";
import type { previewEnvironmentInstanceModel } from "#openapi-types";

const baseUrl = "https://dash.tmpenv.app/api/v1";

export const usePreviewEnvironmentInstanceStore = defineStore(
  "previewEnvironmentInstance",
  () => {
    const instances = ref<previewEnvironmentInstanceModel[]>([]);

    async function loadInstances(envId: string) {
      const { user } = useOidcAuth();

      let response = await getEnvironmentInstanceByIdList({
        headers: {
          authentication: `${user.value?.accessToken}`,
        },
        baseUrl,
        path: {
          id: envId,
        }
      })

      if (response.error) {
        console.log("Error fetching instances");
        console.log(response.error);
        return;
      }

      instances.value = response.data;
    }

    return {
      instances,
      loadInstances,
    };
  },
);
