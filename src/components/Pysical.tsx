import React, { useEffect, useRef } from 'react';
import * as Tone from 'tone';

const WIDTH = 800;
const HEIGHT = 800;
const gravity = 0.1;
const friction = 0.9;
const colors = ["#004b23", "#006400", "#007200", "#008000", "#38b000", "#70e000", "#9ef01a", "#ccff33"];

class Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  callBack: (value: number) => void;

  constructor(x: number, y: number, vx: number, vy: number, r: number, color: string, callBack: (value: number) => void) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.r = r;
    this.color = color;
    this.callBack = callBack;
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
    context.stroke();
    context.closePath();
  }

  attackNote(value: number) {
    this.callBack(value);
  }

  update(context: CanvasRenderingContext2D) {
    if (this.x + this.r + this.vx > WIDTH) {
      this.vx = -this.vx * friction;
      if (Math.abs(this.vx) > 3) this.attackNote(this.vx);
    } else if (this.x - this.r < 0) {
      this.vx = Math.max(-this.vx * friction, 0.1)
      if (Math.abs(this.vx) > 3) this.attackNote(this.vx);
    }
    this.x += this.vx;

    if (this.y + this.r + this.vy > HEIGHT) {
      this.vy = -this.vy * friction;
      if (Math.abs(this.vy) > 3) this.attackNote(this.vy);
    } else if (this.y - this.r < 0) {
      this.vy = Math.max(-this.vy * friction, 0.1);
      if (Math.abs(this.vy) > 3) this.attackNote(this.vy);
    } else {
      this.vy += gravity
    }
    this.y += this.vy;
    this.draw(context);
  }
}

// 指定范围内的随机整数
function randomIntFromRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min)
}

function callBack(value: number): void {
  const piano = new Tone.Synth().toDestination();
  const cChord = ["C3", "D3", "E3", "F4", "G4", "A5", "B5"];
  const note = cChord[Math.min(Math.round((Math.abs(value) / 20) * cChord.length), cChord.length - 1)]
  piano.triggerAttackRelease(note, "8n");
}

const Physical = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const balls = useRef<Ball[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context) return;
    let animationFrameId: number;

    for (let i = 0; i < 10; i++) {
      const r = randomIntFromRange(20, 40);
      const x = randomIntFromRange(r + 1, WIDTH - r - 1);
      const y = randomIntFromRange(r + 1, HEIGHT - r - 1);
      const vx = randomIntFromRange(-2, 2);
      const vy = randomIntFromRange(-2, 2);

      const color = colors[Math.floor(Math.random() * colors.length)];
      balls.current.push(new Ball(x, y, vx, vy, r, color, callBack));
    }
    // Animation loop
    const render = () => {
      context.clearRect(0, 0, WIDTH, HEIGHT);
      balls.current.forEach((ball) => {
        ball.update(context);
      })
      animationFrameId = window.requestAnimationFrame(render);
    }
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const handleCanvasClick = () => {
    balls.current.forEach(ball => {
      ball.vx = (Math.random() - 0.5) * 10; // Random velocity between -10 and 10
      ball.vy = (Math.random() - 0.5) * 20; // Random velocity between -10 and 10
    });
  };

  return (
    <div>
      <canvas
        id='canvas-2'
        width={WIDTH}
        height={HEIGHT}
        ref={canvasRef}
        onClick={handleCanvasClick}
      />
    </div>
  )
}

export default Physical;