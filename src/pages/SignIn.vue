<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { reactive } from 'vue';
import authStore from '@/store/auth';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import useFormDataValidation from '@/composables/useFormDataValidation';

const { t } = useI18n();
const { signIn } = authStore;
const router = useRouter();

const rules = reactive({
  name: [{ required: true, message: t('required'), trigger: 'change' }],
  password: [{ required: true, message: t('required'), trigger: 'change' }],
});

const model = reactive({
  name: '',
  password: '',
});

const { valid } = useFormDataValidation(model, rules);

const submit = () => {
  try {
    signIn(model.name, model.password);
    router.push({ path: '/' });
  } catch (e) {
    message.error((e as Error).message);
  }
};
</script>

<template>
  <a-card
    :title="t('form')"
    :class="$style.card"
  >
    <a-form
      :model="model"
      :rules="rules"
      :label-col="{ sm: { span: 5 } }"
      :wrapper-col="{ sm: { span: 20 } }"
    >
      <a-form-item
        name="name"
        :label="t('name')"
        :has-feedback="true"
      >
        <a-input v-model:value="model.name" />
      </a-form-item>

      <a-form-item
        name="password"
        :label="t('password')"
        :has-feedback="true"
      >
        <a-input-password v-model:value="model.password" />
      </a-form-item>

      <a-button
        type="primary"
        :disabled="!valid"
        @click="submit"
      >
        {{ t('signin') }}
      </a-button>
    </a-form>
  </a-card>
</template>

<style module>
.card {
  width: 400px;
  margin: auto;
}

.card :global(.ant-card-head) {
  color: #fff;
  background-color: #001529;
}

.card :global(.ant-card-body) {
  text-align: center;
}

.card :global(.ant-form-item) {
  margin-bottom: 12px;
  text-align: left;
}
</style>

<i18n locale="ru">
required: Поле обязательно к заполнению
form: Форма входа
signin: Войти
name: Имя
password: Пароль
</i18n>
