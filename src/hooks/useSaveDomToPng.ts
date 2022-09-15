import { writeBinaryFile } from '@tauri-apps/api/fs';
import { path, dialog } from '@tauri-apps/api';
import html2canvas from 'html2canvas';
export default function () {
  const getDomToCanvasBlob = (dom: HTMLElement): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      html2canvas(dom, {
        scale: 1, // 图像的缩放比例
        allowTaint: true, // allowTaint 允许绘制画布
      })
        .then((canvas) => {
          canvas.toBlob((blob) => {
            resolve(blob as Blob);
          });
        })
        .catch((err) => reject(err));
    });
  };

  const saveDomToImg = async (dom: HTMLElement | null) => {
    if (dom) {
      const blob = await getDomToCanvasBlob(dom);
      const buffer = await blob.arrayBuffer();
      const file = new Uint8Array(buffer);
      const basePath = await path.downloadDir();
      const filePath = await dialog.save({
        defaultPath: basePath,
        title: '保存导出的图片',
        filters: [
          {
            name: 'Image',
            extensions: ['png'],
          },
        ],
      });

      writeBinaryFile(filePath, file);
    }
  };

  return {
    saveDomToImg,
  };
}
