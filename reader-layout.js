(()=>{'use strict';
 // Native details stay usable without JS; anchor links reveal a collapsed target.
 function revealHash(){
  if(!location.hash)return;
  let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{return}
  const target=document.getElementById(id);if(!target)return;
  let node=target;while(node){if(node.tagName==='DETAILS')node.open=true;node=node.parentElement}
 }
 revealHash();window.addEventListener('hashchange',revealHash);
})();
