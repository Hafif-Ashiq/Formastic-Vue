<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Health Dashboard')

useHead({
  title: 'Health Dashboard - Sidebar - Vuero',
})
</script>

<template>
  <div class="page-content-inner">
    <LifestyleDashboardV3 />
  </div>
</template>
