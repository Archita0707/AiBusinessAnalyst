import React from 'react';
import { Sparkles } from 'lucide-react';
import './BrainScene.css';

export default function BrainScene() {
  return (
    <div className="brain-scene">

      <div className="brain-glow"></div>

      <div className="brain-orbit orbit-a"></div>
      <div className="brain-orbit orbit-b"></div>

      <div className="brain-core">
        <img
          src="/brain.png"
          alt="AI Brain"
          className="brain-image"
        />

        <div className="brain-spark">
          <Sparkles size={25} />
        </div>
      </div>

      <span className="brain-dot dot-a"></span>
      <span className="brain-dot dot-b"></span>
      <span className="brain-dot dot-c"></span>
      <span className="brain-dot dot-d"></span>
      <span className="brain-dot dot-e"></span>

    </div>
  );
}