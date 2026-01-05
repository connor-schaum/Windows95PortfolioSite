'use client';

import { useState, useRef, useEffect } from 'react';

export default function MSPaint() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [tool, setTool] = useState('pencil'); // 'pencil', 'eraser'

  const colors = [
    '#000000', '#808080', '#800000', '#FF0000',
    '#800080', '#FF00FF', '#008000', '#00FF00',
    '#808000', '#FFFF00', '#008080', '#00FFFF',
    '#000080', '#0000FF', '#800080', '#FF00FF',
    '#FFFFFF', '#C0C0C0', '#808080', '#000000'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 2;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
      }
      setIsDrawing(false);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-1 border-b border-gray-400 bg-gray-200 flex-wrap">
        <div className="flex items-center gap-1">
          <button
            className={`win95-button px-2 py-1 text-xs ${tool === 'pencil' ? 'border-2 inset' : ''}`}
            onClick={() => setTool('pencil')}
            title="Pencil"
          >
            ✏️
          </button>
          <button
            className={`win95-button px-2 py-1 text-xs ${tool === 'eraser' ? 'border-2 inset' : ''}`}
            onClick={() => setTool('eraser')}
            title="Eraser"
          >
            🧹
          </button>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <span className="text-xs">Size:</span>
          <select
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="border-2 border-inset text-xs"
            style={{
              border: '2px inset #c0c0c0',
              padding: '2px 4px'
            }}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="4">4</option>
            <option value="8">8</option>
            <option value="12">12</option>
          </select>
        </div>
        <button
          className="win95-button px-2 py-1 text-xs ml-2"
          onClick={clearCanvas}
          title="New"
        >
          New
        </button>
      </div>

      {/* Color Palette */}
      <div className="flex items-center gap-1 p-1 border-b border-gray-400 bg-gray-200">
        <span className="text-xs mr-2">Colors:</span>
        <div className="flex gap-1 flex-wrap">
          {colors.map((c, idx) => (
            <button
              key={idx}
              className={`border-2 ${color === c ? 'border-black' : 'border-gray-400'}`}
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: c,
                border: color === c ? '2px solid black' : '2px solid #808080'
              }}
              onClick={() => setColor(c)}
              title={c}
            />
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 border-2 border-t-[#808080] border-l-[#808080] border-r-[#ffffff] border-b-[#ffffff] overflow-auto bg-gray-300 p-2">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="bg-white border-2 border-inset cursor-crosshair"
          style={{
            border: '2px inset #c0c0c0',
            display: 'block',
            boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.2)'
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>

      {/* Status Bar */}
      <div className="border-t border-gray-400 bg-gray-200 p-1 text-xs">
        <span>Ready</span>
      </div>
    </div>
  );
}

