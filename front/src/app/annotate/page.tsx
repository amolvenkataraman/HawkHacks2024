'use client'

import { fabric } from 'fabric';
import { useLayoutEffect } from 'react';

export default function Annotate() {
  useLayoutEffect(() => {
    const canvas: fabric.Canvas = new fabric.Canvas('canvas', {
      fireRightClick: true,
      fireMiddleClick: true,
      stopContextMenu: true,
      backgroundColor: undefined,
      backgroundImage: undefined,
    });
    // Scale to remaining webpage size
    canvas.setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Load background (non-interactive)
    fabric.Image.fromURL('https://ipfs.io/ipfs/QmUa2xdD3kvQ3ZwnTADpAukcExtCv6Xaf9FGcPNyQKqKG4', (img) => {
      img.scaleToHeight(canvas.height ?? 0);
      img.selectable = false;
      canvas.backgroundImage = img;
      canvas.requestRenderAll();
    });

    // Interactive rectangle for image annotation
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      // stroke: 'rgba(230, 186, 5, 0.9)',
      // strokeUniform: true,
      // strokeWidth: 2,
      fill: 'rgba(0,0,0,0.1)',
      width: 200,
      height: 200,
      selectable: true,
      hasRotatingPoint: false,
      lockRotation: true,
    });

    // On rect transform
    function onChange(e: fabric.IEvent) {
      console.log(e.target?.left + ' ' + e.target?.top);
    }

    canvas.add(rect);

    canvas.on({
      'object:moving': onChange,
      'object:scaling': onChange,
    });

    canvas.requestRenderAll();
  }, []);
  return (
    <main>
      <canvas id='canvas' />
    </main>
  );
}
