import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
// import { useStorage } from '@vueuse/core'

export type FormData = Record<string, any> | null
export type SectionData = Record<string, any> | null

export const useFormData = defineStore('formData', () => {
  // token will be synced with local storage
  // @see https://vueuse.org/core/usestorage/
  // const token = useStorage('token', '')

  const form = ref<Partial<FormData>>()
  const currentSection = ref<Partial<SectionData>>()
  const apiUrl = 'http://localhost:8000/'
  // const loading = ref(true)

  // const isLoggedIn = computed(() => token.value !== undefined && token.value !== '')

  function setForm(newForm: Partial<FormData>) {
    form.value = newForm
  }

  function setCurrentSection(newSect: Partial<SectionData>){
    currentSection.value = newSect
  }


  return {
    form,
    setForm,
    currentSection,
    setCurrentSection
  } as const
})

/**
 * Pinia supports Hot Module replacement so you can edit your stores and
 * interact with them directly in your app without reloading the page.
 *
 * @see https://pinia.esm.dev/cookbook/hot-module-replacement.html
 * @see https://vitejs.dev/guide/api-hmr.html
 */
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFormData, import.meta.hot))
}
