import { defineStore } from "pinia";
import { deleteEnvironmentById, getEnvironmentList, postEnvironment } from "#openapi-services";
import type { previewEnvironmentModel } from "#openapi-types";

export const usePreviewEnvironmentStore = defineStore(
  "previewEnvironment",
  () => {
    const envs = ref<previewEnvironmentModel[]>([]);

    const toast = useToast();

    async function refreshEnvs() {
      const { user } = useOidcAuth();

      let response = await getEnvironmentList({
        headers: {
          authentication: `${user.value?.accessToken}`,
        },
        baseUrl: "https://tmpenv.app/api/v1",
      });
      if (response.data) {
        envs.value = response.data;
        return;
      }

      console.log("Error fetching environments");
      console.log(response.error);
    }

    async function createEnv(
      env: previewEnvironmentModel,
    ) {
      const { user } = useOidcAuth();


      try {
        let response = await postEnvironment({
          headers: {
            authentication: `${user.value?.accessToken}`,
          },
          baseUrl: "https://tmpenv.app/api/v1",
          body: env,
        })

        if (response.error.message) {
          toast.add({
            title: "Error",
            description: "Error creating environment",
            color: "red",
          })
        }

        await refreshEnvs();
        toast.add({
          title: "Success",
          description: "Environment created",
          color: "green",
        })
      } catch (error) {
        toast.add({
          title: "Error",
          description: "Error creating environment",
          color: "red",
        })
      }
    }

    async function deleteEnv(env: previewEnvironmentModel) {
      const { user } = useOidcAuth();

      try {

        await deleteEnvironmentById({
          headers: {
            authentication: `${user.value?.accessToken}`,
          },
          baseUrl: "https://tmpenv.app/api/v1",
          path: {
            id: env.id,
          }
        });

        await refreshEnvs();

        toast.add({
          title: "Success",
          description: "Environment deleted",
          color: "green",
        })
      } catch (error) {
        toast.add({
          title: "Error",
          description: "Error deleting environment",
          color: "red",
        })
      }


      console.log("Error deleting environment");
    }


    return {
      envs,
      refreshEnvs,
      createEnv,
      deleteEnv,
    };
  },
);
