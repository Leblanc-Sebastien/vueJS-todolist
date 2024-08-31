<script setup lang="ts">
import TodoList from './components/TodoView/TodoList.vue';
</script>

<template>
  <div class="container d-flex flex-column align-item-center justify-content-center">
    <TodoList />
  </div>
</template>

<style scoped lang="scss">
.container {
  background-color: #ffffff;
  height: 100%;
}
</style>
