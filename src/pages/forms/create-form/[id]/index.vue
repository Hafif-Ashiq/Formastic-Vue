<route lang="yaml">
  props: true
  meta:
    requiresUserAuth: true
</route>

<script setup lang="ts">
/**
 * This is a Vue Component that will be
 * automatically mapped to a entry on vue-router.
 *
 * You will be able to access this page at http://localhost:3000/starters/navbar-blank-page-1
 * Page uri will match related path to src/pages folder
 *
 * Read more about routing:
 * @see /vite.config.ts
 * @see /src/router.ts
 */

import { useViewWrapper } from '/@src/stores/viewWrapper'
import { useFormData } from '/@src/stores/formData'
import { useApiRoutes } from '/@src/stores/apiRoutes'
// import {useUserSession} from '/@src/stores/userSession'
import { useNotyf } from '/@src/composable/useNotyf'
import axios from 'axios'
import draggable from 'vuedraggable'
const notyf = useNotyf()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Create Form')

const formData = useFormData()
const apiRoutes = useApiRoutes()
const router = useRouter()
// const userSession = useUserSession()

useHead({
  title: 'Create Form',
})

const props = defineProps(['id'])

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

// const loaded = ref(false)
const componentKey = ref(0)
const formViewerKey = ref(1)
var title = ref('')
var description = ref('')
const id = ref()
const loaded = ref(false)

const drag = ref(false)

onMounted(async () => {
  // console.log(props.id);
  // console.log();
  
  
  if (props.id) {
    
    id.value = props.id
    const data = await axios.get(apiRoutes.apiUrl + '/get-form/' + props.id, {
      headers: {
        Authorization: 'token ' + sessionStorage.getItem('token'),
      },
    })

    const apiData = data['data']

    title.value = apiData['data']['title']
    description.value = apiData['data']['description']

    if (apiData['data']['meta'] !== '') {
      const meta = JSON.parse(apiData['data']['meta'])

      sections = meta['sections']
    }
    if (!apiData['data']['published']) {
      loaded.value = true
    }

    const form = {
      id: id,
      title: title,
      description: description,
      meta: {
        sections: sections,
      },
    }

    formData.setForm(form)
    loaded.value = true
    // console.log(loaded);
    // console.log(loaded);
    
  }
})



var sections: Section[] = [
  {
    title: '',
    color: '#6c5ffc',
    questions: [
      {
        isRequired: false,
        question: '',
        description: '',
        type: '',
        data: {
          placeholder: '',
          options: [],
        },
      },
    ],
  },
]

const handleSave = () => {
  const saveData = {
    id: id.value,
    title: title.value,
    description: description.value,
    meta: JSON.stringify({
      sections: sections,
    }),
  }

  console.log({
    id: id.value,
    title: title.value,
    description: description.value,
    meta: {
      sections: sections,
    },
  })

  console.log(saveData)

  axios
    .patch(apiRoutes.apiUrl + 'form-api/', saveData, {
      headers: {
        Authorization: 'token ' + sessionStorage.getItem('token'),
      },
    })
    .then((response) => {
      console.log(response)
      notyf.success('Form Saved')
      router.replace('/forms')
    })
    .catch((error) => {
      // notyf.error('Form can not be saved at the moment')
      console.log(error)
    })
}

function sectionAdd() {
  sections.push({
    title: '',
    color: '#6c5ffc',
    questions: [
      {
        isRequired: false,
        question: '',
        description: '',
        type: '',
        data: {
          placeholder: '',
          options: [],
        },
      },
    ],
  })

  handleReload()
}

function handleSectionChange(index: number) {
  const data2 = formData.currentSection

  sections[index] = data2 as Section

  handleReload()
}

function sectionCopy(indexCurrent: number) {
  handleSectionChange(indexCurrent)
  const data2 = formData.currentSection as Section
  sections.push(data2)
  handleReload()
}
function deleteSection(index: number) {
  sections.splice(index, 1)

  handleReload()
}

function handleReload() {
  const data = {
    id: id,
    title: title,
    description: description,
    meta: {
      sections: sections,
    },
  }
  formData.setForm(data)
  componentKey.value += 1
  formViewerKey.value += 1
}

const handlePublish = () => {
  const publishData = {
    id: id.value,
    title: title.value,
    description: description.value,
    meta: JSON.stringify({
      sections: sections,
    }),
  }

  axios
    .patch('http://localhost:8000/publish-form', publishData, {
      headers: {
        Authorization: 'token ' + sessionStorage.getItem('token'),
      },
    })
    .then((response) => {
      console.log(response)
      if (response.status == 200) {
        notyf.success('Form Published Successfully')
        router.replace('/forms')
      }
    })
    .catch((error) => {
      console.log(error)
      notyf.error("Couldn't publish form")
      router.push({ path: `/workspace/` })
    })
}


const startDrag = () =>{
  
  drag.value = true
  
  const data = {
    id: id.value,
    title: title,
    description: description,
    meta: {
      sections: sections,
    },
  }
  formData.setForm(data)
  
  console.log('Start Drag');
}

const stopDrag = () =>{
  console.log('Stop Drag');
  
  const data = formData.form

  console.log(data);
  drag.value = false
  
}
</script>

<template>
  <NavbarLayout>
    <!-- Content Wrapper -->
    <div class="page-content-inner full-width" v-if="loaded">
      <!--
        Page content goes here

        You can see pages content samples from 
        files in /src/components/pages directory
      
      -->

      <div v-if="loaded" class="screen">
        <div class="top-section">
          <div class="header-section">
            <div class="header">
              <input
                v-model="title"
                type="text"
                spellcheck="false"
                class="heading-input input"
                placeholder="Form Name"
              />
              <input
                v-model="description"
                type="text"
                spellcheck="false"
                class="description-input input"
                placeholder="Description(click to edit)"
              />
            </div>

            <div class="publish-div">
              <button class="my-4 mb-2 button" size="md" @click="handleSave">Save</button>
              <button class="my-4 mb-2 button" size="md" @click="handlePublish">
                Publish Form
              </button>
            </div>
          </div>
          <div class="line" />
        </div>

        <div class="form-creator">
          <div :key="componentKey" class="form-editor">
            <!-- <Sortable :list="sections" item-key="index" tag="div" :options="options">
            <template #item="{ section, index }"> -->

            <!-- <draggable
              v-model="sections"
              group="section"
              item-key="id"
              @start="startDrag"
              @end="stopDrag"
            >
              <template #item="section">

                  <SectionForm
                  
                  :key="section"
                  :section="section"
                  :index-sect="section"
                  :total-sects="sections.length"
                  :loaded="loaded"
                  @data-changed="() => handleSectionChange(index)"
                  @add-section="sectionAdd"
                  @copy-section="() => sectionCopy(index)"
                  @delete-section="deleteSection(index)"
                  />

              </template>
            </draggable> -->

            <SectionForm
              v-for="(section, index) in sections"
              :key="index"
              :section="section"
              :index-sect="index"
              :total-sects="sections.length"
              :loaded="loaded"
              @data-changed="() => handleSectionChange(index)"
              @add-section="sectionAdd"
              @copy-section="() => sectionCopy(index)"
              @delete-section="deleteSection(index)"
            />
            <!-- </template>
        </Sortable> -->
          </div>
          <div class="form-preview">
            <form-viewer
              :key="formViewerKey"
              :title="title"
              :description="description"
              :sections="sections"
            />
          </div>
        </div>
      </div>
    </div>
  </NavbarLayout>
</template>
<style scoped lang="scss">
:root {
  --main: #141727;
}

input:focus {
  box-shadow: none;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.screen {
  padding-left: 50px;
  padding-right: 50px;
  display: flex;
  flex-direction: column;
  gap: 50px;
  user-select: none;
  background-color: #f7fafe;
}

.top-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.line {
  width: 100%;
  height: 2px;
  background: #c6c6c6;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.row-col {
  background: #000;
  height: 100%;
}

.row-col div {
  height: 100%;
  background-color: aqua;
  border: 1px solid black;
}

.header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 0;
  flex: 1;
}

.input {
  border: none;
  background: inherit;
  color: #141727;
}

.publish-div {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 50px;
}

.input:focus {
  outline: none;
}

.heading-input {
  font-size: 32px;
  font-weight: 700;
  width: 80%;
}

.description-input {
  font-size: 18px;
  font-weight: 500;
  width: 80%;
}

.button {
  color: white;
  border-radius: 15px;
  background-color: var(--primary);
  border: var(--primary);
  padding: 25px 45px;
  font-size: 16px;
  letter-spacing: 1px;
}

.button:hover {
  background-color: var(--primary);
}

.form-creator {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 150px;
}

.form-editor {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  gap: 40px;
  padding-top: 20px;
}

.full-width {
  width: 100%;
}
</style>
