<template>
  <div class="gen-code-layout flex flex-nowrap justify-start">
    <n-tabs v-model:value="defaultActiveTab" justify-content="space-evenly" type="line" :animated="true" size="large">
      <n-tab-pane name="qrcode" tab="二维码生成">
        <gen-qr-code />
      </n-tab-pane>
      <n-tab-pane name="barcode" tab="一维码生成">
        <gen-bar-code />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script lang="ts" setup>
import { NTabs, NTabPane } from 'naive-ui';
import { ref } from 'vue';
import GenQrCode from './gen-qrcode';
import GenBarCode from './gen-barcode';

const defaultActiveTab = ref('qrcode');
</script>

<style scoped lang="scss"></style>
