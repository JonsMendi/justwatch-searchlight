import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: () => ({
    movies: [],
  }),
  getters: {},
  mutations: {
    pushIntoMovies(state) {
      state.movies.push();
    },
  },
  actions: {
    async getMovies(context) {
      try {
        const res = await axios({
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
              filter: { searchQuery: "ola" },
            },
          },
        });
        context.commit("pushIntoMovies", res.data.Search);
      } catch (error) {
        console.log(error);
      }
    },
  },
  modules: {},
});
