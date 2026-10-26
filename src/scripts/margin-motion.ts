// Website story: a reviewer follows three loose ends, then returns to the still drawing.
const figures = document.querySelectorAll<HTMLElement>('[data-margin-motion]');
const preference = matchMedia('(prefers-reduced-motion: reduce)');
const still = new URLSearchParams(location.search).has('still');
figures.forEach(figure => {
 const toggle = figure.querySelector<HTMLButtonElement>('.motion-toggle')!;
 const paths = [...figure.querySelectorAll<SVGPathElement>('.question-path')];
 const ink = [...figure.querySelectorAll<SVGPathElement>('.story-path')];
 const marker = figure.querySelector<SVGCircleElement>('.story-marker')!;
 const lengths = paths.map(path => path.getTotalLength());
 let visible = false, paused = false, started = false, elapsed = 0, last = 0, frame = 0;
 const smooth = (x:number) => x*x*(3-2*x);
 const reset = () => { ink.forEach(path=>{path.style.strokeDashoffset='1';path.style.opacity='0'});marker.style.opacity='0'; };
 const draw = (seconds:number) => {
  reset();
  if(seconds<2.4) return;
  const phase=(seconds-2.4)%8;
  if(phase>=6) return; // Two seconds at the exact still frame.
  const index=Math.floor(phase/2), local=phase-index*2;
  const position=smooth(Math.min(1,local/1.1));
  const opacity=local<.2?local/.2:local>1.5?1-(local-1.5)/.5:1;
  ink[index].style.strokeDashoffset=String(1-position);ink[index].style.opacity=String(opacity);
  const point=paths[index].getPointAtLength(lengths[index]*position);
  marker.setAttribute('cx',String(point.x));marker.setAttribute('cy',String(point.y));marker.style.opacity=String(opacity);
 };
 const tick = (now:number) => {
  if(last)elapsed+=(now-last)/1000;
  last=now;draw(elapsed);frame=requestAnimationFrame(tick);
 };
 const sync = () => {
  cancelAnimationFrame(frame);frame=0;last=0;
  const disabled=preference.matches||still;
  toggle.hidden=disabled;
  if(disabled){figure.classList.remove('motion-ready');reset();return;}
  figure.classList.add('motion-ready');
  if(visible&&!started){started=true;figure.classList.add('motion-in');}
  if(visible&&!paused&&!document.hidden)frame=requestAnimationFrame(tick);
 };
 toggle.addEventListener('click',()=>{paused=!paused;toggle.textContent=paused?'Play motion':'Pause motion';toggle.setAttribute('aria-label',paused?'Play illustration':'Pause illustration');toggle.setAttribute('aria-pressed',String(paused));sync();});
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{visible=entries[0].intersectionRatio>=.3;sync();},{threshold:[0,.3]});
  observer.observe(figure);preference.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);sync();
 }
});
