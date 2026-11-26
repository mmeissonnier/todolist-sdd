<script setup lang="ts">
import TodoForm from "./components/TodoForm.vue";
import TodoListView from "./components/TodoListView.vue";
</script>

<template>
  <main class="app">
    <h1 class="app-title">Todo list</h1>
    <TodoForm />
    <TodoListView />
  </main>
</template>
