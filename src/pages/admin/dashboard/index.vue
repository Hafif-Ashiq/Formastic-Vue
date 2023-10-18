<route lang="yaml">
meta:
  requiresAdminAuth: true
</route>

<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Company Dashboard')

useHead({
  title: 'Company Dashboard - Sidebar - Vuero',
})
</script>

<template>
  <SidebarLayout>
    <div class="page-content-inner">
      <CompanyDashboard />
    </div>
  </SidebarLayout>
</template>
