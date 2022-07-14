<template>
  <div class="app">
    <input type="text" v-model="search" />
    <div v-for="movie in filteredMovies" :key="movie.id">
      <PostComponent :movie="movie"></PostComponent>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PostComponent from "./components/PostComponent.vue";

export default defineComponent({
  name: "App",
  components: { PostComponent },
  data() {
    return {
      search: "",
      movies: [
        {
          id: 1,
          title: "Batman",
          body: "Amazing Movie",
        },
        {
          id: 2,
          title: "Green Lantern",
          body: "Horrible Movie",
        },
      ],
    };
  },
  computed: {
    filteredMovies(): any {
      return this.movies.filter((movie) =>
        movie.title.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
});
</script>

<style></style>
