<script setup lang="ts">

import ProfilePreview from '@/components/Checker/subelements/ProfilePreview.vue'
import { onMounted, ref, toRef, watch } from 'vue'
import ProfileView from '@/components/Checker/subelements/ProfileView.vue'
import { useAdapter } from '@/hooks/DATA_TEMPLATE'

const chosenProfile = ref(-1);

export interface IProfileCard {
  title: string,
  data?: string,
}
const props = defineProps({
  profilesData: {type: Array<Record<string,any>>, default: null}
});
const profilesDataRef = toRef(props, 'profilesData');
const wayBackDisabled = ref(false);
const scrollHidden = ref(true);
let scrollHidTimeoutId:number | null = null;
const adaptedProfilesData = ref<Array<any>>();

watch(profilesDataRef, (val)=>{
  chosenProfile.value = -1;
  wayBackDisabled.value = false;
  if(val.length == 1){
    chosenProfile.value = 0;
    wayBackDisabled.value = true;
  }
  adaptedProfilesData.value = getAdaptedProfilesData();
})

function getAdaptedProfilesData(){ // CONVERTING DATA USING TEMPLATE ADAPTERS
  let adaptedData = Array<any>();
  for(const profile of props.profilesData){
    adaptedData.push({});
    for(const profile_field in profile){
      adaptedData[adaptedData.length-1][profile_field] = useAdapter(profile_field, profile[profile_field]);
    }
  }
  return adaptedData;
}

const emits = defineEmits(['exit']);

function onCardChosen(index:number):void {
  chosenProfile.value = index;
}

function backToTheList(){
  chosenProfile.value = -1;
}

function onExit(){
  emits('exit');
}

function onProfilesListScroll(){
  scrollHidden.value = false;
  if(scrollHidTimeoutId){
    clearTimeout(scrollHidTimeoutId);
  }
  scrollHidTimeoutId = setTimeout(()=>{
    scrollHidden.value = true;
  },1000)
}
onMounted(()=>{
})

</script>

<template>
  <div class="pc-wrapper">
  <div class = "card">
    <div class = "placeholder"
         v-if="!adaptedProfilesData?.length">
      <div class = "inline-title-ico">
      <div class = "title">Данные профиля</div>
      </div>
      <span class = "description" >Данные профиля организации и контактные данные будут отображены после заполнения поля с уникальным идентификатором.</span>
    </div>
    <div class = "profilesList"
        v-else-if="chosenProfile < 0">
      <div class = "inline-title-ico">
        <div class="ico exit-ico" @click = "onExit"></div>
        <div class = "title">Найденные профили</div>
      </div>
      <div class = "profiles-list-list" @scroll="onProfilesListScroll" :class="{scroll_hidden:scrollHidden}">
        <ProfilePreview v-for="(profile,index) in adaptedProfilesData" :key="index" :data="profile" @card-chosen="onCardChosen(index)"/>
      </div>
    </div>
    <div class = "profileCard"
    v-else>
      <div class = "inline-title-ico">
        <div class="mobile-shown ico" @click = "adaptedProfilesData.length > 1 ? backToTheList() : onExit()"></div>
        <div class="mobile-hidden ico" :class="{disabled:wayBackDisabled}" @click = "backToTheList"></div>
        <div class = "title">Данные профиля</div>
      </div>
      <ProfileView :data="adaptedProfilesData[chosenProfile]"/>
    </div>
  </div>
  <div class ="manager_info_block" v-if="chosenProfile >= 0 && adaptedProfilesData && adaptedProfilesData[chosenProfile]['manager']">
    <div class = "content-block">
      <span class="manager_title">МЕНЕДЖЕР</span>
      <span class="manager_name">{{adaptedProfilesData[chosenProfile]['manager']}}</span>
    </div>
  </div>
  </div>
</template>

<style scoped>

  .profilesList{
    display: flex;
    flex:1;
    flex-direction: column;
  }
  @property --var1 {
    syntax: "<color>";
    inherits: true;
    initial-value: white;
  }
  .profiles-list-list {
    --var1: #7e8387;
    transition: --var1 0.2s;
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    overflow-y: auto;
  }
  .profiles-list-list.scroll_hidden {
    --var1: transparent;
    transition: --var1 1s;
  }
  @media(hover:hover) {
    .profiles-list-list:hover {
      --var1: #7e8387;
      transition: --var1 1s;
    }
  }
  .profiles-list-list > *{
    margin-bottom: 10px;
  }
  .profiles-list-list::-webkit-scrollbar{
    width: 5px;
    border-radius: 10px;
  }
  .profiles-list-list::-webkit-scrollbar-thumb{
    border-radius: 20px;
  }
  @media(hover:none){
    .profiles-list-list::-webkit-scrollbar{
      width: 5px;
      border-radius: 10px;
    }
  }
  .profiles-list-list::-webkit-scrollbar-thumb{
    background: var(--var1);
  }

  .manager_name{
    padding-left: 10px;
    font-weight: 600;
    font-size: 15px;
    line-height: 150%;
    text-transform: uppercase;
    color: #7e8387;
  }
  .manager_title{
    font-weight: 700;
    font-size: 16px;
    color: #6191bd;
  }
  .manager_info_block{
    margin-top: 10px;
    border-radius: 30px;
    padding: 20px 30px;
    width: 100%;
    background: #e3e8ec;
    align-content: center;
  }
  .pc-wrapper{
    min-height: 182px;
    flex: 1;
    display: flex;
    flex-direction: column;
    font-family: 'Monserrat', sans-serif;
  }
  .ico{
    cursor: pointer;
    width: 30px;
    margin-right: 10px;
    height: 30px;
    content: url("@/assets/icons/back-ico.svg");
  }
  .ico:hover{
    content: url("@/assets/icons/back-ico-hover.svg");
  }
  .ico.disabled{
    cursor: default;
    pointer-events: none;
    content: url("@/assets/icons/back-ico-disabled.svg");
  }
  .inline-title-ico{
    min-height: 30px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .placeholder{

  }
  .no-display{
    display: none;
  }
  .title{
    color: rgb(70,70,70);
    font-weight: bold;
    font-size: 16px;
    text-transform: uppercase;
  }
  .description{
    color: rgb(148,148,148);
    font-size:15px;
    line-height: 150%;
  }
  .card{
    min-height: 182px;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 25px 30px 25px 30px;
    background-color: white;
    border-radius: 30px;
  }
</style>