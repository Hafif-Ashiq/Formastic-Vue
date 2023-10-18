<route lang="yaml">
meta:
  requiresUserAuth: true
</route>

<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { useUserSession } from '/@src/stores/userSession'
import { useNotyf } from '/@src/composable/useNotyf'
import { useApiRoutes } from '/@src/stores/apiRoutes'
import axios from 'axios'

const viewWrapper = useViewWrapper()
const notyf = useNotyf()
const userSession = useUserSession()
const apiRoutes = useApiRoutes()

const router = useRouter()

viewWrapper.setPageTitle('Forms - Formastic')

const api_url = apiRoutes.apiUrl
// var modalOpen = false

const modalOpen = ref(false)
var modalInput = ref('')
var formsList = ref([])
const componentKey = ref(0)
const handleAddForm = () => {
  console.log(userSession.token);
  
  axios
    .post(
      api_url + 'form-api/',
      {
        title: modalInput.value,
      },
      {
        headers: {
          Authorization: 'token ' + sessionStorage.getItem('token'),
        },
      }
    )
    .then((response) => {
      console.log(response)
      notyf.success('Form Created Successfully')
      componentKey.value++
      
      router.push('/forms/create-form/'+response.data.data.id)
    })
    .catch((error) => {
      console.log(error)
      notyf.error('Form can not be created at the moment')
    })
  modalInput.value = ''
  modalOpen.value = false
}

const handleReload = () => {
  componentKey.value++
  // console.log(componentKey.value);
}

useHead({
  title: 'Forms - Formastic',
})
</script>

<template>
  <NavbarLayout>
    <div class="page-content-inner">
      <ProjectsViewV1
        :key="componentKey"
        :forms-list="formsList"
        @create-form="modalOpen = true"
        @reload="handleReload"
      />
    </div>
    <VModal
      title="Add Form"
      :open="modalOpen"
      size="medium"
      actions="right"
      noscroll
      noclose
      @close="modalOpen = false"
    >
      <template #content>
        <label>Enter the name of form</label>
        <br />
        <div class="control">
          <input v-model="modalInput" type="text" class="input" placeholder="Form 1" />
        </div>
      </template>
      <template #action>
        <VButton color="primary" raised @click="handleAddForm"> Confirm </VButton>
      </template>
    </VModal>
  </NavbarLayout>
</template>
