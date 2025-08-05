// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // これを指定すると `npm run build` 時に静的エクスポート(outフォルダ)が出力される
  // output: "export",
  trailingSlash: true,
  // 必要であれば、URL末尾にスラッシュを付けたい場合はコメントを外してください
  // trailingSlash: true,
};

module.exports = nextConfig;
