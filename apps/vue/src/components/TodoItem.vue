<script setup lang="ts">
import type { Todo } from "@todolist/core";

defineProps<{ todo: Todo }>();
defineEmits<{ toggle: []; remove: [] }>();
</script>

<template>
  <li :class="todo.done ? 'todo done' : 'todo'">
    <label>
      <input
        class="todo-check"
        type="checkbox"
        :checked="todo.done"
        @change="$emit('toggle')"
      />
      <span class="todo-title">{{ todo.title }}</span>
    </label>
    <button type="button" class="todo-delete" @click="$emit('remove')">
      Delete {{ todo.title }}
    </button>
  </li>
</template>
