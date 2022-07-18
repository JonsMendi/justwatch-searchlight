<template>
  <div class="app">
    <MovieComponent />
    <TestComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MovieComponent from "./components/MovieComponent.vue";
import TestComponent from "./components/TestComponent.vue";

export default defineComponent({
  name: "JustWatch-SearchLight",
  components: { MovieComponent, TestComponent },
});
</script>

<style></style>
