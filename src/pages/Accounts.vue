<script setup lang="ts">
import authStore, { Account } from '@/store/auth';
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import useFormDataValidation from '@/composables/useFormDataValidation';

const {
  createAccount, accounts, account, deleteAccount,
} = authStore;
const { t } = useI18n();

const rules = reactive({
  name: [{ required: true, message: t('required'), trigger: 'change' }],
  password: [{ required: true, message: t('required'), trigger: 'change' }],
});

const addAccountModel = reactive({
  name: '',
  password: '',
  type: 'user',
} as Account);

const { valid: addAccountValid } = useFormDataValidation(addAccountModel, rules);

const otherAccounts = computed(
  () => accounts.value.filter((acc) => acc.name !== account.value.name),
);

const removeAccountName = ref<string>(otherAccounts.value[0]?.name);

const addAccount = () => {
  try {
    createAccount({ ...addAccountModel });
    removeAccountName.value = otherAccounts.value[0].name;
    message.success(t('success.creatingAccount'));
  } catch (e) {
    message.error((e as Error).message);
  }
};

const removeAccount = () => {
  try {
    deleteAccount(removeAccountName.value);
    removeAccountName.value = otherAccounts.value[0]?.name;
    message.success(t('success.removingAccount'));
  } catch (e) {
    message.error((e as Error).message);
  }
};
</script>

<template>
  <a-row :gutter="16">
    <a-col :span="12">
      <a-card
        :title="t('creatingAccount')"
        :class="$style.card"
      >
        <a-form
          :model="addAccountModel"
          :rules="rules"
          :label-col="{ style: { width: '75px' } }"
        >
          <a-form-item
            name="name"
            :label="t('name')"
            :has-feedback="true"
          >
            <a-input v-model:value="addAccountModel.name" />
          </a-form-item>

          <a-form-item
            name="password"
            :label="t('password')"
            :has-feedback="true"
          >
            <a-input-password v-model:value="addAccountModel.password" />
          </a-form-item>

          <a-form-item
            :label="t('type')"
            :has-feedback="true"
          >
            <a-select v-model:value="addAccountModel.type">
              <a-select-option value="admin">
                Администратор
              </a-select-option>

              <a-select-option value="user">
                Пользователь
              </a-select-option>
            </a-select>
          </a-form-item>

          <div :class="$style.right">
            <a-button
              type="primary"
              :disabled="!addAccountValid"
              @click="addAccount"
            >
              {{ t('addAccount') }}
            </a-button>
          </div>
        </a-form>
      </a-card>
    </a-col>

    <a-col :span="12">
      <a-card
        v-if="otherAccounts.length"
        :class="$style.card"
        :title="t('removingAccount')"
      >
        <a-form
          :label-col="{ style: { width: '40px' } }"
          label-align="left"
        >
          <a-form-item
            :label="t('name')"
          >
            <a-select v-model:value="removeAccountName">
              <a-select-option
                v-for="acc of otherAccounts"
                :key="acc.name"
                :value="acc.name"
              >
                {{ acc.name }} ({{ acc.type }})
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-button
            type="primary"
            @click="removeAccount"
          >
            {{ t('removeAccount') }}
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
password: Пароль
type: Тип
creatingAccount: Создание аккаунта
removingAccount: Удаление аккаунта
addAccount: Добавить аккаунт
removeAccount: Удалить аккаунт
success:
  creatingAccount: Аккаунт успешно создан
  removingAccount: Аккаунт успешно удален
</i18n>
