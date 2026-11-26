<script setup lang="ts">
import { todoList, useTodos } from "../todo-store";
import TodoItem from "./TodoItem.vue";

const todos = useTodos();
</script>

<template>
  <p v-if="todos.length === 0" role="status" class="todo-empty">No todos yet</p>
  <ul v-else class="todo-list" aria-label="Todos">
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @toggle="todoList.toggle(todo.id)"
      @remove="todoList.remove(todo.id)"
    />
  </ul>
</template>
