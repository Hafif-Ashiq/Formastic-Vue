import { acceptHMRUpdate, defineStore } from 'pinia'

// import { useStorage } from '@vueuse/core'

export type FormData = Record<string, any> | null
export type SectionData = Record<string, any> | null

export const useApiRoutes = defineStore('apiRoute', () => {
  // token will be synced with local storage
  // @see https://vueuse.org/core/usestorage/
  // const token = useStorage('token', '')

  const apiUrl = 'http://localhost:8000/'

  const getApiUrl = () =>{
    return apiUrl
  }

  // const createFormId = ref(-1)

  // function setCreateFormId(id:number){
  //   createFormId.value = id
  // }


  return {
    apiUrl,
   getApiUrl
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
  import.meta.hot.accept(acceptHMRUpdate(useApiRoutes, import.meta.hot))
}
