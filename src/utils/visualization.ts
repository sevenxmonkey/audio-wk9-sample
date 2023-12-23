interface Point {
  id: string,
  x: number,
  y: number
}

export const WIDTH = 600;
export const HEIGHT = 600;
export const SPAN = 30;

// 根据给定的宽度、高度和间距，为矩阵生成一个点的数组
export function getAllPoints(width: number, height: number, span: number): Point[] {
  const result: Point[] = []; // 存储生成的点
  const maxCol = Math.floor(width / span); // 计算最大列数
  const maxRow = Math.floor(height / span); // 计算最大行数
  // 遍历每一列
  for (let col = 1; col < maxCol; col++) {
    // 遍历每一行
    for (let row = 1; row < maxRow; row++) {
      const x = col * span; // 计算 x 坐标
      const y = row * span; // 计算 y 坐标
      result.push({ x, y, id: `${x},${y}` }) // 将点添加到结果数组
    }
  }
  return result; // 返回矩阵点的数组
}

// 使用 Canvas 2D 上下文绘制一个矩阵图形
export function drawMatrix(context: CanvasRenderingContext2D) {
  const matrixPoints = getAllPoints(WIDTH, HEIGHT, SPAN); // 获取所有矩阵点
  context.clearRect(0, 0, WIDTH, HEIGHT); // 清除画布，准备绘制

  // 遍历每个点并在画布上绘制
  matrixPoints.forEach(({ x, y }) => {
    context.beginPath(); // 开始新的绘制路径
    context.fillStyle = 'grey';
    context.arc(x, y, 5, 0, 2 * Math.PI); // 绘制一个圆形代表矩阵中的点
    context.fill();
    context.closePath(); // 结束绘制路径
  })
}

export function drawPianoPoints(context: CanvasRenderingContext2D, ids: string[], attackId: string) {
  const matrixPoints = getAllPoints(WIDTH, HEIGHT, SPAN); // 获取所有矩阵点
  const points = matrixPoints.filter(point => ids.includes(point.id));
  points.forEach(({ id, x, y }) => {
    context.beginPath();
    context.fillStyle = id === attackId ? 'blue' : 'black';
    context.arc(x, y, id === attackId ? 20 : 10, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
  })
}

export function drawKickPoints(context: CanvasRenderingContext2D, ids: string[], attackId: string) {
  const matrixPoints = getAllPoints(WIDTH, HEIGHT, SPAN); // 获取所有矩阵点
  const points = matrixPoints.filter(point => ids.includes(point.id));

  // Shuffle
  for (let i = points.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [points[i], points[j]] = [points[j], points[i]];
  }

  // Draw lines
  context.beginPath();
  context.lineWidth = 3;
  context.strokeStyle = 'blue';
  points.forEach((point) => {
    context.lineTo(point.x, point.y);
  })
  context.closePath();
  context.stroke();
  points.forEach(({ id, x, y }) => {
    context.beginPath();
    const color = attackId === id ? 'black' : "grey";
    const size = attackId === id ? 30 : 20;
    context.arc(x, y, size, 0, 2 * Math.PI);
    context.strokeStyle = color;
    context.stroke();
  })
}

// 根据鼠标位置获取选中的点的 ID
export function getSelectedPointId(moustX: number, moustY: number) {
  const matrixPoints = getAllPoints(WIDTH, HEIGHT, SPAN); // 获取所有矩阵点
  // 遍历所有点
  for (let i = 0; i < matrixPoints.length; i++) {
    const { id, x, y } = matrixPoints[i]; // 获取点的信息
    // 检查鼠标位置是否在当前点的范围内
    if (Math.abs(x - moustX) < SPAN / 2 && Math.abs(y - moustY) < SPAN / 2) {
      return id; // 如果是，返回这个点的 ID
    }
  }
}