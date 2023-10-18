<route lang="yaml">
  props: true  
</route>

<script setup lang="ts">


// import { mapMutations, mapState } from "vuex";
import axios from 'axios'
import { useApiRoutes } from '/@src/stores/apiRoutes'


const apiRoutes = useApiRoutes()

const api_url = apiRoutes.apiUrl




const props = defineProps(['id'])
export interface Question {
  index:number
  isRequired: boolean
  question: string
  description: string
  type: string
  data: {
    placeholder: string
    options: string[]
  }
}

export interface Section {
  title: string
  color: string
  questions: Question[]
}

const loaded = ref(false)

var title = ''
var description = ''
var sections:Section[] = []
var form_table = ''
var fields:{
  field : string
  answer :any
}[] = []
var published = false
var success_submit = false
var fileFields:{
  index: number,
  file: File
}[] = []
var checkBoxArray:{
      index: number,
      array: [string],
  
}[] = []


useHead({
  title: 'Response',
})


function handleSubmit() {
  fileFields.forEach((file) => {
    fields[file['index']]['answer'] = file['file'] 
  })

  checkBoxArray.forEach((options) => {
    fields[options['index']]['answer'] = JSON.stringify(options['array'])
  })
  
  const data:any = {}
  for (let i = 0; i < fields.length; i++) {
    data[fields[i]['field']] = fields[i]['answer']
    console.log(data[fields[i]['field']])
  }

  console.log(data)
  axios
    .post(api_url + 'post-response/' + props.id, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      if (response.status == 200) {
        // this.crossClicked()
        console.log(response)

        // this.submitted = true
        success_submit = true
        // alert("Response Submitted");

        // location.reload();
      }
    })
    .catch((error) => {
      alert('Can not submit response now')

      console.log(error)
    })
}
function uploadImage(e: any, index: number) {
  console.log(e.target.files[0])
  console.log(index)
  fileFields.push({
    index: index,
    file: e.target.files[0],
  })
}
function handleCheckBox(index: number, option: string) {
  let presentIndex = -1
  for (let i = 0; i < checkBoxArray.length; i++) {
    if (checkBoxArray[i]['index'] == index) {
      presentIndex = i
    }
  }

  if (presentIndex !== -1) {
    let optArray = checkBoxArray[presentIndex]['array'] 
    let optIndex = optArray.indexOf('option')
    if (optIndex === -1) {
      optArray.push(option)
    } else {
      optArray.splice(optIndex, 1)
    }
  } else {
    checkBoxArray.push({
      index: index,
      array: [option],
    })
  }
  // {
  //   'index' : index,
  //   'array' : []
  // }

  // console.log(this.checkBoxArray);
}

onBeforeMount(async () => {
  console.log(props.id)
  const getdata = await axios.get(api_url + 'get-form/' + props.id)

  const data = getdata.data['data']
  title = data['title']
  published = data['published']
  description = data['description']
  const secs = JSON.parse(data['meta'])['sections']

  let index = 0
  for (let i = 0; i < secs.length; i++) {
    for (let j = 0; j < secs[i]['questions'].length; j++) {
      secs[i]['questions'][j]['index'] = index

      index++
    }
  }

  sections = secs

  console.log(getdata.data)
  loaded.value = true

  const tableFields = []

  const fiel = getdata.data['fields']

  for (let i = 3; i < fiel.length; i++) {
    tableFields.push({
      field: fiel[i],
      answer: '',
    })
  }

  // const tableFields = getdata.data['fields']

  fields = tableFields
  console.log(fields)
})


</script>


<template >
  <!-- <div>{{ sections }}</div> -->
  <div class="outer-div" v-if="loaded && published">
    <div class="screen-form">
      <div class="top-div">
        <div class="heading-div">
          <h3 class="form-heading">{{ title }}</h3>
          <p class="form-desc">{{ description }}</p>
        </div>
      </div>
      <form class="sections-div" @submit.prevent="handleSubmit">
        <div class="section" v-for="(section, index) in sections" :key="index">
          <div class="section-header" :style="section['color'] === ''
              ? { backgroundColor: '#2152ff' }
              : { backgroundColor: section['color'] }
            ">
            <span class="section-heading">
              {{ section['title'] !== '' ? section['title'] : 'Section Title' }}
            </span>
            <span class="section-num"> {{ index + 1 }} of {{ sections.length }} </span>
            <!-- <div class="sect-color">
              </div> -->
          </div>

          <div class="questions-div">
            <div v-for="(question, index) in section['questions']" class="quest" :key="index">
              <div class="question-head">
                <span class="question-header"> Question {{ index + 1 }} </span>
                <span class="question-text">
                  <span class="question-body-text">
                    {{ question['question'] }}
                  </span>
                  <span v-if="question['isRequired']" class="required">*</span>
                </span>
                <span class="question-desc">{{ question['description'] }}</span>
              </div>
              <div class="inputField">
                <input v-if="question['type'] == 'text'" class="input" type="text"
                  :placeholder="question['data']['placeholder']" v-model="fields[question['index']]['answer']"
                  :required="question['isRequired'] " />
                <input v-model="fields[question['index']]['answer']" v-if="question['type'] == 'email'" class="input"
                  type="email" :placeholder="((question['data']['placeholder']) as string)" :required="question['isRequired']" />
                <input v-model="fields[question['index']]['answer']" v-if="question['type'] == 'password'" class="input"
                  type="password" :placeholder="question['data']['placeholder']" :required="question['isRequired']" />
                <input v-model="fields[question['index']]['answer']" v-if="question['type'] == 'number'" class="input"
                  type="number" :placeholder="question['data']['placeholder']" :required="question['isRequired']" />

                <input v-if="question['type'] == 'file'" class="input" type="file"
                  @change="uploadImage($event, question['index'])" :required="question['isRequired']" />

                <input v-model="fields[question['index']]['answer']" v-if="question['type'] == 'date'" class="input"
                  type="date" :required="question['isRequired']" />

                <div v-if="question['type'] == 'multiplechoice' || question['type'] == 'checkbox'
                  ">
                  <div v-for="(option, index) in question['data']['options']" class="check-div" :key="index">
                    <label class="checkBox">
                      <input type="checkbox" :value="option" :id="option"
                        @change="handleCheckBox(question['index'], option)" />
                      <div class="transition"></div>
                    </label>
                    <label class="input-label" :for="option">{{ option }}</label>
                  </div>
                </div>
                <div v-if="question['type'] === 'textarea'">
                  <textarea name="" :required="question['isRequired']" cols="30" rows="20"
                    v-model="fields[question['index']]['answer']" class="textarea-input"></textarea>
                </div>

                <div v-if="question['type'] === 'dropdown'">
                  <select :name="(question['index'] + '')" class="input" v-model="fields[question['index']]['answer']"
                    :required="question['isRequired']">
                    <!-- <option value="" disabled selected>Choose an Answer</option> -->
                    <option v-for="(option, index) in question['data']['options']" :key="index" :value="option">
                      {{ option }}
                    </option>
                  </select>
                </div>

                <div v-if="question['type'] === 'radio'" class="radio-inputs">
                  <label class="radio" v-for="(option, index) in question['data']['options']" :key="index">
                    <input type="radio" v-model="fields[question['index']]['answer']" name="radio" :value="option"
                      :checked="index === 0 ? true : false" :required="question['isRequired']" />
                    <span class="name">{{ option }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button class="button" >Submit Form</button>
        <!-- <button type="submit">Submit</button> -->
      </form>
    </div>
  </div>
  <div class="unavailable-form" v-else-if="!published">
    <div class="unavailable-data">
      <svg fill="#ff9500" width="165px" height="165px" viewBox="0 0 32.00 32.00" version="1.1"
        xmlns="http://www.w3.org/2000/svg" stroke="#ff9500" stroke-width="0.00032">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC"
          stroke-width="0.384"></g>
        <g id="SVGRepo_iconCarrier">
          <title>exclamation-round</title>
          <path
            d="M0 16q0 3.264 1.28 6.208t3.392 5.12 5.12 3.424 6.208 1.248 6.208-1.248 5.12-3.424 3.392-5.12 1.28-6.208-1.28-6.208-3.392-5.12-5.088-3.392-6.24-1.28q-3.264 0-6.208 1.28t-5.12 3.392-3.392 5.12-1.28 6.208zM4 16q0-3.264 1.6-6.016t4.384-4.352 6.016-1.632 6.016 1.632 4.384 4.352 1.6 6.016-1.6 6.048-4.384 4.352-6.016 1.6-6.016-1.6-4.384-4.352-1.6-6.048zM12 10.016q0 0.992 0.512 2.976t0.992 3.52l0.512 1.504q0 0.832 0.576 1.408t1.408 0.576 1.408-0.576 0.608-1.408l1.984-8q0-1.664-1.184-2.848t-2.816-1.152-2.816 1.152-1.184 2.848zM14.016 24q0 0.832 0.576 1.44t1.408 0.576 1.408-0.576 0.608-1.44-0.608-1.408-1.408-0.576-1.408 0.576-0.576 1.408z">
          </path>
        </g>
      </svg>
      <p>Form Not Available</p>
    </div>
  </div>
  <div class="unavailable-form" v-if="success_submit">
    <div class="submitted-data">
      <svg viewBox="0 0 512 512" width="200px" height="200px" version="1.1" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink" fill="#80ff00" stroke="#80ff00">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <title>success-filled</title>
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="add-copy-2" fill="#00bd6b" transform="translate(42.666667, 42.666667)">
              <path
                d="M213.333333,3.55271368e-14 C95.51296,3.55271368e-14 3.55271368e-14,95.51296 3.55271368e-14,213.333333 C3.55271368e-14,331.153707 95.51296,426.666667 213.333333,426.666667 C331.153707,426.666667 426.666667,331.153707 426.666667,213.333333 C426.666667,95.51296 331.153707,3.55271368e-14 213.333333,3.55271368e-14 Z M293.669333,137.114453 L323.835947,167.281067 L192,299.66912 L112.916693,220.585813 L143.083307,190.4192 L192,239.335893 L293.669333,137.114453 Z"
                id="Shape"></path>
            </g>
          </g>
        </g>
      </svg>
      <p>Submit Successful!!</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.unavailable-form {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100vh;
  background: #0005;
  display: flex;
  justify-content: center;
  align-items: center;
}

.unavailable-data p {
  font-size: 40px;
  color: #ff9500;
  font-weight: 600;
}

.unavailable-data {
  width: 50%;
  padding: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  gap: 60px;
  border-radius: 18px;
}

.submitted-data {
  width: 50%;
  padding: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // background-color: white;
  gap: 60px;
  border-radius: 18px;
}

.submitted-data p {
  font-size: 40px;
  color: #00bd6b;
  font-weight: 600;
}

.button {
  border-radius: 15px;
  background-color: var(--primary);
  padding: 25px 45px;
  font-size: 16px;
  letter-spacing: 1px;
  color: white;
  font-weight: 500;
}



.outer-div {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px;
}

.screen-form {
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  user-select: none;
  padding: 50px;
  border-radius: 3px;
  background-color: white;
  box-shadow: -2px 2px 10px 1px #8f8f8f;
}

.top-div {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  gap: 20px;
  width: 100%;
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
  font-size: 36px;
  font-weight: 700;
  color: #141727;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.form-desc {
  font-size: 18px;
  font-weight: 500;
  color: #141727;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.section {
  width: 80%;
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
  flex-direction: row;
  justify-content: space-between;
  align-items: end;
  gap: 1px;
  position: relative;
  padding: 10px 25px;
  height: 90px;
  border-radius: 18px;
}

.section-heading {
  font-weight: 600;
  font-size: 32px;
  color: white;
}

.section-num {
  font-weight: 600;
  color: white;
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
  align-items: center;
  justify-content: center;
  gap: 35px;
  width: 80%;
}

.questions-div {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-around;
  gap: 25px;
  padding: 10px 20px;
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
  background-color: #f5f5f5;
  user-select: none;
  color: black;
}


input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  // -webkit-appearance: none;
  margin: 0;
}

.textarea-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 125px;
  padding: 10px;
  height: 125px;
  border-radius: 14px;
  border: 1px solid #b6b6b6;
  font-size: 16px;
  background-color: #ededed;
  user-select: none;
}

.textarea-input:focus {
  outline: none;
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

.checkBox input[type='checkbox']:checked+div {
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
  gap: 20px;
}

.input-label {
  font-size: 18px;
}

.type-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 20px;
  height: 55px;
  border-radius: 14px;
  border: 1px solid #b6b6b6;
  color: #b6b6b6;
  background-color: #ededed;
}

.radio-inputs {
  display: flex;
  width:max-content;
  border-radius: 18px;
  background-color: #ededed;
  box-sizing: border-box;
  box-shadow: 0 0 0 1px #0000000f;
  padding: 10px;
  font-size: 20px;
  // padding-bottom: 2px;
}

.radio-inputs .radio {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.radio-inputs .radio input {
  display: none;
}

.radio-inputs .radio .name {
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  border: none;
  color: #334155;
  transition: all 0.15s ease-in-out;
  padding: 35px;
}

.radio-inputs .radio input:checked+.name {
  background-color: #fff;
  font-weight: 500;

}
</style>
