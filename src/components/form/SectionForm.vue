<script setup lang="ts">
import text from '/@src/assets/icons/text.svg'
import date from '/@src/assets/icons/date.svg'
import multiselect from '/@src/assets/icons/multiselect.svg'
import file from '/@src/assets/icons/file.svg'
import password from '/@src/assets/icons/password.svg'
import number from '/@src/assets/icons/number.svg'
import radio from '/@src/assets/icons/radio.svg'
import textarea from '/@src/assets/icons/textarea.svg'
import email from '/@src/assets/icons/email.svg'
import dropdown from '/@src/assets/icons/dropdown.svg'
import checkbox from '/@src/assets/icons/checkbox.svg'

import { useFormData } from '/@src/stores/formData'

const formData = useFormData()

export interface Question {
  isRequired: Boolean
  question: String
  description: String
  type: String
  data: {
    placeholder: String
    options: String[]
  }
}

export interface Section {
  title: String
  color: String
  questions: Question[]
}

const defaultQ: Question = {
  isRequired: false,
  question: '',
  description: '',
  type: 'text',
  data: {
    placeholder: '',
    options: [],
  },
}

// const defaultSect:Section =  {
//     title: "",
//     color: "",
//     questions: [defaultQ]
//   }

// defineProps(['section', 'totalSects', 'indexSect'])
const emit = defineEmits([
  'add-section',
  'copy-section',
  'delete-section',
  'data-changed',
])
const props = withDefaults(
  defineProps<{
    section?: Section
    totalSects?: number
    indexSect?: number
  }>(),
  {
    section: undefined,
    totalSects: 1,
    indexSect: 0,
  }
)
const key = ref(0)
const fields = [
  {
    name: 'Text Field',
    type: 'text',
    icon: text,
    fill: '#FF6A4820',
  },
  {
    name: 'Date',
    type: 'date',
    icon: date,
    fill: '#9C69CC20',
  },
  {
    name: 'Multiple Choice',
    type: 'multiplechoice',
    icon: multiselect,
    fill: '#963E7820',
  },
  {
    name: 'Email Field',
    type: 'email',
    icon: email,
    fill: '#F8B83820',
  },
  {
    name: 'Upload File',
    type: 'file',
    icon: file,
    fill: '#FA7B9F20',
  },
  {
    name: 'Checkbox',
    type: 'checkbox',
    icon: checkbox,
    fill: '#51AFA420',
  },
  {
    name: 'Number',
    type: 'number',
    icon: number,
    fill: '#3EAB6820',
  },
  {
    name: 'Radio Button',
    type: 'radio',
    icon: radio,
    fill: '#15994720',
  },
  {
    name: 'Text Area',
    type: 'textarea',
    icon: textarea,
    fill: '#5883C720',
  },
  {
    name: 'Password Field',
    type: 'password',
    icon: password,
    fill: '#268DFF20',
  },
  {
    name: 'Dropdown',
    type: 'dropdown',
    icon: dropdown,
    fill: '#FF5F7220',
  },
]

const colors = [
  '#6c5ffc',
  '#9e5ffc',
  '#f47b8b',
  '#91bba7',
  '#229da9',
  '#f39770',
  '#2189ff',
  '#fd8c85',
  '#fe9942',
  '#22a3c9',
  '#565871',
  '#fd6785',
  '#8a9cce',
  '#fa664d',
  '#5f70fc',
  '#49b265',
  '#538088',
  '#9ab47e',
  '#576573',
  '#274ba0',
]

const showFieldTypes = ref(-1)
const showColorPallete = ref(false)
const w_h_icons = ref(36)

const loaded = ref(false)

var sectionTitle = ref('')
var sect_color = ref('')

var questions = [defaultQ]

// watch(sectionTitle, () => {
//   handleChange()

// })
watch(sect_color, () => {
  handleChange()
})

const changeColor = (newColor: string) => {
  sect_color.value = newColor
}

onMounted(() => {
  // console.log('mount');

  handleMounted()
})

const handleKey = () => {
  key.value += 1

  return key.value
}

const handleMounted = () => {
  sectionTitle.value = (props?.section?.title ? props.section.title : '') as string

  sect_color.value = (props?.section?.color ? props.section.color : '#000') as string

  questions =
    props.section?.questions !== undefined ? props.section.questions : [defaultQ]

  // console.log(sect_color.value );

  loaded.value = true

  // console.log(this.indexSect + " " + this.totalSects );
}

const addInput = (index: number, field: number) => {
  // typeSelected = fields[field]
  showFieldTypes.value = -1
  // showInput = index
  questions[index]['type'] = fields[field]['type']
}

const handleInputFieldChange = (
  index: number,
  value: {
    placeholder: string
    options: string[]
  }
) => {
  // console.log(questions[index]['data'])
  // console.log(value)

  questions[index]['data'] = value
  // console.log(questions[index]['data'])

  // handleChange()
}

const handleShowField = (index: number) => {
  if (showFieldTypes.value === index) {
    showFieldTypes.value = -1
    return
  } else {
    showFieldTypes.value = index
  }
}
const handleShowColor = () => {
  if (showColorPallete.value) {
    showColorPallete.value = false
    return
  } else {
    showColorPallete.value = true
  }
}
const changeRequired = (index: number) => {
  questions[index]['isRequired'] = !questions[index]['isRequired']
}

const getFieldIcon = (index: number) => {
  for (let i = 0; i < fields.length; i++) {
    if (questions[index]['type'] === fields[i]['type']) {
      return fields[i]['icon']
    }
  }
}

const getFieldName = (index: number) => {
  for (let i = 0; i < fields.length; i++) {
    if (questions[index]['type'] === fields[i]['type']) {
      return fields[i]['name']
    }
  }
}

const addQuestion = () => {
  questions.push({
    isRequired: false,
    question: '',
    description: '',
    type: '',
    data: {
      placeholder: '',
      options: [],
    },
  })

  handleChange()
}

const addSection = () => {
  emit('add-section')
}

const handleChange = () => {
  saveSection()
  // handleMounted()
  emit('data-changed')
}

const deleteQuestion = (index: number) => {
  questions.splice(index, 1)
}

const copyQuestion = (index: number) => {
  questions.push({
    isRequired: questions[index]['isRequired'],
    question: questions[index]['question'],
    description: questions[index]['description'],
    type: questions[index]['type'],
    data: questions[index]['data'],
  })

  handleChange()
}

const copySection = () => {
  saveSection()
  emit('copy-section')
}
const deleteSection = () => {
  emit('delete-section')
}

function saveSection() {
  const data = {
    title: sectionTitle.value,
    color: sect_color.value,
    questions: questions,
  }
  formData.setCurrentSection(data)
}
</script>

<template>
  <div v-if="loaded" class="section-complete">
    <div
      class="heading-div"
      :style="
        sect_color === ''
          ? { backgroundColor: '#6c5ffc' }
          : { backgroundColor: sect_color as string }
      "
    >
      <div class="section-details">
        <p class="section-num font-white">{{ indexSect + 1 }} of {{ totalSects }}</p>
        <input
          v-model="sectionTitle"
          spellcheck="false"
          type="text"
          class="input font-white heading-input"
          placeholder="Section Title "
          @keydown.enter="() => handleChange()"
        >
      </div>

      <div
        class="section-actions"
        :style="
          showColorPallete
            ? { opacity: 1 }
            : ''
        "
      >
        <!-- drag -->
        <button>
          <svg
            :width="w_h_icons"
            :height="w_h_icons"
            viewBox="0 0 34 34"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none" fill-rule="evenodd">
              <rect transform="rotate(-180 17 17)" width="34" height="34" rx="14" />
              <g
                transform="rotate(-180 12 11)"
                fill="#fff"
                stroke="#fff"
                stroke-width="1.5"
              >
                <ellipse cx="2.059" cy="2.083" rx="1.647" ry="1.672" />
                <ellipse cx="2.059" cy="7.917" rx="1.647" ry="1.672" />
                <ellipse cx="7" cy="2.083" rx="1.647" ry="1.672" />
                <ellipse cx="7" cy="7.917" rx="1.647" ry="1.672" />
                <ellipse cx="11.941" cy="2.083" rx="1.647" ry="1.672" />
                <ellipse cx="11.941" cy="7.917" rx="1.647" ry="1.672" />
              </g>
            </g>
          </svg>
        </button>
        <!-- copy  -->
        <button @click="copySection">
          <svg
            :width="w_h_icons"
            :height="w_h_icons"
            viewBox="0 0 34 34"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none" fill-rule="evenodd">
              <rect width="42" height="42" rx="14" />
              <path d="M5 5h24v24H5z" />
              <path
                d="M20.188 9a2.99 2.99 0 0 1 2.12.879 2.99 2.99 0 0 1 .88 2.121v6a2.99 2.99 0 0 1-.88 2.121 2.99 2.99 0 0 1-2.12.879h-3.375a2.99 2.99 0 0 1-2.122-.879A2.99 2.99 0 0 1 13.812 18v-6c0-.828.336-1.578.88-2.121A2.99 2.99 0 0 1 16.811 9z"
                stroke="#fff"
                stroke-width="2"
              />
              <path
                d="M10 15v4a6 6 0 0 0 6 6h3"
                stroke="#fff"
                stroke-width="1.846"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </svg>
        </button>
        <!-- color -->
        <button @click="handleShowColor">
          <div class="color-div">
            <!-- <input v-model="sect_color" type="color" class="colorinput" /> -->
            <color-switcher
              v-if="showColorPallete"
              :colors="colors"
              :current="sect_color"
              @select="(newColor) => changeColor(newColor)"
            />

            <svg
              :width="w_h_icons"
              :height="w_h_icons"
              viewBox="0 0 34 34"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="none" fill-rule="evenodd">
                <rect fill-opacity=".14" width="34" height="34" rx="14" />
                <path d="M6 6h22v22H6z" />
                <path
                  d="M17 7.833c-5.05 0-9.167 4.116-9.167 9.167 0 5.05 4.116 9.167 9.167 9.167a2.293 2.293 0 0 0 2.292-2.292c0-.56-.211-1.1-.587-1.53a.484.484 0 0 1-.12-.303c0-.257.203-.459.46-.459h1.622c3.034 0 5.5-2.465 5.5-5.5 0-4.546-4.116-8.25-9.167-8.25zm5.042 10.084c-.761 0-1.375-.614-1.375-1.375s.614-1.375 1.375-1.375c.76 0 1.375.614 1.375 1.375 0 .76-.615 1.375-1.375 1.375zm-2.75-3.667c-.761 0-1.375-.614-1.375-1.375 0-.76.614-1.375 1.375-1.375.76 0 1.375.614 1.375 1.375 0 .76-.614 1.375-1.375 1.375zm-8.709 2.292c0-.761.614-1.375 1.375-1.375s1.375.614 1.375 1.375c0 .76-.614 1.375-1.375 1.375-.76 0-1.375-.614-1.375-1.375zm5.5-3.667c0 .76-.614 1.375-1.375 1.375-.76 0-1.375-.614-1.375-1.375 0-.76.614-1.375 1.375-1.375s1.375.614 1.375 1.375z"
                  fill="#FFF"
                  fill-rule="nonzero"
                />
              </g>
            </svg>
          </div>
        </button>
        <!-- delete -->
        <button v-if="totalSects > 1" @click="deleteSection">
          <svg
            :width="w_h_icons"
            :height="w_h_icons"
            viewBox="0 0 34 34"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none" fill-rule="evenodd">
              <rect width="42" height="42" rx="14" />
              <path
                d="M22 9h-1.5l-.71-.71c-.18-.18-.44-.29-.7-.29h-4.18c-.26 0-.52.11-.7.29L13.5 9H12c-.55 0-1 .45-1 1s.45 1 1 1h10c.55 0 1-.45 1-1s-.45-1-1-1zm-7 3h4a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4v-6a4 4 0 0 1 4-4z"
                fill="#fff"
                fill-rule="nonzero"
              />
            </g>
          </svg>
        </button>
      </div>
    </div>
    <div class="questions">
      <div
        v-for="(question, index) in questions"
        :key="index"
        class="question shadow"
        @change="handleChange"
      >
        <div class="top-question">
          <h4 class="font-color question-no">
            {{ index < 9 ? '0' + (index + 1) : index + 1 }}
          </h4>
          <div class="toggle-div">
            <h4 class="font-color">Required</h4>
            <ToggleSwitch
              :value="question['isRequired'] as boolean"
              @change-value="changeRequired(index)"
            />
          </div>
        </div>
        <div class="body-question">
          <div class="qname-section">
            <input
              v-model="question['question']"
              type="text"
              spellcheck="false"
              class="input heading-input question-input"
              placeholder="Your Question"
            >
            <span />
          </div>
          <input
            v-model="question['description']"
            type="text"
            spellcheck="false"
            class="input description-input"
            placeholder="Details (Optional)"
          >
        </div>

        <div class="type-question-div">
          <!-- @keydown.space.prevent="handleShowField(index)" -->
          <button class="type-question" @click="handleShowField(index)">
            <p v-if="question['type'] === ''" class="answer-type-2">Select Answer Type</p>
            <div v-if="question['type'] !== ''" class="answer-type-2">
              <p>Type:</p>
              <img :src="getFieldIcon(index)" alt="" />
              <h5>{{ getFieldName(index) }}</h5>
            </div>
            <img src="../../assets/icons/arrow-down.svg" alt="" />
          </button>
          <field-types
            v-if="showFieldTypes === index"
            :fields="fields"
            @select="(field) => addInput(index, field)"
          />
        </div>
        <div v-if="question['type'] !== ''" class="input-question">
          <display-input
            :key="handleKey"
            :input-type="question['type'] as string"
            :input-data="question['data']"
            :question-index="index"
            @change-data="(data) => handleInputFieldChange(index, data)"
          />
        </div>

        <div class="question-icons">
          <!-- drag -->
          <button>
            <svg
              width="32"
              height="32"
              viewBox="0 0 34 34"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="none" fill-rule="evenodd">
                <rect transform="rotate(-180 17 17)" width="34" height="34" rx="14" />
                <g
                  transform="rotate(-180 12 11)"
                  fill="#333"
                  stroke="#333"
                  stroke-width=".824"
                >
                  <ellipse cx="2.059" cy="2.083" rx="1.647" ry="1.672" />
                  <ellipse cx="2.059" cy="7.917" rx="1.647" ry="1.672" />
                  <ellipse cx="7" cy="2.083" rx="1.647" ry="1.672" />
                  <ellipse cx="7" cy="7.917" rx="1.647" ry="1.672" />
                  <ellipse cx="11.941" cy="2.083" rx="1.647" ry="1.672" />
                  <ellipse cx="11.941" cy="7.917" rx="1.647" ry="1.672" />
                </g>
              </g>
            </svg>
          </button>
          <!-- copy -->
          <button @click="copyQuestion(index)">
            <svg
              width="32"
              height="32"
              viewBox="0 0 34 34"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="none" fill-rule="evenodd">
                <rect width="34" height="34" rx="14" />
                <path d="M5 5h24v24H5z" />
                <path
                  d="M20.188 9a2.99 2.99 0 0 1 2.12.879 2.99 2.99 0 0 1 .88 2.121v6a2.99 2.99 0 0 1-.88 2.121 2.99 2.99 0 0 1-2.12.879h-3.375a2.99 2.99 0 0 1-2.122-.879A2.99 2.99 0 0 1 13.812 18v-6c0-.828.336-1.578.88-2.121A2.99 2.99 0 0 1 16.811 9z"
                  stroke="#333"
                  stroke-width="2"
                />
                <path
                  d="M10 15v4a6 6 0 0 0 6 6h3"
                  stroke="#333"
                  stroke-width="1.846"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </svg>
          </button>
          <!-- delete -->
          <button v-if="questions.length !== 1" @click="deleteQuestion(index)">
            <svg
              width="32"
              height="32"
              viewBox="0 0 34 34"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="none" fill-rule="evenodd">
                <rect width="34" height="34" rx="14" />
                <path
                  d="M22 9h-1.5l-.71-.71c-.18-.18-.44-.29-.7-.29h-4.18c-.26 0-.52.11-.7.29L13.5 9H12c-.55 0-1 .45-1 1s.45 1 1 1h10c.55 0 1-.45 1-1s-.45-1-1-1zm-7 3h4a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4v-6a4 4 0 0 1 4-4z"
                  fill="#333"
                  fill-rule="nonzero"
                />
              </g>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="button-div">
      <button class="create-button" @click="addQuestion">
        <svg
          class="plus"
          fill="#6c5ffc"
          width="800px"
          height="800px"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9,17h6v6a1,1,0,0,0,2,0V17h6a1,1,0,0,0,0-2H17V9a1,1,0,0,0-2,0v6H9a1,1,0,0,0,0,2Z"
          />
        </svg>
        <span>Add Another Question</span>
      </button>
      <button
        v-if="indexSect + 1 === totalSects"
        class="create-button"
        @click="addSection"
      >
        <svg
          class="plus"
          fill="#6c5ffc"
          width="800px"
          height="800px"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9,17h6v6a1,1,0,0,0,2,0V17h6a1,1,0,0,0,0-2H17V9a1,1,0,0,0-2,0v6H9a1,1,0,0,0,0,2Z"
          />
        </svg>
        <span>Create Another Section</span>
      </button>
    </div>
  </div>
</template>
<style scoped lang="scss">
input:focus {
  box-shadow: none;
}

.section-complete {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.font-color {
  color: #141727;
}

.question-no {
  font-size: 24px;
  font-weight: 500;
}

.font-white {
  color: white;
}

p {
  margin: 0;
  padding: 0;
  font-weight: 600;
}

.input {
  border: none;
  background: transparent;
  margin: 0;
  padding: 0;
  line-height: 0px;
  width: 100%;
  flex: 1 1 0;
  overflow-wrap: normal;
}

.input:focus {
  outline: none;
}

.heading-input {
  font-size: 28px;
  font-weight: 600;
}

.input::placeholder {
  opacity: 0.5;
}

.colorinput {
  position: absolute;
  inset: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.color-div {
  position: relative;
  background-color: transparent;
}

.description-input {
  font-size: 14px;
  font-weight: 600;
  width: 80%;
}

.toggle-div {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 20px;
}

.toggle-div h4 {
  font-size: 16px;
  font-weight: bold;
}

.top-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-question > p {
  padding: 0;
  margin: 0;
}

.heading-div {
  /* background: #2152ff; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 20px;
  padding: 24px 32px;
}

.section-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 2px;
}

.section-details > .input {
  font-weight: 500;
  font-size: 24px;
  color: white;
}

.section-details > .input::placeholder {
  color: white;
}

.section-actions {
  display: flex;
  flex-direction: row-reverse;
  opacity: 0;
  gap: 8px;
  transition: all 0.2s ease-in-out;
}

.heading-div:hover {
  .section-actions {
    opacity: 1;
  }
}

.section-actions > button {
  background-color: #ffffff4d;
  border-radius: 20px;
  cursor: pointer;
  // width: fit-content;
  // height: fit-content;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 46px;
  height: 46px;
}

.questions {
  padding: 0 10px;
  display: flex;
  justify-content: start;
  align-items: stretch;
  gap: 20px;
  width: 100%;
  flex-direction: column;
}

.question {
  background-color: white;
  padding: 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  position: relative;
}

.type-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 250px;
  padding: 9px 20px;
  height: 55px;
  border-radius: 16px;
  border: 1px solid #dbdbdb;
  color: #666;
  background-color: #fff;
  cursor: pointer;
  user-select: none;
}

.type-question-div {
  position: relative;
  width: 50%;
}

.shadow {
  box-shadow: 0 22px 34px 0 #00000005;
}

.answer-type-2 {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 9px;
  width: 100%;
  cursor: pointer;
  font-weight: normal;
  font-size: 14px;

  p {
    font-weight: normal;
  }
}

.answer-type-2 h5 {
  padding: 0;
  margin: 0;
  font-weight: normal;
}

.plus {
  width: 40px;
  height: 40px;
}

.button-div {
  display: flex;
  padding: 10px 20px;
  gap: 20px;
}

.create-button {
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  padding: 10px 17px;
  font-weight: 500;
  font-size: 18px;
  background: #f0efff;
  // border: 3px solid var(--primary);
  border: none;
  color: var(--primary);
  transition: all 250ms ease-out;
  cursor: pointer;
}

.create-button:hover {
  color: white;
  background: var(--primary);

  .plus path {
    fill: white;
  }
}

.question-icons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: absolute;
  top: 10px;
  right: -45px;
}

.question-icons button {
  border-radius: 100%;
  cursor: pointer;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
}
</style>
