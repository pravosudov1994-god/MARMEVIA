(() => {
  const photos = {
    hero: '/assets/photo-hero.svg',
    expert: '/assets/photo-expert.svg',
    stain: '/assets/photo-stain.svg',
    rust: '/assets/photo-rust.svg',
    dull: '/assets/photo-dull.svg',
    scratch: '/assets/photo-scratch.svg',
    chip: '/assets/photo-chip.svg',
    crack: '/assets/photo-crack.svg',
    pit: '/assets/photo-pit.svg',
    chemical: '/assets/photo-chemical.svg'
  };

  function applyVisuals() {
    const style = document.createElement('style');
    style.textContent = `
      .hero-image{
        background-image:url('${photos.hero}') !important;
        background-size:cover !important;
        background-position:center 52% !important;
        filter:saturate(.9) contrast(.98);
      }
      .problem-grid article{overflow:hidden;background:#fffdf9}
      .problem-art{
        height:148px !important;
        background-size:cover !important;
        background-position:center !important;
        border-bottom:1px solid rgba(201,164,106,.18);
        filter:saturate(.82) contrast(.98);
      }
      .problem-grid article h3{margin-top:18px}
      .case img{
        width:100%;
        aspect-ratio:16/10;
        object-fit:cover;
        object-position:center;
        filter:saturate(.84) contrast(.98);
      }
      .case{overflow:hidden}
      .case::before{
        content:'Демонстрационный пример';
        position:absolute;
        top:14px;
        left:14px;
        z-index:2;
        padding:7px 10px;
        border-radius:999px;
        background:rgba(250,247,242,.9);
        border:1px solid rgba(201,164,106,.36);
        color:#6f5c3d;
        font-size:10px;
        letter-spacing:.08em;
        text-transform:uppercase;
        backdrop-filter:blur(8px);
      }
      .case{position:relative}
      .expert-grid img,
      .master-grid img{
        width:100%;
        height:100%;
        min-height:430px;
        object-fit:cover;
        object-position:center 46%;
        filter:saturate(.87) contrast(.98);
      }
      @media(max-width:760px){
        .hero{
          background:
            linear-gradient(180deg,rgba(250,247,242,.96) 0%,rgba(250,247,242,.9) 38%,rgba(250,247,242,.48) 100%),
            url('${photos.hero}') center 48%/cover no-repeat !important;
        }
        .problem-art{height:116px !important}
        .problem-grid article h3{margin-top:14px}
        .expert-grid img,.master-grid img{min-height:0;height:auto;aspect-ratio:4/3;object-position:center 40%}
        .case::before{top:10px;left:10px;font-size:9px;padding:6px 8px}
      }
    `;
    document.head.appendChild(style);

    const hero = document.querySelector('.hero-image');
    if (hero) hero.setAttribute('aria-label', 'Светлый премиальный интерьер с полированным мраморным полом и лестницей');

    Object.entries({
      stain: photos.stain,
      rust: photos.rust,
      dull: photos.dull,
      scratch: photos.scratch,
      chip: photos.chip,
      crack: photos.crack,
      pit: photos.pit,
      chemical: photos.chemical
    }).forEach(([name, src]) => {
      const el = document.querySelector(`.problem-art.${name}`);
      if (el) el.style.backgroundImage = `url('${src}')`;
    });

    const caseImages = document.querySelectorAll('.case img');
    const casePhotos = [photos.stain, photos.hero, photos.chip, photos.crack];
    const caseAlts = [
      'Демонстрационный пример загрязнения на светлом мраморе',
      'Демонстрационный пример восстановленного мраморного пола',
      'Демонстрационный пример скола на мраморной кромке',
      'Демонстрационный пример трещины на светлом мраморе'
    ];
    caseImages.forEach((img, index) => {
      if (!casePhotos[index]) return;
      img.src = casePhotos[index];
      img.alt = caseAlts[index];
      img.loading = 'lazy';
    });

    const expertImg = document.querySelector('.expert-grid > img');
    if (expertImg) {
      expertImg.src = photos.expert;
      expertImg.alt = 'Мастер выполняет профессиональную обработку мраморной поверхности';
    }

    const masterImg = document.querySelector('.master-grid > img');
    if (masterImg) {
      masterImg.src = photos.expert;
      masterImg.alt = 'Мастер MARMEVIA за работой с мраморной поверхностью';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyVisuals, { once: true });
  } else {
    applyVisuals();
  }
})();
