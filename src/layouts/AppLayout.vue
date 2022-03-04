<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import {
  BorderlessTableOutlined, UserOutlined, EditOutlined, UnorderedListOutlined,
} from '@ant-design/icons-vue';
import authStore from '@/store/auth';

const { signOut, account } = authStore;

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const collapsed = ref(false);

const menu = {
  Table: BorderlessTableOutlined,
  Objects: UnorderedListOutlined,
  Accounts: UserOutlined,
  Rights: EditOutlined,
};

const selectedKey = computed(() => route.matched[0].name as string);
const heading = computed(() => t(`menu.${selectedKey.value}`));

const navigate = (name: string) => { router.push({ name }); };
</script>

<template>
  <a-layout
    :class="$style.layout"
    :style="{ 'margin-left': collapsed ? '80px' : '200px' }"
  >
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      breakpoint="lg"
      :class="$style.sider"
    >
      <a-menu
        :selected-keys="[selectedKey]"
        theme="dark"
        mode="inline"
      >
        <a-menu-item
          v-for="(icon, key) of menu"
          :key="key"
          @click="navigate(key)"
        >
          <template #icon>
            <component :is="icon" />
          </template>
          {{ t(`menu.${key}`) }}
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header :class="$style.header">
        <h1
          :class="$style.heading"
          v-text="heading"
        />

        <span>{{ t('welcome', [account.name]) }} (<strong>{{ account.type }}</strong>)</span>

        <a-button
          danger
          @click="signOut"
          v-text="t('signout')"
        />
      </a-layout-header>

      <a-layout-content :class="$style.content">
        <slot />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style module>
.layout {
  transition: margin 0.2s;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2.5rem;
  background: #fff;
}

.heading {
  margin: 0 1rem 0 0;
  font-size: 1.25rem;
}

.content {
  padding: 1.5rem;
  margin: 1rem;
  background-color: #fff;
}

.sider {
  position: fixed;
  left: 0;
  height: 100vh;
}

.sider :global(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
}
</style>

<i18n locale="ru">
signout: Выйти
welcome: Добро пожаловать, {0}
menu:
  Table: Таблица
  Objects: Объекты
  Accounts: Аккаунты
  Rights: Права
</i18n>
