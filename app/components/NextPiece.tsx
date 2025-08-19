'use client'

interface NextPieceProps {
  piece: {
    shape: number[][]
    type: string
  } | null
}

const PIECE_COLORS = {
  I: '#00ffff',
  O: '#ffff00',
  T: '#ff00ff',
  S: '#00ff00',
  Z: '#ff0000',
  J: '#0000ff',
  L: '#ff8800',
}

export default function NextPiece({ piece }: NextPieceProps) {
  if (!piece) return null

  const { shape, type } = piece
  const color = PIECE_COLORS[type as keyof typeof PIECE_COLORS]

  return (
    <div>
      <h3 className="neon-glow" style={{ color: '#00ff00', textAlign: 'center', marginBottom: '15px' }}>
        NEXT
      </h3>
      <div 
        className="next-piece"
        style={{
          gridTemplateColumns: `repeat(${shape[0]?.length || 4}, 1fr)`,
          gridTemplateRows: `repeat(${shape.length}, 1fr)`
        }}
      >
        {shape.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`next-cell ${cell ? 'filled' : ''}`}
              style={{
                backgroundColor: cell ? color : 'rgba(0, 0, 0, 0.8)',
                color: cell ? color : 'transparent'
              }}
            />
          ))
        )}
      </div>
    </div>
  )
}