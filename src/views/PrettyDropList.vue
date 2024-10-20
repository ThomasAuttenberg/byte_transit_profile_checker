<script setup lang="ts">
import { ref, computed, type PropType, type VNodeRef } from 'vue';

// Ожидаем, что будет передан массив опций и начальное значение
const props = defineProps({
  options: { type: Array as PropType<Array<any>>, required: true },
  prop: { type: String, default: 'Select an option' },
});

const optionsRef = ref<VNodeRef | null>(null);
const selected = defineModel<number | undefined>('selected');
// Храним выбранную опцию
const isOpen = ref(false); // Открыт ли выпадающий список

// Логика определения выбранной опции
const selectedLabel = computed(() => {
  return !(selected.value == null) && selected.value >= 0
    ? props.options[selected.value]
    : props.prop;
});

// Открытие/закрытие выпадающего списка
const toggleDropdown = () => {
  (optionsRef.value as HTMLElement).focus();
  isOpen.value = !isOpen.value;
};

// Выбор опции
const selectOption = (key: number) => {
  selected.value = key;
  isOpen.value = false;
};
</script>


<template>
  <div class="pretty-drop-list-wrapper">
    <div class="pretty-drop-list-select" @click="toggleDropdown" :class="{'prop-showing': selected == -1, opened:isOpen}">
      <span>{{ selectedLabel }}</span>
    </div>
    <ul ref="optionsRef" :class="{isOpen:isOpen}" class="pretty-drop-list-options">
      <li
        v-for="(option, key) in options"
        :key="key"
        @click="selectOption(key)"
        class="pretty-drop-list-option"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>


<style scoped>


.pretty-drop-list-wrapper {
  --max-options-height: 265px;
  position: relative;
  width: 100%;
}

.pretty-drop-list-select {
  border-radius: 10px;
  padding: 0 10px 0 20px;
  height: 50px;
  min-height: 50px;
  max-height: 50px;
  cursor: pointer;
  position: relative;
  width: 100%;
  color: #464646;
  background: #fff;
  align-content: center;
}
.pretty-drop-list-select::after{
  width: 30px;
  height: 30px;
  position: absolute;
  top: calc(50% - 15px);
  right: 5px;
  content: url("@/assets/icons/down-ico.svg")
}
.pretty-drop-list-select.opened::after{
  content: url("@/assets/icons/up-ico.svg")
}
.pretty-drop-list-select:hover{
  outline: 1px solid #D4D8E2;
}

.prop-showing{
  color: #949494;
}
@keyframes appearing {
  0%{
    max-height: 0;
    overflow-y: hidden;
  }
  100%{
    max-height: var(--max-options-height);
    overflow-y: hidden;
  }
}
@keyframes disappearing {
  0%{
    max-height: 265px;
    overflow-y: hidden;
  }
  100%{
    max-height: 0;
    overflow-y: hidden;
  }
}
.pretty-drop-list-options {
  position: absolute;
  top: calc(100% + 5px); /* Регулируем расстояние между селектом и списком */
  left: 0;
  right: 0;
  background: white;
  border-radius: 10px;
  box-shadow: 0 20px 30px 0 rgba(0, 0, 0, 0.05);
  z-index: 10;
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: hidden;
  max-height: 0; /* Ограничение высоты списка */
  transition: max-height 0.2s ease-in;
}
.isOpen{
  max-height: var(--max-options-height);
  animation: appearing 0.3s ease-out;
  overflow-y: auto;
}
.pretty-drop-list-option {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #e0e4eb;
}

.pretty-drop-list-option:hover {
  background: #e6e6e6;
}

/* Стиль для placeholder (когда selected = null или -1) */
.pretty-drop-list-select:empty {
  color: #949494;
}
</style>
