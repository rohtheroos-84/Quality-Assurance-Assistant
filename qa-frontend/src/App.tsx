import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChatInterface } from './components/ChatInterface';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
// import { FileUpload } from './components/FileUpload';
// import { PersonaSelector } from './components/PersonaSelector';
// import { ToolGenerator } from './components/ToolGenerator';
import { BackgroundParticles } from './components/ui/BackgroundParticles';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const { colors, mode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Initialize sidebar as open on desktop, closed on mobile
    return window.innerWidth >= 1024;
  });
  const [selectedPersona, setSelectedPersona] = useState('Novice Guide');
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background Layer */}
      <div 
        style={{
          background: colors.background,
          color: colors.text
        }}
        className="absolute inset-0"
      />
      
      {/* Particles Layer */}
      <BackgroundParticles />
      
      {/* Content Layer */}
      <div className="relative h-full flex flex-col" style={{ zIndex: 1 }}>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <div className="flex flex-1 relative overflow-hidden">
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)}
            selectedPersona={selectedPersona}
            onPersonaChange={setSelectedPersona}
            uploadedFiles={uploadedFiles}
            onFilesChange={setUploadedFiles}
          />
          
          {/* Main content */}
          <main className="flex-1 relative overflow-hidden">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="h-full"
            >
              <ChatInterface 
                selectedPersona={selectedPersona}
                uploadedFiles={uploadedFiles}
              />
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}