import * as PIXI from "pixi.js";
import { useEffect } from "react";
import { useRef } from "react";

class GradientLine extends PIXI.Container {
  constructor({
    points,
    width = 6,
    colors = ["#ff0000", "#00ffff"],
    resolution = 512,
  }) {
    super();

    this.points = points;
    this.width = width;
    this.colors = colors;
    this.resolution = resolution;

    this.progress = 0;

    this._build();
  }

  _build() {
    this.line = new PIXI.Graphics();
    this._drawGeometry();

    this.gradientSprite = new PIXI.Sprite(
      GradientLine.createGradientTexture(this.colors, this.resolution),
    );

    const bounds = this.line.getLocalBounds();

    this.gradientSprite.width = bounds.width;
    this.gradientSprite.height = this.width;

    this.gradientSprite.y = bounds.y + bounds.height / 2 - this.width / 2;

    this.maskGraphics = new PIXI.Graphics();

    this.gradientSprite.mask = this.maskGraphics;

    this.addChild(this.gradientSprite);
    this.addChild(this.maskGraphics);
  }

  _drawGeometry() {
    this.line.clear();

    this.line.lineStyle(this.width, 0xffffff);

    const [first, ...rest] = this.points;

    this.line.moveTo(first.x, first.y);

    rest.forEach((p) => {
      this.line.lineTo(p.x, p.y);
    });

    this.addChild(this.line);
  }

  setProgress(progress) {
    this.progress = Math.max(0, Math.min(1, progress));

    const bounds = this.line.getLocalBounds();

    this.maskGraphics.clear();
    this.maskGraphics.beginFill(0xffffff);
    this.maskGraphics.drawRect(
      bounds.x,
      bounds.y,
      bounds.width * this.progress,
      bounds.height + this.width * 2,
    );
    this.maskGraphics.endFill();
  }

  animateTo(progress, duration = 1000) {
    const start = this.progress;
    const delta = progress - start;

    let time = 0;

    const ticker = PIXI.Ticker.shared;

    const update = (dt) => {
      time += dt * (1000 / 60);

      const t = Math.min(time / duration, 1);

      this.setProgress(start + delta * t);

      if (t === 1) {
        ticker.remove(update);
      }
    };

    ticker.add(update);
  }

  static textureCache = new Map();

  static createGradientTexture(colors, resolution) {
    const key = colors.join("-");

    if (this.textureCache.has(key)) {
      return this.textureCache.get(key);
    }

    const canvas = document.createElement("canvas");

    canvas.width = resolution;
    canvas.height = 4;

    const ctx = canvas.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, resolution, 0);

    colors.forEach((c, i) => {
      gradient.addColorStop(i / (colors.length - 1), c);
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, resolution, 4);

    const texture = PIXI.Texture.from(canvas);

    this.textureCache.set(key, texture);

    return texture;
  }
}

export function GradientLineView({
  container,
  points,
  width,
  colors,
  progress,
}) {
  const lineRef = useRef(null);

  useEffect(() => {
    if (!container) return;

    const line = new GradientLine({
      points,
      width,
      colors,
    });

    lineRef.current = line;

    container.addChild(line);

    return () => {
      container.removeChild(line);
      line.destroy();
      lineRef.current = null;
    };
  }, [container]);

  useEffect(() => {
    if (!lineRef.current) return;

    lineRef.current.setProgress(progress);
  }, [progress]);

  return null;
}

export function GameScene({ pixiApp }) {
  const linesContainerRef = useRef(null);

  useEffect(() => {
    const container = new PIXI.Container();
    pixiApp.stage.addChild(container);

    linesContainerRef.current = container;

    return () => {
      pixiApp.stage.removeChild(container);
      container.destroy();
    };
  }, [pixiApp]);

  return (
    <>
      {linesContainerRef.current && (
        <GradientLineView
          container={linesContainerRef.current}
          width={8}
          progress={1}
          colors={["#ff0000", "#ffff00", "#00ffff"]}
          points={[
            { x: 100, y: 200 },
            { x: 300, y: 200 },
            { x: 500, y: 300 },
          ]}
        />
      )}
    </>
  );
}

export const Game = () => {
  const appRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let app;

    (async () => {
      app = new Application();
      await app.init({ background: "#0e0e0e", resizeTo: window });

      appRef.current = app;

      containerRef.current.appendChild(app.canvas);

      const container = new Container();
      app.stage.addChild(container);
      const goldText = createGoldText("$1124241.89");

      goldText.x = 400;
      goldText.y = 200;

      container.addChild(goldText);
      // await document.fonts.load('64px "Lilita One"');
      // await document.fonts.ready;
      // console.log(document.fonts.check("64px Lilita One"));
      // const svg = buildSvgTextMarkup("$1124241.89");
      // const texture = await createTextureFromSvg(svg);

      // const sprite = new Sprite(texture);

      // sprite.anchor.set(0.5);
      // sprite.x = app.screen.width / 2;
      // sprite.y = app.screen.height / 2;

      // container.addChild(sprite);
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
