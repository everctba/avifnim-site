   (function () {
      var isEnglish = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
      var labels = {
         copy: isEnglish ? 'Copy' : 'Copiar',
         copied: isEnglish ? 'Copied' : 'Copiado',
         failed: isEnglish ? 'Failed' : 'Falhou'
      };
      var params = new URLSearchParams(window.location.search);

      // O app informa o tema no ?theme=light|dark (e pode atualizar pela janela)
      function applyTheme(theme) {
         var next = theme === 'light' ? 'light' : 'dark';
         document.documentElement.setAttribute('data-theme', next);
      }

      window.setHelpTheme = applyTheme;
      applyTheme(params.get('theme') || document.documentElement.getAttribute('data-theme'));

      // Mantém tema e versão ao alternar entre Português e English
      var keepQuery = [];

      if (params.get('theme')) keepQuery.push('theme=' + encodeURIComponent(params.get('theme')));
      if (params.get('version')) keepQuery.push('version=' + encodeURIComponent(params.get('version')));

      if (keepQuery.length) {
         Array.prototype.forEach.call(document.querySelectorAll('.lang-link'), function (link) {
            var href = link.getAttribute('href');
            link.setAttribute('href', href + (href.indexOf('?') === -1 ? '?' : '&') + keepQuery.join('&'));
         });
      }

      // Controles da janela (quando aberto pelo app, sem barra nativa)
      if (window.helpAPI) {
         document.body.classList.add('in-app');

         document.querySelectorAll('[data-window]').forEach(function (button) {
            button.addEventListener('click', function () {
               var action = button.dataset.window;

               if (action === 'min') window.helpAPI.minimize();
               else if (action === 'max') window.helpAPI.toggleMaximize();
               else if (action === 'close') window.helpAPI.close();
            });
         });

         var header = document.querySelector('.top');
         if (header) {
            header.addEventListener('dblclick', function (event) {
               if (event.target.closest('a, button')) return;
               window.helpAPI.toggleMaximize();
            });
         }
      }

      // Botões de copiar
      document.querySelectorAll('pre').forEach(function (pre) {
         var button = pre.querySelector('.copy');
         if (!button) return;

         button.addEventListener('click', function () {
            var code = pre.querySelector('code');
            var text = code ? code.innerText : pre.innerText;

            function done(ok) {
               button.textContent = ok ? labels.copied : labels.failed;
               button.classList.toggle('ok', ok);
               setTimeout(function () { button.textContent = labels.copy; button.classList.remove('ok'); }, 1500);
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
               navigator.clipboard.writeText(text).then(function () { done(true); }).catch(function () { done(false); });
               return;
            }

            try {
               var range = document.createRange();
               range.selectNodeContents(code || pre);
               var selection = window.getSelection();
               selection.removeAllRanges();
               selection.addRange(range);
               done(document.execCommand('copy'));
            } catch (error) {
               done(false);
            }
         });
      });

      // Destaca a seção visível
      var links = Array.prototype.slice.call(document.querySelectorAll('#nav a'));
      var sections = links.map(function (link) { return document.querySelector(link.getAttribute('href')); });

      if ('IntersectionObserver' in window) {
         var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
               if (!entry.isIntersecting) return;

               links.forEach(function (link, index) {
                  link.classList.toggle('active', sections[index] === entry.target);
               });
            });
         }, { rootMargin: '-30% 0px -60% 0px' });

         sections.forEach(function (section) { if (section) observer.observe(section); });
      }

      // Versão (quando a página é aberta de dentro do app, ela recebe ?version=)
      var version = params.get('version');

      if (version) {
         document.getElementById('footer-version').textContent = (isEnglish ? 'Version ' : 'Versão ') + version + '.';
         document.getElementById('version-label').textContent = 'v' + version;
      }
   })();
