// landing/script.js
// Interações da landing em JavaScript puro (sem frameworks/bibliotecas).

(function () {
   'use strict';

   const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

   // -------------------------------------------------------------------------
   // Ano do rodapé
   // -------------------------------------------------------------------------
   const year = document.getElementById('year');
   if (year) year.textContent = String(new Date().getFullYear());

   // -------------------------------------------------------------------------
   // Header com borda ao rolar
   // -------------------------------------------------------------------------
   const header = document.querySelector('.site-header');

   const onScroll = () => {
      if (!header) return;
      header.classList.toggle('is-scrolled', window.scrollY > 8);
   };

   onScroll();
   window.addEventListener('scroll', onScroll, { passive: true });

   // -------------------------------------------------------------------------
   // Menu mobile
   // -------------------------------------------------------------------------
   const menuToggle = document.getElementById('menu-toggle');
   const nav = document.getElementById('site-nav');

   function closeMenu() {
      if (!nav || !menuToggle) return;
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu');
   }

   if (menuToggle && nav) {
      menuToggle.addEventListener('click', () => {
         const open = !nav.classList.contains('is-open');
         nav.classList.toggle('is-open', open);
         menuToggle.setAttribute('aria-expanded', String(open));
         menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      });

      nav.querySelectorAll('a').forEach((link) => {
         link.addEventListener('click', closeMenu);
      });

      document.addEventListener('click', (event) => {
         if (!nav.classList.contains('is-open')) return;
         if (event.target.closest('.site-header')) return;
         closeMenu();
      });

      document.addEventListener('keydown', (event) => {
         if (event.key === 'Escape') closeMenu();
      });
   }

   // -------------------------------------------------------------------------
   // Seletor de idioma (visual)
   // -------------------------------------------------------------------------
   const langSwitch = document.querySelector('.lang-switch');

   if (langSwitch) {
      const langOptions = Array.from(langSwitch.querySelectorAll('.lang-option'));

      const setLanguage = (lang) => {
         langOptions.forEach((button) => {
            const active = button.dataset.lang === lang;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', String(active));
         });
      };

      langOptions.forEach((button) => {
         button.addEventListener('click', () => setLanguage(button.dataset.lang));
      });
   }

   // -------------------------------------------------------------------------
   // Botões de copiar
   // -------------------------------------------------------------------------
   document.querySelectorAll('[data-copy]').forEach((button) => {
      button.addEventListener('click', async () => {
         const target = document.querySelector(button.dataset.copy);
         if (!target) return;

         const text = target.textContent.trim();
         const original = button.textContent;

         const done = (ok) => {
            button.textContent = ok ? 'Copiado' : 'Falhou';
            button.classList.toggle('is-copied', ok);
            window.setTimeout(() => {
               button.textContent = original;
               button.classList.remove('is-copied');
            }, 1500);
         };

         try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
               await navigator.clipboard.writeText(text);
               done(true);
               return;
            }

            const area = document.createElement('textarea');
            area.value = text;
            area.setAttribute('readonly', '');
            area.style.position = 'fixed';
            area.style.opacity = '0';
            document.body.appendChild(area);
            area.select();
            done(document.execCommand('copy'));
            document.body.removeChild(area);
         } catch (error) {
            done(false);
         }
      });
   });

   // -------------------------------------------------------------------------
   // Animação de entrada
   // -------------------------------------------------------------------------
   const revealItems = document.querySelectorAll('.reveal');

   // Revela imediatamente o que já está na viewport (não depende do observer).
   revealItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.98 && rect.bottom > 0) {
         item.style.transition = 'none';
         item.classList.add('is-visible');
      }
   });

   if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach((item) => {
         item.style.transition = 'none';
         item.classList.add('is-visible');
      });
   } else {
      const revealObserver = new IntersectionObserver((entries) => {
         entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
         });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

      revealItems.forEach((item) => revealObserver.observe(item));

      // Rede de segurança: se nada foi revelado (observer bloqueado), mostra tudo.
      window.setTimeout(() => {
         if (!document.querySelector('.reveal.is-visible')) {
            revealItems.forEach((item) => {
               item.style.transition = 'none';
               item.classList.add('is-visible');
            });
         }
      }, 1200);
   }

   // -------------------------------------------------------------------------
   // Link ativo no menu conforme a seção visível
   // -------------------------------------------------------------------------
   const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
   const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

   if ('IntersectionObserver' in window && sections.length) {
      const sectionObserver = new IntersectionObserver((entries) => {
         entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            navLinks.forEach((link) => {
               link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
            });
         });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

      sections.forEach((section) => sectionObserver.observe(section));
   }
})();
