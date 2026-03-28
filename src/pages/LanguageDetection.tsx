// import React, { useState, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { supabase } from "@/integrations/supabase/client";
// import './LanguageDetection.css';

// const LanguageDetectionPage = () => {
//   // Input States
//   const [inputText, setInputText] = useState('');
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

//   // Voice Recording States
//   const [isRecording, setIsRecording] = useState(false);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<Blob[]>([]);

//   // Processing & UI States
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [results, setResults] = useState<any[]>([]); // Maintains history of results

//   // Handlers
//   const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setInputText(e.target.value);
//     if (error) setError('');
//   };

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Validate file type
//       const validTypes = ['text/plain', 'audio/wav', 'audio/mpeg', 'audio/mp3'];
//       if (!validTypes.includes(file.type)) {
//         setError('Invalid file format. Please upload .txt, .wav, or .mp3');
//         return;
//       }
//       setSelectedFile(file);
//       setInputText(''); // Clear text when file is uploaded
//       setError('');
//     }
//   };

//   const removeFile = () => {
//     setSelectedFile(null);
//   };

//   // Voice Recording Logic (MediaRecorder API)
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       mediaRecorderRef.current = new MediaRecorder(stream);

//       mediaRecorderRef.current.ondataavailable = (e) => {
//         if (e.data.size > 0) audioChunksRef.current.push(e.data);
//       };

//       mediaRecorderRef.current.onstop = () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
//         const file = new File([audioBlob], 'voice_recording.wav', { type: 'audio/wav' });
//         setSelectedFile(file);
//         audioChunksRef.current = []; // Reset chunks
//       };

//       mediaRecorderRef.current.start();
//       setIsRecording(true);
//       setError('');
//       setInputText('');
//     } catch (err) {
//       setError('Microphone access denied or unavailable.');
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   // Main Detection Logic
//   const handleDetect = async () => {
//     if (!inputText.trim() && !selectedFile) {
//       setError('Please provide text or upload a file to proceed.');
//       return;
//     }

//     setIsLoading(true);
//     setError('');

//     try {
//       let contentToAnalyze = inputText;

//       // 1. Process Uploaded File
//       // if (selectedFile) {
//       //   if (selectedFile.type === 'text/plain') {
//       //     contentToAnalyze = await selectedFile.text();
//       //   } else if (selectedFile.type.includes('audio')) {
//       //     // Placeholder for STT
//       //     contentToAnalyze = "[Mock Transcribed Text from Audio]";
//       //   }
//       // }


//       // Example: using OpenAI Whisper via Supabase function
//       if (selectedFile && selectedFile.type.includes('audio')) {
//         const formData = new FormData();
//         formData.append('file', selectedFile);

//         const sttResponse = await fetch('/api/stt', { method: 'POST', body: formData });
//         const sttData = await sttResponse.json();
//         contentToAnalyze = sttData.text || '';
//       }


//       // Call actual API rather than mock
//       let data = null;
//       let apiError = null;
//       try {
//         // const response = await supabase.functions.invoke("lang-detect", {
//         //   body: { text: contentToAnalyze.trim() }
//         // });
//         // data = response.data;
//         // apiError = response.error;
//         const response = await supabase.functions.invoke("lang-detect", {
//           body: JSON.stringify({ text: contentToAnalyze.trim() }),
//           headers: { "Content-Type": "application/json" }
//         });
//         data = response.data;
//         apiError = response.error;

//       } catch (e: any) {
//         apiError = e;
//       }

//       let detectedName = "Unknown";
//       let confidenceScore = 50;
//       let breakdown = 'N/A';

//       // if (data && !apiError && !data.error) {
//       //   detectedName = data.full_language_name || data.language || "Unknown";
//       //   confidenceScore = Math.round((parseFloat(data.confidence) || 0.5) * 100);
//       //   if (data.type) breakdown = `Type: ${data.type}`;
//       // } else {
//       if (data && !apiError && data.full_language_name) {
//         detectedName = data.full_language_name;
//         confidenceScore = Math.round((parseFloat(data.confidence) || 0.5) * 100);
//       } else {
//         // Fallback code just in case
//         // const patterns: [RegExp, string, string][] = [
//         //   [/[\u0B80-\u0BFF]/, "ta", "Tamil"],
//         //   [/\b(el|la|los|las|es|está|como|qué|por|para|muy|más)\b/i, "es", "Spanish"],
//         //   [/\b(le|la|les|est|sont|avec|pour|dans|une|comment)\b/i, "fr", "French"],
//         //   [/\b(der|die|das|ist|und|ein|eine|nicht|ich|wie)\b/i, "de", "German"],
//         //   [/\b(il|lo|la|è|sono|che|per|con|una|come)\b/i, "it", "Italian"],
//         //   [/\b(o|a|os|as|é|está|com|para|uma|como)\b/i, "pt", "Portuguese"],
//         //   [/[\u0600-\u06FF]/, "ar", "Arabic"],
//         //   [/[\u0900-\u097F]/, "hi", "Hindi"],
//         //   [/[\u4e00-\u9fff]/, "zh", "Chinese"],
//         //   [/[\u3040-\u309f\u30a0-\u30ff]/, "ja", "Japanese"],
//         //   [/[\uac00-\ud7af]/, "ko", "Korean"],
//         // ];
//         const patterns: [RegExp, string, string][] = [
//           [/[\u0B80-\u0BFF]/, "ta", "Tamil"],          // Tamil
//           [/[\u0C00-\u0C7F]/, "te", "Telugu"],        // Telugu
//           [/[\u0C80-\u0CFF]/, "kn", "Kannada"],       // Kannada
//           [/[\u0D00-\u0D7F]/, "ml", "Malayalam"],     // Malayalam
//           [/[\u0900-\u097F]/, "hi", "Hindi"],         // Hindi (Devanagari)
//           [/[\u0980-\u09FF]/, "bn", "Bengali"],       // Bengali
//           [/[\u0A00-\u0A7F]/, "pa", "Punjabi"],       // Gurmukhi
//           [/[\u0B00-\u0B7F]/, "or", "Odia"],          // Odia
//           [/[\u4e00-\u9fff]/, "zh", "Chinese"],       // Chinese (CJK)
//           [/[\u3040-\u309f]/, "ja", "Japanese-Hiragana"],
//           [/[\u30A0-\u30FF]/, "ja", "Japanese-Katakana"],
//           [/[\uac00-\ud7af]/, "ko", "Korean"],        // Hangul
//           [/[\u0600-\u06FF]/, "ar", "Arabic"],        // Arabic
//           [/[\u0750-\u077F]/, "sd", "Sindhi"],        // Sindhi
//           [/[\u0590-\u05FF]/, "he", "Hebrew"],        // Hebrew
//           [/[\u0370-\u03FF]/, "el", "Greek"],         // Greek
//           [/[\u0400-\u04FF]/, "ru", "Russian/Cyrillic"], // Russian/Cyrillic
//         ];

//         const latinPatterns: [RegExp, string, string][] = [
//           [/\b(el|la|los|las|es|está|cómo|qué|por|para|muy|más)\b/i, "es", "Spanish"],
//           [/\b(o|a|os|as|é|está|com|para|uma|como)\b/i, "pt", "Portuguese"],
//           [/\b(le|la|les|est|sont|avec|pour|dans|une|comment|être)\b/i, "fr", "French"],
//           [/\b(der|die|das|ist|und|ein|eine|nicht|ich|wie|zu)\b/i, "de", "German"],
//           [/\b(il|lo|la|è|sono|che|per|con|una|come|dove)\b/i, "it", "Italian"],
//           [/\b(hello|the|is|and|a|it|you|of|for|in)\b/i, "en", "English"],
//           [/\b(salut|merci|bonjour|oui|non)\b/i, "fr", "French"],
//           [/\b(hola|gracias|amigo|sí|no)\b/i, "es", "Spanish"],
//           [/\b(oi|obrigado|sim|não|amigo)\b/i, "pt", "Portuguese"],
//           [/\b(こんにちは|さようなら|ありがとう)\b/i, "ja", "Japanese"],
//         ];


//         let matched = false;
//         // Collect all detected languages

//         const allPatterns = [...patterns, ...latinPatterns];
//         const detectedLanguages: { name: string, matchedWords: string[], confidence: number }[] = [];

//         allPatterns.forEach(([pattern, code, name]) => {
//           const matches = contentToAnalyze.match(pattern) || [];
//           if (matches.length > 0) {
//             detectedLanguages.push({
//               name,
//               matchedWords: matches,
//               confidence: Math.min(95, Math.max(80, Math.round((matches.length / contentToAnalyze.length) * 100)))
//             });
//           }
//         });

//         // Fallback to English
//         if (detectedLanguages.length === 0) {
//           detectedLanguages.push({ name: "English", matchedWords: [], confidence: 50 });
//         }

//         const languagesStr = detectedLanguages.map(l => l.name).join(', ');
//         const breakdownStr = detectedLanguages.map(l => `${l.name}: ${l.matchedWords.join(' ')}`).join(' | ');
//         const avgConfidence = Math.round(detectedLanguages.reduce((sum, l) => sum + l.confidence, 0) / detectedLanguages.length);

//         const newResult = {
//           id: Date.now(),
//           inputName: selectedFile ? selectedFile.name : `"${contentToAnalyze.substring(0, 15)}..."`,
//           detectedLanguages: languagesStr,
//           numLanguages: detectedLanguages.length,
//           wordBreakdown: breakdownStr,
//           confidence: avgConfidence
//         };

//         setResults(prev => [newResult, ...prev]);


//         // const detectedLanguages: { name: string, matchedWords: string[], confidence: number }[] = [];

//         // // Combine script-based and keyword-based patterns
//         // const allPatterns = [...patterns, ...latinPatterns];

//         // allPatterns.forEach(([pattern, code, name]) => {
//         //   const matches = contentToAnalyze.match(pattern) || [];
//         //   if (matches.length > 0) {
//         //     detectedLanguages.push({
//         //       name,
//         //       matchedWords: matches,
//         //       confidence: Math.min(95, Math.round((matches.length / contentToAnalyze.length) * 100) || 80)
//         //     });
//         //   }
//         // });

//         // // Fallback if nothing matched
//         // if (detectedLanguages.length === 0) {
//         //   detectedLanguages.push({ name: "English", matchedWords: [], confidence: 50 });
//         // }

//         // // Prepare values for UI
//         // const languagesStr = detectedLanguages.map(l => l.name).join(', ');
//         // const breakdownStr = detectedLanguages.map(l => `${l.name}: ${l.matchedWords.join(', ')}`).join(' | ');
//         // const avgConfidence = Math.round(detectedLanguages.reduce((sum, l) => sum + l.confidence, 0) / detectedLanguages.length);

//         // const newResult = {
//         //   id: Date.now(),
//         //   inputName: selectedFile ? selectedFile.name : `"${contentToAnalyze.substring(0, 15)}..."`,
//         //   detectedLanguages: languagesStr,
//         //   numLanguages: detectedLanguages.length,
//         //   wordBreakdown: breakdownStr,
//         //   confidence: avgConfidence
//         // };


//         //   for (const [pattern, code, name] of patterns) {
//         //     let matchedWords: string[] = [];

//         //     if (pattern.source.startsWith("[\\u")) {
//         //       // Script-based: count characters in the range
//         //       const chars = contentToAnalyze.match(pattern) || [];
//         //       if (chars.length > 0) {
//         //         matchedWords = chars;
//         //       }
//         //     } else {
//         //       // Keyword-based: find all matches
//         //       matchedWords = contentToAnalyze.match(pattern) || [];
//         //     }

//         //     if (matchedWords.length > 0) {
//         //       detectedLanguages.push({
//         //         name,
//         //         matchedWords,
//         //         confidence: Math.min(95, Math.round((matchedWords.length / contentToAnalyze.length) * 100) || 80)
//         //       });
//         //     }
//         //   }

//         //   // Fallback if no languages detected
//         //   if (detectedLanguages.length === 0) {
//         //     detectedLanguages.push({ name: "English", matchedWords: [], confidence: 50 });
//         //   }

//         //   if (!matched) detectedName = "English";
//         // }

//         // // capitalize first letter
//         // detectedName = detectedName.charAt(0).toUpperCase() + detectedName.slice(1);

//         // // const newResult = {
//         // //   id: Date.now(),
//         // //   inputName: selectedFile ? selectedFile.name : `"${contentToAnalyze.substring(0, 15)}..."`,
//         // //   detectedLanguages: `${detectedName}`,
//         // //   numLanguages: 1,
//         // //   wordBreakdown: breakdown,
//         // //   confidence: confidenceScore
//         // // };

//         // // Add new result to history
//         // setResults(prev => [newResult, ...prev]);

//         // // Reset input for next submission
//         // setInputText('');
//         // setSelectedFile(null);
//         // } catch (err) {
//         //   setError('Detection failed. Please try again later.');
//         // } finally {
//         //   setIsLoading(false);
//         // }
//       };

//       const exportCSV = () => {
//         const headers = "Input Name,Detected Language(s),Number of Languages,Word-Level Breakdown,Confidence\n";
//         const csvContent = results.map(r =>
//           `"${r.inputName}","${r.detectedLanguages}",${r.numLanguages},"${r.wordBreakdown}","${r.confidence}%"`
//         ).join('\n');

//         const blob = new Blob([headers + csvContent], { type: 'text/csv' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'unispeak-results.csv';
//         a.click();
//       };

//       return (
//         <div className="unispeak-container">
//           {/* Header */}
//           <motion.header
//             className="unispeak-header"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//           >
//             <h1>UniSpeak AI</h1>
//             <p>Seamless Language Detection & Analysis</p>
//           </motion.header>

//           {/* Main Analysis Card */}
//           <motion.div
//             className="unispeak-card box-shadow-premium"
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.1 }}
//           >
//             {/* Text Input Area */}
//             <div className="input-group">
//               <motion.textarea
//                 placeholder="Type or paste your text here..."
//                 value={inputText}
//                 onChange={handleTextChange}
//                 disabled={!!selectedFile || isRecording}
//                 whileFocus={{ scale: 1.01, borderColor: '#5899f4ff' }}
//                 className="modern-textarea"
//               />
//             </div>

//             {/* Selected File Indicator */}
//             <AnimatePresence>
//               {selectedFile && (
//                 <motion.div
//                   key="file-indicator"
//                   className="file-indicator"
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: 'auto' }}
//                   exit={{ opacity: 0, height: 0 }}
//                 >
//                   <span>📎 {selectedFile.name}</span>
//                   <button onClick={removeFile} className="remove-btn">✕</button>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Error Message */}
//             <AnimatePresence>
//               {error && (
//                 <motion.div
//                   key="error-message"
//                   className="error-message"
//                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//                 >
//                   {error}
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Action Buttons Row */}
//             <div className="actions-row">
//               <div className="upload-actions">
//                 <label className="secondary-btn">
//                   📄 Upload Text (.txt)
//                   <input type="file" accept=".txt" onChange={handleFileUpload} hidden />
//                 </label>
//                 <label className="secondary-btn">
//                   🎵 Upload Audio (.wav, .mp3)
//                   <input type="file" accept=".wav,.mp3" onChange={handleFileUpload} hidden />
//                 </label>
//                 <button
//                   className={`secondary-btn ${isRecording ? 'recording-active' : ''}`}
//                   onClick={isRecording ? stopRecording : startRecording}
//                 >
//                   {isRecording ? '⏹ Stop Recording' : '🎤 Record Voice'}
//                 </button>
//               </div>

//               <motion.button
//                 className="primary-btn detect-btn"
//                 onClick={handleDetect}
//                 disabled={isLoading}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 {isLoading ? <span className="loader"></span> : 'Detect Language ✨'}
//               </motion.button>
//             </div>
//           </motion.div>

//           {/* Results Table Section */}
//           <AnimatePresence>
//             {results.length > 0 && (
//               <motion.div
//                 key="results-section"
//                 className="results-section"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: 20 }}
//               >
//                 <div className="results-header">
//                   <h2>Analysis History</h2>
//                   <button className="export-btn" onClick={exportCSV}>📥 Export CSV</button>
//                 </div>

//                 <div className="table-responsive">
//                   <table className="modern-table">
//                     <thead>
//                       <tr>
//                         <th>Input Name</th>
//                         <th>Detected Language(s)</th>
//                         <th>Count</th>
//                         <th>Word Breakdown</th>
//                         <th>Confidence</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <AnimatePresence>
//                         {results.map((result) => (
//                           <motion.tr
//                             key={result.id}
//                             initial={{ opacity: 0, x: -20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0 }}
//                             transition={{ layout: { duration: 0.3 } }}
//                           >
//                             <td>{result.inputName}</td>
//                             <td className="highlight-cell">{result.detectedLanguages}</td>
//                             <td>{result.numLanguages}</td>
//                             <td className="breakdown-cell">{result.wordBreakdown}</td>
//                             <td>
//                               <div className="progress-bar-container">
//                                 <motion.div
//                                   className="progress-bar"
//                                   initial={{ width: 0 }}
//                                   animate={{ width: `${result.confidence}%` }}
//                                 />
//                                 <span>{result.confidence}%</span>
//                               </div>
//                             </td>
//                           </motion.tr>
//                         ))}
//                       </AnimatePresence>
//                     </tbody>
//                   </table>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       );

//     } catch (err) {
//       setError('Detection failed. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };
// }

// export default LanguageDetectionPage;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LanguageDetection.css';

const LanguageDetectionPage = () => {
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (error) setError('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain') {
      setError('Invalid file format. Please upload .txt files only');
      return;
    }

    setSelectedFile(file);
    setError('');

    try {
      const text = await file.text();
      setInputText(text);
    } catch {
      setError('Failed to read the text file.');
    }
  };

  const removeFile = () => setSelectedFile(null);

  const handleDetect = async () => {
    if (!inputText.trim() && !selectedFile) {
      setError('Please provide text or upload a file to proceed.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let contentToAnalyze = inputText;

      if (selectedFile && selectedFile.type === 'text/plain') {
        contentToAnalyze = await selectedFile.text();
      }

      // Extended language patterns
      const patterns: [RegExp, string, string][] = [
        [/[\u0B80-\u0BFF]/, "ta", "Tamil"],
        [/[\u0C00-\u0C7F]/, "te", "Telugu"],
        [/[\u0C80-\u0CFF]/, "kn", "Kannada"],
        [/[\u0D00-\u0D7F]/, "ml", "Malayalam"],
        [/[\u0900-\u097F]/, "hi", "Hindi"],
        [/[\u0980-\u09FF]/, "bn", "Bengali"],
        [/[\u0A00-\u0A7F]/, "pa", "Punjabi"],
        [/[\u0B00-\u0B7F]/, "or", "Odia"],
        [/[\u4e00-\u9fff]/, "zh", "Chinese"],
        [/[\u3040-\u309f]/, "ja", "Japanese-Hiragana"],
        [/[\u30A0-\u30FF]/, "ja", "Japanese-Katakana"],
        [/[\uac00-\ud7af]/, "ko", "Korean"],
        [/[\u0590-\u05FF]/, "he", "Hebrew"],
        [/[\u0600-\u06FF]/, "ar", "Arabic"],
        [/[\u0400-\u04FF]/, "ru", "Russian"],
        [/\b(hello|the|is|and|a|it|you|of|for|in)\b/i, "en", "English"],
        [/\b(hola|gracias|amigo|sí|no)\b/i, "es", "Spanish"],
        [/\b(der|die|das|ist|und|ein|nicht)\b/i, "de", "German"],
        [/\b(le|la|les|est|sont|avec|pour|dans|une)\b/i, "fr", "French"],
        [/\b(il|lo|la|è|sono|che|per|con|una|come|dove)\b/i, "it", "Italian"],
        [/\b(oi|obrigado|sim|não|amigo)\b/i, "pt", "Portuguese"]
      ];

      const detectedLanguages: { name: string; matchedWords: string[]; confidence: number }[] = [];

      patterns.forEach(([pattern, code, name]) => {
        const matches = contentToAnalyze.match(pattern) || [];
        if (matches.length > 0) {
          const confidence = Math.min(95, Math.round((matches.length / contentToAnalyze.length) * 100));
          detectedLanguages.push({ name, matchedWords: matches, confidence });
        }
      });

      if (detectedLanguages.length === 0) {
        detectedLanguages.push({ name: "English", matchedWords: [], confidence: 50 });
      }

      const languagesStr = detectedLanguages.map(l => l.name).join(', ');
      const breakdownStr = detectedLanguages.map(l => `${l.name}: ${l.matchedWords.join(' ')}`).join(' | ');
      const avgConfidence = Math.round(detectedLanguages.reduce((sum, l) => sum + l.confidence, 0) / detectedLanguages.length);

      const newResult = {
        id: Date.now(),
        inputName: selectedFile ? selectedFile.name : `"${contentToAnalyze.substring(0, 15)}..."`,
        detectedLanguages: languagesStr,
        numLanguages: detectedLanguages.length,
        wordBreakdown: breakdownStr,
        confidence: avgConfidence
      };

      setResults(prev => [newResult, ...prev]);
      setInputText('');
      setSelectedFile(null);

    } catch {
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
      <motion.header className="unispeak-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1>UniSpeak AI</h1>
        <p>Seamless Language Detection & Analysis</p>
      </motion.header>

      <motion.div className="unispeak-card box-shadow-premium" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <div className="input-group">
          <motion.textarea
            placeholder="Type or paste your text here..."
            value={inputText}
            onChange={handleTextChange}
            disabled={!!selectedFile}
            whileFocus={{ scale: 1.01, borderColor: '#5899f4ff' }}
            className="modern-textarea"
          />
        </div>

        <AnimatePresence>
          {selectedFile && (
            <motion.div key="file-indicator" className="file-indicator" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <span>📎 {selectedFile.name}</span>
              <button onClick={removeFile} className="remove-btn">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div key="error-message" className="error-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="actions-row">
          <div className="upload-actions">
            <label className="secondary-btn">
              📄 Upload Text (.txt)
              <input type="file" accept=".txt" onChange={handleFileUpload} hidden />
            </label>
          </div>

          <motion.button className="primary-btn detect-btn" onClick={handleDetect} disabled={isLoading} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {isLoading ? <span className="loader"></span> : 'Detect Language ✨'}
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div key="results-section" className="results-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
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
                    {/* <th>Confidence</th> */}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {results.map((result) => (
                      <motion.tr key={result.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ layout: { duration: 0.3 } }}>
                        <td>{result.inputName}</td>
                        <td className="highlight-cell">{result.detectedLanguages}</td>
                        <td>{result.numLanguages}</td>
                        <td className="breakdown-cell">{result.wordBreakdown}</td>
                        {/* <td>
                          <div className="progress-bar-container">
                            <motion.div className="progress-bar" initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }} />
                            <span>{result.confidence}%</span>
                          </div>
                        </td> */}
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
