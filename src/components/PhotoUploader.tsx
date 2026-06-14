import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image, AlertCircle, Loader2, GripVertical } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PhotoUploaderProps {
  existingPhotos?: string[];
  onChange: (urls: string[]) => void;
  maxPhotos?: number;
}

interface PhotoItem {
  id: string;
  url: string;
  uploading?: boolean;
  error?: string;
  isNew?: boolean;
}

export default function PhotoUploader({ existingPhotos = [], onChange, maxPhotos = 10 }: PhotoUploaderProps) {
  const [photos, setPhotos] = useState<PhotoItem[]>(
    existingPhotos.map(url => ({ id: crypto.randomUUID(), url, isNew: false }))
  );
  const [draggingOver, setDraggingOver] = useState(false);
  const [dragItem, setDragItem] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function notifyParent(items: PhotoItem[]) {
    onChange(items.filter(p => !p.uploading && !p.error).map(p => p.url));
  }

  async function uploadFile(file: File): Promise<string | null> {
    const ext = file.name.split('.').pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { data, error } = await supabase.storage
      .from('property-photos')
      .upload(path, file, { cacheControl: '3600', upsert: false });
    if (error || !data) return null;
    const { data: pub } = supabase.storage.from('property-photos').getPublicUrl(data.path);
    return pub.publicUrl;
  }

  async function processFiles(files: FileList | File[]) {
    const arr = Array.from(files);
    const remaining = maxPhotos - photos.filter(p => !p.error).length;
    const toProcess = arr.slice(0, remaining);

    const placeholders: PhotoItem[] = toProcess.map(f => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(f),
      uploading: true,
      isNew: true,
    }));

    setPhotos(prev => {
      const next = [...prev, ...placeholders];
      return next;
    });

    for (let i = 0; i < toProcess.length; i++) {
      const file = toProcess[i];
      const ph = placeholders[i];
      const uploadedUrl = await uploadFile(file);
      setPhotos(prev => {
        const updated = prev.map(p =>
          p.id === ph.id
            ? uploadedUrl
              ? { ...p, url: uploadedUrl, uploading: false }
              : { ...p, uploading: false, error: 'Upload failed' }
            : p
        );
        notifyParent(updated);
        return updated;
      });
    }
  }

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDraggingOver(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  }

  function removePhoto(id: string) {
    setPhotos(prev => {
      const updated = prev.filter(p => p.id !== id);
      notifyParent(updated);
      return updated;
    });
  }

  // Drag-to-reorder
  function onDragStart(index: number) {
    setDragItem(index);
  }

  function onDragEnter(index: number) {
    setDragOver(index);
  }

  function onDragEnd() {
    if (dragItem === null || dragOver === null || dragItem === dragOver) {
      setDragItem(null);
      setDragOver(null);
      return;
    }
    setPhotos(prev => {
      const next = [...prev];
      const [moved] = next.splice(dragItem, 1);
      next.splice(dragOver, 0, moved);
      notifyParent(next);
      return next;
    });
    setDragItem(null);
    setDragOver(null);
  }

  const canAddMore = photos.filter(p => !p.error).length < maxPhotos;

  return (
    <div>
      {/* Drop Zone */}
      {canAddMore && (
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDraggingOver(true); }}
          onDragLeave={() => setDraggingOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            draggingOver
              ? 'border-teal-500 bg-teal-50 scale-[1.01]'
              : 'border-gray-300 bg-gray-50 hover:border-teal-400 hover:bg-teal-50/50'
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors ${draggingOver ? 'bg-teal-100' : 'bg-gray-100'}`}>
            <Upload className={`w-6 h-6 ${draggingOver ? 'text-teal-600' : 'text-gray-400'}`} />
          </div>
          <p className="text-sm font-medium text-gray-700">
            {draggingOver ? 'Drop photos here' : 'Drag & drop photos here'}
          </p>
          <p className="text-xs text-gray-400 mt-1">or click to browse · JPG, PNG, WEBP · max 10MB each</p>
          <p className="text-xs text-teal-600 mt-2 font-medium">
            {photos.filter(p => !p.error).length} / {maxPhotos} photos
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={handleFilePick}
          />
        </div>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-3">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              draggable={!photo.uploading}
              onDragStart={() => onDragStart(index)}
              onDragEnter={() => onDragEnter(index)}
              onDragEnd={onDragEnd}
              onDragOver={e => e.preventDefault()}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 group transition-all ${
                dragOver === index && dragItem !== index
                  ? 'border-teal-500 scale-105'
                  : index === 0
                  ? 'border-teal-400'
                  : 'border-gray-200'
              } ${photo.error ? 'opacity-60' : ''}`}
            >
              <img
                src={photo.url}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Cover badge */}
              {index === 0 && !photo.uploading && !photo.error && (
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-teal-600 text-white text-[10px] font-bold rounded-md">
                  Cover
                </div>
              )}

              {/* Uploading overlay */}
              {photo.uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}

              {/* Error overlay */}
              {photo.error && (
                <div className="absolute inset-0 bg-red-500/60 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
              )}

              {/* Drag handle & Remove */}
              {!photo.uploading && (
                <>
                  <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                    <div className="w-5 h-5 bg-black/50 rounded flex items-center justify-center">
                      <GripVertical className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); removePhoto(photo.id); }}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </>
              )}
            </div>
          ))}

          {/* Add more slot */}
          {canAddMore && photos.length > 0 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-teal-400 hover:bg-teal-50 flex flex-col items-center justify-center gap-1 transition-all"
            >
              <Image className="w-5 h-5 text-gray-400" />
              <span className="text-[10px] text-gray-400">Add more</span>
            </button>
          )}
        </div>
      )}

      {photos.length > 1 && (
        <p className="text-xs text-gray-400 mt-2">Drag photos to reorder. First photo is the cover image.</p>
      )}
    </div>
  );
}
