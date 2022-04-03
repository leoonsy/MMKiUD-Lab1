<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import mainStore, { type Right } from '@/store/main';
import authStore from '@/store/auth';
import { message } from 'ant-design-vue';

const {
  objs, getRights, performObj,
} = mainStore;
const { accounts } = authStore;
const { t } = useI18n();

const formatRights = (rights: Right[]) => [...rights].sort().join(',');

const selectedRight = ref<Right>('r');
const selectedObj = ref(objs.value[0]?.id);

const rightsTranslations = {
  r: 'чтения',
  w: 'записи',
  x: 'выполения',
};

const perform = () => {
  try {
    performObj(selectedObj.value, selectedRight.value);
    message.success(t('success', [rightsTranslations[selectedRight.value]]));
  } catch (e) {
    message.error((e as Error).message);
  }
};
</script>

<template>
  <table :class="$style.table">
    <tr>
      <th />

      <th
        v-for="obj of objs"
        :key="obj.id"
      >
        {{ obj.name }} ({{ obj.type }})
      </th>
    </tr>

    <tr
      v-for="acc of accounts"
      :key="acc.name"
    >
      <td>{{ acc.name }} ({{ acc.type }})</td>

      <td
        v-for="obj of objs"
        :key="obj.id"
      >
        {{ formatRights(getRights(acc.name, obj.id)) }}
      </td>
    </tr>
  </table>

  <a-card
    :title="t('performOperation')"
    :class="$style.card"
  >
    <a-form :label-col="{ style: { width: '60px' } }">
      <a-form-item :label="t('object')">
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

      <a-form-item :label="t('right')">
        <a-select v-model:value="selectedRight">
          <a-select-option value="r">
            Read
          </a-select-option>

          <a-select-option value="w">
            Write
          </a-select-option>

          <a-select-option value="x">
            Execute
          </a-select-option>
        </a-select>
      </a-form-item>

      <div :class="$style.right">
        <a-button
          type="primary"
          @click="perform"
        >
          {{ t('perform') }}
        </a-button>
      </div>
    </a-form>
  </a-card>
</template>

<style module>
.card {
  margin-top: 12px;
}

.table {
  text-align: center;
}

.table td {
  background: #d8e6f3;
}

.table th,
.table td {
  border-color: white;
  border-style: solid;
  border-width: 0 1px 1px 0;
}

.table th,
.table td:first-child {
  padding: 10px 20px;
  color: white;
  background: #64a1d5;
}

.table th:first-child,
.table td:first-child {
  text-align: left;
}
</style>

<i18n locale="ru">
object: Объект
right: Право
perform: Выполнить операцию
performOperation: Выполнить операцию
success: Операция {0} успешно выполнена
</i18n>
