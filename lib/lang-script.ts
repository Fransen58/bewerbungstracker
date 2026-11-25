// UI language before first paint. The prerendered HTML is German; when
// English is stored, the page stays hidden until React has switched the
// texts, so German labels never flash. A timeout shows it in any case.

export const LANG_KEY = "bewerbungstracker:lang";
export const LANG_PENDING_CLASS = "lang-pending";

export const langInitScript = `(function(){try{if(localStorage.getItem(${JSON.stringify(
  LANG_KEY
)})==="en"){var h=document.documentElement;h.lang="en";h.classList.add(${JSON.stringify(
  LANG_PENDING_CLASS
)});setTimeout(function(){h.classList.remove(${JSON.stringify(
  LANG_PENDING_CLASS
)})},2000)}}catch(e){}})()`;
