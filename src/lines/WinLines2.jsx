import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { Application, Container, Graphics, Sprite, Texture } from "pixi.js";
import { createGoldText } from "../svg/custom_pixi_font";

export const WinLines2 = () => {
  const appRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let app;

    const createGradientTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 4;

      const ctx = canvas.getContext("2d");

      const gradient = ctx.createLinearGradient(0, 0, 512, 0);
      gradient.addColorStop(0, "#ff0000");
      gradient.addColorStop(0.5, "#ffff00");
      gradient.addColorStop(1, "#00ffff");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 4);

      return Texture.from(canvas);
    };

    const createGradientLine = (points, width = 6) => {
      const container = new Container();
      const lineGraphics = new Graphics();
      container.addChild(lineGraphics);

      let progress = 0;
      const animationDuration = 0.01; // скорость анимации

      const lerp = (a, b, t) => a + (b - a) * t;

      // функция для получения цвета из градиента (от красного через желтый к голубому)
      const getGradientColor = (t) => {
        if (t < 0.5) {
          // от красного (#ff0000) к желтому (#ffff00)
          const localT = t * 2;
          const r = 255;
          const g = Math.round(255 * localT);
          const b = 0;
          return (r << 16) | (g << 8) | b;
        } else {
          // от желтого (#ffff00) к голубому (#00ffff)
          const localT = (t - 0.5) * 2;
          const r = Math.round(255 * (1 - localT));
          const g = 255;
          const b = Math.round(255 * localT);
          return (r << 16) | (g << 8) | b;
        }
      };

      const tickerCallback = () => {
        progress += animationDuration;
        if (progress > 1) {
          progress = 1;
          app.ticker.remove(tickerCallback); // остановить анимацию когда готово
        }

        const segmentProgress = progress * (points.length - 1);
        const currentSegment = Math.floor(segmentProgress);
        const t = segmentProgress - currentSegment;

        lineGraphics.clear();

        // рисуем полностью завершенные сегменты с градиентом
        for (let i = 0; i < currentSegment; i++) {
          const colorT = i / (points.length - 1);
          const color = getGradientColor(colorT);
          lineGraphics.lineStyle(width, color);
          lineGraphics.moveTo(points[i].x, points[i].y);
          lineGraphics.lineTo(points[i + 1].x, points[i + 1].y);
        }

        // рисуем часть текущего сегмента (плавная промежуточная точка)
        if (currentSegment < points.length - 1) {
          const p0 = points[currentSegment];
          const p1 = points[currentSegment + 1];

          const x = lerp(p0.x, p1.x, t);
          const y = lerp(p0.y, p1.y, t);

          const colorT = currentSegment / (points.length - 1);
          const color = getGradientColor(colorT);
          lineGraphics.lineStyle(width, color);
          lineGraphics.moveTo(p0.x, p0.y);
          lineGraphics.lineTo(x, y);
        }
      };

      app.ticker.add(tickerCallback);

      return container;
    };

    const dockLines = (points, width = 6) => {
      const container = new Container();
      const lineGraphics = new Graphics();
      container.addChild(lineGraphics);

      let progress = 0;
      let speed = 0.01;

      lineGraphics.moveTo(50, 50).stroke({ width: 6, color: 0x00ff00 });
      const lerp = (a, b, t) => a + (b - a) * t;
      const getGradientColor = (t) => {
        if (t < 0.5) {
          // от красного (#ff0000) к желтому (#ffff00)
          const localT = t * 2;
          const r = 255;
          const g = Math.round(255 * localT);
          const b = 0;
          return (r << 16) | (g << 8) | b;
        } else {
          // от желтого (#ffff00) к голубому (#00ffff)
          const localT = (t - 0.5) * 2;
          const r = Math.round(255 * (1 - localT));
          const g = 255;
          const b = Math.round(255 * localT);
          return (r << 16) | (g << 8) | b;
        }
      };
      points = [
        { x: 50, y: 50 },
        { x: 100, y: 100 },
        { x: 150, y: 50 },
        { x: 200, y: 100 },
      ];

      const len = points.length - 1; // фазы

      let i = 1; // счетчик хуйни по индексам
      app.ticker.add((delta) => {
        progress += speed;

        if (progress >= 1) return;

        if (progress >= i / len) {
          i++;
        }

        const segmentStart = (i - 1) / len;
        const segmentEnd = i / len;

        const localT = (progress - segmentStart) / (segmentEnd - segmentStart);

        const x = lerp(points[i - 1].x, points[i].x, localT);
        const y = lerp(points[i - 1].y, points[i].y, localT);

        lineGraphics
          .lineTo(x, y)
          .stroke({ width: 6, color: getGradientColor(progress) });
      });
      // .fill({ color: 0xff0000 });
      return container;
    };

    (async () => {
      app = new Application();
      await app.init({
        background: "#0e0e0e",
        resizeTo: window,
      });

      appRef.current = app;

      containerRef.current.appendChild(app.canvas);

      const rootContainer = new Container();
      app.stage.addChild(rootContainer);

      /*
        ========================
        TEXT (твой код)
        ========================
      */

      // const goldText = createGoldText("$1124241.89");

      // goldText.x = 400;
      // goldText.y = 200;

      // rootContainer.addChild(goldText);

      /*
        ========================
        LINES
        ========================
      */

      const linesContainer = new Container();
      rootContainer.addChild(linesContainer);

      // const line = createGradientLine(
      //   [
      //     { x: 100, y: 400 },
      //     { x: 400, y: 400 },
      //     { x: 650, y: 300 },
      //   ],
      //   8,
      // );
      const line = dockLines([
        { x: 100, y: 400 },
        { x: 200, y: 400 },
      ]);
      linesContainer.addChild(line);
    })();

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, {
          children: true,
          texture: true,
          baseTexture: true,
        });

        appRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} />;
};
