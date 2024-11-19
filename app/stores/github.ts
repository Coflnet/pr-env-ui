import { defineStore } from "pinia";
import { getGithubRepositories } from "#openapi-services";
import type { githubRepositoryModel } from "#openapi-types";

export const useGithubStore = defineStore(
  "github",
  () => {
    const repositories = ref<githubRepositoryModel[]>();

    async function loadRepositoriesOfUser() {

      const { user } = useOidcAuth();

      let response = await getGithubRepositories({
        headers: {
          authentication: `${user.value.accessToken}`,
        },
        baseUrl: "https://tmpenv.app/api/v1",
      });

      if (response.error) {
        console.log("Error fetching repositories");
        console.log(response.error);
        return;
      }

      repositories.value = response.data;
    }

    return {
      repositories,
      loadRepositoriesOfUser,
    };
  },
);
