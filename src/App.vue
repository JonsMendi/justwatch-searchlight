<template>
  <div class="app">
    <div v-if="loading">Loading...</div>

    <div v-else-if="error">Error: {{ error.message }}</div>

    <ul v-else-if="result && result.popularTitles">
      <li v-for="dog of result.popularTitles" :key="dog.id">
        {{ dog }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import gql from "graphql-tag";
import { useQuery } from "@vue/apollo-composable";

export default defineComponent({
  name: "App",
  setup() {
    const { result, loading, error } = useQuery(
      gql`
        query GetSuggestedTitles(
          $country: Country!
          $language: Language!
          $first: Int!
          $filter: TitleFilter
        ) {
          popularTitles(country: $country, first: $first, filter: $filter) {
            edges {
              node {
                ...SuggestedTitle
                __typename
              }
              __typename
            }
            __typename
          }
        }

        fragment SuggestedTitle on MovieOrShow {
          id
          objectType
          objectId
          content(country: $country, language: $language) {
            fullPath
            title
            originalReleaseYear
            posterUrl
            fullPath
            __typename
          }
          __typename
        }
      `,
      {
        country: "US",
        language: "en",
        first: 7,
        filter: { searchQuery: "p" },
      }
    );
    console.log(result);
    return {
      result,
      loading,
      error,
    };
  },
});
</script>

<style></style>
