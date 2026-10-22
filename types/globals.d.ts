// Globals the game's scripts share: every module hangs its namespace on window.FM (see the first lines of each js/ file).
// A file with `// @ts-check` on its first line is checked by `npm run typecheck`.
interface Window {
  FM: any;
}
