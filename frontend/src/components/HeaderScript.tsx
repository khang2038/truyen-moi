'use client';

import { useEffect, useRef } from 'react';
import { getHeaderScript } from '@/lib/api';

export function HeaderScript() {
  const injectedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate injection
    if (injectedRef.current) return;

    async function loadScript() {
      try {
        const script = await getHeaderScript();
        if (script && script.trim()) {
          // Check if already injected by looking for a marker
          const markerId = 'header-script-marker';
          if (document.getElementById(markerId)) {
            return; // Already injected
          }

          // Create marker to prevent duplicate injection
          const marker = document.createElement('div');
          marker.id = markerId;
          marker.style.display = 'none';
          document.body.appendChild(marker);

          // Parse and inject script tags
          const parser = new DOMParser();
          const doc = parser.parseFromString(`<html><head>${script}</head></html>`, 'text/html');
          const scripts = doc.querySelectorAll('script');
          const otherElements = Array.from(doc.head.children).filter(
            (el) => el.tagName !== 'SCRIPT'
          );

          // Inject script tags
          scripts.forEach((scriptEl) => {
            // Check if script already exists
            const src = scriptEl.getAttribute('src');
            const text = scriptEl.textContent;
            let exists = false;

            if (src) {
              exists = Array.from(document.querySelectorAll('script[src]')).some(
                (s) => s.getAttribute('src') === src
              );
            } else if (text) {
              exists = Array.from(document.querySelectorAll('script')).some(
                (s) => s.textContent === text
              );
            }

            if (!exists) {
              const newScript = document.createElement('script');
              Array.from(scriptEl.attributes).forEach((attr) => {
                newScript.setAttribute(attr.name, attr.value);
              });
              if (scriptEl.textContent) {
                newScript.textContent = scriptEl.textContent;
              }
              document.head.appendChild(newScript);
            }
          });

          // Inject other elements (meta, link, etc.)
          otherElements.forEach((el) => {
            // Check if element already exists
            const tagName = el.tagName.toLowerCase();
            const id = el.getAttribute('id');
            const rel = el.getAttribute('rel');
            let exists = false;

            if (id) {
              exists = !!document.getElementById(id);
            } else if (tagName === 'meta' && el.getAttribute('name')) {
              const name = el.getAttribute('name');
              exists = !!document.querySelector(`meta[name="${name}"]`);
            } else if (tagName === 'link' && rel) {
              const href = el.getAttribute('href');
              exists = !!document.querySelector(`link[rel="${rel}"]${href ? `[href="${href}"]` : ''}`);
            }

            if (!exists) {
              const newEl = el.cloneNode(true) as HTMLElement;
              document.head.appendChild(newEl);
            }
          });

          injectedRef.current = true;
        }
      } catch (error) {
        console.error('Failed to load header script:', error);
      }
    }

    // Run immediately
    loadScript();
  }, []);

  return null;
}

