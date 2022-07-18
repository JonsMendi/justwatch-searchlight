import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    // Under was created moviesNew state to contain the information that "movies" state is containing
    // in MovieComponent but still not working. (the name is suppose to be movies instead of moviesNew after making it work)
    moviesNew: [] as any,
    searchMovie: "",
  },
  getters: {},
  mutations: {
    // Under pushIntoMovies should update the state moviesNew. Not working
    setMovies: (state, payload) => {
      state.moviesNew = payload;
    },
    searchMovie: (state, searchData) => {
      console.log("search", searchData);
      state.searchMovie = searchData;
    },
  },
  actions: {
    // Under the async getMovies function should fetch the query and then we should be able to update the
    // state moviesNew with a fetched data from getMovies. This need to happen with the help from mutation
    // pushIntoMovies, but somehow it's not working still.
    async getMovies({ commit }): Promise<void> {
      const searchValue = commit("searchMovie");
      try {
        const result = await axios({
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
              first: 5,
              filter: { searchQuery: searchValue },
            },
          },
        });
        // Under, it is still a lit bt confusing but at the moment is the way defined
        // to extract different values from the returned data in order to be displayed.
        commit("setMovies", result.data);
        console.log(result.data);
      } catch (error) {
        console.log(error);
      }
    },
  },
  modules: {},
});
