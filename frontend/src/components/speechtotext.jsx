import React, { useState, useRef } from 'react';
import { Mic, Square } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { speechAPI } from '../services/api'; // adjust path as needed

const SpeechToText = ({ onTranscript, language = 'en' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        setIsProcessing(true);

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        formData.append('language', language);

        try {
          const response = await speechAPI.transcribeAudio(formData);

          if (response.status === 200) {
            onTranscript(response.data.transcript);
            toast.success('Audio transcribed successfully!');
          } else {
            console.error('Transcription error:', response.data);
            toast.error('Failed to transcribe audio');
          }
        } catch (err) {
          console.error('Error processing audio:', err.response?.data || err.message);
          toast.error('Error processing audio');
        } finally {
          setIsProcessing(false);
          // Stop all tracks
          stream.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started. Speak now!');
    } catch (err) {
      console.error('Microphone access error:', err);
      toast.error('Could not access microphone');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="flex items-center">
        {!isRecording && !isProcessing ? (
          <button
            onClick={handleStartRecording}
            className="p-3 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
            title="Start voice recording"
          >
            <Mic className="w-6 h-6" />
          </button>
        ) : isRecording ? (
          <button
            onClick={handleStopRecording}
            className="p-3 text-red-500 hover:text-red-600 transition-colors animate-pulse rounded-full hover:bg-red-50"
            title="Stop recording"
          >
            <Square className="w-6 h-6" />
          </button>
        ) : (
          <div className="p-3 text-blue-600" title="Processing audio...">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </>
  );
};

export default SpeechToText;
