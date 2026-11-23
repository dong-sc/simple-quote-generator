import { useEffect, useRef } from 'react';
import { CASEWORK_TOOL_ID } from '../utils/casework';

export function CaseworkBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = () => {
      if (ref.current) window.DongCasework?.mountBar(CASEWORK_TOOL_ID, ref.current);
    };
    if (window.DongCasework) mount();
    else window.addEventListener('dongcasework:ready', mount, { once: true });
    return () => window.removeEventListener('dongcasework:ready', mount);
  }, []);

  return <div ref={ref} data-casework-bar />;
}
