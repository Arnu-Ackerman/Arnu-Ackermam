/* Local website interactions: review carousel and subtle UI effects. */

document.getElementById('year').textContent=new Date().getFullYear();
const track=document.getElementById('reviewTrack');
const originalCards=[...track.children];
const prev=document.getElementById('prev'), next=document.getElementById('next');
let index=0, timer=null, paused=false;
function visible(){return window.innerWidth<=600?1:(window.innerWidth<=900?2:3)}
function cardStep(){const card=track.querySelector('.review-card');return card ? card.getBoundingClientRect().width+18 : 0}
function updateButtons(){
  const max=Math.max(0,originalCards.length-visible());
  prev.style.opacity=index===0?".5":"1";
  next.style.opacity=index>=max?".5":"1";
}
function moveTo(nextIndex, animate=true){
  const max=Math.max(0,originalCards.length-visible());
  index=nextIndex;
  if(index>max) index=0;
  if(index<0) index=max;
  track.style.transition=animate?"transform .55s ease":"none";
  track.style.transform=`translateX(-${index*cardStep()}px)`;
  updateButtons();
}
function advance(){ if(!paused) moveTo(index+1); }
function startAuto(){ stopAuto(); timer=setInterval(advance,3500); }
function stopAuto(){ if(timer){clearInterval(timer);timer=null;} }
prev.addEventListener('click',()=>{moveTo(index-1);startAuto()});
next.addEventListener('click',()=>{moveTo(index+1);startAuto()});
const windowEl=document.querySelector('.review-window');
windowEl.addEventListener('mouseenter',()=>{paused=true});
windowEl.addEventListener('mouseleave',()=>{paused=false});
windowEl.addEventListener('focusin',()=>{paused=true});
windowEl.addEventListener('focusout',()=>{paused=false});
window.addEventListener('resize',()=>moveTo(0,false));
moveTo(0,false);startAuto();

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll(
    'main > section, .skill-card, .feature-card, .review-card, .pricing-card'
  );

  // Only activate reveal styles after JS is running, so content stays visible if JS is unavailable.
  if ('IntersectionObserver' in window && !reduceMotion) {
    document.documentElement.classList.add('effects-ready');
    targets.forEach((el) => el.classList.add('js-reveal'));

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

    targets.forEach((el) => observer.observe(el));
  } else {
    targets.forEach((el) => el.classList.add('is-visible'));
  }

  const header = document.querySelector('.topbar');
  if (header) {
    const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }
})();
