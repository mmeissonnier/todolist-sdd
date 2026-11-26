<script setup lang="ts">
import type { Todo } from "@todolist/core";
import { todoList } from "../todo-store";

defineProps<{ todo: Todo }>();
</script>

<template>
  <li :class="todo.done ? 'todo done' : 'todo'">
    <label>
      <input
        class="todo-check"
        type="checkbox"
        :checked="todo.done"
        @change="todoList.toggle(todo.id)"
      />
      <span class="todo-title">{{ todo.title }}</span>
    </label>
    <button type="button" class="todo-delete" @click="todoList.remove(todo.id)">
      Delete {{ todo.title }}
    </button>
  </li>
</template>
