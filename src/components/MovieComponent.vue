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
          <a @click="openNewPath(movie.fullPath)" class="movie-button">
            <div class="movies-inside">
              <h2>{{ movie.title }}</h2>
              <p>Released Year: {{ movie.originalReleaseYear }}</p>
              <p>Type: {{ movie.objectType }}</p>
              <p class="movie-click">Click to check in JustWatch!</p>
            </div>
          </a>
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
    // Under function to allow access the justwatch website for the specific movie.
    openNewPath: function (access: any) {
      window.open("https://www.justwatch.com" + access, "_blank");
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
  margin-right: 40px;
}

.movies-input {
  width: 300px;
  height: 30px;
  margin-left: 30px;
  font-size: 17px;
}

.movies-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 15px;
  padding: 2px;
}

.movies-item {
  margin: 10px;
  border: 2px solid #ebc324;
  border-radius: 5px;
  background-color: #10161d;
  transform: scale(1);
  transition: transform 0.2s ease;
}

.movies-item:hover {
  transform: scale(1.01);
}

.movies-inside {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px;
  padding: 50px;
}

li {
  list-style: none;
}

h2 {
  text-align: center;
}

.signature {
  position: relative;
  color: grey;
  width: 200px;
  font-size: 11px;
  top: 50px;
  left: 40px;
}

.movie-button:hover {
  transition: all 0.5s ease-out;
  transition: 300ms;
  cursor: pointer;
}

.movie-click {
  font-size: 12px;
  padding-top: 30px;
  color: grey;
}

/* Under the responsiveness is defined in a very simple way */

@media all and (max-width: 1124px) {
  .logo {
    margin-left: 20px;
  }
  .input-wrapper {
    flex-direction: column;
    margin-left: 20px;
  }
  .movies-input {
    margin-top: 30px;
  }
  .movies-wrapper {
    grid-template-columns: 1fr 1fr;
    margin-right: 20px;
  }
}

@media all and (max-width: 768px) {
  .movies-wrapper {
    grid-template-columns: 1fr;
  }
}
</style>
