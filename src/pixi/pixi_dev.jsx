import { useState } from "react";
import { Application, Assets, Container, Sprite, Texture } from "pixi.js";
import { useEffect } from "react";
import { useRef } from "react";
import { buildSvgTextMarkup } from "../svg/custom_text";

function createTextureFromSvg(svg) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const texture = Texture.from(img);
      resolve(texture);
    };

    img.onerror = reject;

    img.src =
      "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
  });
}

export const PixiDev = () => {
  const containerRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    let app;

    (async () => {
      app = new Application();
      await app.init({ background: "#0e0e0e", resizeTo: window });

      appRef.current = app;

      containerRef.current.appendChild(app.canvas);

      const container = new Container();
      app.stage.addChild(container);

      const svg = buildSvgTextMarkup("$1124241.89");
      const texture = await createTextureFromSvg(svg);

      const sprite = new Sprite(texture);

      sprite.anchor.set(0.5);
      sprite.x = app.screen.width / 2;
      sprite.y = app.screen.height / 2;

      container.addChild(sprite);
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
