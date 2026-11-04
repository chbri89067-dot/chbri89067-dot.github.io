/* Explicit platform profiles; scenes and assets remain shared. */
(function () {
  'use strict';
  const name=document.documentElement.dataset.experience;
  if(name!=='mobile'&&name!=='desktop'){
    const next=new URL('index.html',location.href);next.search=location.search;location.replace(next.href);return;
  }
  window.VR_MODE=name;
  window.VR_EXPERIENCE=Object.freeze({name,mobile:name==='mobile',desktop:name==='desktop'});
}());
