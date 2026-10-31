import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  RefreshCw,
  AlertCircle,
  ZoomIn,
} from 'lucide-react';
import { validateImageFile } from '../utils/validation';

interface ImageUploaderProps {
  imageDataUrl: string | null;
  imageFileName?: string;
  onImageSelected: (dataUrl: string, fileName: string, fileSizeBytes: number) => void;
  onImageRemoved: () => void;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageDataUrl,
  imageFileName,
  onImageSelected,
  onImageRemoved,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showEnlargeModal, setShowEnlargeModal] = useState(false);

  const processFile = (file: File) => {
    setErrorMessage(null);
    const validation = validateImageFile(file);

    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Invalid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageSelected(result, file.name, file.size);
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file from disk. Please try another file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
          <ImageIcon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>Circuit Photograph</span>
          <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400 lowercase">(recommended for visual continuity)</span>
        </label>
        {imageDataUrl && (
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Attached ({imageFileName || 'photo'})
          </span>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={disabled}
      />

      {imageDataUrl ? (
        /* Preview State */
        <div className="rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 overflow-hidden shadow-xs">
          <div className="relative aspect-video max-h-64 w-full rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800">
            <img
              src={imageDataUrl}
              alt="Uploaded circuit preview"
              className="w-full h-full object-contain"
            />
            {/* Overlay actions */}
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 backdrop-blur-[2px]">
              <button
                type="button"
                onClick={() => setShowEnlargeModal(true)}
                className="h-8 px-3 rounded-md bg-slate-900/90 hover:bg-slate-800 text-xs font-medium text-white border border-slate-700 flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>Enlarge</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="h-8 px-3 rounded-md bg-slate-900/90 hover:bg-slate-800 text-xs font-medium text-white border border-slate-700 flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={onImageRemoved}
                disabled={disabled}
                className="h-8 px-3 rounded-md bg-red-950/90 hover:bg-red-900 text-xs font-medium text-red-200 border border-red-800 flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <X className="w-3.5 h-3.5 text-red-400" />
                <span>Remove</span>
              </button>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between px-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="truncate max-w-[240px] font-mono font-medium text-slate-700 dark:text-slate-300">
              {imageFileName || 'circuit_photo.jpg'}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowEnlargeModal(true)}
                className="text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Inspect Leads</span>
              </button>
              <button
                type="button"
                onClick={onImageRemoved}
                disabled={disabled}
                className="text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Dropzone State */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
            disabled ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-900/30 border-slate-300 dark:border-slate-800' :
            isDragging
              ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30'
              : 'border-slate-300 dark:border-slate-750 hover:border-cyan-500 dark:hover:border-cyan-500 bg-slate-50/60 dark:bg-slate-950/50 hover:bg-slate-100/60 dark:hover:bg-slate-900/60'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-1.5">
            <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-750 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-xs">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold underline underline-offset-2">
                  Browse file
                </span>{' '}
                or drag circuit photo here
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                JPEG, PNG, or WebP up to 10 MB. Top-down, well-lit photos work best.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error alert */}
      {errorMessage && (
        <div className="rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 p-2.5 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-800 dark:text-red-200">Upload Issue</p>
            <p className="text-[11px] text-red-700/90 dark:text-red-300/90 mt-0.5">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Enlarged Modal */}
      {showEnlargeModal && imageDataUrl && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowEnlargeModal(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 p-3 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 px-2">
              <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                {imageFileName || 'Circuit Inspection View'}
              </span>
              <button
                type="button"
                onClick={() => setShowEnlargeModal(false)}
                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto max-h-[80vh] p-2 flex items-center justify-center bg-slate-950 rounded-lg mt-2">
              <img
                src={imageDataUrl}
                alt="Enlarged circuit"
                className="max-h-[75vh] w-auto object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
