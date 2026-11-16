// Light/dark theme. Default follows the system; once the user toggles,
// the choice is stored and wins over the system setting.

export const THEME_KEY = "bewerbungstracker:theme";

// Runs inline in <head> before first paint, so there is no flash.
export const themeInitScript = `(function(){try{var k=${JSON.stringify(
  THEME_KEY
)};var m=window.matchMedia("(prefers-color-scheme: dark)");function a(){var s=localStorage.getItem(k);document.documentElement.classList.toggle("dark",s?s==="dark":m.matches)}a();m.addEventListener("change",a)}catch(e){}})()`;
