<template>
  <div class="question-types">
    <button
      v-for="(field, index) in fields"
      :key="field['name']"
      class="type"
      :style="{ 'background-color': field['fill'] }"
      @click="handleSelect(index)"
    >
      <img :src="field['icon']" alt="" />
      <h5>{{ field['name'] }}</h5>
    </button>
  </div>
</template>
<script setup lang="ts">
defineProps(['fields'])
const emit = defineEmits(['select'])

function handleSelect(type: Number) {
  emit('select', type)
}
</script>
<style scoped lang="scss">
.question-types {
  width: 800px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  padding: 20px;
  background-color: white;
  position: absolute;
  top: 100%;
  left: 0%;
  z-index: 10;
  border-radius: 20px;
  box-shadow: -1px 1px 12px 2px #d4d4d4;
}

.type {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  padding: 10px 20px;
  height: 50px;
  gap: 8px;
  width: 100%;
  border-radius: 12px;
  cursor: pointer;
  border: none;
}

.type h5 {
  padding: 0;
  margin: 0;
}
</style>
