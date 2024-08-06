<script setup lang="ts">

import ByteTransitLeftCornerLogo from "@/views/ByteTransitLeftCornerLogo.vue";
import UUIDInput from "@/views/UUIDInput.vue";
import { ref, watch } from 'vue'
import ProfilesCard from '@/components/Checker/subelements/ProfilesCard.vue'
import Button from '@/views/Button.vue'
import APIFetch from '@/hooks/APIFetch'
import { AxiosError } from 'axios'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter();
const route = useRoute();

const API_ENDPOINT = ''; // relative api link

const uuid = ref<string>(route.params.uuid as string);
const val = ref<string>(route.params['uuid'] as string); // input content string
const isError = ref(false);  // request error
const isLoading = ref(false); // request loading status
const isInputError = ref(false); // input validator result
const isInputEmpty = ref(!val.value);
const profilesData = ref<Array<any> | undefined>(); // server response
let currentProfile:string;


if(route.params['uuid']){
  getData();
}

//============================== Input Validation ==================================================

const validator = (val : string | undefined) => { // input validator
  return !(val && val.length > 40);
}


watch(val, (newValue)=> { //watch if input is empty
  if((isInputEmpty.value = newValue.length == 0)){
    warningText.value='';
    if(uuid.value) {
      router.push('/');
    }
  }
});


watch(isError, (val) => { //watch input validator check state
  isInputError.value = val
  if(val){
    warningText.value = "Разрешенная длина uuid: до 40 символов включительно"
  }else{
    warningText.value = '';
  }
});

watch(() => route.params, (newValue, oldValue) => { //watch router params
  if(newValue.uuid != oldValue.uuid) {
      uuid.value = newValue.uuid as string;
      if(currentProfile != newValue.uuid) {
        val.value = newValue.uuid ? newValue.uuid as string : '';
        if (typeof newValue.uuid == typeof undefined) {
          profilesData.value = [];
          currentProfile = '';
        } else {
          getData();
        }
      }
  }
})


//============================== Request functionality =============================================

// api request
async function fetchData(uuid: string) {
  const response = await APIFetch("post", API_ENDPOINT,
    {
      uuid: uuid,
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
  fetchData(val.value).then((response) => {
    profilesData.value = response;
    warningText.value = "";
    router.push(val.value);
    currentProfile = val.value;
    }).catch((err:AxiosError)=>{
      profilesData.value = [];
      let isNetworkError = false;
      if(err.code == "ERR_NETWORK") isNetworkError = true;
      if(err.response?.status !== 404){
        console.error("Ошибка во время выполнения запроса: "+err+" Данные прологгированы ниже:");
        console.log(err);
      }
    switch(err.response?.status){
      case 404: warningText.value='Введен некорректный УИН, либо профиль с таким УИНом отсутствует в базе данных учетной системы.</br>' +
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



</script>

<template>
  <div class = "wrpr">
    <ByteTransitLeftCornerLogo @logo-click="router.push('/')" class="bt-logo"/>
    <div class = "mainblock">
      <div class = 'form_content' :class="{mobile_hidden: profilesData?.length}">
        <div class = 'title'>Проверка корректности профиля</div>
        <UUIDInput class="inpt"
                   @keydown.enter="val.length ? getData() : undefined"
                   :validator="validator"
                   v-model:inputError="isError"
                   :placeholder="'Уникальный идентификатор'"
                   v-model:input-val="val"/>
        <Button class="form_button"
                @click="getData();"
                :is-loading="isLoading"
                :is-disabled="isInputError || isInputEmpty"
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