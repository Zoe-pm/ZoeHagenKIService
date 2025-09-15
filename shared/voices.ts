/**
 * ElevenLabs Voice Configuration
 * Static list of available voices with IDs for consistent usage across frontend and backend
 */

export interface ElevenLabsVoice {
  id: string;
  name: string;
  category?: string;
  labels?: string[];
}

export const ELEVENLABS_VOICES: ElevenLabsVoice[] = [
  {
    id: "aEO01A4wXwd1O8GPgGlF",
    name: "Arabella"
  },
  {
    id: "mDRP1h6KfUD1XAUJxqr0", 
    name: "Doreen Pelz"
  },
  {
    id: "gs0tAILXbY5DNrJrsM6F",
    name: "Jeff"
  },
  {
    id: "KbSC2XTZL12xT3fm2fcD",
    name: "Julia"
  },
  {
    id: "qOuKJtFz7wxe3An8vkzE",
    name: "Amanda"
  },
  {
    id: "z5BOyiMj15k5OugxHBej",
    name: "Norbert News"
  },
  {
    id: "oYuK6X6xL9cwJKfgStee",
    name: "Markus Kästler"
  },
  {
    id: "E0OS48T5F0KU7O2NInWS",
    name: "Lucy Finnek"
  },
  {
    id: "CLrOIc4387Te6zgQGxeh",
    name: "Markus"
  },
  {
    id: "fTt9FjPijsUvyEUqGiV2",
    name: "Erfrischend anders"
  }
];