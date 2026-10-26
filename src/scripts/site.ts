const dialog = document.querySelector<HTMLDialogElement>('dialog');
const modalContent = document.querySelector<HTMLElement>('.modal-content');
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const progress = document.querySelector<HTMLElement>('.reading-progress');
let progressFrame = 0;
function updateProgress() {
 const target = dialog?.open ? dialog : document.documentElement;
 const distance = target.scrollHeight - target.clientHeight;
 if (progress) progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0,target.scrollTop / distance)) : 0})`;
}
function requestProgress() {
 if (!progressFrame) progressFrame = requestAnimationFrame(() => { updateProgress(); progressFrame = 0; });
}
window.addEventListener('scroll', requestProgress, { passive: true });
dialog?.addEventListener('scroll', requestProgress, { passive: true });
window.addEventListener('resize', requestProgress);
function prepareArticle(root: ParentNode) {
 root.querySelectorAll<HTMLTableElement>('table').forEach((table,index) => {
  if(table.parentElement?.classList.contains('table-scroll')) return;
  const region = document.createElement('div');
  region.className = 'table-scroll'; region.tabIndex = 0;
  region.setAttribute('role','region'); region.setAttribute('aria-label',`Reference table ${index+1}; scroll for all columns`);
  table.before(region); region.append(table);
 });
}
prepareArticle(document);
let pending: AbortController | undefined;
let openingLink: HTMLAnchorElement | undefined;
document.addEventListener('click', async event => {
 const target = event.target instanceof Element ? event.target : null;
 const anchor = target?.closest<HTMLAnchorElement>('a.note-link');
 if (!anchor || !dialog || !modalContent || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
 event.preventDefault();
 pending?.abort(); openingLink?.removeAttribute('aria-busy');
 const controller = new AbortController(); pending = controller; openingLink = anchor;
 anchor.setAttribute('aria-busy','true');
 try {
  const response = await fetch(anchor.href,{signal:controller.signal});
  if (!response.ok) throw new Error('Article unavailable');
  const page = new DOMParser().parseFromString(await response.text(),'text/html');
  const article = page.querySelector('.article-content');
  if(!article) throw new Error('Article unavailable');
  if(controller.signal.aborted) return;
  modalContent.replaceChildren(document.importNode(article,true));
  prepareArticle(modalContent);
  const permalink = dialog.querySelector<HTMLAnchorElement>('.reader-permalink');
  if(permalink) permalink.href=anchor.href;
  if(!dialog.open) dialog.showModal();
  dialog.scrollTop=0; updateProgress();
 } catch(error) {
  if(!controller.signal.aborted) window.location.assign(anchor.href);
 } finally { anchor.removeAttribute('aria-busy'); }
});
dialog?.querySelector('.close')?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('close',()=>openingLink?.focus({preventScroll:true}));
dialog?.addEventListener('click',event=>{
 const target=event.target instanceof Element ? event.target : null;
 const anchor=target?.closest<HTMLAnchorElement>('a[href^="#"]');
 if(!anchor) return;
 const id=anchor.getAttribute('href')!.slice(1);
 event.preventDefault();
 if(id==='top') dialog.scrollTo({top:0,behavior:reducedMotion()?'instant':'smooth'});
 else {
  const heading=modalContent?.querySelector<HTMLElement>(`[id="${CSS.escape(id)}"]`);
  heading?.scrollIntoView({behavior:reducedMotion()?'instant':'smooth',block:'start'});
 }
});
if('IntersectionObserver' in window && !reducedMotion()){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}
 }),{threshold:.08});
 document.querySelectorAll('.feature-copy,.section-head').forEach(element=>{element.classList.add('reveal');observer.observe(element)});
}
updateProgress();
document.fonts.ready.then(requestProgress);

import './margin-motion';
