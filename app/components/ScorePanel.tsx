'use client'

interface ScorePanelProps {
  score: number
  level: number
  lines: number
}

export default function ScorePanel({ score, level, lines }: ScorePanelProps) {
  return (
    <div>
      <h2 className="neon-glow" style={{ color: '#ff00ff', textAlign: 'center', marginBottom: '20px' }}>
        SCORE
      </h2>
      <div className="score-display neon-glow">
        {score.toLocaleString()}
      </div>
      <div className="level-display neon-glow">
        Level: {level}
      </div>
      <div className="level-display neon-glow" style={{ color: '#00ff00' }}>
        Lines: {lines}
      </div>
    </div>
  )
}