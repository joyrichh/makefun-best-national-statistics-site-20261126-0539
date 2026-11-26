import * as data from './data.js';
import * as charts from './charts.js';
import * as views from './views.js';

export const state = {
  year: data.NATIONAL_YEAR,
  economyIndicator: 'both',
  search: '',
  sort: { key: 'population', direction: 'desc' },
  compare: ['Jawa Barat', 'DKI Jakarta'],
};

const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('id').trim();

export function calculateDerived() {
  const provinces = data.PROVINCES.map((province) => ({ ...province, share: province.population / data.COUNTRY.population * 100 }));
  const provinceTotal = provinces.reduce((sum, province) => sum + province.population, 0);
  const query = normalize(state.search);
  const visibleProvinces = provinces.filter((province) => normalize(province.name).includes(query));
  visibleProvinces.sort((first, second) => {
    const difference = state.sort.key === 'name'
      ? first.name.localeCompare(second.name, 'id')
      : first[state.sort.key] - second[state.sort.key];
    return (state.sort.direction === 'asc' ? difference : -difference) || first.name.localeCompare(second.name, 'id');
  });
  return {
    provinces, provinceTotal, visibleProvinces,
    coverage: provinceTotal / data.COUNTRY.population * 100,
    topProvinces: [...provinces].sort((first, second) => second.population - first.population),
    populationChange: data.POPULATION.at(-1).value - data.POPULATION.at(-2).value,
    hdiChange: data.HDI.at(-1).value - data.HDI.at(-2).value,
    povertyChange: data.POVERTY.march.rate - data.POVERTY.september.rate,
    unemploymentChange: data.ECONOMY.at(-2).unemployment - data.ECONOMY.at(-1).unemployment,
  };
}

const routes = {
  '/': { title: 'Ringkasan', render: views.renderOverview },
  '/population': { title: 'Penduduk', render: views.renderPopulation },
  '/economy': { title: 'Ekonomi', render: views.renderEconomy },
  '/health-education': { title: 'Kesehatan & Pendidikan', render: views.renderHealthEducation },
  '/regions': { title: 'Wilayah', render: views.renderRegions },
  '/sources': { title: 'Sumber & Metode', render: views.renderSources },
};
const root = document.getElementById('app');
const context = () => ({ data, charts, state, derived: calculateDerived(), compact: window.innerWidth < 600 });
const currentRoute = () => window.location.hash.startsWith('#/') ? window.location.hash.slice(1) : '/';

function render(resetScroll = false) {
  const path = currentRoute();
  const route = routes[path];
  root.innerHTML = route ? route.render(context()) : '<section class="not-found" id="main-content"><p class="eyebrow">HALAMAN TIDAK DITEMUKAN</p><h1>Kembali melihat gambaran besar.</h1><p>Alamat ini tidak tersedia. Seluruh data tetap dapat dijelajahi dari ringkasan.</p><a class="button-primary" href="#/">Ke ringkasan →</a></section>';
  document.title = path === '/' ? 'NusaData — Statistik Indonesia' : `${route?.title ?? 'Halaman tidak ditemukan'} — NusaData`;
  document.querySelectorAll('nav [data-route]').forEach((link) => {
    if (link.dataset.route === path) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  if (resetScroll) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    root.focus({ preventScroll: true });
  }
}

function updateRegions() {
  const derived = calculateDerived();
  document.getElementById('province-rows').innerHTML = views.renderProvinceRows(derived.visibleProvinces);
  document.getElementById('result-count').textContent = `${derived.visibleProvinces.length} dari ${data.PROVINCES.length} provinsi`;
  root.querySelectorAll('[data-sort-heading]').forEach((heading) => {
    const active = heading.dataset.sortHeading === state.sort.key;
    heading.setAttribute('aria-sort', active ? state.sort.direction === 'asc' ? 'ascending' : 'descending' : 'none');
    heading.querySelector('.sort-arrow').textContent = active ? state.sort.direction === 'asc' ? '↑' : '↓' : '↕';
  });
}

root.addEventListener('click', (event) => {
  const year = event.target.closest('[data-year]');
  if (year) {
    const value = Number(year.dataset.year);
    if (!data.ECONOMY.some((item) => item.year === value)) return;
    state.year = value;
    render();
    root.querySelector(`[data-year="${value}"]`)?.focus({ preventScroll: true });
    return;
  }
  const indicator = event.target.closest('[data-indicator]');
  if (indicator) {
    if (!['both', 'growth', 'inflation'].includes(indicator.dataset.indicator)) return;
    state.economyIndicator = indicator.dataset.indicator;
    render();
    root.querySelector(`[data-indicator="${state.economyIndicator}"]`)?.focus({ preventScroll: true });
    return;
  }
  const sort = event.target.closest('[data-sort]');
  if (sort) {
    const key = sort.dataset.sort;
    if (!['name', 'population', 'share', 'grdpPerCapita', 'ipm'].includes(key)) return;
    state.sort = { key, direction: state.sort.key === key ? state.sort.direction === 'desc' ? 'asc' : 'desc' : key === 'name' ? 'asc' : 'desc' };
    updateRegions();
  }
});

root.addEventListener('input', (event) => {
  if (event.target.id !== 'province-search') return;
  state.search = event.target.value;
  updateRegions();
});

root.addEventListener('change', (event) => {
  const picker = event.target.closest('[data-compare]');
  if (!picker || !data.PROVINCES.some((province) => province.name === picker.value)) return;
  const index = Number(picker.dataset.compare);
  if (index !== 0 && index !== 1) return;
  const previous = state.compare[index];
  const other = 1 - index;
  if (state.compare[other] === picker.value) state.compare[other] = previous;
  state.compare[index] = picker.value;
  state.compare.forEach((value, position) => { document.getElementById(`compare-${position}`).value = value; });
  document.getElementById('comparison-result').innerHTML = views.renderComparison(context());
});

document.querySelector('.skip-link').addEventListener('click', (event) => {
  event.preventDefault();
  root.focus();
});
window.addEventListener('hashchange', () => render(true));
let compact = window.innerWidth < 600;
window.addEventListener('resize', () => {
  const nextCompact = window.innerWidth < 600;
  if (nextCompact !== compact) {
    compact = nextCompact;
    render();
  }
});
render();
