<route lang="yaml">
  meta:
    requiresUserAuth: true
  </route>

<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Formastic - Dashboard')

useHead({
  title: 'Formastic ',
})
</script>

<template>
  <NavbarLayout>
    <div class="page-content-inner">
      <PersonalDashboardV2 />
    </div>
  </NavbarLayout>
</template>
