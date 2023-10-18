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


interface UserForm {
  "id": number,
  "title": string,
  "description": string,
  "meta": string,
  "published": boolean,
  "form_table": string,
  "user_id": number,
  "created_at" : Date,
  "questions" : Number,
  "responses" : Number,
  "sr_no" : Number
      }

var userForms:UserForm[] = []



const loaded = ref(false)
onMounted(async () =>{
  // console.log(url);
  

  await axios.get('http://localhost:8000/form-api/',{
    headers: {
      Authorization : 'token ' + sessionStorage.getItem('token')
    }
  }).then(response => {
    response.data
    
    userForms = response.data

    userForms.forEach((el,index) => {
      el['questions'] = 0
      el['responses'] = 0
      el['sr_no'] = index+1
    })
    
  }).catch(err => {
    console.error(err);
    
  })
  loaded.value = true
})
const viewForm = (row:UserForm) => {
  // apiRoutes.setCreateFormId(row.id)

}

const handleRemove = async (row:UserForm) =>
{
  console.log(row);
  
  await axios.delete(url + 'form-api/',{
    data: {
      id : row['id']
    },
    headers: {
      Authorization : 'token ' + sessionStorage.getItem('token')
    }
  }).then(response => {
    console.log(response);
    
    if (response.status == 200) {
      notyf.dismissAll()
      notyf.success("Form Deleted!!")
      emit('reload')
    }
  }).catch(err=>{
    console.log(err);
    
    notyf.dismissAll()
    notyf.error("Form can not be deleted at the moment!!")

  })
  
}

const copyLink = (row:UserForm) =>{
  navigator.clipboard.writeText('http://localhost:3000/' + "response/" + row['id'])
  notyf.success('Link copied to Clipboard!')
}

const showResponses = (row:UserForm) =>{
  router.push('forms/responses/'+row.id)

  
}


const sortedData = computed(() => {
  switch (route.query.sort) {
    case 'title:asc': {
      return [...userForms].sort((a, b) =>
        collator.compare(a.title, b.title)
      )
    }
    case 'title:desc': {
      return [...userForms].sort((a, b) =>
        collator.compare(b.title, a.title)
      )
    }
    case 'created_at:asc': {
      return [...userForms].sort((a, b) =>
        a.created_at > b.created_at ? 1 : -1
      )
    }
    case 'created_at:desc': {
      return [...userForms].sort((a, b) =>
        a.created_at > b.created_at ? -1 : 1
      )
    }
    case 'sr_no:asc': {
      return [...userForms].sort((a, b) =>
        a.sr_no > b.sr_no ? 1 : -1
      )
    }
    case 'sr_no:desc': {
      return [...userForms].sort((a, b) =>
      a.sr_no > b.sr_no ? -1 : 1
      )
    }
    // case 'status:asc': {
    //   return [...flexRowsAdvanced].sort((a, b) => collator.compare(a.status, b.status))
    // }
    // case 'status:desc': {
    //   return [...flexRowsAdvanced].sort((a, b) => collator.compare(b.status, a.status))
    // }
    // case 'contacts:asc': {
    //   return [...flexRowsAdvanced].sort((a, b) =>
    //     a.contacts.length > b.contacts.length ? 1 : -1
    //   )
    // }
    // case 'contacts:desc': {
    //   return [...flexRowsAdvanced].sort((a, b) =>
    //     a.contacts.length > b.contacts.length ? -1 : 1
    //   )
    // }
    default: {
      return userForms
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
  title: {
    bold: true,
    // we can use custom render function for column heading
    renderHeader: () =>
      h(
        'span',
        {},
        h(SortColumnComponent, {
          label: 'Title',
          id: 'title',
          sortIcon:true
        })
      ),
  },
  // position: {
  //   renderHeader: () =>
  //     h(
  //       'span',
  //       {},
  //       h(SortColumnComponent, {
  //         label: 'Position',
  //         id: 'position',
  //       })
  //     ),
  // },
  // annualEarnings: {
  //   inverted: true,
  //   format: (value: any) => numberFormat.format(value),
  //   // we can use custom render function for column heading
  //   renderHeader: () =>
  //     h(
  //       'span',
  //       {},
  //       h(SortColumnComponent, {
  //         label: 'Revenue',
  //         id: 'annual-earnings',
  //       })
  //     ),
  // },
  published: {
    label: 'published',
    // we can use custom render function for each rows
    renderRow: (row: any) =>
      h(
        VTag,
        {
          rounded: true,
          color:
            row.published 
              ? 'success'
              : 'danger'
              
        },
        // that notation is to render content in the default slot
        {
          default() {
            return `${row.published? 'Published' : "Not Published"}`
          },
        }
      ),
    // we can use custom render function for column heading
    renderHeader: () =>
      h(
        'span',
        {},
        h(SortColumnComponent, {
          label: 'Published',
          id: 'published',
          sortIcon:false
        })
      ),
  },
  created_at: {
    renderHeader: () =>
      h(
        'span',
        {},
        h(SortColumnComponent, {
          label: 'Creation Date',
          id: 'created_at',
          sortIcon:true
        })
      ),
  },
  
  questions: {
    renderHeader: () =>
      h(
        'span',
        {},
        h(SortColumnComponent, {
          label: 'Questions',
          id: 'no_questions',
          sortIcon:false
        })
      ),
    
  },
  responses: {
    renderHeader: () =>
      h(
        'span',
        {},
        h(SortColumnComponent, {
          label: 'Responses',
          id: 'no_responses',
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
          copyLink(row)
        },
        onResponse: () => {
          console.log('response', row)
          showResponses(row)
        },
        onRemove: () => {
          console.log('remove', row)
          handleRemove(row)
        },
      },),
  },
} as const
</script>

<template>
  <div 
    v-if="loaded" 
    class="all-projects" 
  >
    <ProjectsToolbar
      @create-form="() => {
        $emit('create-form')
      }" 
    />  

    <h3 class="section-heading">
      User Forms
    </h3>
    <!--
    <div class="columns is-multiline project-grid is-flex-tablet-p is-half-tablet-p">
      <div class="column is-one-fifth">
        <a class="project-grid-item">
          <img
            class="project-avatar"
            src="/images/icons/logos/slicer.svg"
            alt=""
            @error.once="onceImageErrored(150)"
          >
          <h3>The Slicer project</h3>
          <p>Design project</p>
          <VProgress
            size="tiny"
            :value="31"
          />
        </a>
      </div>

      <div class="column is-one-fifth">
        <a class="project-grid-item">
          <img
            class="project-avatar"
            src="/images/icons/logos/metamovies.svg"
            alt=""
            @error.once="onceImageErrored(150)"
          >
          <h3>Metamovies reworked</h3>
          <p>Design project</p>
          <VProgress
            size="tiny"
            :value="84"
          />
        </a>
      </div>

      <div class="column is-one-fifth">
        <a class="project-grid-item">
          <img
            class="project-avatar"
            src="/@src/assets/illustrations/dashboards/flights/company1.svg"
            alt=""
            @error.once="onceImageErrored(150)"
          >
          <h3>Supreme Flights app</h3>
          <p>Software project</p>
          <VProgress
            size="tiny"
            :value="45"
          />
        </a>
      </div>

      <div class="column is-one-fifth">
        <a class="project-grid-item">
          <img
            class="project-avatar"
            src="/images/icons/logos/fastpizza.svg"
            alt=""
            @error.once="onceImageErrored(150)"
          >
          <h3>Fastpizza delivery app</h3>
          <p>Software project</p>
          <VProgress
            size="tiny"
            :value="90"
          />
        </a>
      </div>

      <div class="column is-one-fifth">
        <a class="project-grid-item">
          <img
            class="project-avatar"
            src="/images/icons/logos/drop.svg"
            alt=""
            @error.once="onceImageErrored(150)"
          >
          <h3>Drop website redesign</h3>
          <p>Design project</p>
          <VProgress
            size="tiny"
            :value="12"
          />
        </a>
      </div>
    </div> -->

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
