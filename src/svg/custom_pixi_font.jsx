import * as PIXI from "pixi.js";

export function createGoldText(text) {
  const container = new PIXI.Container();
  function isFontLoaded(font) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    ctx.font = `100px ${font}, monospace`;
    const w1 = ctx.measureText("abcdefghijklmnopqrstuvwxyz").width;

    ctx.font = `100px monospace`;
    const w2 = ctx.measureText("abcdefghijklmnopqrstuvwxyz").width;

    return w1 !== w2;
  }

  console.log(isFontLoaded("Lilita One"));

  const fontFamily = "Lilita One";
  const fontSize = 100;

  // 1️⃣ нижний слой (тёмный stroke)
  const shadowStyle = new PIXI.TextStyle({
    fontFamily,
    fontSize,
    // fill: 0xffffff,
    stroke: "#AF3F1B",
    strokeThickness: 9,
    lineJoin: "round",
    resolution: 4,
  });

  const shadowText = new PIXI.Text(text, shadowStyle);
  shadowText.anchor.set(0.5);
  shadowText.y = 2;

  // 2️⃣ основной золотой текст
  const gradientCanvas = document.createElement("canvas");
  gradientCanvas.width = 1;
  gradientCanvas.height = fontSize;

  const ctx = gradientCanvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, fontSize);
  gradient.addColorStop(0.3, "#F4E232");
  gradient.addColorStop(0.45, "#F5CE2A");
  gradient.addColorStop(0.47, "#F5D029");
  gradient.addColorStop(0.49, "#F3B525");
  gradient.addColorStop(0.63, "#EB7D26");

  const mainStyle = new PIXI.TextStyle({
    fontFamily,
    fontSize,
    fill: gradient,
    stroke: "#E58924",
    strokeThickness: 2,
    lineJoin: "round",
    resolution: 4,
  });

  const mainText = new PIXI.Text(text, mainStyle);
  mainText.anchor.set(0.5);

  // 3️⃣ верхний highlight
  const highlightGradient = ctx.createLinearGradient(0, 0, 0, fontSize);
  highlightGradient.addColorStop(0.2, "#FDF586");
  highlightGradient.addColorStop(0.78, "#EE9124");

  const highlightStyle = new PIXI.TextStyle({
    fontFamily: "Lilita One",
    fontSize,
    fill: ["#F4E232", "#EB7D26"], // gradient fill ✔
    fillGradientType: 1,
    fillGradientStops: [0.3, 0.63],
    stroke: "#E58924", // только цвет
    strokeThickness: 2,
    resolution: 4,
  });

  const highlightText = new PIXI.Text(text, highlightStyle);
  highlightText.anchor.set(0.5);

  container.addChild(shadowText);
  // container.addChild(mainText);
  // container.addChild(highlightText);

  return container;
}
