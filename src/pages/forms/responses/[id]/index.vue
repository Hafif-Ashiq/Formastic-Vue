<route lang="yaml">
props: true
meta:
  requiresUserAuth: true
</route>



<script setup lang="ts">
import VTag from '/@src/components/base/tags/VTag.vue'
import FlexTableDropdown from '/@src/components/partials/dropdowns/FlexTableDropdown.vue'
// import VAvatarStack from '/@src/components/base/avatar/VAvatarStack.vue'
// import { flexRowsAdvanced } from '/@src/data/documentation/table'
// import { onceImageErrored } from '/@src/utils/via-placeholder'
import { RouterLink } from 'vue-router/auto'
import axios from 'axios'
import { useUserSession } from '/@src/stores/userSession'
import { useApiRoutes } from '/@src/stores/apiRoutes'
import { useNotyf } from '/@src/composable/useNotyf'
const collator = new Intl.Collator('en')
// const numberFormat = new Intl.NumberFormat('en-US', {
//   style: 'currency',
//   currency: 'USD',
// })
const router = useRouter()
const route = useRoute()
const userSession = useUserSession()
const notyf = useNotyf()
const apiRoutes = useApiRoutes()
const url = apiRoutes.apiUrl
const emit = defineEmits(['create-form','reload'])


const props = defineProps(['id'])

var responses:any[] = []
const modalOpen = ref(false)
const response_form_id = ref(-1)
const loaded = ref(false)

onMounted(async () =>{
  console.log(url);
  

  await axios.get('http://localhost:8000/get-responses/'+props.id,{
    headers: {
      Authorization : 'token ' + sessionStorage.getItem('token')
    }
  }).then(response => {
    response.data
    
    responses = response.data

    responses.forEach((el,index) => {
      el['questions'] = 0
      el['responses'] = 0
      el['sr_no'] = index+1
    })
    
  }).catch(err => {
    console.error(err);
    
  })
  loaded.value = true
})
const viewForm = (row:any) => {
  // apiRoutes.setCreateFormId(row.id)
  // router.push('/forms/create-form/' + row.id)
  
  response_form_id.value = row.id
  
  console.log(response_form_id.value);
  modalOpen.value = true

}



const sortedData = computed(() => {
  switch (route.query.sort) {

    case 'created_at:asc': {
      return [...responses].sort((a, b) =>
        a.created_at > b.created_at ? 1 : -1
      )
    }
    case 'created_at:desc': {
      return [...responses].sort((a, b) =>
        a.created_at > b.created_at ? -1 : 1
      )
    }
   
    default: {
      return responses
    }
  }
})

const SortColumnComponent = defineComponent({
  props: {
    label: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    dataType:{
      type: String
    },
    sortIcon:{
      type:Boolean,
      required:true
    }
  },
  setup(props) {
    const currentRoute = useRoute()
    return () =>
      h(
        RouterLink,
        {
          to: {
            ...currentRoute,
            query: props.sortIcon ? {
              sort:
                currentRoute.query.sort === `${props.id}:asc`
                  ? `${props.id}:desc`
                  : currentRoute.query.sort === `${props.id}:desc`
                  ? undefined
                  : `${props.id}:asc`,
            } : {},
          },
        },
        {
          default() {
            const icon = h(
              'span',
              { key: `${currentRoute.query.sort}`, class: 'is-inline' },
              h('span', {
                class: 'iconify is-inline',
                'data-icon':
                  currentRoute.query.sort === `${props.id}:asc`
                    ? 'fa6-solid:sort-up'
                    : currentRoute.query.sort === `${props.id}:desc`
                    ? 'fa6-solid:sort-down'
                    : 'fa6-solid:sort',
              })
            )

            return props.sortIcon ? [props.label, icon] : [props.label]
          },
        }
      )
  },
})

// this is the how rows and columns are rendered
const columns = {
  sr_no : {
    bold: true,
    // we can use custom render function for column heading
    renderHeader: () =>
      h(
        'span',
        {},
        h(SortColumnComponent, {
          label: '#',
          id: 'sr_no',
          sortIcon:true
        })
      ),
  },
  created_at: {
    renderHeader: () =>
      h(
        'span',
        {},
        h(SortColumnComponent, {
          label: 'Submit Date',
          id: 'created_at',
          sortIcon:true
        })
      ),
  },
  approved: {
    label: 'approved',
    // we can use custom render function for each rows
    renderRow: (row: any) =>
      h(
        VTag,
        {
          rounded: true,
          color:
            row.approved 
              ? 'success'
              : 'danger'
              
        },
        // that notation is to render content in the default slot
        {
          default() {
            return `${row.approved? 'Approved' : "Not Approved"}`
          },
        }
      ),
    // we can use custom render function for column heading
    renderHeader: () =>
      h(
        'span',
        {},
        h(SortColumnComponent, {
          label: 'Approved',
          id: 'approved',
          sortIcon:false
        })
      ),
  },

  actions: {
    label: '',
    align: 'end',
    renderRow: (row: any) =>
      h(FlexTableDropdown,{
        published: row['published'],
        // We can catch all events from vue
        
        onView: () => {
          console.log('viewing', row)
          viewForm(row)
        },
        onCopy: () => {
          console.log('Copy Link', row)
          // copyLink(row)
        },
        onSchedule: () => {
          console.log('response', row)
        },
        onRemove: () => {
          console.log('remove', row)
          // handleRemove(row)
        },
      },),
  },
} as const
</script>

<template>

<NavbarLayout>
    <!-- Content Wrapper -->
    <div class="page-content-inner full-width" v-if="loaded">

  <div 
    v-if="loaded" 
    class="all-projects" 
  >
    <!-- <ProjectsToolbar
      @create-form="() => {
        $emit('create-form')
      }" 
    />   -->

    <h3 class="section-heading">
     Responses 
    </h3>
    
    <div class="columns">
      <div class="column is-12">
        <VFlexTable
          :data="sortedData"
          :columns="columns"
          rounded
        />
      </div>
    </div>
  </div>
  </div>

  <ResponseModal v-if="modalOpen" :form-id="$props.id" :response-data="modalOpen" >

  </ResponseModal>
  </NavbarLayout>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';

.all-projects {
  .section-heading {
    font-family: var(--font-alt);
    font-size: 0.85rem;
    text-transform: uppercase;
    color: var(--light-text);
    margin-bottom: 1rem;
  }

  .project-grid {
    margin-bottom: 1.5rem;

    .project-grid-item {
      @include vuero-s-card;

      text-align: center;
      box-shadow: none;

      &:hover,
      &:focus {
        border-color: var(--fade-grey-dark-6);
        box-shadow: var(--light-box-shadow);

        .project-avatar {
          filter: grayscale(0);
          opacity: 1;
        }
      }

      .project-avatar {
        display: block;
        height: 40px;
        width: 40px;
        border-radius: 10px;
        margin: 0 auto 10px;
        filter: grayscale(1);
        opacity: 0.6;
        transition: all 0.3s; // transition-all test
      }

      h3 {
        font-size: 0.95rem;
        font-family: var(--font-alt);
        font-weight: 600;
        color: var(--dark-text);
      }

      p {
        font-size: 0.9rem;
        margin-bottom: 10px;
      }
    }
  }
}

.is-dark {
  .all-projects {
    .project-grid {
      .project-grid-item {
        @include vuero-card--dark;

        h3 {
          color: var(--dark-dark-text);
        }
      }
    }
  }
}

@media only screen and (width <= 767px) {
  .all-projects {
    .all-projects-header {
      flex-direction: column;

      .header-item {
        width: 100%;
        border-inline-end: none;
        border-bottom: 1px solid var(--fade-grey-dark-3);
        padding: 16px 0;

        &:last-child {
          border-bottom: none;
        }
      }
    }

    .projects-card-grid {
      .grid-item {
        .bottom-section {
          flex-wrap: wrap;

          .foot-block {
            &:first-child {
              width: 100%;
              margin: 0;
              text-align: center;
              padding: 16px 0;

              .developers {
                justify-content: center;

                .v-avatar {
                  margin: 0 4px;
                }
              }
            }

            &:not(:first-child) {
              width: 33.3%;
              text-align: center;
              margin: 0;
            }
          }
        }
      }
    }

    .illustration-header {
      > img {
        display: none !important;
      }

      .header-stats {
        .stats-inner {
          flex-wrap: wrap;

          .stat-item {
            width: 50%;
            margin: 0;
            padding: 16px 0;
          }
        }
      }
    }

    .project-minimal-grid {
      .grid-header {
        .filter {
          display: none;
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .all-projects {
    .illustration-header {
      > img {
        display: none !important;
      }

      .header-stats {
        .stats-inner {
          width: 100%;

          .stat-item {
            width: 25%;
          }
        }
      }
    }

    .project-minimal-grid {
      .grid-body {
        display: flex;

        .column {
          min-width: 50%;
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: landscape) {
  .all-projects {
    .illustration-header {
      .header-stats {
        .stats-inner {
          .stat-item {
            width: 25%;
          }
        }
      }
    }

    .recent-projects {
      .project-box {
        h3 {
          font-size: 1.1rem;
        }
      }
    }

    .project-minimal-grid {
      .grid-body {
        .grid-item {
          .item-title {
            padding: 30px 0;

            h3 {
              font-size: 1.5rem;
            }
          }
        }
      }
    }

    .projects-card-grid {
      .grid-item {
        .bottom-section {
          margin-top: 0.75rem;

          .foot-block {
            &:first-child {
              display: none;
            }
          }
        }
      }
    }
  }
}
</style>
