'use client';

import { useEffect } from 'react';
import { getHeaderScript } from '@/lib/api';

export function HeaderScript() {
  useEffect(() => {
    async function loadScript() {
      const script = await getHeaderScript();
      if (script) {
        // Parse and inject script tags
        const parser = new DOMParser();
        const doc = parser.parseFromString(script, 'text/html');
        const scripts = doc.querySelectorAll('script');
        const otherElements = Array.from(doc.head.children).filter(
          (el) => el.tagName !== 'SCRIPT'
        );

        // Inject script tags
        scripts.forEach((scriptEl) => {
          const newScript = document.createElement('script');
          Array.from(scriptEl.attributes).forEach((attr) => {
            newScript.setAttribute(attr.name, attr.value);
          });
          if (scriptEl.textContent) {
            newScript.textContent = scriptEl.textContent;
          }
          document.head.appendChild(newScript);
        });

        // Inject other elements (meta, link, etc.)
        otherElements.forEach((el) => {
          const newEl = el.cloneNode(true);
          document.head.appendChild(newEl);
        });
      }
    }
    loadScript();
  }, []);

  return null;
}

