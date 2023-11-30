<template>
  <div class="app__inner">
    <LNB />
    <div class="app__page">
      <div class="page__header">
        <TheHeader />
      </div>
      <div class="page__container">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script>
import LNB from '~/components/LNB';
import TheHeader from '~/components/TheHeader';

export default {
  components: {
    LNB,
    TheHeader,
  },
};
</script>

<style lang="scss" scoped>
@import '~/scss/_variables.scss';
.app__inner {
  display: flex;
  height: 100vh;
  color: $color-font;
  font-size: 14px;
  line-height: 1.4;
  font-family: 'Noto Sans KR', sans-serif;
  .app__page {
    height: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    .page__header {
      height: 80px;
    }
    .page__container {
      flex-grow: 1;
      overflow-y: auto;
    }
  }
}
</style>
