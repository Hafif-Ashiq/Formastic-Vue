<script setup lang="ts">
const emits = defineEmits<{
  (e: 'view'): void
  (e: 'copy'): void
  (e: 'response'): void
  (e: 'remove'): void
}>()

const props = defineProps(['published'])


</script>

<template>
  <VDropdown
    icon="feather:more-vertical"
    class="is-pushed-mobile"
    spaced
    right
  >
    <template #content="{ close }">
      <a
        v-if="!published"
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('view')
            close()
          }
        "
      >
        <div class="icon">
          <i
            aria-hidden="true"
            class="lnil lnil-eye"
          />
        </div>
        <div class="meta">
          <span>View / Update</span>
          <span>View or Update Form</span>
        </div>
      </a>

      <a 
        v-if="published"
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('response')
            close()
          }
        "
      >
        <div class="icon">
          <i
            aria-hidden="true"
            class="lnil lnil-eye"
          />
        </div>
        <div class="meta">
          <span>View Responses</span>
          <span>View Form Responses</span>
        </div>
      </a>

       <a
       v-if="published"
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('copy')
            close()
          }
        "
      >
        <div class="icon">
          <i
            aria-hidden="true"
            class="lnil lnil-copy"
          />
        </div>
        <div class="meta">
          <span>Copy Link</span>
          <span>Copy response link</span>
        </div>
      </a>

      

      <hr class="dropdown-divider">

      <a
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('remove')
            close()
          }
        "
      >
        <div class="icon">
          <i
            aria-hidden="true"
            class="lnil lnil-trash-can-alt"
          />
        </div>
        <div class="meta">
          <span>Remove</span>
          <span>Remove from list</span>
        </div>
      </a>
    </template>
  </VDropdown>
</template>
