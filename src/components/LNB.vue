<template>
  <nav ref="nav" :style="{ width: `${navWidth}px` }">
    <div class="header">
      <div class="user_profile"></div>
      Leon's Notion
    </div>
    <ul>
      <WorkspaceItem
        v-for="workspace in workspaces"
        :key="workspace.id"
        :workspace="workspace"
      />
    </ul>
    <div class="actions">
      <div class="action" @click="$store.dispatch('workspace/createWorkspace')">
        <span class="material-icons">add</span>새로운 페이지
      </div>
    </div>
    <div
      ref="resizeHandle"
      class="resize-handle"
      @dblclick="navWidth = 240"
    ></div>
  </nav>
</template>

<script>
import WorkspaceItem from '~/components/WorkspaceItem';
import interact from 'interactjs';

export default {
  components: {
    WorkspaceItem,
  },
  data() {
    return {
      navWidth: 240,
    };
  },
  computed: {
    workspaces() {
      return this.$store.state.workspace.workspaces;
    },
  },
  created() {
    //created와 같은 라이프사이클에서는 별도의 비동기 동작을 수행할 수 없음 따로 method에서 처리
    this.workspacesInit();
  },
  mounted() {
    this.navInit();
  },
  methods: {
    async workspacesInit() {
      await this.$store.dispatch('workspace/readWorkspaces');
      if (this.$route.fullPath === '/') {
        this.$router.push({
          name: 'Workspace',
          params: {
            id: this.$store.state.workspace.workspaces[0].id,
          },
        });
      }
    },
    navInit() {
      interact(this.$refs.nav)
        .resizable({
          edges: {
            //resize-handle부분을 클릭했을 때만 반응하게 함
            right: this.$refs.resizeHandle,
          },
        })
        .on('resizemove', (event) => {
          this.navWidth = event.rect.width;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
nav {
  flex-shrink: 0;
  max-width: 500px;
  min-width: 160px;
  height: 100%;
  background-color: $color-background;
  display: flex;
  flex-direction: column;
  position: relative;
  .header {
    padding: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    .user_profile {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      margin-right: 10px;
      background-image: url('/static/icon.jpg');
      background-size: cover;
    }
  }
  ul {
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .actions {
    border-top: 1px solid $color-border;
    .action {
      height: 45px;
      display: flex;
      align-items: center;
      padding: 0 14px;
      color: $color-icon;
      cursor: pointer;
      &:hover {
        background-color: $color-background--hover1;
      }
      .material-icons {
        margin-right: 4px;
        color: $color-icon;
      }
    }
  }
  .resize-handle {
    width: 4px;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    cursor: col-resize;
    transition: 0.4s;
    &:hover {
      background-color: $color-border;
    }
  }
}
</style>
