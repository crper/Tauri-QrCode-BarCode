<template>
  <n-message-provider :max="1">
    <message-api></message-api>
    <div class="app-container bg-slate-550">
      <div class="common-layout h-full">
        <gen-code />
      </div>
    </div>
  </n-message-provider>
</template>

<script lang="ts" setup>
import { NMessageProvider } from 'naive-ui';
import MessageApi from '@/components/MessageApi.vue';
import GenCode from './components/gen-code';
</script>

<style lang="scss">
.app-container {
  height: 100%;
  width: 100%;
}
</style>
