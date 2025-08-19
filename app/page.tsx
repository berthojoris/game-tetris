'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import GameBoard from './components/GameBoard'
import ScorePanel from './components/ScorePanel'
import NextPiece from './components/NextPiece'
import GameControls from './components/GameControls'
import DifficultySelector from './components/DifficultySelector'
import ClientOnly from './components/ClientOnly'
import { useGame } from './hooks/useGame'

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false)
  const [difficulty, setDifficulty] = useState(1)
  
  const {
    board,
    score,
    level,
    lines,
    nextPiece,
    gameOver,
    paused,
    startGame,
    pauseGame,
    resetGame,
    movePiece,
    rotatePiece,
    dropPiece
  } = useGame(difficulty)

  const handleStartGame = () => {
    setGameStarted(true)
    startGame()
  }

  const handleResetGame = () => {
    setGameStarted(false)
    resetGame()
  }

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver || paused) return

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          movePiece(-1, 0)
          break
        case 'ArrowRight':
          e.preventDefault()
          movePiece(1, 0)
          break
        case 'ArrowDown':
          e.preventDefault()
          movePiece(0, 1)
          break
        case 'ArrowUp':
        case ' ':
          e.preventDefault()
          rotatePiece()
          break
        case 'Enter':
          e.preventDefault()
          dropPiece()
          break
        case 'p':
        case 'P':
          e.preventDefault()
          pauseGame()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameStarted, gameOver, paused, movePiece, rotatePiece, dropPiece, pauseGame])

  if (!gameStarted) {
    return (
      <ClientOnly fallback={
        <div className="game-container">
          <div className="side-panel">
            <div style={{ textAlign: 'center', color: '#00ffff' }}>Loading...</div>
          </div>
        </div>
      }>
        <div className="game-container">
          <div className="side-panel">
            <h1 className="neon-glow" style={{ color: '#00ffff', fontSize: '2.5rem', textAlign: 'center', marginBottom: '30px' }}>
              NEON TETRIS
            </h1>
            <DifficultySelector 
              difficulty={difficulty} 
              onDifficultyChange={setDifficulty} 
            />
            <button 
              className="control-button" 
              onClick={handleStartGame}
              style={{ width: '100%', marginTop: '20px' }}
            >
              Start Game
            </button>
            <div style={{ marginTop: '30px', fontSize: '0.9rem', color: '#888' }}>
              <h3 style={{ color: '#fff', marginBottom: '10px' }}>Controls:</h3>
              <p>← → Move</p>
              <p>↓ Soft Drop</p>
              <p>↑ / Space: Rotate</p>
              <p>Enter: Hard Drop</p>
              <p>P: Pause</p>
            </div>
          </div>
        </div>
      </ClientOnly>
    )
  }

  return (
    <ClientOnly fallback={
      <div className="game-container">
        <div className="side-panel">
          <div style={{ textAlign: 'center', color: '#00ffff' }}>Loading...</div>
        </div>
      </div>
    }>
      <div className="game-container">
        <div className="side-panel">
          <ScorePanel score={score} level={level} lines={lines} />
          <NextPiece piece={nextPiece} />
          <GameControls 
            onPause={pauseGame}
            onReset={handleResetGame}
            paused={paused}
            onMove={movePiece}
            onRotate={rotatePiece}
            onDrop={dropPiece}
          />
        </div>
        
        <GameBoard board={board} />
        
        {gameOver && (
          <div className="game-over">
            <h2 className="neon-glow">GAME OVER</h2>
            <div className="score-display neon-glow" style={{ fontSize: '2rem', marginBottom: '20px' }}>
              Final Score: {score}
            </div>
            <button className="control-button" onClick={handleResetGame}>
              Play Again
            </button>
          </div>
        )}
      </div>
    </ClientOnly>
  )
}