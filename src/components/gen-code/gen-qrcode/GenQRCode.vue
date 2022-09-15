<template>
  <div class="flex justify-start flex-row flex-nowrap">
    <n-card title="参数" :bordered="false">
      <div class="left">
        <n-form :model="model" label-align="left" label-placement="top" label-width="auto" size="small">
          <n-form-item label="二维码内容" path="textareaValue">
            <n-input
              v-model:value="model.textareaValue"
              :show-count="true"
              autofocus
              round
              :autosize="{
                minRows: 5,
                maxRows: 10,
              }"
              type="textarea"
              placeholder="输入文本【实时生成】"
            />
          </n-form-item>
          <n-form-item :label="'二维码尺寸'" path="qrCodeSize">
            <n-slider v-model:value.lazy="model.qrCodeSize" :step="1" :min="200" :max="500" placement="bottom-end" />
          </n-form-item>
          <n-form-item label="二维码边距" path="margin">
            <n-slider v-model:value="model.margin" :step="1" :min="1" :max="20" placement="bottom-end" />
          </n-form-item>
          <n-form-item label="二维码前景色" path="foreground">
            <n-color-picker v-model:value="model.foreground" models="['hex']" />
          </n-form-item>
          <n-form-item label="二维码背景色" path="background">
            <n-color-picker v-model:value="model.background" models="['hex']" />
          </n-form-item>
          <n-form-item label="二维码纠错级别" path="level">
            <n-radio-group v-model:value="model.level" name="level">
              <n-radio-button value="L">L</n-radio-button>
              <n-radio-button value="M">M</n-radio-button>
              <n-radio-button value="Q">Q</n-radio-button>
              <n-radio-button value="H">H</n-radio-button>
            </n-radio-group>
          </n-form-item>
          <n-divider dashed title-placement="center"> 额外信息 </n-divider>
          <n-form-item label="标题" path="title">
            <n-input v-model:value="model.title" type="text" placeholder="输入文本【实时生成】" />
          </n-form-item>
          <n-form-item label="描述信息" path="desc">
            <n-input
              v-model:value="model.desc"
              :show-count="true"
              round
              :autosize="{
                minRows: 5,
                maxRows: 10,
              }"
              type="textarea"
              placeholder="输入文本【实时生成】"
            />
          </n-form-item>
        </n-form>
      </div>
    </n-card>
    <n-card title="实时预览" :bordered="false">
      <div class="right flex justify-center flex-col">
        <transition-group name="fade">
          <template v-if="!model.textareaValue">
            <n-empty size="large" description="没有可以生成二维码的内容">
              <template #icon>
                <n-icon>
                  <qr-code />
                </n-icon>
              </template>
              <template #extra> 请在左边的区域输入点内容吧！ </template>
            </n-empty>
          </template>
          <template v-else>
            <div ref="qrcode">
              <div class="p-5">
                <div class="flex justify-center">
                  <qrcode-vue
                    class="p-3"
                    :size="qrCodeConf.size"
                    :value="qrCodeConf.value"
                    :margin="qrCodeConf.margin"
                    :level="qrCodeConf.level"
                    :background="qrCodeConf.background"
                    :foreground="qrCodeConf.foreground"
                    :render-as="qrCodeConf.renderAs"
                  />
                </div>
                <transition-group name="slide-fade">
                  <div v-if="qrCodeConf.title || qrCodeConf.desc" class="card-body">
                    <h2 v-if="qrCodeConf.title" class="card-title">
                      {{ qrCodeConf.title }}
                    </h2>
                    <p v-if="qrCodeConf.desc">{{ qrCodeConf.desc }}</p>
                  </div>
                </transition-group>
              </div>
            </div>
          </template>
          <div v-if="qrCodeConf.value" class="flex justify-center mt-5" @click="saveQrCode">
            <button class="btn btn-primary">保存二维码</button>
          </div>
        </transition-group>
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { NInput, NEmpty, NCard, NForm, NIcon, NFormItem, NRadioGroup, NDivider, NSlider, NColorPicker, NRadioButton } from 'naive-ui';
import { ref, watch } from 'vue';
import QrcodeVue from 'qrcode.vue';
import { QrCode } from '@vicons/carbon';
import useSaveDomToPng from '@/hooks/useSaveDomToPng';
const qrcode = ref(null);

const { saveDomToImg } = useSaveDomToPng();
type Level = 'L' | 'M' | 'Q' | 'H';
const model = ref({
  textareaValue: '',
  qrCodeSize: 200, // 二维码尺寸
  level: 'Q', // 二维码纠错等级
  margin: 1, // 二维码边距
  background: '#ffffff', // 二维码背景色
  foreground: '#000000', // 二维码前景色
  renderAs: 'canvas' as const, // 二维码渲染格式
  title: '', // 标题
  desc: '', // 描述信息
});

const qrCodeConf = ref({
  size: model.value.qrCodeSize,
  value: model.value.textareaValue,
  level: model.value.level as Level,
  margin: model.value.margin,
  background: model.value.background,
  foreground: model.value.foreground,
  renderAs: model.value.renderAs,
  title: model.value.title,
  desc: model.value.desc,
});

watch(
  () => model,
  (newValue) => {
    qrCodeConf.value = {
      value: newValue.value.textareaValue,
      level: newValue.value.level as Level,
      size: newValue.value.qrCodeSize,
      margin: newValue.value.margin,
      background: newValue.value.background,
      foreground: newValue.value.foreground,
      renderAs: newValue.value.renderAs,
      title: newValue.value.title,
      desc: newValue.value.desc,
    };
  },
  { deep: true }
);

const saveQrCode = async () => {
  if (qrcode.value) {
    saveDomToImg(qrcode.value);
  }
};
</script>
