
## 介绍

一个桌面应用，支持一维码，二维码的生成并导出图片，采用tauri打包

本地客户端应用，不需要联网直接使用！

## 功能
- 生成二维码或者一维码
- 导出生成的结果图


## 前端技术栈
- [vue3](https://cn.vuejs.org/)
- [typescript](https://www.typescriptlang.org/)
- [tailwind v3](https://tailwindcss.com/)
- [pnpm v7](https://pnpm.io/)
- [tauri v1](https://tauri.app/)


## 开发？

1. 克隆仓库
2. pnpm i
3. 开发模式
   - 网页开发【不支持tauri api操作文件】
     - `pnpm dev`
   - 客户端开发【支持tauri api操作文件】
     - `pnpm tauri dev` 





## 其他

一维码的编码输入没有做过多的格式校验，

有兴趣的可以PR完善下。

若是该项目能让你学到点东西，是我的荣幸！😄