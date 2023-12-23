import React, { useEffect, useRef, useState } from 'react';
import { HEIGHT, WIDTH, drawKickPoints, drawMatrix, drawPianoPoints, getSelectedPointId } from '../utils/visualization';
import { playSequence } from '../utils/music';

const Matrix = (): JSX.Element => {
  // Piano
  const [pianoPoints, setPianoPoints] = useState<string[]>([]);
  const [attackPianoPoint, setAttackPianoPoint] = useState<string>('');

  // Kick
  const [kickPoints, setKickPoints] = useState<string[]>([]);
  const [attackKickPoint, setAttackKickPoint] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
      drawMatrix(context);
      drawPianoPoints(context, pianoPoints, attackPianoPoint);
      drawKickPoints(context, kickPoints, attackKickPoint)
    }
  }, [pianoPoints, attackPianoPoint, kickPoints, attackKickPoint])

  useEffect(() => {
    if (pianoPoints.length || kickPoints.length) {
      playSequence(pianoPoints, kickPoints, (noteId: number) => {
        setAttackPianoPoint(pianoPoints[noteId % pianoPoints.length]);
      }, (noteId: number) => {
        setAttackKickPoint(kickPoints[noteId % kickPoints.length])
      });
    }
  }, [pianoPoints, kickPoints])

  const handleClick = (event: React.MouseEvent) => {
    if (canvasRef.current) {
      const { left, top } = canvasRef.current.getBoundingClientRect();
      const selectedId = getSelectedPointId(event.clientX - left, event.clientY - top);
      if (selectedId) {
        if (event.nativeEvent.button === 0) {
          if (pianoPoints.includes(selectedId)) {
            const updatedIds = pianoPoints.filter(id => id !== selectedId);
            setPianoPoints(updatedIds);
          } else {
            setPianoPoints([...pianoPoints, selectedId]);
          }
        } else if (event.nativeEvent.button === 2) {
          event.preventDefault();
          if (kickPoints.includes(selectedId)) {
            const updatedIds = kickPoints.filter(id => id !== selectedId);
            setKickPoints(updatedIds);
          } else {
            setKickPoints([...kickPoints, selectedId]);
          }
        }
      }
    }
  }

  return (
    <div>
      <canvas
        id='canvas-1'
        width={WIDTH}
        height={HEIGHT}
        ref={canvasRef}
        onClick={handleClick}
        onContextMenu={handleClick}
      />
    </div>
  )
}
export default Matrix;

