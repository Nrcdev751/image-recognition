import React, { useState, useCallback } from 'react';
import JSZip from 'jszip';
import { Upload, FileUp, X, Check, Loader2, Image as ImageIcon } from 'lucide-react';

interface ZipUploadStageProps {
  onSave: (images: { name: string; data: string }[]) => void;
  onCancel: () => void;
}

export const ZipUploadStage: React.FC<ZipUploadStageProps> = ({ onSave, onCancel }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedImages, setExtractedImages] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processZipFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setExtractedImages([]);

    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      const images: string[] = [];

      const promises: Promise<void>[] = [];

      contents.forEach((relativePath, zipEntry) => {
        if (!zipEntry.dir && (relativePath.match(/\.(jpg|jpeg|png|webp)$/i))) {
          const promise = zipEntry.async('base64').then((data) => {
            const ext = relativePath.split('.').pop()?.toLowerCase();
            let mimeType = 'image/jpeg';
            if (ext === 'png') mimeType = 'image/png';
            if (ext === 'webp') mimeType = 'image/webp';

            images.push(`data:${mimeType};base64,${data}`);
          });
          promises.push(promise);
        }
      });

      await Promise.all(promises);

      if (images.length === 0) {
        setError('No valid images found in the zip file.');
      } else {
        setExtractedImages(images);
      }
    } catch (err) {
      console.error('Error unziping file:', err);
      setError('Failed to process zip file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/zip' || file.name.endsWith('.zip'))) {
      await processZipFile(file);
    } else {
      setError('Please upload a valid .zip file.');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processZipFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      setError('Please enter a name for these images.');
      return;
    }

    const newUsers = extractedImages.map(img => ({
      name: name.trim(),
      data: img
    }));

    onSave(newUsers);
  };

  const removeImage = (index: number) => {
    setExtractedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full flex flex-col p-8 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
          Batch Upload
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-slate-400" />
        </button>
      </div>

      {extractedImages.length === 0 ? (
        <div
          className={`
            flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 transition-all duration-300
            ${isDragging ? 'border-cyan-400 bg-cyan-400/5' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isProcessing ? (
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-4" />
              <p className="text-slate-300 text-lg">Processing Zip File...</p>
            </div>
          ) : (
            <>
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <FileUp className="w-12 h-12 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Drop Zip File Here</h3>
              <p className="text-slate-400 text-center max-w-sm mb-8">
                Upload a zip file containing multiple images to train the model with multiple samples at once.
              </p>

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".zip"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <span className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
                  Browse Files
                </span>
              </label>
              {error && (
                <p className="mt-4 text-red-400 bg-red-400/10 px-4 py-2 rounded-lg">
                  {error}
                </p>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 mb-6">
            <label className="block text-sm text-slate-400 mb-2">Assign Name to {extractedImages.length} Images</label>
            <div className="flex gap-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter person's name..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                autoFocus
              />
              <button
                onClick={handleSave}
                disabled={!name.trim()}
                className="px-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Check className="w-5 h-5" />
                Save All
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
            {extractedImages.map((img, idx) => (
              <div key={idx} className="group relative aspect-square bg-slate-800 rounded-xl overflow-hidden border border-white/5">
                <img src={img} alt={`Extracted ${idx}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-lg backdrop-blur opacity-0 group-hover:opacity-100 transition-all transform scale-90 hover:scale-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between items-center text-sm text-slate-500">
            <span>{extractedImages.length} images extracted</span>
            <button onClick={() => setExtractedImages([])} className="text-red-400 hover:text-red-300">
              Discard & Upload New
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
