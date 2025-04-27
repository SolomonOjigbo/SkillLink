import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../hooks/useAuth';

interface AvatarProps {
  url?: string;
  size: number;
  onUpload: (filePath: string) => void;
  storageBucket: string;
  userId?: string;
}

export default function Avatar({
  url,
  size,
  onUpload,
  storageBucket,
  userId
}: AvatarProps) {
  const [uploading, setUploading] = useState(false);
  const { data: authUser } = useUser();

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      if (!event.target.files?.[0]) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = 'jpg';
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `uploads/${Date.now()}_${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(storageBucket)
        .upload(filePath, file, {
          cacheControl: '3600', // 1 hour cache
          upsert: false,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl }
      } = supabase.storage.from(storageBucket).getPublicUrl(filePath);

      onUpload(publicUrl);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Upload failed');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {url ? (
        <img
          src={url}
          alt="Avatar"
          style={{ height: size, width: size }}
          className="object-cover"
        />
      ) : (
        <div style={{ height: size, width: size }} />
      )}
      <div style={{ width: size }}>
        {authUser?.id === userId && (
          <label
            htmlFor="single"
            className={`block rounded p-2 text-center ${
              uploading
                ? 'bg-gray-300'
                : 'cursor-pointer bg-blue-500 text-white'
            }`}
          >
            <>{uploading ? 'Uploading...' : 'Upload Image'}</>
          </label>
        )}
        <input
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          className="hidden"
        />
      </div>
    </div>
  );
}
