import React from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
  onDrop: (acceptedFiles: File[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/*': [] } });

  return (
    <div
      {...getRootProps({ className: 'dropzone' })}
      style={{ border: '2px dashed #888', padding: 20, textAlign: 'center', cursor: 'pointer' }}
    >
      <input {...getInputProps()} />
      <p>Arrastra y suelta una imagen aquí, o haz clic para seleccionar</p>
    </div>
  );
};

export default ImageUploader;
