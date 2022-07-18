<template>
  <div class="component-wrapper">
    <div class="input-wrapper">
      <img src="https://www.justwatch.com/blog/images/icon.png" class="logo" />
      <input
        type="text"
        v-model="searchMovie"
        placeholder="Search for movies or series"
        class="movies-input"
      />
    </div>
    <div class="movies-wrapper">
      <ul v-for="movie in movies" :key="movie">
        <li class="movies-item">
          <div class="movies-inside">
            <h3>{{ movie.title }}</h3>
            <p>Released Year: {{ movie.originalReleaseYear }}</p>
            <p>Type: {{ movie.objectType }}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="signature">
      <p>João Borges Mendonça</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
// import logo from "../assets/icon.png";

export default defineComponent({
  data() {
    return {
      searchMovie: "",
      movies: [] as any,
    };
  },
  watch: {
    // Under, to make use of the input, was used watch option to trigger a function whenever
    // a reactive property changes.
    // Then the getMovies function is called again
    searchMovie: function (searchData) {
      console.log("search", searchData);
      this.searchMovie = searchData;
      this.getMovies();
    },
  },
  mounted() {
    // Here the function will be mounted
    this.getMovies();
  },
  methods: {
    // Under getMovies define the query.
    async getMovies() {
      const searchValue = this.searchMovie;
      console.log("this", searchValue);
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
              first: 5,
              filter: { searchQuery: searchValue },
            },
          },
        });
        // Under, it is still a lit bt confusing but at the moment is the way defined
        // to extract different values from the returned data in order to be displayed.
        if (result.data.data.popularTitles.edges.length > 0) {
          this.movies = result.data.data.popularTitles.edges.map((res: any) => {
            console.log("res", res.node.content);
            return {
              originalReleaseYear: res.node.content.originalReleaseYear,
              fullPath: res.node.content.fullPath,
              posterUrl: res.node.content.posterUrl,
              title: res.node.content.title,
              objectType: res.node.objectType,
            };
          });
        }
        console.log(result.data);
      } catch (error) {
        console.log(error);
      }
    },
  },
});
</script>

<style>
.component-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.logo {
  width: 50px;
}

.input-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 80px;
  margin-bottom: 60px;
  margin-right: 80px;
}

.movies-input {
  width: 300px;
  height: 30px;
  margin-left: 30px;
  font-size: 17px;
}

.movies-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.movies-item {
  margin: 10px;
  border: 2px solid #ebc324;
  border-radius: 5px;
  background-color: #10161d;
}

.movies-inside {
  margin: 10px;
}

li {
  list-style: none;
}

.signature {
  position: relative;
  color: grey;
  width: 200px;
  font-size: 11px;
  top: 50px;
  left: 40px;
}
</style>
