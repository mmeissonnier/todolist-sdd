<script setup lang="ts">
import { useTodos } from "../todo-store";
import TodoItem from "./TodoItem.vue";

const todos = useTodos();
</script>

<template>
  <p v-if="todos.length === 0" role="status">No todos yet</p>
  <ul v-else aria-label="Todos">
    <TodoItem v-for="todo in todos" :key="todo.id" :todo="todo" />
  </ul>
</template>
