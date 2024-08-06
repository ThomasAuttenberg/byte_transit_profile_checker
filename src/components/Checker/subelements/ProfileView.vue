<script setup lang="ts">
import { getTemplateTitleByField as getTemplateLabel } from '@/hooks/DATA_TEMPLATE'
import InformationField from '@/components/Checker/subelements/InformationField.vue'

defineProps({
  data: {type: Object, required: true}
});
import profile_ico from "@/assets/icons/profileico-background.svg";
import phone_img from "@/assets/icons/phone.svg";
</script>

<template>
  <div class = "cd">
    <div class = "content-block">
      <div class = "title">{{data['name']}}</div>
      <InformationField v-if="data['inn']" :copyable="true" :text="data['inn']" :label="getTemplateLabel('inn')+':'"/>
      <InformationField v-if="data['kpp']" :copyable="true" :text="data['kpp']" :label="getTemplateLabel('kpp')+':'"/>
      <InformationField v-if="data['serial_doc']" :copyable="true" :text="data['serial_doc'] + ' ' + data['number_doc'] " :label="getTemplateLabel('serial_doc')+':'"/>
    </div>
    <div class = "additional_block">
    <div class = "content-block">
      <InformationField v-if="data['uid']" :copyable="true" :text="data['uid']" :label="getTemplateLabel('uid')+':'"/>
      <InformationField v-if="data['email']" :copyable="true" :text="data['email']" :label="getTemplateLabel('email')+':'"/>
    </div>
    <div class = "contact-block-title">Контактное лицо</div>
    <div class = "content-block contact-block">
      <InformationField class="specified_field" :ico="profile_ico" v-if="data['contact_name']" :copyable="true" :text="data['contact_name']" />
      <InformationField class="specified_field" :ico="phone_img" v-if="data['contact_phone']" :copyable="true" :text="data['contact_phone']" />
    </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
.contact-block-title{
  margin-top: 10px;
  text-transform: uppercase;
  font-weight: bold;
}
.specified_field::v-deep(.inf-field-text){
  text-transform: uppercase;
  color: #7e8387;
  font-weight: 600;
}
.contact-block-title::before{
  content: '';
  display: block;
  width: 100%;
  height: 1px;
  background: #EAEAEA;
  margin-top: 20px;
  margin-bottom: 20px;
}
.title{
  font-family: 'Monserrat',sans-serif;
  font-weight: 600;
  font-size: 15px;
  line-height: 150%;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.cd{
  position: relative;
}
.content-block{
  margin-top: 10px;
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
.contact-block{
  padding: 15px 15px 15px 20px;
}
</style>