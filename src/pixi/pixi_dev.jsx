import { useState } from "react";
import { Application, Assets, Container, Sprite, Texture } from "pixi.js";
import { useEffect } from "react";
import { buildSvgTextMarkup } from "../svg/custom_text";
import { createGoldText } from "../svg/custom_pixi_font";
import { useRef } from "react";
// function createTextureFromSvg(svgMarkup) {
//   return new Promise((resolve, reject) => {
//     const blob = new Blob([svgMarkup], { type: "image/svg+xml" });
//     const url = URL.createObjectURL(blob);

//     const img = new Image();
//     img.crossOrigin = "anonymous";

//     img.onload = () => {
//       const tex = Texture.from(img);
//       URL.revokeObjectURL(url);
//       resolve(tex);
//     };

//     img.onerror = reject;
//     console.log("url", url);
//     img.src = url;
//   });
// }

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
