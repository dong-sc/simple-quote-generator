// Casework 系列列由 Dong Tools 總站的 series.js 提供（index.html 以 async 載入）。
// 載入失敗時不會顯示系列列，工具本身照常運作。
export const CASEWORK_TOOL_ID = 'quote';

type DongCasework = {
  mountBar: (id: string, target?: Element) => unknown;
  showNext: (target?: Element) => unknown;
};

declare global {
  interface Window {
    DongCasework?: DongCasework;
  }
}

/** 列印或匯出之後呼叫，顯示 Casework 的下一步。 */
export function showCaseworkNext() {
  window.DongCasework?.showNext();
}
