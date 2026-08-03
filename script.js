const observer=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.08});
document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));

const nav=document.querySelector('.site-header nav');
if(nav){
  const inJournal=location.pathname.includes('/journal/');
  const prefix=inJournal?'../':'';
  const sections=[['works.html','Originals'],['prints.html','Prints'],['commissions.html','Commissions'],['about.html','Artist'],['journal.html','Journal'],['arcana.html','Arcana']];
  const current=location.pathname.split('/').pop()||'index.html';
  nav.innerHTML=sections.map(([href,label])=>`<a${current===href?' class="active"':''} href="${prefix}${href}">${label}</a>`).join('');
}

const menu=document.querySelector('.menu');
if(menu)menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.textContent=open?'Close':'Menu'});

const params=new URLSearchParams(location.search);
const work=params.get('work');
const interest=params.get('interest');
const workField=document.querySelector('#work-field');
const interestField=document.querySelector('[name="interest"]');
if(workField&&work)workField.value=work;
if(interestField&&interest)[...interestField.options].some(option=>{
  if(option.value===interest){option.selected=true;return true}
  return false;
});

const form=document.querySelector('#inquiry-form');
if(form)form.addEventListener('submit',async event=>{
  event.preventDefault();
  const button=form.querySelector('button[type="submit"]');
  const status=document.querySelector('#form-status');
  button.disabled=true;
  button.textContent='Sending…';
  status.textContent='Sending your inquiry securely…';
  try{
    const response=await fetch('https://formsubmit.co/ajax/marievzal@gmail.com',{
      method:'POST',
      headers:{Accept:'application/json'},
      body:new FormData(form)
    });
    const result=await response.json();
    if(!response.ok||result.success===false)throw new Error('Submission failed');
    form.reset();
    status.textContent='Thank you. Your inquiry has been sent directly to Maryia.';
    button.textContent='Inquiry sent ✓';
  }catch(error){
    status.textContent='The message could not be sent. Please email marievzal@gmail.com directly.';
    button.disabled=false;
    button.textContent='Try again →';
  }
});

const worksGrid=document.querySelector('[data-works-grid]');
if(worksGrid){
  fetch('data/artworks.json?v=20260803-full').then(response=>response.json()).then(({artworks})=>{
    worksGrid.innerHTML=artworks.map(item=>{
      const meta=[item.status,item.dimensions].filter(Boolean).join(' · ');
      const classes=['work',item.featured?'work-featured':'',item.type==='sculpture'?'sculpture':''].filter(Boolean).join(' ');
      const description=item.description?`<p class="work-description">${item.description}</p>`:'';
      const action=item.status==='Available'&&item.purchasable!==false?`<a href="contact.html?interest=${encodeURIComponent('Acquiring an original')}&work=${encodeURIComponent(item.title)}">Buy this work</a>`:'';
      const hasFilm=Boolean(item.video);
      const imageClass=item.imageClass?` class="${item.imageClass}"`:'';
      const image=hasFilm
        ? `<button class="work-media" type="button" data-work-film="${item.video}" data-work-poster="${item.videoPoster||item.image}" data-work-title="${item.title}" aria-label="Watch the film for ${item.title}"><img${imageClass} src="${item.image}" alt="${item.title} by Maryia Zaloznaya"><span>View artwork film</span></button>`
        : `<img${imageClass} src="${item.image}" alt="${item.title} by Maryia Zaloznaya">`;
      return `<article class="${classes}">${image}<div><p>${meta}</p><h2>${item.title}</h2>${description}${action}</div></article>`;
    }).join('');
    document.querySelectorAll('[data-work-film]').forEach(button=>button.addEventListener('click',()=>openWorkFilm(button)));
  }).catch(()=>{worksGrid.innerHTML='<p>The collection is temporarily unavailable.</p>'});
}

function openWorkFilm(button){
  const modal=document.createElement('div');
  modal.className='work-film-modal';
  modal.innerHTML=`<div class="work-film-modal__backdrop" data-close-film></div><section class="work-film-modal__panel" role="dialog" aria-modal="true" aria-label="${button.dataset.workTitle} film"><button class="work-film-modal__close" type="button" data-close-film aria-label="Close">Close</button><video controls autoplay muted loop playsinline preload="metadata" poster="${button.dataset.workPoster}"><source src="${button.dataset.workFilm}" type="video/mp4"></video><p>${button.dataset.workTitle} · Studio film</p></section>`;
  document.body.appendChild(modal);
  document.body.classList.add('modal-open');
  const close=()=>{modal.querySelector('video').pause();modal.remove();document.body.classList.remove('modal-open')};
  modal.querySelectorAll('[data-close-film]').forEach(item=>item.addEventListener('click',close));
  document.addEventListener('keydown',function escape(event){if(event.key==='Escape'){close();document.removeEventListener('keydown',escape)}},{once:true});
}

const SUPPORT_PAYMENT_LINK='';
const supportButton=document.createElement('button');
supportButton.type='button';
supportButton.className='support-art-button';
supportButton.innerHTML='<span>✦</span><b>Support the art</b>';
supportButton.setAttribute('aria-label','Support Maryia’s art');
if(SUPPORT_PAYMENT_LINK)document.body.appendChild(supportButton);
supportButton.addEventListener('click',()=>{
  const modal=document.createElement('div');
  modal.className='support-modal';
  modal.innerHTML=`<div class="support-modal__backdrop" data-support-close></div><section class="support-modal__panel" role="dialog" aria-modal="true" aria-labelledby="support-title"><button class="support-modal__close" type="button" data-support-close>Close</button><p class="eyebrow">Patronage · Independent art</p><h2 id="support-title">Help the next work<br><em>come into being.</em></h2><p>Your support funds materials, studio time and the creation of new paintings and immersive art experiences.</p><a class="support-pay" ${SUPPORT_PAYMENT_LINK?`href="${SUPPORT_PAYMENT_LINK}" target="_blank" rel="noopener"`:'aria-disabled="true"'}><span class="support-apple">Pay</span><small>Choose your contribution securely</small></a><p class="support-secure">Secure payment · Card and Apple Pay through Stripe</p></section>`;
  document.body.appendChild(modal);
  document.body.classList.add('modal-open');
  const close=()=>{modal.remove();document.body.classList.remove('modal-open')};
  modal.querySelectorAll('[data-support-close]').forEach(item=>item.addEventListener('click',close));
  document.addEventListener('keydown',function escape(event){if(event.key==='Escape'){close();document.removeEventListener('keydown',escape)}},{once:true});
});
