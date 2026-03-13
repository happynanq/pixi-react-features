import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

export const PixiShaders = () => {
  const containerRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    const app = new PIXI.Application({
      backgroundColor: 0xffffff,
      resizeTo: window,
      antialias: true,
    });

    appRef.current = app;
    containerRef.current.appendChild(app.view);

    const root = new PIXI.Container();
    app.stage.addChild(root);

    /*
    ============================================
    FULLSCREEN SHADER (playground)
    ============================================
    */

    const vertexSrc = `
precision mediump float;

attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vUV;

void main(){
    vUV = aTextureCoord;
    vec3 pos = projectionMatrix * vec3(aVertexPosition,1.0);
    gl_Position = vec4(pos.xy,0.0,1.0);
}
`;

    const fragmentSrc = `
precision mediump float;

varying vec2 vUV;

uniform float time;

void main(){

    vec2 st = vUV;

    float d = distance(st, vec2(0.5));

    float glow = 0.01 / d;

    float pulse = sin(time*2.0)*0.5+0.5;

    vec3 color = vec3(glow*pulse);

    gl_FragColor = vec4(color,1.0);
}
`;

    // root.addChild(quad);

    /*
    ============================================
    LINE GEOMETRY
    ============================================
    */

    function buildLineGeometry(points, width) {
      const positions = [];
      const uvs = [];
      const indices = [];

      const lengths = [0];
      let totalLength = 0;

      for (let i = 1; i < points.length; i++) {
        const dx = points[i].x - points[i - 1].x;
        const dy = points[i].y - points[i - 1].y;

        totalLength += Math.hypot(dx, dy);
        lengths.push(totalLength);
      }

      for (let i = 0; i < points.length; i++) {
        const prev = points[Math.max(i - 1, 0)];
        const next = points[Math.min(i + 1, points.length - 1)];

        const dx = next.x - prev.x;
        const dy = next.y - prev.y;

        const len = Math.hypot(dx, dy) || 1;

        const nx = -dy / len;
        const ny = dx / len;

        const hw = width / 2;

        const x1 = points[i].x + nx * hw;
        const y1 = points[i].y + ny * hw;

        const x2 = points[i].x - nx * hw;
        const y2 = points[i].y - ny * hw;

        positions.push(x1, y1);
        positions.push(x2, y2);

        const t = lengths[i] / totalLength;

        uvs.push(t, 0);
        uvs.push(t, 1);
      }

      for (let i = 0; i < points.length - 1; i++) {
        const a = i * 2;
        const b = i * 2 + 1;
        const c = i * 2 + 2;
        const d = i * 2 + 3;

        indices.push(a, b, c);
        indices.push(b, d, c);
      }

      const geometry = new PIXI.Geometry();

      geometry.addAttribute("aPosition", positions, 2);
      geometry.addAttribute("aUV", uvs, 2);
      geometry.addIndex(indices);

      return geometry;
    }

    /*
    ============================================
    LINE SHADER
    ============================================
    */

    const lineVertex = `
precision mediump float;

attribute vec2 aPosition;
attribute vec2 aUV;

uniform mat3 translationMatrix;
uniform mat3 projectionMatrix;

varying vec2 vUV;

void main(){

    vUV = aUV;

    vec3 pos = projectionMatrix * translationMatrix * vec3(aPosition,1.0);

    gl_Position = vec4(pos.xy,0.0,1.0);

}
`;

    const lineFragment = `
precision mediump float;

varying vec2 vUV;

uniform float progress;

float alphaMask(float t){

    if(t < 0.14){
        return t / 0.14;
    }
    else if(t < 0.75){
        return 1.0;
    }
    else{
        return 1.0 - (t - 0.75) / 0.25;
    }
}

void main(){

    if(vUV.x > progress){
        discard;
    }

    float headFade = clamp((progress - vUV.x) / 0.1, 0.0, 1.0);

    float tailFade = clamp(vUV.x / 0.1, 0.0, 1.0);

    float a = headFade * tailFade;

    vec3 color = vec3(1.0, 0.0, 0.0);

    gl_FragColor = vec4(color, a);
}
`;

    const lineShader = PIXI.Shader.from(lineVertex, lineFragment, {
      progress: 0,
    });

    const geometry = buildLineGeometry(
      [
        { x: 200, y: 400 },
        { x: 400, y: 250 },
        { x: 600, y: 400 },
        { x: 800, y: 250 },
        { x: 1000, y: 400 },
      ],
      20,
    );

    const mesh = new PIXI.Mesh(geometry, lineShader);

    root.addChild(mesh);

    /*
    ============================================
    TICKER
    ============================================
    */

    let progress = 0;

    app.ticker.add((delta) => {
      progress += 0.03 * delta;

      if (progress > 1) progress = 1;

      lineShader.uniforms.progress = progress;
    });

    return () => {
      app.destroy(true, {
        children: true,
        texture: true,
        baseTexture: true,
      });
    };
  }, []);

  return <div ref={containerRef} />;
};
