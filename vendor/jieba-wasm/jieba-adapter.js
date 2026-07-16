/**
 * jieba-wasm 适配器
 *
 * 将 jieba-wasm ESM 封装为全局 Promise: window.__jiebaReady
 * 解析后暴露 window.__jiebaCut(text: string) => string[]
 *
 * 使用方式：
 *   await window.__jiebaReady;
 *   const tokens = window.__jiebaCut('中华人民共和国');
 */
(function () {
  'use strict';

  window.__jiebaReady = (async function () {
    // 动态 import 同目录下的 ESM（浏览器原生支持）
    const mod = await import('./jieba_rs_wasm.js');
    // 默认导出是 init 函数，调用后返回 Jieba 实例
    const jieba = await mod.default();
    // 暴露全局 cut 函数
    window.__jiebaCut = function (text) {
      if (!text) return [];
      try {
        return jieba.cut(String(text), true); // hms=true，用 HMM 提升未登录词识别
      } catch (e) {
        console.warn('[jieba-adapter] cut 失败:', e);
        return [String(text)];
      }
    };
    console.info('[jieba-adapter] 已就绪');
  })().catch(function (err) {
    console.warn('[jieba-adapter] 加载失败，搜索回落到字符级匹配', err);
  });
})();
