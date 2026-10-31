(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  if (toggle && nav) {
    const closeMenu = () => { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      nav.classList.toggle('is-open', !isOpen);
    });
    nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); } });
  }
  const archive = document.querySelector('[data-archive]');
  if (!archive) return;
  const buttons = [...archive.querySelectorAll('[data-filter]')];
  const search = archive.querySelector('[data-search-input]');
  const entries = [...document.querySelectorAll('[data-entry]')];
  let category = 'all';
  const update = () => {
    const query = search.value.toLowerCase().trim();
    let count = 0;
    entries.forEach(entry => {
      const tags = entry.dataset.tags.split(' ');
      const matchesCategory = category === 'all' || (category === 'research' && tags.some(tag => ['code', 'study', 'writing', 'publication', 'research'].includes(tag))) || (category === 'life' && tags.some(tag => ['life', 'photo'].includes(tag)));
      const visible = matchesCategory && entry.dataset.search.includes(query);
      entry.hidden = !visible;
      if (visible) count++;
    });
    document.querySelector('[data-empty-state]').hidden = count > 0;
    document.querySelector('[data-results-status]').textContent = `${count} ${count === 1 ? 'note' : 'notes'} ${query || category !== 'all' ? 'found' : 'in the journal'}`;
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.filter;
    buttons.forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
    update();
  }));
  search.addEventListener('input', update);
})();
