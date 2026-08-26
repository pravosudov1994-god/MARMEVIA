(() => {
  const assets = {
    hero: '/assets/photo-hero.svg?v=4',
    expert: '/assets/photo-expert.svg?v=4',
    master: '/assets/photo-master.svg?v=4',
    stain: '/assets/photo-stain.svg?v=4',
    rust: '/assets/photo-rust.svg?v=4',
    dull: '/assets/photo-dull.svg?v=4',
    scratch: '/assets/photo-scratch.svg?v=4',
    chip: '/assets/photo-chip.svg?v=4',
    crack: '/assets/photo-crack.svg?v=4',
    pit: '/assets/photo-pit.svg?v=4',
    chemical: '/assets/photo-chemical.svg?v=4'
  };

  const preload = () => {
    Object.values(assets).forEach((src) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = src;
    });
  };

  const reliableImage = (img, src, fallback, alt) => {
    if (!img) return;
    img.removeAttribute('loading');
    img.loading = 'eager';
    img.decoding = 'async';
    img.alt = alt;
    img.onerror = () => {
      img.onerror = null;
      img.src = fallback;
    };
    img.src = src;
  };

  const run = () => {
    preload();

    const hero = document.querySelector('.hero-image');
    if (hero) {
      hero.style.backgroundImage = `linear-gradient(90deg, rgba(250,247,242,.02), rgba(250,247,242,.02)), url('${assets.hero}')`;
      hero.style.backgroundPosition = 'center';
      hero.style.backgroundSize = 'cover';
      hero.style.backgroundRepeat = 'no-repeat';
    }

    const problemPhotos = {
      stain: assets.stain,
      rust: assets.rust,
      dull: assets.dull,
      scratch: assets.scratch,
      chip: assets.chip,
      crack: assets.crack,
      pit: assets.pit,
      chemical: assets.chemical
    };

    Object.entries(problemPhotos).forEach(([name, src]) => {
      const el = document.querySelector(`.problem-art.${name}`);
      if (!el) return;
      el.style.backgroundImage = `url('${src}')`;
      el.style.backgroundPosition = 'center';
      el.style.backgroundSize = 'cover';
      el.style.backgroundRepeat = 'no-repeat';
    });

    const expertImage = document.querySelector('.expert-grid > img');
    reliableImage(
      expertImage,
      assets.hero,
      '/assets/stair.svg',
      'Демонстрационный светлый интерьер с мраморной отделкой'
    );

    const masterImage = document.querySelector('.master-grid > img');
    reliableImage(
      masterImage,
      assets.master,
      '/assets/master.svg',
      'Демонстрационное изображение мастера при работе с мраморной поверхностью'
    );

    const caseGrid = document.querySelector('#work .case-grid');
    if (caseGrid) {
      caseGrid.classList.add('visual-cases');
      caseGrid.innerHTML = `
        <article class="visual-case">
          <div class="compare-media">
            <div class="compare-half"><img src="${assets.dull}" alt="Демонстрационный вид потускневшего мрамора"><span>До</span></div>
            <div class="compare-half"><img src="${assets.hero}" alt="Демонстрационный вид восстановленного мраморного пола"><span>После</span></div>
            <i aria-hidden="true">↔</i>
          </div>
          <div class="visual-case-copy"><h3>Восстановление блеска</h3><p>Демонстрация типовой задачи: от матовой поверхности к более ровному и выразительному виду.</p></div>
        </article>
        <article class="visual-case">
          <div class="compare-media">
            <div class="compare-half"><img src="${assets.rust}" alt="Демонстрационный след ржавчины на мраморе"><span>До</span></div>
            <div class="compare-half"><img src="${assets.dull}" alt="Демонстрационная чистая мраморная поверхность"><span>После</span></div>
            <i aria-hidden="true">↔</i>
          </div>
          <div class="visual-case-copy"><h3>Удаление ржавчины</h3><p>Пример визуального результата после локальной восстановительной обработки поверхности.</p></div>
        </article>
        <article class="visual-case">
          <div class="compare-media">
            <div class="compare-half"><img src="${assets.chip}" alt="Демонстрационный скол на мраморной кромке"><span>До</span></div>
            <div class="compare-half"><img src="${assets.expert}" alt="Демонстрационная обработанная мраморная поверхность"><span>После</span></div>
            <i aria-hidden="true">↔</i>
          </div>
          <div class="visual-case-copy"><h3>Локальное восстановление</h3><p>Ремонт повреждённого участка с последующей обработкой и выравниванием внешнего вида.</p></div>
        </article>`;

      caseGrid.querySelectorAll('img').forEach((img) => {
        img.removeAttribute('loading');
        img.loading = 'eager';
        img.decoding = 'async';
        img.onerror = () => {
          img.onerror = null;
          img.src = '/assets/case-1.svg';
        };
      });
    }

    if (!document.querySelector('#marmevia-visual-refresh')) {
      const style = document.createElement('style');
      style.id = 'marmevia-visual-refresh';
      style.textContent = `
        .problem-art{height:150px!important;background-repeat:no-repeat!important;transition:transform .35s ease,filter .35s ease;filter:saturate(.88) contrast(.98)}
        .problem-grid article{box-shadow:0 12px 34px rgba(74,54,28,.045);transition:transform .25s ease,box-shadow .25s ease}
        .problem-grid article:hover{transform:translateY(-3px);box-shadow:0 18px 38px rgba(74,54,28,.08)}
        .problem-grid article:hover .problem-art{filter:saturate(.98) contrast(1)}
        .expert-grid>img,.master-grid>img{display:block!important;width:100%!important;filter:saturate(.82)!important;object-position:center;min-height:430px;background:#e9e1d6}
        #work{overflow:hidden}
        #work .case-grid.visual-cases{grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
        .visual-case{overflow:hidden;border:1px solid var(--line);border-radius:18px;background:var(--paper);box-shadow:0 16px 42px rgba(74,54,28,.055)}
        .compare-media{position:relative;display:grid;grid-template-columns:1fr 1fr;height:255px;background:#e8e0d5}
        .compare-half{position:relative;overflow:hidden;background:#e8e0d5}
        .compare-half:first-child{border-right:1px solid rgba(255,255,255,.9)}
        .compare-half img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;filter:saturate(.82);transform:scale(1.01);background:#e8e0d5}
        .compare-half span{position:absolute;bottom:12px;left:12px;padding:5px 10px;border-radius:999px;background:rgba(34,32,30,.78);color:#fff;font-size:11px;font-weight:700;backdrop-filter:blur(8px)}
        .compare-half:nth-child(2) span{left:auto;right:12px;background:rgba(201,164,106,.92);color:#fff}
        .compare-media>i{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:#fff;color:var(--gold2);font-style:normal;border:1px solid var(--line);box-shadow:0 6px 20px rgba(60,45,28,.12);z-index:2}
        .visual-case-copy{padding:20px 20px 22px}
        .visual-case-copy h3{font-family:var(--serif);font-size:26px;line-height:1.08;margin:0 0 8px}
        .visual-case-copy p{font-size:13px;line-height:1.55;color:var(--muted);margin:0}
        .estimate{position:relative;isolation:isolate}
        .estimate:before{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(250,247,242,.96),rgba(250,247,242,.88)),url('${assets.dull}') center/cover no-repeat;opacity:.58}
        @media(max-width:1020px){
          #work .case-grid.visual-cases{grid-template-columns:1fr 1fr}
          .visual-case:last-child{grid-column:1/-1;max-width:560px;width:100%;margin-inline:auto}
        }
        @media(max-width:720px){
          .hero{background:linear-gradient(180deg,rgba(30,27,23,.20),rgba(24,21,18,.72)),url('${assets.hero}') center 48%/cover no-repeat!important}
          .problem-art{height:118px!important}
          #work .case-grid.visual-cases{display:flex!important;gap:14px!important;overflow-x:auto!important;scroll-snap-type:x mandatory;padding:0 14px 12px;margin-inline:-14px;grid-template-columns:none!important}
          #work .visual-case{flex:0 0 88%;min-width:0;scroll-snap-align:center}
          #work .visual-case:last-child{max-width:none;margin:0}
          .compare-media{height:220px}
          .visual-case-copy{padding:17px}
          .visual-case-copy h3{font-size:24px}
          .expert-grid>img,.master-grid>img{min-height:0;aspect-ratio:4/3!important;object-fit:cover!important}
        }
      `;
      document.head.appendChild(style);
    }
  };

  // The script is injected at the end of <body>, so the DOM is already parsed.
  // Run immediately instead of waiting for DOMContentLoaded: this avoids a
  // WebKit/Safari lazy-image race where dynamically replaced images stay blank.
  if (document.body) run();
  else document.addEventListener('DOMContentLoaded', run, { once: true });
})();
