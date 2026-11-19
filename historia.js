// landing/historia.js
// Barra de progresso de leitura + borda do header ao rolar (JS puro).

(function () {
   'use strict';

   const bar = document.getElementById('reading-progress');
   const header = document.querySelector('.article-header');

   function update() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - window.innerHeight;

      if (bar) {
         const progress = height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0;
         bar.style.width = `${progress}%`;
      }

      if (header) {
         header.classList.toggle('is-scrolled', scrollTop > 8);
      }
   }

   update();
   window.addEventListener('scroll', update, { passive: true });
   window.addEventListener('resize', update);
})();
