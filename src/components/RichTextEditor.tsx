import { useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Image, Video, Sigma } from 'lucide-react';
import FormulaEditor from './FormulaEditor';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);
  const [showFormulaEditor, setShowFormulaEditor] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

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

  const insertFormula = (formula: string) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      const index = range ? range.index : quill.getLength();
      quill.insertText(index, `$${formula}$`, 'user');
      quill.setSelection(index + formula.length + 2);
    }
    setShowFormulaEditor(false);
  };

  const insertImage = () => {
    if (imageUrl.trim()) {
      const quill = quillRef.current?.getEditor();
      if (quill) {
        const range = quill.getSelection();
        const index = range ? range.index : quill.getLength();
        quill.insertEmbed(index, 'image', imageUrl.trim());
        setImageUrl('');
        setShowImageInput(false);
      }
    }
  };

  const insertVideo = () => {
    if (videoUrl.trim()) {
      const quill = quillRef.current?.getEditor();
      if (quill) {
        const range = quill.getSelection();
        const index = range ? range.index : quill.getLength();
        const embedUrl = getEmbedUrl(videoUrl.trim());
        const videoHTML = `<iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
        quill.clipboard.dangerouslyPasteHTML(index, videoHTML);
        setVideoUrl('');
        setShowVideoInput(false);
      }
    }
  };

  const getEmbedUrl = (url: string): string => {
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    if (url.includes('vimeo.com/')) {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
    return url;
  };


  return (
    <div className="space-y-2">
      <div className="bg-white [&_.ql-container]:min-h-[150px] [&_.ql-editor]:min-h-[120px]">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value === null || value === undefined ? '' : value}
          onChange={(content) => {
            onChange(content);
          }}
          placeholder={placeholder}
          modules={modules}
          formats={['header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link']}
        />
      </div>
      
      <div className="flex items-center space-x-2 pt-2 border-t border-slate-200">
        <button
          type="button"
          onClick={() => setShowFormulaEditor(true)}
          className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-sm text-slate-700 transition-colors"
          title="Insert Formula"
        >
          <Sigma className="w-4 h-4" />
          <span>Formula</span>
        </button>
        <button
          type="button"
          onClick={() => setShowImageInput(true)}
          className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-sm text-slate-700 transition-colors"
          title="Insert Image"
        >
          <Image className="w-4 h-4" />
          <span>Image</span>
        </button>
        <button
          type="button"
          onClick={() => setShowVideoInput(true)}
          className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-sm text-slate-700 transition-colors"
          title="Insert Video"
        >
          <Video className="w-4 h-4" />
          <span>Video</span>
        </button>
      </div>

      {showVideoInput && (
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center space-x-2">
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter video URL (YouTube, Vimeo)"
              className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <button
              type="button"
              onClick={insertVideo}
              className="px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
            >
              Insert
            </button>
            <button
              type="button"
              onClick={() => {
                setShowVideoInput(false);
                setVideoUrl('');
              }}
              className="px-3 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showImageInput && (
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center space-x-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <button
              type="button"
              onClick={insertImage}
              className="px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
            >
              Insert
            </button>
            <button
              type="button"
              onClick={() => {
                setShowImageInput(false);
                setImageUrl('');
              }}
              className="px-3 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 text-sm"
            >
              Cancel
            </button>
          </div>
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
