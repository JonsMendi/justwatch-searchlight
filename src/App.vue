<template>
  <div class="app">
    <MovieComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MovieComponent from "./components/MovieComponent.vue";

export default defineComponent({
  name: "JustWatch-SearchLight",
  components: { MovieComponent },
});
</script>

<style></style>
