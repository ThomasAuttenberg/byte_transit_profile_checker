<script setup lang="ts">

import ByteTransitLeftCornerLogo from "@/views/ByteTransitLeftCornerLogo.vue";
import UUIDInput from "@/views/UUIDInput.vue";
import { ref, type VNodeRef, watch } from 'vue'
import ProfilesCard from '@/components/Checker/subelements/ProfilesCard.vue'
import Button from '@/views/Button.vue'
import APIFetch from '@/hooks/APIFetch'
import { AxiosError } from 'axios'
import { useRoute, useRouter } from 'vue-router'
import PrettyDropList from '@/views/PrettyDropList.vue'
const router = useRouter();
const route = useRoute();

const API_ENDPOINT = ''; // relative api link

const criteria = ref<string>(route.params.criteria as string);
const query = ref<string>(route.params.query as string);
const inputValue = ref<string>(''); // input content string
const isError = ref(false);  // request error
const isLoading = ref(false); // request loading status
const isInputEmpty = ref<boolean>(true);
const inputRef = ref<VNodeRef | null>(null);
const profilesData = ref<Array<any> | undefined>(); // server response
const mode = ref<InputMode>();
const selected = ref<number>(-1);

//console.log(criteria.value)
//console.log(query.value)

interface InputMode {
  mode: string;
  mask: any; // Здесь можно уточнить тип в зависимости от используемой библиотеки для масок
  label: string;
  validator: (val?: string) => boolean;
  errorText: string;
  inputIco: URL; // Предполагается, что это строка с URL
  inputPlaceholder: string;
  middleware?: (val: string) => string;
}

const inputModes : InputMode[] = [
  {
    mode: "phone",
    mask: {
      mask:'+{7}(000)000-00-00',
      prepare: (appended:string, masked:any) => {
        if (appended[0] === '8' && masked.value === '') {
          return '+7'+appended.slice(1);
        }
        return appended;
      },
    },
    label: 'Искать по номеру телефона',
    validator: (val:string | undefined) => {return val? val.length == 11 : false},
    errorText: 'Номер телефона должен содержать 11 цифр',
    inputIco: new URL("@/assets/icons/phone-ico.svg", import.meta.url),
    inputPlaceholder: 'Телефон',
    middleware: (value:string) : string => {
       return 8 + value.slice(1);
    }
  },
  {
    mode: "uuid",
    mask: { mask: /^[A-Za-z0-9-]{0,36}$/, },
    label: 'Искать по УИН',
    validator: (val:string | undefined) => {return val? val.length <= 50 : false},
    errorText: 'UUID должен состоять из 36 символов',
    inputIco: new URL("@/assets/icons/profileico.svg", import.meta.url),
    inputPlaceholder: 'Уникальный идентификатор'
  },
  {
    mode: "inn",
    mask: { mask: /^\d{0,14}$/ },
    label: 'Искать по ИНН',
    validator: (val:string | undefined) => {return val? val.length >= 9 && val.length <= 14:false},
    errorText: 'ИНН должен содержать от 9 до 14 цифр',
    inputIco: new URL("@/assets/icons/inn-ico.svg", import.meta.url),
    inputPlaceholder: 'ИНН'
  },
  {
    mode: "login",
    mask: { mask: /^[a-zA-Z0-9._%+-]*@?[a-zA-Z0-9.-]*\.?[a-zA-Z]{0,6}$/ },
    label: 'Искать по логину',
    validator: (val:string | undefined) => {return val ? val.length > 0 && val.length<=50: false},
    errorText: 'Логин не должен быть пустым',
    inputIco: new URL("@/assets/icons/profileico.svg", import.meta.url),
    inputPlaceholder: 'Логин'
  },
  {
    mode: "email",
    mask: {mask: /^[a-zA-Z0-9._%+-]*@?[a-zA-Z0-9.-]*\.?[a-zA-Z]{0,6}$/ },
    label: 'Искать по почте',
    validator: (val:string | undefined) => {return  val? /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(val) && val.length<=50 : false},
    errorText: 'Почта введена некорректно',
    inputIco: new URL("@/assets/icons/mail-ico.svg", import.meta.url),
    inputPlaceholder: 'Почта'
  },
  {
    mode: "legal_name",
    mask: { mask: /^[a-zA-Zа-яА-ЯёЁ0-9\s"'-]{0,50}$/ },
    label: 'Искать по наименованию',
    validator: (val: string | undefined) => {return val? val.length<=50 : false},
    errorText: 'Наименование не может содержать более 50 символов',
    inputIco: new URL("@/assets/icons/legal-name-ico.svg", import.meta.url),
    inputPlaceholder: 'Наименование'
  }
]

const modeIndexMap: Record<string, number> = inputModes.reduce((acc, modeObj, index) => {
  acc[modeObj.mode] = index; // Устанавливаем ключ как значение mode, а значение — индекс
  return acc; // Возвращаем аккумулятор
}, {} as Record<string, number>);


if(criteria.value && query.value){
  mode.value = inputModes[modeIndexMap[criteria.value]];
  if(mode.value) {
    selected.value = modeIndexMap[criteria.value];
    if(mode.value.validator(query.value)) {
      inputValue.value = query.value;
      isInputEmpty.value = false;
      getData();
    } else {
      router.push('/');
    }
  }else{
    router.push('/');
  }
}else{
  if(route.params){
    router.push('/');
  }
}

//============================== Input Validation ==================================================

const validator = (val : string | undefined) => { // input validator
  return !(val && val.length > 50);
}

watch(inputValue, (newValue)=> { //watch if input is empty
  if((isInputEmpty.value = newValue.length == 0)){
    warningText.value='';
    if(criteria.value && query.value) {
      router.push('/');
    }
  }
});


watch(isError, (val) => { //watch input validator check state
  if(val){
    warningText.value = inputModes[selected.value].errorText;
  }else{
    warningText.value = '';
  }
});

watch(() => route.params, (newValue, oldValue) => { //watch router params
  if(newValue.criteria != oldValue.criteria || newValue.query != oldValue.query) {
    query.value = newValue.query as string;
    criteria.value = newValue.criteria as string;
    inputValue.value = newValue.query ? newValue.query as string : '';
    if (!newValue.criteria || !newValue.query) {
      profilesData.value = [];
    } else {
      getData();
    }
  }
})


//============================== Request functionality =============================================

// api request
async function fetchData(criteria: string, query: string) {
  const response = await APIFetch("post", API_ENDPOINT,
    {
      type: criteria,
      value: query,
    }
  );
  if(!Array.isArray(response.data))
    throw new Error("NOT_ARRAY");
  return Promise.resolve(response.data);
}

const warningText = ref('');

// api request & result processing
function getData(){
  isLoading.value = true;
  let searchingQuery = inputRef.value ? inputRef.value.getUnmaskedValue() : route.params.query;
  if(mode.value?.middleware){
    searchingQuery = mode.value.middleware(searchingQuery);
  }
  fetchData((mode.value as InputMode).mode, searchingQuery).then((response) => {
    profilesData.value = response;
    warningText.value = "";
    //console.log("query: "+searchingQuery);
    router.push({name:'search', params:{criteria:mode.value?.mode, query:searchingQuery}})
    }).catch((err:AxiosError)=>{
      profilesData.value = [];
      let isNetworkError = false;
      if(err.code == "ERR_NETWORK") isNetworkError = true;
      if(err.response?.status !== 404){
        console.error("Ошибка во время выполнения запроса: "+err+" Данные прологгированы ниже:");
        console.log(err);
      }
    switch(err.response?.status){
      case 404: warningText.value='Профиль с указанными данными отсутствует в базе данных учетной системы.</br>' +
        '<b>Попробуйте указать другой УИН.</b>';
        break;
      case 500: warningText.value="<b>Internal Server Error:</b> внутренняя ошибка сервера";
        break;
      case 400:
        warningText.value="<b>Bad Request (400):</b> сервер не понимает запрос. " +
          "Данные в консоли";
        break;
      case 403:
        warningText.value="<b>Access is Forbidden (403):</b> отказ сервера в обслуживании." +
          "Данные в консоли";
        break;
      default:
        if(!isNetworkError) {
          warningText.value = "<b>Произошла ошибка</b> во время выполнения запроса: " +
            "(code:" + err.response?.status + "). Дополнительные данные в консоли";
        }else{
          warningText.value = "<b>Невозможно подключиться к серверу.</b> Обратитесь к системному администратору";
        }
        break;
    }
    }).catch((err:Error)=>{
      if(err.message == "NOT_ARRAY"){
        warningText.value = "Ошибка типизации ответа сервере. Ожидаем"
      }
    }

  ).finally(()=>{
      setTimeout(()=>{isLoading.value = false},300);
  });
}

//==================================================================


const options : Array<string> = inputModes.map(mode => mode.label);

watch(selected, (value:number) => {
  inputValue.value='';
  mode.value = inputModes[value];

})



</script>

<template>
  <div class = "wrpr">
    <ByteTransitLeftCornerLogo @logo-click="router.push('/')" class="bt-logo"/>
    <div class = "mainblock">
      <div class = 'form_content' :class="{mobile_hidden: profilesData?.length}">
        <div class = 'title'>Проверка корректности профиля</div>
        <PrettyDropList class="drop-list"
                        v-model:selected="selected"
                        :options
                        :prop="'Искать по...'">
        </PrettyDropList>
        <UUIDInput ref="inputRef" v-show="selected != -1" class="inpt" style="margin-top: 10px"
                   @keydown.enter="!(isError || isInputEmpty) ? getData() : undefined"
                   :mask="inputModes[selected]?.mask"
                   v-model:inputError="isError"
                   :validator="inputModes[selected] ? inputModes[selected].validator : ()=>{return true;}"
                   :placeholder="inputModes[selected] ? inputModes[selected].inputPlaceholder : 'Искать по...'"
                   :ico="inputModes[selected]?.inputIco"
                   v-model:input-val="inputValue"/>

        <Button class="form_button"
                @click="getData();"
                :is-loading="isLoading"
                :is-disabled="isError || isInputEmpty"
                :button-text="'Проверить'"/>
        <div class = "warning" v-html="warningText">
        </div>
      </div>
      <ProfilesCard @exit="profilesData = []" class="profileCard" :class="{mobile_hidden: !profilesData?.length}" :profiles-data="profilesData"/>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap');
.boldWarningText{
  font-weight: 600;
}
.drop-list{
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 150%;
}
.warning{
  padding-top: 10px;
  font-family: 'Monserrat', sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 150%;
  color: #f8960f;
}
.title{
  line-height: 130%;
  color: rgb(70,70,70);
  font-size: 20px;
  font-weight: bold;
  text-transform: uppercase;
  font-family: 'Monserrat', sans-serif;
  margin-bottom: 20px;
}
.form_button {
  margin-top: 10px;
  height: 50px;
  border: none;
}
.mainblock{
  max-width: 970px;
  padding-right: 20px;
  padding-left: 20px;
  min-height:182px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin: 90px auto;
}
.bt-logo{
  content:"";
  height: 79px;
  max-width: 970px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 10px auto;
  padding-left: 20px;
  padding-right: 20px;
}
.profileCard{
  max-width: 560px;
}
.profileCard:deep(.tooltip){
  left: 100%;
  cursor: auto;
  pointer-events: none;
}
.profileCard:deep(.tooltip).copyEvent{
  animation: none;
}
@media(max-width: 1052px){
  .profileCard:deep(.tooltip){
    top: -100%;
    left: auto;
    right: -135%;
  }
}
.form_content{
  padding: 0 50px 0 0;
  display: flex;
  width: 350px;
  flex-direction: column;
  justify-content: space-between;
}

@media (max-width: 768px){
  :deep(.mobile-hidden){
    display: none;
  }
  :deep(.mobile-shown){
    display: block;
  }
  .profileCard:deep(.profilesList){
    max-height: calc(100vh - 204px);
    min-height: 210px;
  }
  .profileCard:deep(.exit-ico){
    display: block;
  }
  .form_content.mobile_hidden{
    display: none;
  }
  .form_content{
    margin: 50px auto;
    width: 100%;
    padding: 0;
  }
  .mobile_hidden{
    display: none;
  }
  .profileCard{
    margin: 30px auto;
    max-width: none;
  }
  .mainblock{
    margin: 0;
    align-items: center;
    justify-content: center;
  }
}
.wrpr{
  box-sizing: inherit;
  position: relative;
  padding: 1px;
  min-height: 100vh;
  min-width: 100vw;
  background: #EEEFF0;
}
@media(min-width: 769px) {
  :deep(.mobile-shown){
    display: none;
  }
  .profileCard:deep(.profilesList){
    max-height: min(calc(100vh - 324px), 580px);
    min-height: 220px;
  }
  .profileCard:deep(.exit-ico) {
    display: none;
  }

}

</style>