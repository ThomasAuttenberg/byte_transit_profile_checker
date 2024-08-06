<script setup lang="ts">
import InformationField from '@/components/Checker/subelements/InformationField.vue'
import {getTemplateTitleByField as getTemplateLabel } from '@/hooks/DATA_TEMPLATE'

defineProps({
  data: {type: Object, required: true}
});
const emits = defineEmits(["cardChosen"]);

function onClick(){
  emits('cardChosen');
}

</script>

<template>
  <div class = "cd">
    <div class = "content-block">
      <div class = "inline-title-ico">
      <div class = "title">{{data['name']}}
      </div>
        <div class="ico" @click = "onClick"></div>
      </div>
      <InformationField v-if="data['inn']" :copyable="false" :text="data['inn']" :label="getTemplateLabel('inn')+':'"/>
      <InformationField v-if="data['kpp']" :copyable="false" :text="data['kpp']" :label="getTemplateLabel('kpp')+':'"/>
      <InformationField v-if="data['serial_doc']" :copyable="false" :text="data['serial_doc'] + ' ' + data['number_doc'] " :label="getTemplateLabel('serial_doc')+':'"/>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
.ico{
  cursor: pointer;
  width: 30px;
  height: 30px;
  content: url("@/assets/icons/goto.svg");
}
.ico:hover{
  content:url("@/assets/icons/back-ico-hover.svg");
  transform: scaleX(-1);
}
.inline-title-ico{
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
}
.title{
  font-family: 'Monserrat',sans-serif;
  font-weight: 600;
  font-size: 15px;
  line-height: 150%;
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
}
.content-block{
  font-family: 'Montserrat', sans-serif;
  font-size: 15px;
  line-height: 150%;
  color: #353535;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  padding: 20px;
  background: #f8f8f8;
}
</style>