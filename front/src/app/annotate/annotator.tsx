'use client'

import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

export default function Annotator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rects] = useState<fabric.Rect[]>([]);

  useEffect(() => {
    const canvas: fabric.Canvas = new fabric.Canvas(canvasRef.current, {
      fireRightClick: true,
      fireMiddleClick: true,
      stopContextMenu: true,
      backgroundColor: undefined,
    });

    let initPos = { x: 0, y: 0 };
    canvas.on('mouse:down', (e) => {
      initPos = { x: e.pointer?.x ?? 0, y: e.pointer?.y ?? 0 }
    });
    canvas.on('mouse:up', (e) => {
      const pos = { x: e.pointer?.x ?? 0, y: e.pointer?.y ?? 0 }
      const pos1 = { x: Math.min(initPos.x, pos.x), y: Math.min(initPos.y, pos.y) }
      const pos2 = { x: Math.max(initPos.x, pos.x), y: Math.max(initPos.y, pos.y) }

      // Reject if size is too small
      if (pos2.x - pos1.x < 3 || pos2.y - pos1.y < 3) {
        return;
      }

      const rect = new fabric.Rect({
        left: pos1.x,
        top: pos1.y,
        fill: 'rgba(0,0,0,0.3)',
        width: pos2.x - pos1.x,
        height: pos2.y - pos1.y,
        selectable: false,
        lockRotation: true,
      });
      canvas.add(rect);
      rects.push(rect);
      canvas.bringToFront(rect);
      canvas.requestRenderAll();
    });

    // Clear annotation key
    canvas.on('mouse:dblclick', (e) => {
      const rect = e.target as fabric.Rect;
      if (rects.includes(rect)) {
        canvas.remove(rect);
        rects.splice(rects.indexOf(rect), 1);
        canvas.requestRenderAll();
      }
    });

    const loadImg = async () => {
      function load() {
        return new Promise((resolve, _) => {
          fabric.Image.fromURL('https://ipfs.io/ipfs/QmUa2xdD3kvQ3ZwnTADpAukcExtCv6Xaf9FGcPNyQKqKG4', (img) => {
            canvas.backgroundImage = img;
            canvas.setDimensions({ width: img.width ?? 0, height: img.height ?? 0 });
            resolve(null);
          });
        });
      }
      await load();
    }
    loadImg().catch(console.error);

    canvas.requestRenderAll();
  }, []);

  // Upload annotation coordinates
  const upload = async () => {
    const coords = rects.map((rect) => ({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    }));
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
