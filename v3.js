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

const artistFilm=document.querySelector('.artist-film__video');
const artistFilmSound=document.querySelector('.artist-film__sound');
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
['loadedmetadata','loadeddata','canplay','canplaythrough','pause','stalled','suspend'].forEach(eventName=>artistFilm?.addEventListener(eventName,keepArtistFilmPlaying));
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
