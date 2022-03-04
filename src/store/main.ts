import { ref } from 'vue';
import storage from '@/utils/storage';
import authStore from '@/store/auth';

export type Obj = {
  id: string;
  name: string;
  type: 'file' | 'dev';
}

export type Right = 'r' | 'w' | 'x';
type Matrix = Record<string, Record<string, Right[]>>

const { account } = authStore;

// объекты
const OBJS_KEY = 'objs';
const MATRIX_KEY = 'matrix';

const objsText = storage.get(OBJS_KEY);
const objs = ref<Obj[]>(objsText ? JSON.parse(objsText) : []);

const matrixText = storage.get(MATRIX_KEY);
const matrix = ref<Matrix>(matrixText ? JSON.parse(matrixText) : {});

const setRight = (sub: string, obj: string, right: Right) => {
  if (!matrix.value[sub]) {
    matrix.value[sub] = {};
  }

  if (!matrix.value[sub][obj]) {
    matrix.value[sub][obj] = [];
  }

  if (!matrix.value[sub][obj].includes(right)) {
    matrix.value[sub][obj].push(right);
    storage.set(MATRIX_KEY, JSON.stringify(matrix.value));
  }
};

const setRights = (sub: string, obj: string, rights: Right[]) => {
  rights.forEach((right) => setRight(sub, obj, right));
};

const removeRight = (sub: string, obj: string, right: Right) => {
  if (matrix.value[sub] && matrix.value[sub][obj] && matrix.value[sub][obj].includes(right)) {
    matrix.value[sub][obj] = matrix.value[sub][obj].filter((r) => r !== right);
    storage.set(MATRIX_KEY, JSON.stringify(matrix.value));
  }
};

const addObj = (obj: Obj) => {
  objs.value.push(obj);
  storage.set(OBJS_KEY, JSON.stringify(objs.value));
};

const addRights = (sub: string, obj: string, rights: Right | Right[]) => {
  if (account.value.type !== 'admin') {
    throw Error('Изменять права может только администратор');
  }

  if (Array.isArray(rights)) {
    setRights(sub, obj, rights);
  } else {
    setRight(sub, obj, rights);
  }
};

const deleteRights = (sub: string, obj: string, rights: Right | Right[]) => {
  if (account.value.type !== 'admin') {
    throw Error('Удалять права может только администратор');
  }

  if (Array.isArray(rights)) {
    rights.forEach((right) => removeRight(sub, obj, right));
  } else {
    removeRight(sub, obj, rights);
  }
};

const checkRight = (sub: string, obj: string, right: Right) => matrix.value[sub]
    && matrix.value[sub][obj]
    && matrix.value[sub][obj].includes(right);

const performObj = (obj: string, right: Right) => {
  if (!checkRight(account.value.name, obj, right)) {
    throw new Error('Нет прав');
  }

  return true;
};

const createObj = (obj: Obj) => {
  // проверок нет, т.к. все субъекты могут создавать объекты
  addObj(obj);
  setRights(account.value.name, obj.id, ['r', 'w', 'x']);
};

const deleteObj = (objId: string) => {
  if (account.value.type !== 'admin') {
    throw Error('Удалять объекты только администратор');
  }

  objs.value = objs.value.filter((o) => o.id !== objId);
  storage.set(OBJS_KEY, JSON.stringify(objs.value));

  Object.keys(matrix.value).forEach((sub) => {
    if (matrix.value[sub][objId]) {
      delete matrix.value[sub][objId];
    }
  });
  storage.set(MATRIX_KEY, JSON.stringify(matrix.value));
};

const getRights = (sub: string, obj: string) => {
  if (matrix.value[sub] && matrix.value[sub][obj]) {
    return matrix.value[sub][obj];
  }

  return [];
};

export default {
  objs,
  matrix,
  addRights,
  deleteRights,
  performObj,
  createObj,
  deleteObj,
  getRights,
};
