<script setup lang="ts">
import { ref } from "vue";
import { todoList } from "../todo-store";

const title = ref("");
const rejected = ref(false);

function handleSubmit() {
  const result = todoList.add(title.value);
  if (result.ok) {
    title.value = "";
    rejected.value = false;
  } else {
    rejected.value = true;
  }
}
</script>

<template>
  <form class="todo-form" @submit.prevent="handleSubmit">
    <input
      class="todo-form-input"
      v-model="title"
      aria-label="New todo title"
      placeholder="What needs to be done?"
    />
    <button type="submit" class="todo-form-submit">Add</button>
    <p v-if="rejected" role="alert" class="todo-form-error">A title is required</p>
  </form>
</template>
