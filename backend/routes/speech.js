import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import ffmpeg from 'fluent-ffmpeg';

const router = express.Router();

// Upload directory
const uploadDir = path.join('C:', 'EDUBOT', 'backend', 'uploads', 'audio');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup
const upload = multer({ dest: uploadDir });

// Helper: convert audio to WAV if needed
async function convertToWav(inputPath) {
  const outputPath = inputPath + '.wav';
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat('wav')
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .save(outputPath);
  });
}

// Helper: run whisper-cli
function runWhisper(audioPath, language = 'en') {
  return new Promise((resolve, reject) => {
    const whisperPath = path.join('C:', 'EDUBOT', 'backend', 'whisper.cpp', 'build', 'bin', 'Debug', 'whisper-cli.exe');
    const modelPath = path.join('C:', 'EDUBOT', 'backend', 'whisper.cpp', 'models', 'base.bin');

    const args = [
      '-m', modelPath,
      '-f', audioPath,
      '-l', language,
      '--output-txt'
    ];

    execFile(whisperPath, args, (err, stdout, stderr) => {
      if (err) return reject(new Error(stderr || err.message));

      const txtFile = audioPath + '.txt';
      let transcript = '';
      if (fs.existsSync(txtFile)) {
        transcript = fs.readFileSync(txtFile, 'utf-8').trim();
        fs.unlinkSync(txtFile); // cleanup
      }
      resolve(transcript);
    });
  });
}

// POST /api/speech-to-text
router.post('/', upload.single('audio'), async (req, res) => {
  let audioFile;
  try {
    if (!req.file) return res.status(400).json({ error: 'No audio uploaded' });

    audioFile = req.file.path;
    const language = req.body.language || 'en';

    // Convert to WAV if necessary
    const ext = path.extname(audioFile).toLowerCase();
    if (ext !== '.wav') {
      audioFile = await convertToWav(audioFile);
    }

    // Run Whisper
    const transcript = await runWhisper(audioFile, language);

    res.json({ transcript });

  } catch (err) {
    console.error('Error during transcription:', err);
    res.status(500).json({ error: 'Transcription failed', details: err.message });
  } finally {
    // Cleanup uploaded/conversion files
    try { if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path); } catch {}
    try { if (audioFile && fs.existsSync(audioFile) && audioFile !== req.file?.path) fs.unlinkSync(audioFile); } catch {}
  }
});

export default router;
