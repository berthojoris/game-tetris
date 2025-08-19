export const TETRIS_PIECES = {
  I: {
    shape: [
      [1, 1, 1, 1]
    ],
    type: 'I'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    type: 'O'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    type: 'T'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    type: 'S'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    type: 'Z'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    type: 'J'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    type: 'L'
  }
}

export function createEmptyBoard(height: number, width: number): (string | null)[][] {
  return Array(height).fill(null).map(() => Array(width).fill(null))
}

export function isValidMove(
  board: (string | null)[][],
  shape: number[][],
  x: number,
  y: number
): boolean {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const newX = x + col
        const newY = y + row
        
        // Check boundaries
        if (newX < 0 || newX >= board[0].length || newY >= board.length) {
          return false
        }
        
        // Check collision with existing pieces (but allow negative Y for spawning)
        if (newY >= 0 && board[newY][newX]) {
          return false
        }
      }
    }
  }
  return true
}

export function placePiece(
  board: (string | null)[][],
  shape: number[][],
  x: number,
  y: number,
  pieceType: string
): (string | null)[][] {
  const newBoard = board.map(row => [...row])
  
  shape.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell) {
        const boardY = y + rowIndex
        const boardX = x + colIndex
        if (boardY >= 0 && boardY < board.length && boardX >= 0 && boardX < board[0].length) {
          newBoard[boardY][boardX] = pieceType
        }
      }
    })
  })
  
  return newBoard
}

export function clearLines(board: (string | null)[][]): {
  clearedBoard: (string | null)[][]
  linesCleared: number
} {
  const linesToClear: number[] = []
  
  // Find complete lines
  board.forEach((row, index) => {
    if (row.every(cell => cell !== null)) {
      linesToClear.push(index)
    }
  })
  
  if (linesToClear.length === 0) {
    return { clearedBoard: board, linesCleared: 0 }
  }
  
  // Remove complete lines and add empty lines at the top
  let clearedBoard = board.filter((_, index) => !linesToClear.includes(index))
  
  // Add empty lines at the top
  const emptyLines = Array(linesToClear.length)
    .fill(null)
    .map(() => Array(board[0].length).fill(null))
  
  clearedBoard = [...emptyLines, ...clearedBoard]
  
  return { clearedBoard, linesCleared: linesToClear.length }
}

export function getRandomPiece() {
  const pieces = Object.values(TETRIS_PIECES)
  const randomPiece = pieces[Math.floor(Math.random() * pieces.length)]
  return {
    shape: randomPiece.shape.map(row => [...row]),
    type: randomPiece.type
  }
}