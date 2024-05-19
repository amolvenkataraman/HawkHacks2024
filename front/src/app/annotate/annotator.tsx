'use client'

import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

export default function Annotator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [coords, setCoords] = useState<number[]>();

  useEffect(() => {
    const canvas: fabric.Canvas = new fabric.Canvas(canvasRef.current, {
      fireRightClick: true,
      fireMiddleClick: true,
      stopContextMenu: true,
      backgroundColor: undefined,
    });

    // Load background
    fabric.Image.fromURL('https://ipfs.io/ipfs/QmUa2xdD3kvQ3ZwnTADpAukcExtCv6Xaf9FGcPNyQKqKG4', (img) => {
      img.scaleToHeight(canvas.height ?? 0);
      img.selectable = false;
      canvas.backgroundImage = img;
      canvas.setDimensions({ width: img.width ?? 0, height: img.height ?? 0 });
      canvas.requestRenderAll();
    });

    // Interactive rectangle for image annotation
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'rgba(0,0,0,0.3)',
      width: 200,
      height: 200,
      selectable: true,
      hasRotatingPoint: false,
      lockRotation: true,
    });
    setCoords([rect.left ?? 0, rect.top ?? 0, rect.getScaledWidth(), rect.getScaledHeight()]);

    // Scale to remaining webpage size
    canvas.setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // On rect transform
    function onChange(e: fabric.IEvent) {
      setCoords([e.target?.left ?? 0, e.target?.top ?? 0, e.target?.getScaledWidth() ?? 0, e.target?.getScaledHeight() ?? 0]);
    }

    canvas.add(rect);

    canvas.on({
      'object:moving': onChange,
      'object:scaling': onChange,
    });

    canvas.requestRenderAll();

  }, []);

  // Upload annotation coordinates
  const upload = async () => {
    console.log(coords);
    const res = await fetch('/TODO', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coords }),
    });
    if (!res.ok) {
      console.error('Failed to upload annotation');
    }
  }

  return (
    <div className='flex justify-center'>
      <div>
        <canvas ref={canvasRef} />
      </div>
      <button onClick={upload}>Upload Annotation</button>
    </div>
  );
}
