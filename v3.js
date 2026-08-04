const featuredSlides=[...document.querySelectorAll('.slide')];
let featuredIndex=0;
function showFeatured(next){
  if(!featuredSlides.length)return;
  featuredSlides[featuredIndex].classList.remove('active');
  featuredIndex=(next+featuredSlides.length)%featuredSlides.length;
  featuredSlides[featuredIndex].classList.add('active');
}
document.querySelector('.slide-next')?.addEventListener('click',()=>showFeatured(featuredIndex+1));
document.querySelector('.slide-prev')?.addEventListener('click',()=>showFeatured(featuredIndex-1));

const homeHero=document.querySelector('.home-hero');
const artistFilm=document.querySelector('.artist-film__video');
const ambientFilm=document.querySelector('.home-hero__video--ambient');
const artistFilmSound=document.querySelector('.artist-film__sound');
const embeddedMobileBrowser=/Instagram|FBAN|FBAV|Line\/|Twitter|MicroMessenger/i.test(navigator.userAgent);
const compactViewport=window.matchMedia('(max-width: 760px)').matches;
const useMobileFilm=embeddedMobileBrowser||compactViewport;

function attachFilmSource(video,source){
  if(!video||!source)return;
  video.src=source;
  video.load();
}

// Instagram's iPhone browser cannot reliably decode the 4K Level 6 master.
// Give mobile/in-app browsers a fast-start H.264 Level 4.1 file and reserve
// the full-resolution master (plus the decorative ambient layer) for desktop.
attachFilmSource(artistFilm,useMobileFilm?artistFilm?.dataset.mobileSrc:artistFilm?.dataset.desktopSrc);
if(!useMobileFilm)attachFilmSource(ambientFilm,ambientFilm?.dataset.desktopSrc);

function keepArtistFilmPlaying(){
  if(!artistFilm)return;
  artistFilm.autoplay=true;
  artistFilm.loop=true;
  artistFilm.playsInline=true;
  artistFilm.defaultMuted=true;
  artistFilm.muted=true;
  artistFilm.setAttribute('muted','');
  artistFilm.setAttribute('playsinline','');
  artistFilm.setAttribute('webkit-playsinline','');
  if(artistFilm.paused)artistFilm.play().catch(()=>{});
}
artistFilm?.addEventListener('playing',()=>homeHero?.classList.add('is-playing'));
artistFilm?.addEventListener('error',()=>homeHero?.classList.remove('is-playing'));
['loadedmetadata','loadeddata','canplay','canplaythrough','pause','stalled'].forEach(eventName=>artistFilm?.addEventListener(eventName,keepArtistFilmPlaying));
artistFilm?.addEventListener('ended',()=>{artistFilm.currentTime=0;keepArtistFilmPlaying()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)keepArtistFilmPlaying()});
window.addEventListener('pageshow',keepArtistFilmPlaying);
window.addEventListener('load',keepArtistFilmPlaying);
setInterval(keepArtistFilmPlaying,1200);
keepArtistFilmPlaying();
artistFilmSound?.addEventListener('click',()=>{
  if(!artistFilm)return;
  artistFilm.muted=!artistFilm.muted;
  artistFilmSound.setAttribute('aria-pressed',String(!artistFilm.muted));
  artistFilmSound.setAttribute('aria-label',artistFilm.muted?'Turn sound on':'Turn sound off');
  artistFilmSound.querySelector('b').textContent=artistFilm.muted?'Off':'On';
  if(artistFilm.paused)artistFilm.play().catch(()=>{});
});
