<template >
    <div class="main-div" v-if="loaded">

        <div class="data-div">
            <div class="heading-div">
                <h3 class="form-heading">{{ form_title }}</h3>
                <p class="form-desc">{{ form_desc }}</p>
            </div>
            <div v-for="(section, index) in sections" :key="index" class="section-div">
                <!-- <div class="question">{{ question.question }}</div>
                <div class="response">{{ getResponse(question) }}</div> -->
                <div class="section-header">
                    <span class="section-num">{{ index + 1 }} of {{ sections.length }}</span>
                    <span class="section-heading">{{ section['title'] }}</span>
                    <div class="sect-color"
                        :style="section['color'] === '' ? { 'backgroundColor': '#2152ff' } : { 'backgroundColor': section['color'] }">
                    </div>
                </div>
                <div class="questions-div row">
                    <div v-for="(question, index) in section['questions']" class="question " :key="index">
                        <div class="question-head col-6">
                            <span class="question-header">{{ index + 1 }}</span>
                            <span class="question-text">
                                <span class="question-body-text">
                                    {{ question['question'] === '' ? "Your Question" :
                                        question['question'] }}
                                </span>
                                <!-- <span v-if="question['isRequired']" class="required">*</span> -->
                            </span>

                        </div>
                        <div class="question-response col-5 offset-1">
                            <div v-if="question['type'] === 'file'">
                                <!-- <a :href="'http://localhost:8000/' + getResponse(question)"></a> -->
                                <!-- <img :src="'http://localhost:8000/' + getResponse(question)" alt=""> -->
                                File : {{ getResponse(question) }}

                            </div>
                            <div v-else-if="question['type'] === 'multiplechoice' || question['type'] === 'checkbox'">
                                
                                <ul>
                                    <li v-for="(element, index) in getArrayResponse(question)" :key="index">
                                        {{ element }}
                                    </li>
                                </ul>
                            </div>
                            <div v-else> {{ getResponse(question) }}</div>
                        </div>

                    </div>
                </div>

            </div>
            <div class="approve-button" v-if="!response['approved']">
                <button variant="gradient" color="info" class="mx-6 py-3 " :active="true" size="lg"
                    @click="approveForm">
                    Approve Form</button>
            </div>

            <button class="close-button" @click="closeModal">
                <!-- Cross SVG -->
                <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">

                <!-- Uploaded to: SVG Repo, www.svgrepo.com, Transformed by: SVG Repo Mixer Tools -->
                <svg width="48px" height="48px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                    stroke="#000000">
                    <g id="SVGRepo_iconCarrier">
                        <path
                            d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z"
                            fill="#000000" />
                    </g>

                </svg>
            </button>
        </div>

        <!-- <button @click="closeModal">X</button> -->

    </div>
</template>
<script setup  lang="ts">
import axios from 'axios'
import { useApiRoutes } from '/@src/stores/apiRoutes';


    const props = defineProps( ['responseData', 'form_id'])
    const emit = defineEmits(['close-response','update-responses'])
    const url = useApiRoutes().apiUrl
            var sections:any[] =  []
            var form_title= ''
            var form_desc= ''
            
            var loaded=false
            var response:any = null
        
    

        function closeModal() {
            emit('close-response')
        }
        function getResponse(question:any) {
            const ques = question['question'].split(' ').join('_') + question['index']

            return response[ques]
            
        }
        function getArrayResponse(question:any) {
            console.log(question);
            const ques = question['question'].split(' ').join('_') + question['index']
            const arrayString = response[ques]
            const array = JSON.parse(arrayString)

            return array
        }
        function approveForm() {
            axios.patch(url + 'approve-response', {
                'form_id' : props.form_id,
                'id': response['id'],
                'approved': true
            },{

                headers: {
                    Authorization: "token " + localStorage.getItem('token')
                }

            }
            ).then(response => {
                console.log(response);
                emit('update-responses')
                closeModal()
            })
            .catch(error => {
                console.error(error);
            })
        }
    
    onMounted(async()=> {
        console.log(props.form_id);
        
        const getdata = await axios.get(url + "get-form/" + props.form_id)

        const data = getdata.data['data']

        console.log(data);
        const secs = JSON.parse(data['meta'])['sections']
        let index = 0
        console.log(secs);
        secs.forEach((sec:any) =>{
            sec['questions'].forEach((ques:any)=>{
                ques['index'] = index
                index++
            })
        })

        form_title = data['title']
        form_desc = data['description']
        sections = secs
        response = props.responseData
        loaded = true
    },
    

    )

</script>
<style scoped lang="scss">
.main-div {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background-color: #282828e8;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    padding: 50px;
}

.data-div {
    background: white;
    width: 80%;
    padding: 60px 80px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: start;
    border-radius: 20px;
    gap: 35px;
    position: relative;
    box-shadow: -2px 2px 10px 1px #252525;
}



.heading-div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
}

.form-heading {
    font-size: 28px;
    font-weight: 800;
    color: #141727;
}

.form-desc {
    font-size: 18px;
    font-weight: 600;
    color: #141727;
    width: 80%;
    text-align: center;
}

.section-div {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    font-size: 20px;
    gap: 20px;
}


.section-header {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: stretch;
    gap: 1px;
    position: relative;
}

.section-heading {
    font-weight: 700;
    font-size: 22px;
    color: #141727;

}

.section-num {
    font-weight: 600;
    color: #141727;
    font-size: 16px;
}

.sect-color {
    width: 18px;
    border-radius: 20px;
    height: 100%;
    position: absolute;
    left: -30px;
    top: 0;

}

.questions-div {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
    gap: 30px;
    padding: 10px;
}

.required {
    color: red;
    font-size: 20px;
}

.question {
    display: flex;
    align-items: start;
    border-bottom: 1px solid #d4d4d465;
}

.close-button {
    position: absolute;
    right: 30px;
    top: 30px;
    font-size: 36px;
    cursor: pointer;
    background-color: transparent;
    outline: none;
    border: none;
}

.question-header {
    color: #141727;
    font-size: 18px;
    font-weight: 700;

}

.question-text {
    color: #141727;
    font-size: 18px;
    font-weight: 800;
    display: flex;
    justify-content: start;
    align-items: start;
    gap: 5px;
}

.question-desc {
    color: #707070;
    font-weight: 600;
}

.question-head {
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 10px;

}

.cross-img {
    width: 48px;
    height: 48px;

}

.approve-button {
    display: grid;
    place-items: center;
}

.question-response{
    font-size: 18px;
}
</style>