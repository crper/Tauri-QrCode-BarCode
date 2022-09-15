<template>
  <div class="flex justify-start flex-col flex-nowrap">
    <n-card title="实时预览" :bordered="false">
      <div class="right flex justify-center flex-col">
        <transition-group name="fade">
          <template v-if="!model.content">
            <n-empty key="hasContent" size="large" description="没有可以生成一维码的内容">
              <template #icon>
                <n-icon>
                  <barcode />
                </n-icon>
              </template>
              <template #extra> 请在输入区域输入点内容吧！ </template>
            </n-empty>
          </template>
          <template v-else>
            <div key="empty" class="p-2">
              <div class="flex justify-center">
                <div ref="exportDomImgRef" class="p-2">
                  <img ref="barCodeRef" />
                </div>
              </div>
            </div>
            <div v-if="model.content" class="flex justify-center mt-5" @click="saveBarCode">
              <button class="btn btn-primary">保存一维码</button>
            </div>
          </template>
        </transition-group>
      </div>
    </n-card>
    <n-card title="参数" :bordered="false">
      <n-alert title="温馨提示" class="mb-2" type="warning"
        >不同编码类型接受的内容不是一样的，有些只能接受数字，请确认输入内容是否合规！
      </n-alert>
      <div class="left">
        <n-form :model="model" label-align="left" label-placement="top" label-width="auto" size="small">
          <n-form-item label="编码格式 | 条形码内容" path="content">
            <n-input-group>
              <n-select
                v-model:value="model.format"
                placeholder="选择编码类型"
                :options="generalOptions"
                style="width: 140px"
                size="large"
              />
              <n-input
                v-model:value="model.content"
                type="text"
                placeholder="输入文本【实时生成】，注意输入格式，并没有做精准校验拦截"
                size="large"
                clearable
                style="width: 100%"
                show-count
              />
            </n-input-group>
          </n-form-item>
          <n-alert v-if="optionDesc" :title="`编码介绍:[${model.format}]`" class="m-1" type="info">{{ optionDesc }} </n-alert>

          <n-form-item :label="'线条宽度'" path="width">
            <n-slider v-model:value.lazy="model.width" :step="1" :min="1" :max="5" placement="bottom-end" />
          </n-form-item>
          <n-form-item :label="'线条高度'" path="height">
            <n-slider v-model:value.lazy="model.height" :step="1" :min="40" :max="80" placement="bottom-end" />
          </n-form-item>
          <n-form-item :label="'字体大小'" path="fontSize">
            <n-slider v-model:value.lazy="model.fontSize" :step="1" :min="10" :max="30" placement="bottom-end" />
          </n-form-item>
          <n-form-item label="一维码边距" path="margin">
            <n-slider v-model:value="model.margin" :step="1" :min="1" :max="20" placement="bottom-end" />
          </n-form-item>
          <n-form-item label="一维码线条色" path="lineColor">
            <n-color-picker v-model:value="model.lineColor" models="['hex']" />
          </n-form-item>
          <n-form-item label="一维码背景色" path="background">
            <n-color-picker v-model:value="model.background" models="['hex']" />
          </n-form-item>
          <n-form-item label="显示文本内容" path="displayValue">
            <n-switch v-model:value="model.displayValue" />
          </n-form-item>
          <n-form-item label="文字间距" path="textMargin">
            <n-slider v-model:value="model.textMargin" :step="1" :min="2" :max="5" placement="bottom-end" />
          </n-form-item>
          <n-form-item label="文本对齐方式" path="textAlign">
            <n-radio-group v-model:value="model.textAlign" name="level">
              <n-radio-button value="left">左对齐</n-radio-button>
              <n-radio-button value="center">居中</n-radio-button>
              <n-radio-button value="right">右对齐</n-radio-button>
            </n-radio-group>
          </n-form-item>
        </n-form>
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import {
  NInput,
  NEmpty,
  NCard,
  NForm,
  NFormItem,
  NSlider,
  NColorPicker,
  NSelect,
  NAlert,
  NSwitch,
  NRadioButton,
  NRadioGroup,
  NIcon,
  NInputGroup,
} from 'naive-ui';
import { ref, computed, watch } from 'vue';
import { Barcode } from '@vicons/carbon';
import useSaveDomToPng from '@/hooks/useSaveDomToPng';
import JsBarcode from 'jsbarcode';
import { throttle } from 'lodash-es';

const barCodeRef = ref(null);
const exportDomImgRef = ref(null);
const { saveDomToImg } = useSaveDomToPng();

const generalOptions = ['CODE128', 'CODE39', 'EAN2', 'UPC', 'EAN5', 'EAN8', 'EAN13', 'ITF14'].map((v) => ({
  label: v,
  value: v,
}));

const optionDesc = computed(() => {
  switch (model.value.format) {
    case 'CODE128':
      return `Code128码可表示从 ASCII 0 到ASCII 127 共128个字符（其中包含数字，字母，符号），理论上常没有限制。Code128码有三个子集A码、B码、C码：

Code128 A码可表示：大写英文字母、数字、控制字符组成的字符串，比如：ABC、ABC123。

Code128 B码可表示：大小写英文字母、数字、字符组成的字符串，比如：Abc123、A-123(B)。

Code128 C码可表示：仅可表示100个“两位”数字编码（00-99），比如：123456、00225869。`;
    case 'CODE39':
      return `Code 39，又称为"Code 3 of 9"，是非零售市场中最常用的格式，用于盘存和跟踪。Code 39码编码规则简单，误码率低、所能表示字符多等特点。此条码广泛应用于制造业、军事和医疗保健行业中。这种格式离散而且长度可变，接受以下 44 个字符： 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-.$/+%及“空格”星号 () 仅作起始/结束字符，不能用于条码正文。`;
    case 'EAN2':
      return `EAN-2是对EAN-2的补充 东盟 -13和UPC-A条形码。它通常用于杂志和期刊上以指示发行编号。`;
    case 'UPC':
      return `UPC（通用商品代码）符号用于美国和加拿大的零售业中。UPC(A) 的格式为 12 位。该符号由 11 个数据位和  1个检查位组成。首位通常表示被识别的产品的类型。接下来的 5 位表示制造商代码，最后 5 位用于识别特定的产品。UPC(A) 代码必须为数字。`;
    case 'EAN5':
      return `EAN-5字符的编码与其他字符非常相似 欧洲商品编号。唯一的区别是数字之间用01隔开。EAN-5始终以“ 01011”开头。另外，不使用R代码。`;
    case 'EAN8':
      return `欧洲商品编码 (EAN) 系统是欧洲版本的通用商品代码 (UPC)。现在，此代码被称为国际商品编码；但是仍保留了 EAN 缩写形式。EAN 代码印在欧洲零售商品上。

EAN-8 使用八位数编码，包括两个国家代码数位、五个数据位和一个检查位。在条码向导中，您必须输入七位数，第八位数（或说检查位）将自动生成。

可以向主条码中添加两位数或五位数（可选）。此数字是为出版物和期刊而设计的，作为附加条码显示在主条码右侧。`;
    case 'EAN13':
      return `EAN-13 是欧洲版本的通用商品代码 (UPC (A))。EAN-13 和 UPC (A) 之间的区别是 EAN-13 使用 13 位数编码，第 13 位与一个 UPC (A) 符号左边六位数的样式相同。第 13 位数与第 12 位数共同表示国家/地区代码。

可以向主条码中添加两位数或五位数（可选）。`;
    case 'ITF14':
      return `ITF-14 类似于 ITF 格式，只不过必须在条码向导中准确输入 13 位数。可以为新增条码输入五位数（可选）。ITF-14 代码必须为数字。`;
    default:
      return null;
  }
});

const model = ref({
  content: '',
  width: 2, // 一维码宽度
  height: 40, // 一维码高度
  fontSize: 10,
  margin: 10, // 一维码边距
  format: 'CODE128',
  background: '#ffffff', // 一维码背景色
  lineColor: '#000000', // 一维码前景色
  displayValue: true,
  textMargin: 2, // 文字间距
  textAlign: 'center',
  flat: true,
});

const renderBarCode = throttle((dom: never, content: string, params: JsBarcode.Options | undefined) => {
  try {
    JsBarcode(dom, content, params);
  } catch (error) {
    window.$message.error(`输入内容不符合编码格式的要求，请确认或者修正您的输入！\n ${error}`, { showIcon: true, type: 'error' });
  }
}, 300);

watch(
  () => model,
  (newValue) => {
    if (barCodeRef.value) {
      const params = {
        content: newValue.value.content,
        width: newValue.value.width, // 一维码宽度
        height: newValue.value.height, // 一维码高度
        margin: newValue.value.margin, // 一维码边距
        background: newValue.value.background, // 一维码边距
        lineColor: newValue.value.lineColor, // 一维码线条颜色
        fontSize: newValue.value.fontSize, // 一维码边距
        format: newValue.value.format, // 一维码编码类型
        displayValue: newValue.value.displayValue, // 是否显示文本
        textMargin: newValue.value.textMargin, // 文字间距
        textAlign: newValue.value.textAlign, // 文本对齐方式
      };

      if (newValue.value.content) {
        renderBarCode(barCodeRef.value, newValue.value.content, params);
      }
    }
  },
  { deep: true }
);

const saveBarCode = async () => {
  if (barCodeRef.value) {
    saveDomToImg(exportDomImgRef.value);
  }
};
</script>
