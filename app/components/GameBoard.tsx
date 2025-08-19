'use client'

interface GameBoardProps {
  board: (string | null)[][]
}

const PIECE_COLORS = {
  I: '#00ffff', // Cyan
  O: '#ffff00', // Yellow
  T: '#ff00ff', // Magenta
  S: '#00ff00', // Green
  Z: '#ff0000', // Red
  J: '#0000ff', // Blue
  L: '#ff8800', // Orange
}

export default function GameBoard({ board }: GameBoardProps) {
  return (
    <div 
      className="game-board"
      style={{
        gridTemplateColumns: `repeat(${board[0]?.length || 10}, 1fr)`,
        gridTemplateRows: `repeat(${board.length}, 1fr)`
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`game-cell ${cell ? 'filled' : ''}`}
            style={{
              backgroundColor: cell ? PIECE_COLORS[cell as keyof typeof PIECE_COLORS] || '#fff' : 'rgba(0, 0, 0, 0.8)',
              color: cell ? PIECE_COLORS[cell as keyof typeof PIECE_COLORS] || '#fff' : 'transparent'
            }}
          />
        ))
      )}
    </div>
  )
}