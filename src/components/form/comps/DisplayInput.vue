<!-- eslint-disable vue/prop-name-casing -->
<template>
  <div class="main-div">
    <div
      v-if="
        inputType === 'text' ||
          inputType === 'email' ||
          inputType === 'password' ||
          inputType === 'number'
      "
      class="input-div"
    >
      <label for="in" class="input-label">Text Field Placeholder</label>
      <input
        v-model="placeholder"
        spellcheck="false"
        type="text"
        name="in"
        class="input"
        placeholder="Answer Placeholder"
      >
    </div>
    <input
      v-else-if="inputType === 'date' || inputType === 'file'"
      disabled
      :type="inputType"
      class="input"
      :placeholder="inputType.toUpperCase()"
    >
    <div v-else-if="inputType === 'textarea'" class="textarea-div">
      <textarea id="" disabled name="" cols="30" rows="20" class="textarea-input" />
    </div>
    <div
      v-else-if="
        inputType === 'multiplechoice' ||
          inputType === 'checkbox' ||
          inputType === 'radio' ||
          inputType === 'dropdown'
      "
    >
      <form @submit.prevent=""  
      class="input-div"
      >
        <label for="placeholder" class="input-label">Enter the different options</label>
        <input
          v-model="optionText"
          spellcheck="false"
          type="text"
          class="input"
          placeholder="Enter option"
          @keydown.enter="addOptions"
        >
      </form>
      <div v-if="options.length !== 0" class="options-div">
        <button
          v-for="(option, index) in options"
          :key="index"
          class="option-group bg-gradient-info"
          @click="deleteOption(index)"
        >
          <p class="option">
            {{ option }}
          </p>
          <img :src="cross" class="cross" alt="" />
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import cross from '/@src/assets/icons/cross.svg'

interface inputDataProps {
  inputData: {
    placeholder: String
    options: String[]
  }
  inputType: string
  questionIndex: number
}

// defineProps(['input_type','input_data'])
const props = withDefaults(defineProps<inputDataProps>(), {
  inputData: () => {
    return {
      placeholder: '' as String,
      options: [],
    }
  },
  inputType: '',
  questionIndex: 0,
})
const emit = defineEmits(['change-data'])
// var input_type = ""

var placeholder = ref('')
var options = ref<string[]>([])
var optionText = ref('')

onMounted(() => {
  if (props.inputData) {
    // console.log(props.inputData);
    
    if (props.inputData['placeholder'] != null) {
      placeholder.value = props.inputData['placeholder'] as string
    }
    if (props.inputData['options'].toString() != [].toString()) {
      options.value = props.inputData['options'] as string[]
    }
  }

  // console.log(placeholder)
  // console.log(options)
})

watch(placeholder, () => {
  handleChange()
})

// watch(options, () => {
//   handleChange()
// })

function addOptions() {
  // console.log('Option : ' + optionText)

  if (optionText.value !== '') {
    options.value.push(optionText.value)
    optionText.value = ''

    // console.log(options)
    handleChange()
  }
}

function deleteOption(index: number) {
  options.value.splice(index, 1)
  handleChange()
}
function handleChange() {
  // console.log(props.inputType);
  
  interface dataInterface {
    placeholder: String
    options: string[]
  }
  const data: dataInterface = {
    placeholder: '',
    options: [],
  }


  
  if (
    props.inputType === 'text' ||
    props.inputType === 'email' ||
    props.inputType === 'number' ||
    props.inputType === 'password'
  ) {
    data['placeholder'] = placeholder.value
    data['options'] = []
  } else if (
    props.inputType === 'multiplechoice' ||
    props.inputType === 'checkbox' ||
    props.inputType === 'radio' ||
    props.inputType === 'dropdown'
  ) {
    // console.log(options);
    data['options'] = options.value as string[]
    data['placeholder'] = ''
  } else {
    data['options'] = []
    data['placeholder'] = ''
  }

  emit('change-data', data)
}
</script>
<style scoped lang="scss">
.input {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px 24px;
  height: 75px;
  border-radius: 20px;
  border: none;
  // border: 1px solid #b6b6b6;
  font-weight: 500;
  font-size: 16px;
  background-color: #f5f5f5;
  user-select: none;
  color: #808080;
}

.textarea-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 165px;
  border-radius: 14px;
  border: none;
  resize: none;
  font-size: 16px;
  background-color: #f5f5f5;
  user-select: none;
  color: #808080;
}

.input:focus {
  outline: none;
}

.input-label {
  font-size: 16px;
  color: black;
  font-weight: 500;
}

.input-div{
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: start;
  justify-content: start;
}

.options-div {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 15px 10px;
  gap: 15px;
  align-items: center;
  justify-content: start;
  position: relative;
  z-index: 0;
}

.option {
  margin: unset;
  color: white;
}

.option-group {
  display: flex;
  position: relative;
  padding: 10px 20px;
  color: white;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  transition: all 200ms ease-out;
  cursor: pointer;
  border: none;
  background-color: var(--primary);
}

.cross {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 35px;
  height: 35px;
  opacity: 0;
  translate: -50% -50%;
}

.option-group:hover {
  .cross {
    opacity: 1;
  }

  .option {
    opacity: 0;
  }
}
</style>
