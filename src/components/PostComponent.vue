<template>
  <div>
    <h3>{{ movie.title }}</h3>
    <p>{{ movie.body }}</p>
  </div>
</template>

<script lang="ts">
export default {
  props: ["movie"],
};
</script>
