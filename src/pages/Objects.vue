<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import useFormDataValidation from '@/composables/useFormDataValidation';
import mainStore, { type Obj } from '@/store/main';
import { v4 as uuidv4 } from 'uuid';

const { createObj, deleteObj, objs } = mainStore;
const { t } = useI18n();

const rules = reactive({
  name: [{ required: true, message: t('required'), trigger: 'change' }],
});

const addObjectModel = reactive({
  id: '',
  name: '',
  type: 'file',
} as Obj);

const { valid: addObjectValid } = useFormDataValidation(addObjectModel, rules);
const selectedObj = ref(objs.value[0]?.id);

const addObject = () => {
  try {
    createObj({ ...addObjectModel, id: uuidv4() });
    selectedObj.value = objs.value[0]?.id;
    message.success(t('success.creatingObject'));
  } catch (e) {
    message.error((e as Error).message);
  }
};

const removeObject = () => {
  try {
    deleteObj(selectedObj.value);
    selectedObj.value = objs.value[0]?.id;
    message.success(t('success.removingObject'));
  } catch (e) {
    message.error((e as Error).message);
  }
};
</script>

<template>
  <a-row :gutter="16">
    <a-col :span="12">
      <a-card
        :title="t('creatingObject')"
        :class="$style.card"
      >
        <a-form
          :model="addObjectModel"
          :rules="rules"
          :label-col="{ style: { width: '50px' } }"
        >
          <a-form-item
            name="name"
            :label="t('name')"
            :has-feedback="true"
          >
            <a-input v-model:value="addObjectModel.name" />
          </a-form-item>

          <a-form-item
            :label="t('type')"
            :has-feedback="true"
          >
            <a-select v-model:value="addObjectModel.type">
              <a-select-option value="file">
                Файл
              </a-select-option>

              <a-select-option value="dev">
                Устройство
              </a-select-option>
            </a-select>
          </a-form-item>

          <div :class="$style.right">
            <a-button
              type="primary"
              :disabled="!addObjectValid"
              @click="addObject"
            >
              {{ t('addObject') }}
            </a-button>
          </div>
        </a-form>
      </a-card>
    </a-col>

    <a-col :span="12">
      <a-card
        v-if="objs.length"
        :class="$style.card"
        :title="t('removingObject')"
      >
        <a-form
          :label-col="{ style: { width: '40px' } }"
          label-align="left"
        >
          <a-form-item :label="t('name')">
            <a-select v-model:value="selectedObj">
              <a-select-option
                v-for="obj of objs"
                :key="obj.id"
                :value="obj.id"
              >
                {{ obj.name }} ({{ obj.type }})
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-button
            type="primary"
            @click="removeObject"
          >
            {{ t('removeObject') }}
          </a-button>
        </a-form>
      </a-card>
    </a-col>
  </a-row>
</template>

<style module>
.card {
  height: 100%;
}

.right {
  text-align: right;
}
</style>

<i18n locale="ru">
required: Поле обязательно к заполнению
name: Имя
type: Тип
creatingObject: Создание объекта
removingObject: Удаление объекта
addObject: Добавить объект
removeObject: Удалить объект
success:
  creatingObject: Объект успешно создан
  removingObject: Объект успешно удален
</i18n>
