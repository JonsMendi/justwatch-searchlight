<template>
  <div class="app">
    <ul>
      <li v-for="movie in movies" :key="movie">
        <h3>{{ movie }}</h3>
        <p>{{ $store.state.movies }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";

export default defineComponent({
  data() {
    return {
      movies: [],
    };
  },
  async mounted() {
    try {
      let result = await axios({
        method: "POST",
        url: "https://apis.justwatch.com/graphql",
        data: {
          query: `
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
        }`,
          variables: {
            country: "US",
            language: "en",
            first: 4,
            filter: { searchQuery: "" },
          },
        },
      });
      this.movies = result.data.data.popularTitles.edges[0].node.content;
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  },
});
</script>

<style></style>
