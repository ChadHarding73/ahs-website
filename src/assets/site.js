document.querySelectorAll('.slideshow').forEach((ss) => {
  const slides = [...ss.querySelectorAll('.slide')]; if (slides.length < 2) return;
  let i = 0; const go = (n) => { slides[i].classList.remove('on'); i = (n + slides.length) % slides.length; slides[i].classList.add('on'); };
  ss.querySelector('.prev').onclick = () => go(i - 1); ss.querySelector('.next').onclick = () => go(i + 1);
  if (ss.dataset.autoplay) setInterval(() => go(i + 1), 5000);
});
document.querySelectorAll('.strip').forEach((s) => {
  const t = s.querySelector('.track');
  s.querySelector('.prev').onclick = () => t.scrollBy({ left: -t.clientWidth * .8, behavior: 'smooth' });
  s.querySelector('.next').onclick = () => t.scrollBy({ left: t.clientWidth * .8, behavior: 'smooth' });
});
const tog = document.querySelector('.menu-toggle'), nav = document.getElementById('nav');
tog.onclick = () => { const o = nav.classList.toggle('open'); tog.setAttribute('aria-expanded', o); };
