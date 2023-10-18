<template>
  <div class="pallete">
    <h5>Color Pallete</h5>
    <div class="colors-div">
      <button
        v-for="(color, index) in colors"
        :key="index"
        class="color"
        :style="{ 'background-color': color }"
        @click="handleSelect(color)"
      >
        <svg
          v-if="color === current"
          class="tick"
          viewBox="0 0 16.00 16.00"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          fill="none"
          stroke="#ffffff"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2.5"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0" />
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke="#CCCCCC"
            stroke-width="1.92"
          />
          <g id="SVGRepo_iconCarrier">
            <polyline points="2.75 8.75,6.25 12.25,13.25 4.75" />
          </g>
        </svg>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps(['colors', 'current'])
const emit = defineEmits(['select'])

function handleSelect(color: string) {
  emit('select', color)
}

onMounted(()=>{
    console.log(props.current);
    
})

</script>
<style scoped lang="scss">
.colors-div {
  //   width: 325px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 6px;
  
}

.pallete {
  background-color: white;
  z-index: 10;
  position: absolute;
  top: 120%;
  left: -100px;
  box-shadow:
    0 22px 63px 0 #0000001c,
    0 22px 63px 0 #0000001c;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  padding: 20px;
  align-items: start;
  gap: 15px;

  h5{
    font-size: 16px;
    font-weight: bold;
  }
}

.color {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  padding: 10px 20px;
  height: 40px;
  width: 40px;
  gap: 8px;
  border-radius: 16px;
  cursor: pointer;
  border: none;
  position: relative;
}

.color h5 {
  padding: 0;
  margin: 0;
}

.tick {
  position: absolute;
  width: 75%;
  height: 75%;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
</style>
