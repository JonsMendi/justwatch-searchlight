<template>
  <div class="app">
    <input type="text" />
    <p>{{ moviesNew }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

export default defineComponent({
  mounted() {
    this.$store.dispatch("getMovies");
    this.$store.dispatch("searchMovie");
  },
  computed: mapState(["moviesNew", "searchMovie"]),
});
</script>

<style></style>
