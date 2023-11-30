import { request } from '../api/api.js';
import router from '~/routes';

export default {
  namespaced: true,
  state() {
    return {
      workspaces: [],
      currentWorkspace: {},
      currentWorkspacePath: [],
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
      dispatch('findWorkspacePath');
      if (!workspaces.length) {
        //문서가 없는 경우 무조건 하나의 문서 생성시킴
        await dispatch('createWorkspace');
      }
    },
    async readWorkspace({ commit }, payload) {
      const { id } = payload;
      try {
        const workspace = await request(`/documents/${id}`, {
          method: 'GET',
        });

        commit('assignState', {
          currentWorkspace: workspace,
        });
      } catch (error) {
        router.push('/error');
      }
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
    findWorkspacePath({ state, commit }) {
      const currentWorkspaceId = parseInt(
        router.currentRoute.value.params.id,
        10,
      );
      // _find의 언더바는 현재 파일에서만 사용할 함수라는 뜻 -  일종의 코딩 컨벤션
      function _find(workspace, parents) {
        if (currentWorkspaceId == workspace.id) {
          commit('assignState', {
            currentWorkspacePath: [...parents, workspace],
          });
        }
        if (workspace.documents) {
          //재귀 호출
          workspace.documents.forEach((ws) =>
            _find(ws, [...parents, workspace]),
          );
        }
      }
      state.workspaces.forEach((workspace) => _find(workspace, []));
    },
  },
};

//state: 상태
//getters: 계산된 상태
//mutaions: 상태를 변경, mutation을 실행할 수 있는 commit
//actions: 비동기 로직을 담당, action을 실행하는 dispatch
