'use client'

import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

interface Dataset {
  dataset_id: string;
  image_id_list: string[];
}

export default function Annotator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageIdList] = useState<string[]>([]);
  const [curImageIndex, setCurImageIndex] = useState<number>(0);
  const [rectGroups] = useState<fabric.Group[]>([]);

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
      console.log(initPos);
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
        absolutePositioned: true,
        stroke: 'blue',
        strokeWidth: 3,
        fill: 'rgba(0,0,0,0)',
        width: pos2.x - pos1.x,
        height: pos2.y - pos1.y,
        selectable: false,
        lockRotation: true,
      });

      // Rect index label
      const text = new fabric.Text(`${rectGroups.length}`, {
        left: pos1.x + 5,
        top: pos1.y + 5,
        fontSize: 20,
        fill: 'blue',
        selectable: false,
        lockRotation: true,
      });

      const group = new fabric.Group([rect, text], {
        selectable: false,
        lockRotation: true,
      });

      canvas.add(group);
      rectGroups.push(group);
      canvas.bringToFront(group);
      canvas.requestRenderAll();
    });

    // Clear annotation key
    canvas.on('mouse:dblclick', (e) => {
      const group = e.target as fabric.Group;
      if (rectGroups.includes(group)) {
        canvas.remove(group);
        rectGroups.splice(rectGroups.indexOf(group), 1);
      }
      // Update rect index labels
      rectGroups.forEach((g, index) => {
        const text = g.getObjects()[1] as fabric.Text;
        text.set({ text: `${index}` });
      });
      canvas.requestRenderAll();
    });

    const loadImg = async () => {
      // Obtain first image dataset
      const dataset: Dataset | undefined | void = await fetch('/dataset/first').then(async (res) => {
        if (!res.ok) {
          return;
        }
        return res.json() as Promise<Dataset>;
      }).catch(console.error);

      // Load images
      dataset?.image_id_list.forEach((id: string) => {
        imageIdList.push(id);
      });

      const load = () => {
        return new Promise((resolve, _) => {
          fabric.Image.fromURL(imageIdList[curImageIndex] ?? 'https://picsum.photos/seed/picsum/200/300', (img) => {
            canvas.backgroundImage = img;
            canvas.setDimensions({ width: img.width ?? 0, height: img.height ?? 0 });
            resolve(null);
          });
        });
      };
      await load();
    }
    loadImg().catch(console.error);

    canvas.requestRenderAll();
  }, [rectGroups, curImageIndex, imageIdList]);

  // Upload annotation coordinates
  const upload = async () => {
    const coords = rectGroups.map((g) => {
      const rect = g.getObjects()[0] as fabric.Rect;
      return {
        xmin: (rect.left ?? 0) / ((canvasRef.current?.width ?? 0) / 2) + 0.5,
        ymin: (rect.top ?? 0) / ((canvasRef.current?.height ?? 0) / 2) + 0.5,
        xmax: ((rect.left ?? 0) + (rect.width ?? 0)) / ((canvasRef.current?.width ?? 0) / 2) + 0.5,
        ymax: ((rect.top ?? 0) + (rect.height ?? 0)) / ((canvasRef.current?.height ?? 0) / 2) + 0.5,
      }
    });
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
    <div className='flex flex-col justify-center items-center'>
      <canvas ref={canvasRef} />
      <button onClick={upload}>Upload Annotation</button>
    </div>
  );
}
