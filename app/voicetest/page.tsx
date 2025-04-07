// app/voicetest/page.tsx
'use client';
import { useState } from 'react';

export default function VoiceTestPage() {
  const [text, setText] = useState('');
  const [member, setMember] = useState('Lyra');

  const playVoice = async () => {
    const res = await fetch('/api/voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ member, text }),
    });

    const blob = await res.blob();
    const audio = new Audio(URL.createObjectURL(blob));
    audio.play();
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>🎤 AI Family Voice Tester</h1>
      <select onChange={(e) => setMember(e.target.value)} value={member}>
        <option>Lyra</option>
        <option>Kara</option>
      </select>
      <br />
      <textarea
        placeholder="Type something for them to say..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: '100%', height: 100, marginTop: 10 }}
      />
      <br />
      <button onClick={playVoice} style={{ marginTop: 10 }}>
        ▶️ Play Voice
      </button>
    </div>
  );
}
