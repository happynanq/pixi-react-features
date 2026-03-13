export const buildSvgTextMarkup = (text, opts = {}) => {
  const {
    width = 400,
    height = 120,
    fontSize = 64,
    fontFamily = "Lilita One",
  } = opts;
  // <?xml version="1.0" encoding="UTF-8"?>

  return `
  <svg xmlns="http://www.w3.org/2000/svg"
  
  width="${width}"
  height="${height}"
  viewBox="0 0 ${width} ${height}">

  <defs>

  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
  <stop offset="30%" stop-color="#F4E232"/>
  <stop offset="45%" stop-color="#F5CE2A"/>
  <stop offset="47%" stop-color="#F5D029"/>
  <stop offset="49%" stop-color="#F3B525"/>
  <stop offset="63%" stop-color="#EB7D26"/>
  </linearGradient>

  <linearGradient id="highlightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
  <stop offset="20%" stop-color="#FDF586"/>
  <stop offset="78%" stop-color="#EE9124"/>
  </linearGradient>
  
  <style>
  @font-face {
  font-family: 'Lilita One';
  src: url('https://fonts.gstatic.com/s/lilitaone/v13/i7dPIFZ9Zz-WBtRtedDbYE98RXw.woff2') format('woff2');
}
  
  text{
  font-family:${fontFamily};
  font-size:${fontSize}px;
  font-weight:400;
  text-anchor:middle;
  dominant-baseline:middle;
  stroke-linejoin:round;
  paint-order:stroke fill;
  }
  </style>

  </defs>

  <!-- нижний слой -->
  <text
  x="50%"
  y="50.5%"
  fill="none"
  stroke="#AF3F1B"
  stroke-width="7.5">
  ${text}
  </text>

 

  <!-- средний слой -->
  <text
  x="50%"
  y="50%"
  fill="url(#goldGradient)"
  stroke="#E58924"
  stroke-width="2">
  ${text}
  </text>

  <!-- верхний слой -->
  <text
  x="50%"
  y="50%"
  fill="none"
  stroke="url(#highlightGradient)"
  stroke-width="1">
  ${text}
  </text>

  </svg>
  `;
};

export const CustomText = () => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: buildSvgTextMarkup("$1124241.89") }}
      style={{ backgroundColor: "#1e1e1e" }}
    ></div>
  );
};
