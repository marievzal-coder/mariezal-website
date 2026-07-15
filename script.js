const observer=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.08});document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));const menu=document.querySelector('.menu'),nav=document.querySelector('.site-header nav');if(menu)menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.textContent=open?'Close':'Menu'});const params=new URLSearchParams(location.search),work=params.get('work'),workField=document.querySelector('#work-field');if(workField&&work)workField.value=work;const form=document.querySelector('#inquiry-form');if(form)form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form),subject=encodeURIComponent(`MARIEZAL inquiry --- ${d.get('interest')}`),body=encodeURIComponent(`Name: ${d.get('name')}\nEmail: ${d.get('email')}\nInterest: ${d.get('interest')}\nArtwork: ${d.get('work')}\n\n${d.get('message')}`);location.href=`mailto:marievzal@gmail.com?subject=${subject}&body=${body}`});

const worksGrid=document.querySelector('[data-works-grid]');
if(worksGrid){
  fetch('data/artworks.json').then(response=>response.json()).then(({artworks})=>{
    worksGrid.innerHTML=artworks.map(item=>{
      const meta=[item.status,item.dimensions].filter(Boolean).join(' Â· ');
      const classes=['work',item.featured?'work-featured':'',item.type==='sculpture'?'sculpture':''].filter(Boolean).join(' ');
      const description=item.description?`<p class="work-description">${item.description}</p>`:'';
      const action=item.status==='Available'?`<a href="contact.html?work=${encodeURIComponent(item.title)}">Buy this work -†—</a>`:'';
      return `<article class="${classes}"><img src="${item.image}" alt="${item.title} by Maryia Zaloznaya"><div><p>${meta}</p><h2>${item.title}</h2>${description}${action}</div></article>`;
    }).join('');
  }).catch(()=>{worksGrid.innerHTML='<p>The collection is temporarily unavailable.</p>'});
}
