<template>
  <div class="app">
    <input type="search" v-model="theSearchKeyword" />
    <button @click="refetch()">Search Movie</button>
    <div v-if="loading">Loading...</div>

    <div v-else-if="error">Error: {{ error.message }}</div>

    <ul v-else-if="result">
      <li v-for="item of result.popularTitles" :key="item">
        <h3>{{ item }}</h3>
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
  props: ["id"],

  setup(props) {
    const theSearchKeyword = "Stranger Things";
    const { result, loading, error, refetch } = useQuery(
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
      () => ({
        country: "US" as string,
        language: "en" as string,
        first: 10 as number,
        filter: { searchQuery: theSearchKeyword },
      })
    );

    console.log(result);

    return {
      result,
      loading,
      error,
      refetch,
      theSearchKeyword,
    };
  },
  // methods: {
  //   changeMessage(event: any) {
  //     this.theSearchKeyword = event.target.value;
  //   },
  // },
});
</script>

<style></style>
