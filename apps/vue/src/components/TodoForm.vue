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
  <form @submit.prevent="handleSubmit">
    <input
      v-model="title"
      aria-label="New todo title"
      placeholder="What needs to be done?"
    />
    <button type="submit">Add</button>
    <p v-if="rejected" role="alert">A title is required</p>
  </form>
</template>
