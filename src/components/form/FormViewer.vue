<template>
  <div class="screen-form">
    <div class="top-div">
      <h1 class="main-heading">
        Form Preview
      </h1>
      <div class="heading-div">
        <h3 class="form-heading">
          {{ title ? title : 'Title Name' }}
        </h3>
        <p class="form-desc">{{ description ? description : 'description' }}</p>
      </div>
    </div>
    <div class="sections-div">
      <div v-for="(section, index) in sections" :key="index" class="section">
        <div class="section-header">
          <span class="section-num">{{ index + 1 }} of {{ sections?.length }}</span>
          <span class="section-heading">{{
            section['title'] !== '' ? section['title'] : 'Section Title'
          }}</span>
          <div
            class="sect-color"
            :style="
              section['color'] === ''
                ? { backgroundColor: '#2152ff' }
                : { backgroundColor: section['color'] as string }
            "
          />
        </div>

        <div class="questions-div">
          <div
            v-for="(question, index) in section['questions']"
            :key="index"
            class="quest"
          >
            <div class="question-head">
              <span class="question-header">Question {{ index + 1 }}</span>
              <span class="question-text">
                <span class="question-body-text">
                  {{
                    question['question'] === '' ? 'Your Question' : question['question']
                  }}
                </span>
                <span v-if="question['isRequired']" class="required">*</span>
              </span>
              <span class="question-desc">{{
                question['description'] === '' ? 'Description' : question['description']
              }}</span>
            </div>
            <div class="inputField">
              <!-- For Placeholders -->
              <input
                v-if="placeholderNeeded(question['type'])"
                disabled
                class="input"
                type="text"
                :placeholder="
                  question['data']['placeholder'] === '' ||
                    !question['data']['placeholder']
                    ? 'Answer Placeholder'
                    : question['data']['placeholder'] as string
                "
              >
              <!-- For nothing -->
              <input
                v-if="nothingNeeded(question['type'] as string)"
                disabled
                class="input"
                :type="(question['type'] as string)"
                :placeholder="(question['type'] as string)"
              >
              <!-- For Checkboxes -->
              <div v-if="checkBoxNeeded(question['type'] as string)">
                <div
                  v-for="(option, index3) in question['data']['options']"
                  :key="index3"
                  class="check-div"
                >
                  <label class="checkBox">
                    <input id="ch1" disabled type="checkbox" >
                    <div class="transition" />
                  </label>
                  <label for="ch1" class="input-label">{{ option }}</label>
                </div>
              </div>
              <div v-if="dropdown(question['type'] as string)">
                <div class="type-question">
                  <p class="answer-type-1">{{ question['data']['options'][0] }}</p>
                  <img src="../assets/icons/arrow-down.svg" alt="" />
                </div>
              </div>
              <div v-if="question['type'] === 'textarea'">
                <textarea
                  disabled
                  name=""
                  cols="30"
                  rows="20"
                  class="textarea-input"
                />
              </div>
              <div v-if="question['type'] === 'radio'" class="radio-input">
                <div
                  v-for="(option, index2) in question['data']['options']"
                  :key="index2"
                  :class="index2 === 0 ? 'radio-select' : ''"
                  class="radio-opt"
                >
                  {{ option }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import {useFormData} from "/@src/stores/formData"
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
  isRequired: false as Boolean,
  question: '' as String,
  description: '' as String,
  type: '' as String,
  data: {
    placeholder: '' as String,
    options: [''],
  },
}

const defaultSect:Section =  {
    title: ""as String,
    color: "" as String,
    questions: [defaultQ]
  }

// interface inputDataProps {
//   title: string,
//   description: string,
//   sections : Section[]
// }

// // defineProps(['input_type','input_data'])
// const props = withDefaults(defineProps<inputDataProps>(),{
//   title:  "",
//   description: "" ,
//   sections: undefined
// })

const title = ref('')
const description = ref('')
const sections = ref([defaultSect])

onMounted(()=>{
  title.value = formData.form ? formData.form.title : ""
  description.value = formData.form ? formData.form.description : ""

  sections.value = formData.form ? formData.form.meta.sections : [defaultSect]
   
  
})


  function placeholderNeeded(type: String) {
    if (type === 'email' || type === 'password' || type === 'number' || type === 'text') {
      return true
    }
    return false
  }
function checkBoxNeeded(type: string) {
  if (type === 'multiplechoice' || type === 'checkbox') {
    return true
  }
  return false
}
function nothingNeeded(type: string) {
  return type === 'date' || type === 'file' ? true : false
}
function dropdown(type: string) {
  return type === 'dropdown'
}
</script>
<style scoped lang="scss">
.screen-form {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: start;
  gap: 40px;
  user-select: none;
}

.top-div {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  gap: 20px;
}

.main-heading {
  font-size: 36px;
  font-weight: 700;
  color: #141727;
}

p {
  position: relative;
  inset: 0;
  margin: 0;
}

.heading-div {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 2px;
}

.form-heading {
  font-size: 28px;
  font-weight: 700;
  color: #141727;
}

.form-desc {
  font-size: 18px;
  font-weight: 600;
  color: #141727;
}

.section {
  color: #141727;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: start;
  gap: 20px;
  padding: 10px 25px;
}

.section-header {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  gap: 1px;
  position: relative;
}

.section-heading {
  font-weight: 700;
  font-size: 24px;
  color: #141727;
}

.section-num {
  font-weight: 600;
  color: #141727;
}

.sect-color {
  width: 18px;
  border-radius: 20px;
  height: 100%;
  position: absolute;
  left: -30px;
  top: 0;
}

.question-header {
  color: #141727;
  font-size: 18px;
  font-weight: 700;
}

.question-text {
  color: #141727;
  font-size: 20px;
  font-weight: 800;
  display: flex;
  justify-content: start;
  align-items: start;
  gap: 5px;
  width: 90%;
}

.question-desc {
  color: #707070;
  font-weight: 600;
}

.question-head {
  display: flex;
  flex-direction: column;
}

.sections-div {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: start;
  gap: 35px;
}

.questions-div {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-around;
  gap: 25px;
  padding: 10px;
}

.required {
  color: red;
  font-size: 20px;
}

.input {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px 24px;
  height: 75px;
  border-radius: 20px;
  border: none;
  font-weight: 500;
  font-size: 16px;
  background-color: #eef1f5;
  user-select: none;
  color: #808080;

  ::placeholder{
    color: #808080;
  }
}


.textarea-input {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px 24px;
  height: 175px;
  border-radius: 20px;
  border: none;
  font-weight: 500;
  font-size: 16px;
  background-color: #eef1f5;
  user-select: none;
  resize: none;
  color: #808080;
}

.input:focus {
  outline: none;
}

.quest {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: start;
  gap: 20px;
}

.checkBox {
  display: block;
  cursor: pointer;
  width: 24px;
  height: 24px;
  border: 3px solid #fff0;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 0 2px #2152ff;
}

.checkBox div {
  width: 60px;
  height: 60px;
  background-color: #2152ff;
  top: -52px;
  left: -52px;
  position: absolute;
  transform: rotateZ(45deg);
  z-index: 100;
}

.checkBox input[type='checkbox']:checked + div {
  left: -10px;
  top: -10px;
}

.checkBox input[type='checkbox'] {
  position: absolute;
  left: 50px;
  visibility: hidden;
}

.transition {
  transition: 300ms ease;
}

.check-div {
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 4px;
}

.input-label {
  font-size: 18px;
}

.type-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  height: 55px;
  width: 100%;
  border-radius: 20px;
  border: none;
  font-weight: 500;
  background-color: #eef1f5;
  user-select: none;
  color: #808080;

  p{
    font-weight: 500;
  }
}

.radio-input {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 90%;
  background: #ededed;
  flex-wrap: wrap;
  padding: 10px;
  justify-content: start;
  align-items: center;
  // width: max-content;
  border-radius: 20px;
}

.radio-opt {
  font-weight: 600;
  display: flex;
  padding: 30px;
  justify-content: center;
  align-items: center;
  height: 100%;
  border-radius: 18px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.radio-select {
  background: white;
}
</style>
