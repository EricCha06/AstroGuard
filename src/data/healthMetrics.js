export const METRICS = {
  hr: { t: 'Heart Rate', u: 'BPM', icon: 'Heart', dec: 0, min: 20, max: 250, tol: 2, what: 'How many times your heart beats each minute. It reflects exertion, stress, hydration and fitness.', how: 'Rest for 5 minutes. Use your mission-issued monitor, or count the pulse at your wrist for 30 seconds and double it.' },
  sp: { t: 'Blood Oxygen (SpO₂)', u: '%', icon: 'Droplets', dec: 1, min: 50, max: 100, tol: 0.3, what: 'The share of your blood carrying oxygen. It helps show how well your lungs and circulation are working.', how: 'Rest and keep your hand warm and still. Clip the pulse oximeter on a fingertip and read the steady value.' },
  tp: { t: 'Body Temperature', u: '°C', icon: 'Thermometer', dec: 1, min: 30, max: 43, tol: 0.1, what: 'Your core body temperature. A change can reflect illness, exertion or the habitat environment.', how: 'Wait 15 minutes after exercise or a hot drink. Use the mission-issued thermometer as instructed.' },
  sys: { t: 'Systolic Pressure', u: 'mmHg', icon: 'Activity', dec: 0, min: 50, max: 260, tol: 3, what: 'The pressure in your arteries when the heart beats (top number).', how: 'Sit calmly for 5 minutes with the cuff at heart level. Record the top number.' },
  dia: { t: 'Diastolic Pressure', u: 'mmHg', icon: 'Activity', dec: 0, min: 30, max: 160, tol: 3, what: 'The pressure in your arteries between beats (bottom number).', how: 'Use the same reading as systolic pressure. Record the bottom number.' },
  rr: { t: 'Respiratory Rate', u: 'breaths/min', icon: 'Wind', dec: 0, min: 4, max: 60, tol: 1, what: 'How many breaths you take each minute. It can change with stress, exertion or air quality.', how: 'Sit quietly and count breaths for 60 seconds without trying to control them.' },
  sl: { t: 'Sleep Duration', u: 'hours', icon: 'Moon', dec: 1, min: 0, max: 16, tol: 0.3, what: 'Hours slept in your last sleep period. Sleep affects alertness, mood and recovery.', how: 'Enter total hours slept in your last sleep period, based on your sleep log or wearable.' },
  stress: { t: 'Stress Level', u: '/100', icon: 'Brain', dec: 0, min: 0, max: 100, tol: 5, what: 'Your own rating of how stressed you feel (0 = calm, 100 = extreme).', how: 'Pause and rate how you feel right now.' },
  fat: { t: 'Fatigue Level', u: '/100', icon: 'Battery', dec: 0, min: 0, max: 100, tol: 5, what: 'Your own rating of tiredness (0 = fully rested, 100 = exhausted).', how: 'Rate how tired you feel right now.' },
}
export const CARD_KEYS = ['hr', 'sp', 'tp', 'bp', 'rr', 'sl']
// ILLUSTRATIVE general-adult values only. Not mission-approved. lo/hi = attention band, rlo/rhi = prompt-review band. null = not configured.
export const DEFAULT_RANGES = {
  hr: { lo: 60, hi: 100, rlo: 40, rhi: 130 }, sp: { lo: 95, hi: 100, rlo: 90, rhi: null },
  tp: { lo: 36.1, hi: 37.5, rlo: 35, rhi: 38.5 }, sys: { lo: 90, hi: 130, rlo: 80, rhi: 160 },
  dia: { lo: 60, hi: 85, rlo: 50, rhi: 100 }, rr: { lo: 12, hi: 20, rlo: 8, rhi: 28 },
  sl: { lo: 7, hi: 9.5, rlo: 4, rhi: null }, stress: { lo: null, hi: null, rlo: null, rhi: null }, fat: { lo: null, hi: null, rlo: null, rhi: null },
}
export const SYMPTOMS = ['Headache', 'Dizziness', 'Nausea', 'Fatigue', 'Difficulty sleeping', 'Muscle discomfort', 'Vision changes', 'Breathing discomfort', 'Other symptoms']
