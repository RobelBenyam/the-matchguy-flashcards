import { useEffect, useRef } from 'react';
import { CardContent } from '../types';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';

interface RichContentRendererProps {
  content: string | CardContent;
  className?: string;
}

export default function RichContentRenderer({ content, className = '' }: RichContentRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    if (typeof content === 'string') {
      const html = renderWithFormulas(content);
      containerRef.current.innerHTML = DOMPurify.sanitize(html);
    } else {
      containerRef.current.innerHTML = '';
    }

    const blockFormulas = containerRef.current.querySelectorAll('.katex-block');
    blockFormulas.forEach((el) => {
      const formula = decodeURIComponent(el.getAttribute('data-formula') || '');
      try {
        katex.render(formula, el as HTMLElement, { displayMode: true });
      } catch (e) {
        el.textContent = `$$${formula}$$`;
      }
    });

    const inlineFormulas = containerRef.current.querySelectorAll('.katex-inline');
    inlineFormulas.forEach((el) => {
      const formula = decodeURIComponent(el.getAttribute('data-formula') || '');
      try {
        katex.render(formula, el as HTMLElement, { displayMode: false });
      } catch (e) {
        el.textContent = `$${formula}$`;
      }
    });

    const tables = containerRef.current.querySelectorAll('table');
    tables.forEach((table) => {
      if (!table.hasAttribute('data-styled')) {
        table.setAttribute('data-styled', 'true');
        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';
        table.style.margin = '10px 0';
        const cells = table.querySelectorAll('th, td');
        cells.forEach((cell) => {
          (cell as HTMLElement).style.border = '1px solid #ddd';
          (cell as HTMLElement).style.padding = '8px';
        });
      }
    });
  }, [content]);

  if (typeof content === 'string') {
    return (
      <div 
        ref={containerRef}
        className={`${className} ql-editor prose prose-sm max-w-none`}
        style={{ wordBreak: 'break-word' }}
      />
    );
  }

  const richContent = content as CardContent;

  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textContainerRef.current || !richContent.text) return;
    const html = renderWithFormulas(richContent.text);
    textContainerRef.current.innerHTML = DOMPurify.sanitize(html);

    const blockFormulas = textContainerRef.current.querySelectorAll('.katex-block');
    blockFormulas.forEach((el) => {
      const formula = decodeURIComponent(el.getAttribute('data-formula') || '');
      try {
        katex.render(formula, el as HTMLElement, { displayMode: true });
      } catch (e) {
        el.textContent = `$$${formula}$$`;
      }
    });

    const inlineFormulas = textContainerRef.current.querySelectorAll('.katex-inline');
    inlineFormulas.forEach((el) => {
      const formula = decodeURIComponent(el.getAttribute('data-formula') || '');
      try {
        katex.render(formula, el as HTMLElement, { displayMode: false });
      } catch (e) {
        el.textContent = `$${formula}$`;
      }
    });
  }, [richContent.text]);

  return (
    <div className={`space-y-4 ${className}`}>
      {richContent.text && (
        <div ref={textContainerRef} className="ql-editor prose prose-sm max-w-none break-words"></div>
      )}

      {richContent.images && richContent.images.length > 0 && (
        <div className="space-y-4">
          {richContent.images.map((url, index) => (
            <div key={index} className="flex justify-center">
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="max-w-full h-auto rounded-lg shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+not+found';
                }}
              />
            </div>
          ))}
        </div>
      )}

      {richContent.videos && richContent.videos.length > 0 && (
        <div className="space-y-4">
          {richContent.videos.map((url, index) => (
            <div key={index} className="aspect-video bg-slate-900 rounded-lg overflow-hidden shadow-md">
              <iframe
                src={getEmbedUrl(url)}
                className="w-full h-full"
                allowFullScreen
                title={`Video ${index + 1}`}
              />
            </div>
          ))}
        </div>
      )}

      {richContent.tables && richContent.tables.length > 0 && (
        <div className="space-y-4">
          {richContent.tables.map((table, tableIndex) => (
            <div key={tableIndex} className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-slate-300 rounded-lg overflow-hidden">
                <tbody>
                  {table.map((row, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      {row.map((cell, colIndex) => (
                        <td
                          key={colIndex}
                          className="border border-slate-300 px-4 py-2 text-left"
                        >
                          {cell || '\u00A0'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {richContent.formulas && richContent.formulas.length > 0 && (
        <div className="space-y-3">
          {richContent.formulas.map((formula, index) => (
            <div
              key={index}
              className="p-4 bg-slate-50 rounded-lg border border-slate-200 font-mono text-center text-lg"
              dangerouslySetInnerHTML={{ __html: renderFormula(formula) }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function getEmbedUrl(url: string): string {
  if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }
  if (url.includes('vimeo.com/')) {
    const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
  }
  return url;
}

function renderFormula(formula: string): string {
  return formula
    .replace(/\^(\d+)/g, '<sup>$1</sup>')
    .replace(/_(\d+)/g, '<sub>$1</sub>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function renderWithFormulas(html: string): string {
  const blockFormulaRegex = /\$\$([^$]+)\$\$/g;
  const inlineFormulaRegex = /\$([^$]+)\$/g;
  
  let rendered = html;
  
  rendered = rendered.replace(blockFormulaRegex, (_match, formula) => {
    return `<span class="katex-block" data-formula="${encodeURIComponent(formula.trim())}"></span>`;
  });
  
  rendered = rendered.replace(inlineFormulaRegex, (_match, formula) => {
    return `<span class="katex-inline" data-formula="${encodeURIComponent(formula.trim())}"></span>`;
  });
  
  return rendered;
}

