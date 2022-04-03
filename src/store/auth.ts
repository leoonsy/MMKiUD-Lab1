import { ref } from 'vue';
import storage from '@/utils/storage';

export type Account = {
  name: string;
  password: string;
  type: 'admin' | 'user';
}

// субъекты
const ACCOUNTS_KEY = 'accounts';
const ACCOUNT_KEY = 'account';

const accountsText = storage.get(ACCOUNTS_KEY);
// можно было хранить как Record для производительности и получать массив через computed, но пофиг
const accounts = ref<Account[]>(accountsText ? JSON.parse(accountsText) : []);

const accountText = storage.get(ACCOUNT_KEY);
const account = ref<Account>(accountText ? JSON.parse(accountText) : null);

const addAccount = (acc: Account) => {
  accounts.value.push(acc);
  storage.set(ACCOUNTS_KEY, JSON.stringify(accounts.value));
};

const removeAccount = (name: string) => {
  accounts.value = accounts.value.filter((acc) => acc.name !== name);
  storage.set(ACCOUNTS_KEY, JSON.stringify(accounts.value));
};

const setAccount = (acc: Account) => {
  account.value = acc;
  storage.set(ACCOUNT_KEY, JSON.stringify(acc));
};

const createAccount = (param: Account) => {
  if (account.value.type !== 'admin') {
    throw new Error('Создать аккаунт может только администратор');
  }

  if (accounts.value.find((acc) => acc.name === param.name)) {
    throw new Error('Аккаунт с таким именем уже существует');
  }

  addAccount(param);
};

const deleteAccount = (name: string) => {
  if (account.value.type !== 'admin') {
    throw new Error('Удалить аккаунт может только администратор');
  }

  removeAccount(name);
};

const signIn = (name: string, password: string) => {
  const result = accounts.value.find((acc) => acc.name === name && acc.password === password);

  if (!result) {
    throw new Error('Неверный логин или пароль');
  }

  setAccount(result);
};

const signOut = () => {
  storage.remove(ACCOUNT_KEY);
  window.location.reload();
};

const createAdmin = () => {
  if (accounts.value.find((acc) => acc.name === 'admin')) {
    return;
  }

  addAccount({
    name: 'admin',
    password: 'admin',
    type: 'admin',
  });
};

createAdmin();

export default {
  accounts,
  account,
  createAccount,
  createAdmin,
  deleteAccount,
  signIn,
  signOut,
};
