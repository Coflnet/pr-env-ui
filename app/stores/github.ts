import { defineStore } from "pinia";
import type { components as Components } from "#open-fetch-schemas/previewenvironments";

export const useGithubStore = defineStore(
  "github",
  () => {
    const repositories = ref<
      Components["schemas"]["server.githubRepositoryModel"][]
    >([]);

    const toast = useToast();

    async function loadRepositoriesOfUser() {
      const { user } = useOidcAuth();

      const { data } = await usePreviewenvironments(
        "/github/repositories",
        {
          headers: {
            authentication: user.value.accessToken,
          },
          onResponse(response: Response) {
            console.log({ response });
            if (!response.status) {
              toast.add({
                title: "Error",
                description: "Failed to fetch repositories",
                color: "red",
              });
            }
          },
        },
      );

      repositories.value = data.value;
    }

    return {
      repositories,
      loadRepositoriesOfUser,
    };
  },
);
