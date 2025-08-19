'use client'

interface GameControlsProps {
  onPause: () => void
  onReset: () => void
  paused: boolean
  onMove: (dx: number, dy: number) => void
  onRotate: () => void
  onDrop: () => void
}

export default function GameControls({ 
  onPause, 
  onReset, 
  paused, 
  onMove, 
  onRotate, 
  onDrop 
}: GameControlsProps) {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
        <button className="control-button" onClick={onPause}>
          {paused ? 'Resume' : 'Pause'}
        </button>
        <button className="control-button" onClick={onReset}>
          Reset
        </button>
      </div>
      
      {/* Mobile Controls */}
      <div className="mobile-controls">
        <button className="control-button" onClick={() => onMove(-1, 0)}>
          ←
        </button>
        <button className="control-button" onClick={onRotate}>
          ↻
        </button>
        <button className="control-button" onClick={() => onMove(1, 0)}>
          →
        </button>
        <button className="control-button" onClick={() => onMove(0, 1)}>
          ↓
        </button>
        <button className="control-button" onClick={onDrop}>
          Drop
        </button>
        <div></div> {/* Empty cell for grid alignment */}
      </div>
    </div>
  )
}