import { request } from '../api/api.js';
import router from '~/routes';

export default {
  namespaced: true,
  state() {
    return {
      workspaces: [],
      currentWorkspace: {},
    };
  },
  getters: {},
  mutations: {
    assignState(state, payload) {
      Object.keys(payload).forEach((key) => {
        state[key] = payload[key];
      });
    },
  },
  actions: {
    async createWorkspace({ dispatch }, payload = {}) {
      const { parentId } = payload;

      const workspace = await request('/documents', {
        method: 'POST',
        body: JSON.stringify({
          title: '',
          parent: parentId,
        }),
      });
      await dispatch('readWorkspaces');

      router.push({
        name: 'Workspace',
        params: {
          id: workspace.id,
        },
      });
    },
    async readWorkspaces({ commit, dispatch }) {
      const workspaces = await request('/documents', {
        method: 'GET',
      });
      commit('assignState', {
        workspaces,
      });
      if (!workspaces.length) {
        //문서가 없는 경우 무조건 하나의 문서 생성시킴
        dispatch('createWorkspace');
      }
    },
    async readWorkspace({ commit }, payload) {
      const { id } = payload;

      const workspace = await request(`/documents/${id}`, {
        method: 'GET',
      });
      commit('assignState', {
        currentWorkspace: workspace,
      });
    },
    async updateWorkspace({ dispatch }, payload) {
      const { id, title, content } = payload;
      await request(`/documents/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title,
          content,
        }),
      });
      await dispatch('readWorkspaces');
    },
    async deleteWorkspace({ state, dispatch }, payload) {
      const { id } = payload;
      await request(`/documents/${id}`, {
        method: 'DELETE',
      });
      await dispatch('readWorkspaces');
      if (id === parseInt(router.currentRoute.value.params.id, 10)) {
        router.push({
          name: 'Workspace',
          params: {
            id: state.workspaces[0].id,
          },
        });
      }
    },
  },
};

//state: 상태
//getters: 계산된 상태
//mutaions: 상태를 변경, mutation을 실행할 수 있는 commit
//actions: 비동기 로직을 담당, action을 실행하는 dispatch
