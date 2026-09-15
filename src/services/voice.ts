import { voiceSamples } from '@/data/insights'
import { uid } from './util'

/**
 * MOCK VOICE INPUT
 * ================
 * Simulated. No microphone permission is requested and no audio is captured.
 * The "levels" are generated numbers that drive the waveform animation, and the
 * transcript is drawn from a fixed sample list.
 *
 * REAL IMPLEMENTATION has two reasonable paths:
 *
 *  1. Browser-native, no server:
 *       const rec = new webkitSpeechRecognition()
 *       rec.interimResults = true
 *       rec.onresult = (e) => onPartial(e.results[0][0].transcript)
 *
 *  2. Record and transcribe, better accuracy and consistent across browsers:
 *       const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
 *       // MediaRecorder -> blob -> POST to VITE_SPEECH_API_BASE
 *
 * Either way the interface below holds: start listening, receive audio levels
 * for the waveform, receive a partial transcript as words arrive, then a final
 * one. Building the UI against that shape now means the swap is a one-file change.
 */

export interface VoiceSession {
  id: string
  /** Stops listening early and resolves with whatever has been "heard". */
  stop: () => void
  /** Abandons the session with no transcript. */
  cancel: () => void
}

export interface VoiceHandlers {
  /** 0-1 values, roughly 20 per second, for the waveform bars. */
  onLevel: (levels: number[]) => void
  /** Words appearing as they are recognised. */
  onPartial: (text: string) => void
  onFinal: (text: string) => void
  onCancel?: () => void
}

const BAR_COUNT = 28

export function startListening(handlers: VoiceHandlers, forcedPhrase?: string): VoiceSession {
  const phrase = forcedPhrase ?? voiceSamples[Math.floor(Math.random() * voiceSamples.length)]
  const words = phrase.split(' ')

  let levels = new Array<number>(BAR_COUNT).fill(0.08)
  let wordIndex = 0
  let stopped = false
  let energy = 0.35

  const levelTimer = setInterval(() => {
    if (stopped) return
    // Envelope that swells while "speaking" and dips between words.
    energy = Math.min(1, Math.max(0.18, energy + (Math.random() - 0.45) * 0.28))
    const next = Math.min(1, energy * (0.55 + Math.random() * 0.75))
    levels = [...levels.slice(1), next]
    handlers.onLevel(levels)
  }, 55)

  const wordTimer = setInterval(() => {
    if (stopped) return
    wordIndex += 1
    handlers.onPartial(words.slice(0, wordIndex).join(' '))
    if (wordIndex >= words.length) {
      finish()
    }
  }, 190)

  const cleanup = () => {
    stopped = true
    clearInterval(levelTimer)
    clearInterval(wordTimer)
  }

  const finish = () => {
    if (stopped) return
    cleanup()
    // Small pause after the last word, the way a recogniser waits for silence.
    setTimeout(() => handlers.onFinal(phrase), 340)
  }

  return {
    id: uid('voice'),
    stop: finish,
    cancel: () => {
      if (stopped) return
      cleanup()
      handlers.onCancel?.()
    },
  }
}
