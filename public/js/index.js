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

// ── PROMO DEL DÍA: contenido desde content/promo.json + contador regresivo ──
const promoBar=document.getElementById('promoBar');
if(promoBar){
  fetch('content/promo.json').then(r=>r.json()).then(promo=>{
    if(!promo.enabled)return;
    document.getElementById('promoBadge').textContent=promo.badge||'';
    document.getElementById('promoMsg').textContent=promo.message||'';
    document.getElementById('promoPriceBefore').textContent=promo.priceBefore||'';
    document.getElementById('promoPriceAfter').textContent=promo.priceAfter||'';
    const cta=document.getElementById('promoCta');
    cta.textContent=promo.ctaText||'Ver oferta';
    cta.href=promo.ctaUrl||'#';
    if(promo.discountPercent){
      document.getElementById('promoDiscount').hidden=false;
      document.getElementById('promoDiscountText').textContent='-'+promo.discountPercent+'%';
    }
    promoBar.hidden=false;

    const pH=document.getElementById('pH'),pM=document.getElementById('pM'),pS=document.getElementById('pS');
    const pad=n=>String(n).padStart(2,'0');
    const PROMO_KEY='cdl_promoEnd';
    const PROMO_DURATION=(promo.durationHours||5)*60*60*1000;
    let promoEnd=null;
    try{
      const saved=Number(localStorage.getItem(PROMO_KEY));
      if(saved&&!isNaN(saved))promoEnd=saved;
    }catch(e){}
    if(!promoEnd){
      promoEnd=Date.now()+PROMO_DURATION;
      try{localStorage.setItem(PROMO_KEY,promoEnd);}catch(e){}
    }
    setInterval(()=>{
      let diff=promoEnd-Date.now();
      if(diff<=0){
        promoEnd=Date.now()+PROMO_DURATION;
        try{localStorage.setItem(PROMO_KEY,promoEnd);}catch(e){}
        diff=promoEnd-Date.now();
      }
      pH.textContent=pad(Math.floor(diff/3600000));
      pM.textContent=pad(Math.floor(diff%3600000/60000));
      pS.textContent=pad(Math.floor(diff%60000/1000));
    },1000);
  }).catch(()=>{});
}

// ── PORTAFOLIO: tarjetas desde content/portfolio.json ──
const portGrid=document.getElementById('portGrid');
if(portGrid){
  fetch('content/portfolio.json').then(r=>r.json()).then(data=>{
    (data.items||[]).forEach(item=>{
      const card=document.createElement('a');
      card.href=item.url;
      card.target='_blank';
      card.className='port-card';

      let discountHtml='';
      if(item.discount){
        discountHtml=`<span class="port-discount" aria-label="${item.discount}% de descuento">
          <svg viewBox="0 0 100 100"><polygon points="50,2 61,20 79,10 82,30 100,35 90,50 100,65 82,70 79,90 61,80 50,98 39,80 21,90 18,70 0,65 10,50 0,35 18,30 21,10 39,20" fill="#e53935"/></svg>
          <b>-${item.discount}%</b>
        </span>`;
      }

      let iconHtml;
      if(item.image){
        iconHtml=`<div class="port-card-icon" style="background:#fff;box-shadow:0 8px 20px rgba(15,14,11,.12),inset 0 0 0 1px var(--fog);overflow:hidden">
          <img src="${item.image}" alt="" style="width:100%;height:100%;object-fit:cover">
        </div>`;
      }else if(item.icon==='playstore'){
        iconHtml=`<div class="port-card-icon" style="background:#fff;box-shadow:0 8px 20px rgba(15,14,11,.12),inset 0 0 0 1px var(--fog)">
          <svg width="22" height="22" viewBox="0 0 24 24">
            <defs>
              <linearGradient id="playGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00d4ff"/>
                <stop offset="30%" stop-color="#00f076"/>
                <stop offset="65%" stop-color="#ffcf00"/>
                <stop offset="100%" stop-color="#ff3a44"/>
              </linearGradient>
            </defs>
            <polygon points="5,3 5,21 20,12" fill="url(#playGrad)"/>
          </svg>
        </div>`;
      }else{
        iconHtml=`<div class="port-card-icon"><i data-feather="${item.icon}" style="width:20px;height:20px"></i></div>`;
      }

      card.innerHTML=`${discountHtml}${iconHtml}
        <div class="port-card-body"><h4>${item.title}</h4><p>${item.description}</p></div>
        <span class="port-card-link">${item.linkText||'Ver sitio'} <i data-feather="arrow-up-right" style="width:12px;height:12px"></i></span>`;
      portGrid.appendChild(card);
    });

    feather.replace();

    // barra de navegador simulada en cada tarjeta de sitio web
    portGrid.querySelectorAll('.port-card').forEach(card=>{
      if(card.href.includes('play.google.com'))return;
      let host;
      try{host=new URL(card.href).hostname;}catch(e){return;}
      const bar=document.createElement('div');
      bar.className='port-browser';
      bar.innerHTML=`<span class="port-dot" style="background:#ff5f56"></span><span class="port-dot" style="background:#ffbd2e"></span><span class="port-dot" style="background:#27c93f"></span><span class="port-url">🔒 ${host}</span>`;
      card.prepend(bar);
    });
  }).catch(()=>{});
}

// ── ACCESO OCULTO AL PANEL ADMIN ──
// Escribir "@admin" en el campo Nombre del formulario de contacto lleva al panel.
const nameField=document.getElementById('cn');
if(nameField){
  nameField.addEventListener('input',()=>{
    if(nameField.value.trim().toLowerCase()==='@admin'){
      location.href='/admin/';
    }
  });
}

// Si la persona ya inició sesión como admin, se le confirma con una insignia discreta
// (un visitante normal nunca la ve, y nunca inicia sesión sin conocer /admin).
if(window.netlifyIdentity){
  netlifyIdentity.on('init',user=>{
    if(user){
      const badge=document.createElement('a');
      badge.href='/admin/';
      badge.textContent='⚙ Modo admin';
      badge.style.cssText='position:fixed;bottom:12px;left:12px;z-index:300;background:var(--ink);color:#fff;font-size:.72rem;font-weight:700;padding:6px 12px;border-radius:99px;text-decoration:none;box-shadow:0 4px 14px rgba(0,0,0,.25)';
      document.body.appendChild(badge);
    }else{
      netlifyIdentity.on('login',()=>{location.href='/admin/';});
    }
  });
  netlifyIdentity.init();
}

// ── WHATSAPP FLOTANTE: solo visible desde contacto en adelante ──
const waBtn=document.querySelector('.wa');
const contacto=document.getElementById('contacto');
if(waBtn&&contacto){
  const toggleWa=()=>waBtn.classList.toggle('show',scrollY+innerHeight/2>=contacto.offsetTop);
  window.addEventListener('scroll',toggleWa,{passive:true});
  toggleWa();
}
