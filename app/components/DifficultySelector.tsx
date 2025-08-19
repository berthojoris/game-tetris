'use client'

interface DifficultySelectorProps {
  difficulty: number
  onDifficultyChange: (level: number) => void
}

const DIFFICULTY_LEVELS = [
  { level: 1, name: 'Easy', speed: 800 },
  { level: 2, name: 'Medium', speed: 600 },
  { level: 3, name: 'Hard', speed: 400 },
  { level: 4, name: 'Expert', speed: 200 },
  { level: 5, name: 'Insane', speed: 100 }
]

export default function DifficultySelector({ difficulty, onDifficultyChange }: DifficultySelectorProps) {
  return (
    <div>
      <h3 className="neon-glow" style={{ color: '#9400d3', textAlign: 'center', marginBottom: '15px' }}>
        SELECT DIFFICULTY
      </h3>
      <div className="difficulty-selector">
        {DIFFICULTY_LEVELS.map(({ level, name, speed }) => (
          <button
            key={level}
            className={`difficulty-button ${difficulty === level ? 'selected' : ''}`}
            onClick={() => onDifficultyChange(level)}
          >
            {name} ({speed}ms)
          </button>
        ))}
      </div>
    </div>
  )
}