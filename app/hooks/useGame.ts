'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { TETRIS_PIECES, createEmptyBoard, isValidMove, placePiece, clearLines, getRandomPiece } from '../utils/gameLogic'

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20

export function useGame(difficulty: number) {
  const [board, setBoard] = useState(() => createEmptyBoard(BOARD_HEIGHT, BOARD_WIDTH))
  const [currentPiece, setCurrentPiece] = useState<any>(null)
  const [nextPiece, setNextPiece] = useState<any>(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [paused, setPaused] = useState(false)
  const [gameActive, setGameActive] = useState(false)
  
  const gameLoopRef = useRef<NodeJS.Timeout>()
  const speedRef = useRef(800)

  // Update speed based on difficulty and level
  useEffect(() => {
    const baseSpeed = [800, 600, 400, 200, 100][difficulty - 1] || 800
    speedRef.current = Math.max(50, baseSpeed - (level - 1) * 50)
  }, [difficulty, level])

  const spawnNewPiece = useCallback(() => {
    const piece = nextPiece || getRandomPiece()
    const newNextPiece = getRandomPiece()
    
    const startX = Math.floor(BOARD_WIDTH / 2) - Math.floor(piece.shape[0].length / 2)
    const startY = 0
    
    if (!isValidMove(board, piece.shape, startX, startY)) {
      setGameOver(true)
      setGameActive(false)
      return
    }
    
    setCurrentPiece({
      ...piece,
      x: startX,
      y: startY
    })
    setNextPiece(newNextPiece)
  }, [board, nextPiece])

  const movePiece = useCallback((dx: number, dy: number) => {
    if (!currentPiece || gameOver || paused) return false
    
    const newX = currentPiece.x + dx
    const newY = currentPiece.y + dy
    
    if (isValidMove(board, currentPiece.shape, newX, newY)) {
      setCurrentPiece(prev => ({ ...prev, x: newX, y: newY }))
      return true
    }
    
    // If moving down failed, place the piece
    if (dy > 0) {
      const newBoard = placePiece(board, currentPiece.shape, currentPiece.x, currentPiece.y, currentPiece.type)
      const { clearedBoard, linesCleared } = clearLines(newBoard)
      
      setBoard(clearedBoard)
      setLines(prev => prev + linesCleared)
      setScore(prev => prev + (linesCleared * 100 * level) + 10)
      setLevel(Math.floor(lines / 10) + 1)
      
      spawnNewPiece()
    }
    
    return false
  }, [currentPiece, board, gameOver, paused, spawnNewPiece, level, lines])

  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameOver || paused) return
    
    // Rotate the shape 90 degrees clockwise
    const rotated = currentPiece.shape[0].map((_: any, index: number) =>
      currentPiece.shape.map((row: any[]) => row[index]).reverse()
    )
    
    if (isValidMove(board, rotated, currentPiece.x, currentPiece.y)) {
      setCurrentPiece(prev => ({ ...prev, shape: rotated }))
    }
  }, [currentPiece, board, gameOver, paused])

  const dropPiece = useCallback(() => {
    if (!currentPiece || gameOver || paused) return
    
    let newY = currentPiece.y
    while (isValidMove(board, currentPiece.shape, currentPiece.x, newY + 1)) {
      newY++
    }
    
    setCurrentPiece(prev => ({ ...prev, y: newY }))
    // The piece will be placed on the next game loop
  }, [currentPiece, board, gameOver, paused])

  const startGame = useCallback(() => {
    setBoard(createEmptyBoard(BOARD_HEIGHT, BOARD_WIDTH))
    setScore(0)
    setLevel(1)
    setLines(0)
    setGameOver(false)
    setPaused(false)
    setGameActive(true)
    setCurrentPiece(null)
    setNextPiece(getRandomPiece())
  }, [])

  const pauseGame = useCallback(() => {
    setPaused(prev => !prev)
  }, [])

  const resetGame = useCallback(() => {
    setGameActive(false)
    setGameOver(false)
    setPaused(false)
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
    }
  }, [])

  // Game loop
  useEffect(() => {
    if (!gameActive || gameOver || paused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
      return
    }

    if (!currentPiece) {
      spawnNewPiece()
      return
    }

    gameLoopRef.current = setInterval(() => {
      movePiece(0, 1)
    }, speedRef.current)

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [gameActive, gameOver, paused, currentPiece, movePiece, spawnNewPiece])

  // Create display board with current piece
  const displayBoard = (() => {
    if (!currentPiece) return board
    
    const newBoard = board.map(row => [...row])
    
    currentPiece.shape.forEach((row: number[], rowIndex: number) => {
      row.forEach((cell: number, colIndex: number) => {
        if (cell) {
          const boardY = currentPiece.y + rowIndex
          const boardX = currentPiece.x + colIndex
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = currentPiece.type
          }
        }
      })
    })
    
    return newBoard
  })()

  return {
    board: displayBoard,
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
  }
}