feather.replace();
document.querySelectorAll('.yr').forEach(e=>e.textContent=new Date().getFullYear());

// ── DRAWER ──
const overlay=document.getElementById('overlay');
const drawer=document.getElementById('drawer');
const burger=document.getElementById('burger');
const dclose=document.getElementById('drawer-close');

const open=()=>{drawer.classList.add('on');overlay.classList.add('on');burger.classList.add('on');document.body.style.overflow='hidden'};
const close=()=>{drawer.classList.remove('on');overlay.classList.remove('on');burger.classList.remove('on');document.body.style.overflow=''};

burger.onclick=()=>drawer.classList.contains('on')?close():open();
dclose.onclick=close;
overlay.onclick=close;
drawer.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',close));

// ── HEADER ──
const hdr=document.getElementById('hdr');
window.addEventListener('scroll',()=>hdr.classList.toggle('solid',scrollY>60),{passive:true});

// ── HERO BG PARALLAX ──
const heroBg=document.getElementById('heroBg');
window.addEventListener('scroll',()=>{
  heroBg.style.transform=`translateY(${scrollY*.3}px)`;
},{passive:true});

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}
  });
});

// ── REVEAL ──
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');io.unobserve(e.target);}});
},{threshold:0.1});
document.querySelectorAll('[data-r]').forEach(el=>io.observe(el));

// ── PROMO DEL DÍA: contador regresivo ──
const promoBar=document.getElementById('promoBar');
if(promoBar){
  const setPromoH=()=>document.documentElement.style.setProperty('--promoH',promoBar.offsetHeight+'px');
  setPromoH();
  window.addEventListener('resize',setPromoH);

  const pH=document.getElementById('pH'),pM=document.getElementById('pM'),pS=document.getElementById('pS');
  const pad=n=>String(n).padStart(2,'0');
  const PROMO_KEY='cdl_promoEnd';
  const PROMO_DURATION=5*60*60*1000; // 5 horas desde la primera visita
  let promoEnd=null;
  try{
    const saved=Number(localStorage.getItem(PROMO_KEY));
    if(saved&&!isNaN(saved))promoEnd=saved;
  }catch(e){}
  if(!promoEnd){
    promoEnd=Date.now()+PROMO_DURATION;
    try{localStorage.setItem(PROMO_KEY,promoEnd);}catch(e){}
  }
  const promoTimer=setInterval(()=>{
    const diff=promoEnd-Date.now();
    if(diff<=0){
      promoBar.style.display='none';
      setPromoH();
      clearInterval(promoTimer);
      return;
    }
    pH.textContent=pad(Math.floor(diff/3600000));
    pM.textContent=pad(Math.floor(diff%3600000/60000));
    pS.textContent=pad(Math.floor(diff%60000/1000));
  },1000);
}

// ── PORTAFOLIO: barra de navegador simulada ──
document.querySelectorAll('.port-card').forEach(card=>{
  if(card.href.includes('play.google.com'))return;
  let host;
  try{host=new URL(card.href).hostname;}catch(e){return;}
  const bar=document.createElement('div');
  bar.className='port-browser';
  bar.innerHTML=`<span class="port-dot" style="background:#ff5f56"></span><span class="port-dot" style="background:#ffbd2e"></span><span class="port-dot" style="background:#27c93f"></span><span class="port-url">🔒 ${host}</span>`;
  card.prepend(bar);
});

// ── WHATSAPP FLOTANTE: solo visible desde contacto en adelante ──
const waBtn=document.querySelector('.wa');
const contacto=document.getElementById('contacto');
if(waBtn&&contacto){
  const toggleWa=()=>waBtn.classList.toggle('show',scrollY+innerHeight/2>=contacto.offsetTop);
  window.addEventListener('scroll',toggleWa,{passive:true});
  toggleWa();
}
