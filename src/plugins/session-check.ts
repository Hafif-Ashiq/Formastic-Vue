// import { useFetch } from '/@src/composable/useFetch'
import { definePlugin } from '/@src/app'
import { useUserSession } from '/@src/stores/userSession'
import { useApiRoutes } from '../stores/apiRoutes'
import axios from 'axios'

/**
 * Here we are setting up two router navigation guards
 * (note that we can have multiple guards in multiple plugins)
 *
 * We can add meta to pages either by declaring them manualy in the
 * routes declaration (see /@src/router.ts)
 * or by adding a <route> tag into .vue files (see /@src/pages/sidebar/dashboards.ts)
 *
 * <route lang="yaml">
 * meta:
 *   requiresAuth: true
 * </route>
 *
 * <script setup lang="ts">
 *  // TS script
 * </script>
 *
 * <template>
 *  // HTML content
 * </template>
 */

export default definePlugin(async ({ router, pinia }) => {
  const userSession = useUserSession(pinia)
  // const $fetch = useFetch()

  // 1. Check token validity at app startup
  if (userSession.isLoggedIn) {
    try {
      // Do api request call to retreive user profile.
      // Note that the api is provided with json-server
      // const user = await $fetch('/api/users/me')
      // userSession.setUser(user)
    } catch (err) {
      // delete stored token if it fails
      userSession.logoutUser()
    }
  }
  const apiRoutes = useApiRoutes()

  

  router.beforeEach(async (to) => {


    const localS = localStorage.getItem('token')
    const sessionS = sessionStorage.getItem('token')
    const user = userSession.user

    if(sessionS){
      userSession.setToken(sessionS)
    }

    
    
    if (to.meta.loginRemember) {
      // console.log('inremeber');
      // console.log(route);
      
      
      if (user?.user_role == 'user') {
        console.log('in user');
        
        
        if (userSession.user?.user_role == 'user') {
          return to.query?.redirect ? to.query.redirect : '/dashboard'

          // return '/dashboard'
          
        }
        else if (userSession.user?.user_role == 'admin') {
          return '/admin/dashboard'
        }
      } 
      else if (sessionS) {
        console.log("in sessionS");
        console.log(sessionS);
        
        
        const data = await axios.get(apiRoutes.apiUrl + 'get-user-data', {
          headers: {
            Authorization: 'token ' + sessionS,
          },
        })
        
        console.log(data);
        
        userSession.setUser(data.data)
        userSession.setToken(sessionS)
        console.log('full path ' + to.fullPath)
        
        if (userSession.user?.user_role == 'user') {
          return to.fullPath
          // return '/dashboard'
          
        }
        else if (userSession.user?.user_role == 'admin') {
          return '/admin/dashboard'
        }
      } else if (localS && localS !== '') {
        const data = await axios.get(apiRoutes.apiUrl + 'get-user-data', {
          headers: {
            Authorization: 'token ' + localS,
          },
        })
        
        userSession.setUser(data.data)


        sessionStorage.setItem('token', localS)
        if (userSession.user?.user_role == 'user') {
          return to.fullPath
          // return '/dashboard'
          
        }
        else if (userSession.user?.user_role == 'admin') {
          return '/admin/dashboard'
        }
       
      } 

      
    }
    

    if (to.meta.requiresUserAuth && userSession?.user?.user_role !== 'user') {
      // 2. If the page requires auth, check if user is logged in
      // if not, redirect to login page.
      console.log(to.fullPath)

      return {
        name: '/login',
        // save the location we were at to come back later
        query: { redirect: to.fullPath },
      }
    }
    if (to.meta.requiresAdminAuth && userSession?.user?.user_role !== 'admin') {
      // 2. If the page requires auth, check if user is logged in
      // if not, redirect to login page.
      return {
        name: '/login',
        // save the location we were at to come back later
        query: { redirect: to.fullPath },
      }
    }
  })
})
