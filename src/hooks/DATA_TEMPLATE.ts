
//==================================ADAPTERS===========================================//

export const booleanAdapter = (val:any):string => {
  return val ? "Да" : "Нет";
}
//======================== CHANGE OBJECT BELOW TO FIT A SERVER RESPONSE ===============//

export const DATA_TEMPLATE
  : {title:string, field:any, adapterFunction?:(val:any)=>string}[] = [
  {
    title: 'Наименование организации',
    field: 'name',
  },
  {
    title: 'ФИО менеджера',
    field: 'manager',
  },
  {
    title: 'УИН',
    field: 'uid',
  },
  {
    title: 'Почта',
    field: 'email',
  },
  {
    title: 'ИНН',
    field: 'inn',
  },
  {
    title: 'КПП',
    field: 'kpp',
  },
  {
    title: 'Паспорт',
    field: 'serial_doc',
  },
  {
    title: 'Паспорт',
    field: 'number_doc',
  },
  {
    title: 'Юридическое лицо',
    field: 'is_company',
    adapterFunction: booleanAdapter,
  },
  {
    title: 'Контактное лицо',
    field: 'contact_name',
  },
  {
    title: 'Телефон контактного лица',
    field: 'contact_phone',
  }
];








export function useAdapter(field:string, value:any){
  const templateObj = DATA_TEMPLATE.filter((val)=>val.field === field)[0];
  if(value == null) return null;
  if(templateObj.adapterFunction){
    return templateObj.adapterFunction(value);
  }else{
    return String(value).trim();
  }
}
export function getTemplateTitleByField(field:string) : string{
  return DATA_TEMPLATE.filter((val)=> val.field==field )[0].title;
}