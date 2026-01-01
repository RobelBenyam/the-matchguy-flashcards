import { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Image, Video, Table, Sigma, X, Plus, Minus } from 'lucide-react';
import { CardContent } from '../types';
import FormulaEditor from './FormulaEditor';

interface RichContentEditorProps {
  value: string | CardContent;
  onChange: (value: string | CardContent) => void;
  placeholder?: string;
}

export default function RichContentEditor({ value, onChange, placeholder }: RichContentEditorProps) {
  const getContentFromValue = (val: string | CardContent): CardContent => {
    if (typeof val === 'string') {
      return { text: val };
    }
    if (val && typeof val === 'object') {
      return {
        text: (val as CardContent).text || '',
        images: (val as CardContent).images || [],
        videos: (val as CardContent).videos || [],
        tables: (val as CardContent).tables || [],
        formulas: (val as CardContent).formulas || [],
      };
    }
    return { text: '' };
  };

  const [content, setContent] = useState<CardContent>(() => getContentFromValue(value));
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    setContent(getContentFromValue(value));
  }, [JSON.stringify(value)]);
  
  const [showImageInput, setShowImageInput] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [showTableEditor, setShowTableEditor] = useState(false);
  const [showFormulaEditor, setShowFormulaEditor] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [tableRows, setTableRows] = useState(2);
  const [tableCols, setTableCols] = useState(2);

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link'],
        ['clean']
      ],
    },
  };

  const handleTextChange = (text: string) => {
    const newContent = { ...content, text };
    setContent(newContent);
    onChange(newContent);
  };

  const insertFormula = (formulaText: string) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      const index = range ? range.index : quill.getLength();
      quill.insertText(index, `$${formulaText}$`, 'user');
      quill.setSelection(index + formulaText.length + 2);
    }
    setShowFormulaEditor(false);
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      const newContent = {
        ...content,
        images: [...(content.images || []), imageUrl.trim()],
      };
      setContent(newContent);
      onChange(newContent);
      setImageUrl('');
      setShowImageInput(false);
    }
  };

  const removeImage = (index: number) => {
    const newContent = {
      ...content,
      images: content.images?.filter((_, i) => i !== index) || [],
    };
    setContent(newContent);
    onChange(newContent);
  };

  const addVideo = () => {
    if (videoUrl.trim()) {
      const newContent = {
        ...content,
        videos: [...(content.videos || []), videoUrl.trim()],
      };
      setContent(newContent);
      onChange(newContent);
      setVideoUrl('');
      setShowVideoInput(false);
    }
  };

  const removeVideo = (index: number) => {
    const newContent = {
      ...content,
      videos: content.videos?.filter((_, i) => i !== index) || [],
    };
    setContent(newContent);
    onChange(newContent);
  };

  const addTable = (rows: number, cols: number) => {
    const table: string[][] = Array(rows).fill(null).map(() => Array(cols).fill(''));
    const newContent = {
      ...content,
      tables: [...(content.tables || []), table],
    };
    setContent(newContent);
    onChange(newContent);
    setShowTableEditor(false);
  };

  const updateTableCell = (tableIndex: number, rowIndex: number, colIndex: number, value: string) => {
    const tables = [...(content.tables || [])];
    if (!tables[tableIndex]) return;
    const table = tables[tableIndex].map((row, r) =>
      r === rowIndex ? row.map((cell, c) => (c === colIndex ? value : cell)) : row
    );
    tables[tableIndex] = table;
    const newContent = { ...content, tables };
    setContent(newContent);
    onChange(newContent);
  };

  const removeTable = (index: number) => {
    const newContent = {
      ...content,
      tables: content.tables?.filter((_, i) => i !== index) || [],
    };
    setContent(newContent);
    onChange(newContent);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white [&_.ql-container]:min-h-[150px] [&_.ql-editor]:min-h-[120px]">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content.text || ''}
          onChange={handleTextChange}
          placeholder={placeholder}
          modules={modules}
          formats={['header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link']}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowImageInput(!showImageInput)}
          className="flex items-center space-x-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors text-sm"
        >
          <Image className="w-4 h-4" />
          <span>Image</span>
        </button>
        <button
          type="button"
          onClick={() => setShowVideoInput(!showVideoInput)}
          className="flex items-center space-x-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors text-sm"
        >
          <Video className="w-4 h-4" />
          <span>Video</span>
        </button>
        <button
          type="button"
          onClick={() => setShowTableEditor(!showTableEditor)}
          className="flex items-center space-x-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors text-sm"
        >
          <Table className="w-4 h-4" />
          <span>Table</span>
        </button>
        <button
          type="button"
          onClick={() => setShowFormulaEditor(true)}
          className="flex items-center space-x-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors text-sm"
        >
          <Sigma className="w-4 h-4" />
          <span>Formula</span>
        </button>
      </div>

      {showImageInput && (
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
            />
            <button
              type="button"
              onClick={addImage}
              className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowImageInput(false);
                setImageUrl('');
              }}
              className="p-2 text-slate-500 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {content.images && content.images.length > 0 && (
        <div className="space-y-2">
          {content.images.map((url, index) => (
            <div key={index} className="relative inline-block">
              <img src={url} alt={`Image ${index + 1}`} className="max-w-full h-auto rounded-lg border border-slate-200" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showVideoInput && (
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter video URL (YouTube, Vimeo, etc.)"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
            />
            <button
              type="button"
              onClick={addVideo}
              className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowVideoInput(false);
                setVideoUrl('');
              }}
              className="p-2 text-slate-500 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {content.videos && content.videos.length > 0 && (
        <div className="space-y-2">
          {content.videos.map((url, index) => (
            <div key={index} className="relative">
              <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden">
                <iframe
                  src={getEmbedUrl(url)}
                  className="w-full h-full"
                  allowFullScreen
                  title={`Video ${index + 1}`}
                />
              </div>
              <button
                type="button"
                onClick={() => removeVideo(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showTableEditor && (
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Rows</label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setTableRows(Math.max(1, tableRows - 1))}
                  className="p-1 border border-slate-300 rounded hover:bg-slate-100"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={tableRows}
                  onChange={(e) => setTableRows(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                  className="w-16 px-2 py-1 border border-slate-300 rounded text-sm text-center"
                />
                <button
                  type="button"
                  onClick={() => setTableRows(Math.min(20, tableRows + 1))}
                  className="p-1 border border-slate-300 rounded hover:bg-slate-100"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Columns</label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setTableCols(Math.max(1, tableCols - 1))}
                  className="p-1 border border-slate-300 rounded hover:bg-slate-100"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tableCols}
                  onChange={(e) => setTableCols(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                  className="w-16 px-2 py-1 border border-slate-300 rounded text-sm text-center"
                />
                <button
                  type="button"
                  onClick={() => setTableCols(Math.min(10, tableCols + 1))}
                  className="p-1 border border-slate-300 rounded hover:bg-slate-100"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                addTable(tableRows, tableCols);
                setTableRows(2);
                setTableCols(2);
              }}
              className="px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
            >
              Insert Table
            </button>
            <button
              type="button"
              onClick={() => {
                setShowTableEditor(false);
                setTableRows(2);
                setTableCols(2);
              }}
              className="px-3 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {content.tables && content.tables.length > 0 && (
        <div className="space-y-4">
          {content.tables.map((table, tableIndex) => (
            <div key={tableIndex} className="relative border border-slate-200 rounded-lg p-4">
              <button
                type="button"
                onClick={() => removeTable(tableIndex)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
              <table className="w-full border-collapse">
                <tbody>
                  {table.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, colIndex) => (
                        <td key={colIndex} className="border border-slate-300 p-2">
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) => updateTableCell(tableIndex, rowIndex, colIndex, e.target.value)}
                            className="w-full px-2 py-1 border-0 focus:ring-1 focus:ring-orange-500 outline-none text-sm"
                            placeholder="Cell"
                          />
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

      {showFormulaEditor && (
        <FormulaEditor
          onInsert={insertFormula}
          onClose={() => setShowFormulaEditor(false)}
        />
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
