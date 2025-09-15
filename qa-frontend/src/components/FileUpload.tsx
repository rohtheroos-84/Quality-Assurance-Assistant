import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { chatAPI } from '../services/api';
import { AnimatedBackground } from './AnimatedBackground';

interface FileUploadProps {
  uploadedFiles: any[];
  onFilesChange: (files: any[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  uploadedFiles,
  onFilesChange
}) => {
  // Particle configuration for drag effects
  const [particleSystem, setParticleSystem] = React.useState(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const uploadPromises = acceptedFiles.map(async (file) => {
      try {
        const fileType = file.type;
        let response;
        let uploadResponse;
        
        if (fileType === 'application/pdf') {
          response = await chatAPI.uploadPDF(file);
          uploadResponse = {
            text: response.text,
            metadata: { type: 'pdf' }
          };
        } else if (fileType === 'text/csv' || fileType.includes('excel')) {
          response = await chatAPI.uploadCSV(file);
          uploadResponse = {
            data: response.data,
            columns: response.columns,
            metadata: { type: 'csv' }
          };
        } else {
          throw new Error('Unsupported file type');
        }

        return {
          id: Math.random().toString(36).substr(2, 9),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadResponse
        };
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        return null;
      }
    });

    const uploadedResults = await Promise.all(uploadPromises);
    const successfulUploads = uploadedResults.filter(result => result !== null);
    
    onFilesChange([...uploadedFiles, ...successfulUploads]);
  }, [uploadedFiles, onFilesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: true
  });

  const removeFile = (id: string) => {
    onFilesChange(uploadedFiles.filter(file => file.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white font-['Poppins'] flex items-center space-x-2">
        <span>📁</span>
        <span>File Upload</span>
      </h3>

      <div {...getRootProps()} 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            scale: isDragActive ? 1.05 : 1,
            boxShadow: isHovered 
              ? "0 0 30px rgba(59, 130, 246, 0.2)" 
              : "0 0 0 rgba(59, 130, 246, 0)"
          }}
          transition={{ 
            duration: 0.5,
            boxShadow: { duration: 0.3 }
          }}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer backdrop-blur-sm
            ${isDragActive
              ? 'border-blue-400 bg-blue-50/50 shadow-lg shadow-blue-500/20'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
            } dark:bg-[#161B22]/50`}
        >
          <input {...getInputProps()} />

          <motion.div
            animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <motion.div 
              className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden group"
              initial={{ scale: 1 }}
              animate={{ 
                scale: isDragActive ? 1.1 : 1,
                rotate: isDragActive ? [0, -5, 5, -5, 0] : 0,
              }}
              transition={{ 
                duration: isDragActive ? 0.5 : 0.2,
                rotate: { repeat: Infinity, duration: 2 }
              }}
            >
              {/* Gradient background that shifts */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br"
                animate={{
                  background: [
                    "linear-gradient(to bottom right, rgb(59, 130, 246), rgb(99, 102, 241))",
                    "linear-gradient(to bottom right, rgb(139, 92, 246), rgb(76, 29, 149))",
                    "linear-gradient(to bottom right, rgb(16, 185, 129), rgb(59, 130, 246))",
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              {/* Icon with glow effect */}
              <motion.span 
                className="text-3xl text-white relative z-10"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📄
              </motion.span>

              {/* Glow overlay */}
              <motion.div 
                className="absolute inset-0 bg-blue-500/20 filter blur-xl"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            <div className="mt-4">
              <motion.p 
                className="text-sm font-medium text-gray-700 dark:text-gray-200"
                animate={{ 
                  scale: isDragActive ? 1.05 : 1,
                  color: isDragActive ? '#3B82F6' : ''
                }}
              >
                {isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to select'}
              </motion.p>
              <motion.p 
                className="text-xs text-gray-500 dark:text-gray-400 mt-1"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                PDF, CSV, Excel files supported
              </motion.p>
            </div>
          </motion.div>

          {isDragActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 rounded-2xl border-2 border-blue-400 bg-blue-50/20"
            />
          )}
        </motion.div>
      </div>

      {uploadedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2"
        >
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files</h4>
          {uploadedFiles.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 30px -10px rgba(59, 130, 246, 0.3)",
              }}
              className="flex items-center justify-between p-3 bg-white/60 dark:bg-[#161B22]/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden"
                  whileHover={{ scale: 1.1 }}
                >
                  {/* Animated gradient background */}
                  <motion.div 
                    className="absolute inset-0"
                    animate={{
                      background: [
                        "linear-gradient(to bottom right, rgb(34, 197, 94), rgb(16, 185, 129))",
                        "linear-gradient(to bottom right, rgb(16, 185, 129), rgb(6, 182, 212))",
                        "linear-gradient(to bottom right, rgb(34, 197, 94), rgb(16, 185, 129))",
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  {/* Icon with subtle float animation */}
                  <motion.span 
                    className="text-white text-sm relative z-10"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    📄
                  </motion.span>

                  {/* Glow effect */}
                  <motion.div 
                    className="absolute inset-0 bg-green-500/20 filter blur-sm"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <div>
                  <p className="text-sm font-medium text-gray-700 truncate max-w-32">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeFile(file.id)}
                className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
              >
                <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
