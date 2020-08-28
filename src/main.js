import App from "./App.svelte";
import { EncodeNums, DecodeNums } from "./Scripts/coder.js";

const param = new URLSearchParams(window.location.search).get("order");

let order;
if (param == null || param == "") {
  window.location = window.location.href + "soon"; // Main page
} else {
  order = DecodeNums(param);
  if (!Array.isArray(order) || order.length != 3) {
    window.location = window.location.href + "soon"; // Main page
  }
}

console.log(EncodeNums([77082970450]));

const app = new App({
  target: document.body,
  props: {
    phone: order[0],
    igid: order[1],
    lang: EncodeNums([order[2]]),
  },
});
export default app;

// Setting up a "real 100vh" height for mobile browsers
changeHeight();
function changeHeight() {
  var vh = window.innerHeight * 0.01 * 100;
  document.documentElement.style.setProperty("--fullH", `${vh}px`);
}
window.addEventListener("resize", changeHeight);
