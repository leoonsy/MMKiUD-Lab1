<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import useFormDataValidation from '@/composables/useFormDataValidation';
import mainStore, { Right } from '@/store/main';
import authStore from '@/store/auth';
import { v4 as uuidv4 } from 'uuid';

const { addRights, deleteRights, objs } = mainStore;
const { accounts } = authStore;
const { t } = useI18n();

const selectedRight = ref<Right>('r');
const selectedObj = ref(objs.value[0]?.id);
const selectedAccount = ref(accounts.value[0]?.name);

const addRight = () => {
  try {
    addRights(selectedAccount.value, selectedObj.value, selectedRight.value);
    message.success(t('success.addingRight'));
  } catch (e) {
    message.error((e as Error).message);
  }
};

const removeRight = () => {
  try {
    deleteRights(selectedAccount.value, selectedObj.value, selectedRight.value);
    message.success(t('success.removingRight'));
  } catch (e) {
    message.error((e as Error).message);
  }
};
</script>

<template>
  <a-row
    v-if="accounts.length && objs.length"
    :gutter="16"
  >
    <a-col :span="12">
      <a-card
        :title="t('addingRight')"
        :class="$style.card"
      >
        <a-form :label-col="{ style: { width: '70px' } }">
          <a-form-item
            :label="t('account')"
            :has-feedback="true"
          >
            <a-select v-model:value="selectedAccount">
              <a-select-option
                v-for="acc of accounts"
                :key="acc.name"
                :value="acc.name"
              >
                {{ acc.name }} ({{ acc.type }})
              </a-select-option>
            </a-select>
          </a-form-item>

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
              @click="addRight"
            >
              {{ t('addRight') }}
            </a-button>
          </div>
        </a-form>
      </a-card>
    </a-col>

    <a-col :span="12">
      <a-card
        :title="t('removingRight')"
        :class="$style.card"
      >
        <a-form :label-col="{ style: { width: '70px' } }">
          <a-form-item
            :label="t('account')"
            :has-feedback="true"
          >
            <a-select v-model:value="selectedAccount">
              <a-select-option
                v-for="acc of accounts"
                :key="acc.name"
                :value="acc.name"
              >
                {{ acc.name }} ({{ acc.type }})
              </a-select-option>
            </a-select>
          </a-form-item>

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
              @click="removeRight"
            >
              {{ t('removeRight') }}
            </a-button>
          </div>
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
right: Право
object: Объект
account: Аккаунт
addingRight: Добавление права
removingRight: Удаление права
addRight: Добавить право
removeRight: Удалить право
success:
  addingRight: Право успешно добавлено
  removingRight: Право успешно удалено
</i18n>
