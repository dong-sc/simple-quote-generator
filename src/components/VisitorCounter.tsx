import { useEffect, useRef, useState } from 'react';

const COUNTER_ENDPOINT = 'https://abacus.jasoncameron.dev/hit/donglinphoto-quote/visits';

/**
 * 頁尾的使用次數。送出去的只有「有人開了這一頁」，不含任何使用者填的內容。
 * 計數服務掛掉或被擋下時就不顯示，不影響工具本身。
 */
export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const requested = useRef(false);

  useEffect(() => {
    // StrictMode 在開發模式會跑兩次 effect，擋住才不會重複累加
    if (requested.current) return;
    requested.current = true;

    let active = true;

    fetch(COUNTER_ENDPOINT)
      .then((response) => response.json())
      .then((data: { value?: number }) => {
        if (active && typeof data?.value === 'number') {
          setCount(data.value);
        }
      })
      .catch(() => {
        // 計數失敗就安靜略過
      });

    return () => {
      active = false;
    };
  }, []);

  if (count === null) {
    return null;
  }

  return (
    <p className="visitor-counter">{`🧮 已幫 ${count.toLocaleString()} 位接案者算過「會不會開太便宜」`}</p>
  );
}
