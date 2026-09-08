// This page keeps its own styles and interactions when embedded in the portfolio.
if(window.parent!==window){
 const publishHeight=()=>{
  if(document.querySelector('dialog[open],.compare-panel--expanded'))return;
  window.parent.postMessage({type:'nc-explorer-height',height:Math.ceil(document.body.getBoundingClientRect().height)+20},window.location.origin);
 };
 const placeOverlays=()=>{
  const frameTop=window.frameElement.getBoundingClientRect().top;
  document.documentElement.style.setProperty('--overlay-top',`${Math.max(20,20-frameTop)}px`);
  document.documentElement.style.setProperty('--overlay-height',`${Math.max(250,window.parent.innerHeight-40)}px`);
 };
 document.addEventListener('click',placeOverlays,true);
 new ResizeObserver(publishHeight).observe(document.body);
 window.addEventListener('load',publishHeight);
 publishHeight();
}
