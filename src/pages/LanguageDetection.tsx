import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LanguageDetection.css';

const LanguageDetectionPage = () => {
  // Input States
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Voice Recording States
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Processing & UI States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<any[]>([]); // Maintains history of results

  // Handlers
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (error) setError('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['text/plain', 'audio/wav', 'audio/mpeg', 'audio/mp3'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid file format. Please upload .txt, .wav, or .mp3');
        return;
      }
      setSelectedFile(file);
      setInputText(''); // Clear text when file is uploaded
      setError('');
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  // Voice Recording Logic (MediaRecorder API)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const file = new File([audioBlob], 'voice_recording.wav', { type: 'audio/wav' });
        setSelectedFile(file);
        audioChunksRef.current = []; // Reset chunks
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError('');
      setInputText('');
    } catch (err) {
      setError('Microphone access denied or unavailable.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Main Detection Logic
  const handleDetect = async () => {
    if (!inputText.trim() && !selectedFile) {
      setError('Please provide text or upload a file to proceed.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let contentToAnalyze = inputText;

      // 1. Process Uploaded File
      if (selectedFile) {
        if (selectedFile.type === 'text/plain') {
          contentToAnalyze = await selectedFile.text();
        } else if (selectedFile.type.includes('audio')) {
          // Placeholder for STT
          contentToAnalyze = "[Mock Transcribed Text from Audio]";
        }
      }

      // Simulating API latency & response for the deliverable
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newResult = {
        id: Date.now(),
        inputName: selectedFile ? selectedFile.name : `"${contentToAnalyze.substring(0, 15)}..."`,
        detectedLanguages: 'English (80%), Spanish (20%)',
        numLanguages: 2,
        wordBreakdown: 'Hello (En), amigo (Es)',
        confidence: 94
      };

      // Add new result to history
      setResults(prev => [newResult, ...prev]);
      
      // Reset input for next submission
      setInputText('');
      setSelectedFile(null);
    } catch (err) {
      setError('Detection failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = "Input Name,Detected Language(s),Number of Languages,Word-Level Breakdown,Confidence\n";
    const csvContent = results.map(r => 
      `"${r.inputName}","${r.detectedLanguages}",${r.numLanguages},"${r.wordBreakdown}","${r.confidence}%"`
    ).join('\n');
    
    const blob = new Blob([headers + csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unispeak-results.csv';
    a.click();
  };

  return (
    <div className="unispeak-container">
      {/* Header */}
      <motion.header 
        className="unispeak-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>UniSpeak AI</h1>
        <p>Seamless Language Detection & Analysis</p>
      </motion.header>

      {/* Main Analysis Card */}
      <motion.div 
        className="unispeak-card box-shadow-premium"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Text Input Area */}
        <div className="input-group">
          <motion.textarea
            placeholder="Type or paste your text here..."
            value={inputText}
            onChange={handleTextChange}
            disabled={!!selectedFile || isRecording}
            whileFocus={{ scale: 1.01, borderColor: '#6366f1' }}
            className="modern-textarea"
          />
        </div>

        {/* Selected File Indicator */}
        <AnimatePresence>
          {selectedFile && (
            <motion.div 
              className="file-indicator"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <span>📎 {selectedFile.name}</span>
              <button onClick={removeFile} className="remove-btn">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons Row */}
        <div className="actions-row">
          <div className="upload-actions">
            <label className="secondary-btn">
              📄 Upload Text (.txt)
              <input type="file" accept=".txt" onChange={handleFileUpload} hidden />
            </label>
            <label className="secondary-btn">
              🎵 Upload Audio (.wav, .mp3)
              <input type="file" accept=".wav,.mp3" onChange={handleFileUpload} hidden />
            </label>
            <button 
              className={`secondary-btn ${isRecording ? 'recording-active' : ''}`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? '⏹ Stop Recording' : '🎤 Record Voice'}
            </button>
          </div>

          <motion.button 
            className="primary-btn detect-btn"
            onClick={handleDetect}
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? <span className="loader"></span> : 'Detect Language ✨'}
          </motion.button>
        </div>
      </motion.div>

      {/* Results Table Section */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div 
            className="results-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="results-header">
              <h2>Analysis History</h2>
              <button className="export-btn" onClick={exportCSV}>📥 Export CSV</button>
            </div>
            
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Input Name</th>
                    <th>Detected Language(s)</th>
                    <th>Count</th>
                    <th>Word Breakdown</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {results.map((result) => (
                      <motion.tr 
                        key={result.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ layout: { duration: 0.3 } }}
                      >
                        <td>{result.inputName}</td>
                        <td className="highlight-cell">{result.detectedLanguages}</td>
                        <td>{result.numLanguages}</td>
                        <td className="breakdown-cell">{result.wordBreakdown}</td>
                        <td>
                          <div className="progress-bar-container">
                            <motion.div 
                              className="progress-bar" 
                              initial={{ width: 0 }}
                              animate={{ width: `${result.confidence}%` }}
                            />
                            <span>{result.confidence}%</span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageDetectionPage;
