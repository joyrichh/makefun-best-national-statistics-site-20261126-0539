import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { readAppTree, htmlFacts, firstLoadOf, sourceUrls } from '../vendor/makefun-frontend.ts';
import * as data from '../app/data.js';
import * as charts from '../app/charts.js';
import * as views from '../app/views.js';

const directory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
let checks = 0;
const verify = (condition, message) => { assert.ok(condition, message); checks += 1; };
const equal = (actual, expected, message) => { assert.deepEqual(actual, expected, message); checks += 1; };

class Element {
  constructor(dataset = {}) {
    this.dataset = dataset;
    this.innerHTML = '';
    this.textContent = '';
    this.value = '';
    this.attributes = {};
    this.listeners = {};
    this.focused = false;
  }
  setAttribute(key, value) { this.attributes[key] = value; }
  removeAttribute(key) { delete this.attributes[key]; }
  addEventListener(name, listener) { this.listeners[name] = listener; }
  focus() { this.focused = true; }
  querySelector() { return new Element(); }
  querySelectorAll() { return sortHeadings; }
  closest(selector) {
    const key = selector.match(/^\[data-([a-z]+)\]$/)?.[1];
    return key && Object.hasOwn(this.dataset, key) ? this : null;
  }
}
const routeNames = ['/', '/population', '/economy', '/health-education', '/regions', '/sources'];
const sortKeys = ['name', 'population', 'share', 'grdpPerCapita', 'ipm'];
const sortHeadings = sortKeys.map((key) => new Element({ sortHeading: key }));
const links = routeNames.map((route) => new Element({ route }));
const root = new Element();
const elements = new Map([['app', root]]);
const skip = new Element();
const windowListeners = {};
globalThis.document = {
  title: '',
  getElementById(id) { if (!elements.has(id)) elements.set(id, new Element()); return elements.get(id); },
  querySelector() { return skip; },
  querySelectorAll() { return links; },
};
globalThis.window = {
  innerWidth: 1280, location: { hash: '#/' }, scrollTo() {},
  addEventListener(name, listener) { windowListeners[name] = listener; },
};

const { state, calculateDerived } = await import('../app/main.js');
const visit = (path) => { window.location.hash = '#' + path; windowListeners.hashchange(); };
const click = (dataset) => root.listeners.click({ target: new Element(dataset) });
const selectProvince = (index, value) => {
  const picker = new Element({ compare: String(index) });
  picker.value = value;
  root.listeners.change({ target: picker });
};
const context = () => ({ data, charts, state, derived: calculateDerived(), compact: window.innerWidth < 600 });

equal(readFileSync(resolve(directory, 'prompt.txt')), Buffer.from('garap bounty ini sampai jadi yang terbaik\n'), 'Exact prompt contents');
equal(statSync(resolve(directory, 'prompt.txt')).size, 42, 'Exact prompt byte count');
equal(readFileSync(resolve(directory, '.gitignore'), 'utf8'), 'out/\nout1/\nout2/\n', 'Exact ignore file');
equal(readFileSync(resolve(directory, '.makefun/owner.json'), 'utf8'), '{"wallet":"3jcYvH5x8TXgGK4W4Qpx7FHrjYJJAEUn7uCw775hWMmx"}\n', 'Exact wallet metadata');
equal(createHash('sha256').update(readFileSync(resolve(directory, 'vendor/makefun-frontend.ts'))).digest('hex'), '4c8da1c8e76490b3a847670f49137d3ec23953e3c988fe6a6cb320fce5739240', 'Unmodified vendor');

equal(data.POPULATION.map((item) => item.year), [2020, 2022, 2023, 2024], 'No invented population point');
equal(data.POPULATION.map((item) => item.value), [270203900, 275773800, 278696200, 281603800], 'Exact population values');
equal(data.ECONOMY.map((item) => item.growth), [-2.07, 3.70, 5.31, 5.05, 5.03], 'Exact growth values');
equal(data.ECONOMY.slice(1).map((item) => item.inflation), [1.87, 5.51, 2.61, 1.57], 'Exact inflation values');
equal(data.ECONOMY.slice(1).map((item) => item.unemployment), [6.49, 5.86, 5.32, 4.91], 'Exact TPT values');
verify(!Object.hasOwn(data.ECONOMY[0], 'inflation') && !Object.hasOwn(data.ECONOMY[0], 'unemployment'), 'Missing 2020 indicators omitted');
equal(data.HDI.map((item) => item.value), [72.81, 73.77, 74.39, 75.02], 'Exact IPM values');
equal(data.HDI.map((item) => item.year), [2020, 2022, 2023, 2024], 'No invented IPM point');
equal(data.PROVINCES.length, 21, 'Province coverage');
equal(data.COUNTRY, { name: 'Indonesia', provinces: 38, landArea: 1890179.78, islands: 17380, population: 281603800 }, 'Exact national geography and population');
equal(data.ECONOMIC_FACTS, { year: 2024, gdpTrillion: 22139.0, gdpPerCapitaMillion: 78.6, gdpPerCapitaUSD: 4960.3, unemploymentFebruary: 4.82, workingAgeMillion: 215.37, labourForceMillion: 152.1 }, 'Exact national economy facts');
equal(data.POVERTY, { year: 2024, march: { rate: 9.03, peopleMillion: 25.22 }, september: { rate: 8.57, peopleMillion: 24.06, urban: 6.66, rural: 11.34, line: 595242 } }, 'Exact poverty facts and periods');
equal(data.HUMAN_DEVELOPMENT, { year: 2024, lifeExpectancy: 74.15, expectedSchooling: 13.21, meanSchooling: 8.85, expenditureMillion: 12.34, literacy: { overall: 96.67, male: 97.69, female: 95.66 } }, 'Exact human development and literacy facts');
equal(data.AGE_STRUCTURE.groups.map((group) => group.value), [23.44, 68.94, 7.62], 'Exact SUPAS age shares');
equal(data.AGE_STRUCTURE.dependencyRatio, 45.05, 'Exact dependency ratio');
equal(data.GENERATIONS.map((generation) => generation.value), [24.93, 24.34, 19.70, 19.65, 10.31, 1.07], 'Exact generation shares');
equal(data.PROVINCES.map((province) => [province.name, province.population, province.grdpPerCapita, province.ipm]), [
  ['Jawa Barat', 50345200, 56.082, 74.92], ['Jawa Timur', 41814500, 75.770, 75.35],
  ['Jawa Tengah', 37892300, 47.970, 73.87], ['Sumatera Utara', 15588500, 73.575, 75.76],
  ['Banten', 12431400, 70.276, 76.35], ['DKI Jakarta', 10684900, 344.383, 84.15],
  ['Sulawesi Selatan', 9463400, 73.573, 75.18], ['Lampung', 9419600, 51.387, 73.13],
  ['Sumatera Selatan', 8837300, 75.132, 73.84], ['Riau', 6728100, 165.350, 75.67],
  ['Sumatera Barat', 5836200, 57.083, 76.43], ['Kalimantan Barat', 5695500, 52.703, 71.19],
  ['Aceh', 5554800, 43.782, 75.36], ['Bali', 4433300, 67.318, 78.63],
  ['Kalimantan Selatan', 4273400, 67.122, 75.19], ['Kalimantan Timur', 4045900, 212.117, 78.79],
  ['DI Yogyakarta', 3759500, 51.486, 81.62], ['Jambi', 3724300, 86.775, 74.36],
  ['Sulawesi Tengah', 3121800, 120.750, 72.24], ['Kalimantan Tengah', 2809700, 79.320, 74.28],
  ['Papua', 1060000, 81.009, 68.86],
], 'Every supplied provincial figure matches exactly');
equal(new Set(data.PROVINCES.map((item) => item.name)).size, data.PROVINCES.length, 'Unique provinces');
equal(data.PROVINCES.find((item) => item.name === 'Papua').population, 1060000, 'Post-split Papua population');
equal(data.SOURCES.length, 10, 'Source registry');
for (const item of data.SOURCES) verify(item.publisher === 'BPS — Statistics Indonesia' && item.year && item.publication && item.indicator, 'Complete BPS source');

const derived = calculateDerived();
equal(derived.provinceTotal, data.PROVINCES.reduce((sum, province) => sum + province.population, 0), 'Total computed from data');
equal(derived.coverage, derived.provinceTotal / data.COUNTRY.population * 100, 'Correct national denominator');
for (const province of derived.provinces) equal(province.share, province.population / data.COUNTRY.population * 100, `Share: ${province.name}`);

function verifyMarkup(markup, label) {
  const stack = [];
  const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
  for (const match of markup.matchAll(/<\/?([a-z][\w:-]*)\b[^>]*>/gi)) {
    const tag = match[1].toLowerCase();
    if (/^<\//.test(match[0])) equal(stack.pop(), tag, `${label}: balanced ${tag}`);
    else if (!voidTags.has(tag) && !/\/\s*>$/.test(match[0])) stack.push(tag);
  }
  equal(stack, [], `${label}: all tags closed`);
  for (const match of markup.matchAll(/href="([^"]+)"/g)) verify(routeNames.some((path) => match[1] === '#' + path), `${label}: link resolves to a real route`);
}

for (const width of [1280, 390]) {
  window.innerWidth = width;
  for (const path of routeNames) {
    visit(path);
    verify(root.innerHTML.length > 2000, `${path} renders at ${width}px`);
    equal((root.innerHTML.match(/<h1[ >]/g) ?? []).length, 1, `${path} has one main heading`);
    verifyMarkup(root.innerHTML, `${path} at ${width}px`);
    verify(!root.innerHTML.includes('undefined') && !root.innerHTML.includes('NaN'), `${path} has no invalid values`);
    verify(!/lorem ipsum|placeholder text|coming soon/i.test(root.innerHTML), `${path} has no filler`);
    equal(links.filter((link) => link.attributes['aria-current'] === 'page').length, 1, 'Exactly one active navigation link');
    verify(document.title.includes('NusaData'), 'Route document title');
    for (const chart of root.innerHTML.matchAll(/<svg\b[^>]*class="chart"[\s\S]*?<\/svg>/g)) {
      verify(chart[0].includes('role="img"') && chart[0].includes('<title>'), 'Chart accessible title');
    }
  }
}

window.innerWidth = 1280;
visit('/economy');
for (const row of data.ECONOMY) {
  click({ year: String(row.year) });
  equal(state.year, row.year, 'Year handler updates state');
  verify(root.innerHTML.includes(`data-year="${row.year}" aria-pressed="true"`), 'Year selector pressed state');
  verify(root.innerHTML.includes(views.formatNumber(row.growth)), 'Selected growth displayed');
  equal((root.innerHTML.match(/class="metric-card"/g) ?? []).length, row.year === 2020 ? 1 : 3, 'No unavailable-year indicator cards');
  for (const indicator of ['growth', 'inflation', 'both']) {
    click({ indicator });
    equal(state.economyIndicator, indicator, 'Indicator handler updates state');
    verify(root.innerHTML.includes(`data-indicator="${indicator}" aria-pressed="true"`), 'Chart selector pressed state');
    const seriesCount = indicator === 'both' ? 2 : 1;
    equal((root.innerHTML.match(/<polyline/g) ?? []).length, seriesCount, 'Indicator selection changes rendered series');
  }
}
click({ year: '1900' });
equal(state.year, 2024, 'Invalid year ignored');
click({ indicator: 'not-a-series' });
equal(state.economyIndicator, 'both', 'Invalid indicator ignored');

visit('/regions');
for (const key of sortKeys) {
  click({ sort: key });
  const firstDirection = state.sort.direction;
  for (let iteration = 0; iteration < 2; iteration += 1) {
    const rows = calculateDerived().visibleProvinces;
    const sign = state.sort.direction === 'asc' ? 1 : -1;
    for (let index = 1; index < rows.length; index += 1) {
      const difference = key === 'name' ? rows[index].name.localeCompare(rows[index - 1].name, 'id') : rows[index][key] - rows[index - 1][key];
      verify(difference * sign >= 0, `${key} sorts ${state.sort.direction}`);
    }
    click({ sort: key });
  }
  equal(state.sort.direction, firstDirection, 'Two clicks restore direction');
}
for (const [query, expected] of [['JAWA', 3], ['  bali  ', 1], ['Kalimantan', 4], ['', 21], ['<script>', 0], ['xyz-tidak-ada', 0]]) {
  root.listeners.input({ target: { id: 'province-search', value: query } });
  equal(calculateDerived().visibleProvinces.length, expected, `Live search: ${query}`);
  verify(document.getElementById('result-count').textContent.startsWith(`${expected} dari`), 'Live result count');
  if (!expected) verify(document.getElementById('province-rows').innerHTML.includes('Tidak ada provinsi'), 'Useful empty search feedback');
}
root.listeners.input({ target: { id: 'province-search', value: '' } });
for (const first of data.PROVINCES) {
  for (const second of data.PROVINCES) {
    if (first.name === second.name) continue;
    selectProvince(0, first.name);
    selectProvince(1, second.name);
    equal(state.compare, [first.name, second.name], 'Every pair selectable');
    const output = document.getElementById('comparison-result').innerHTML;
    verify(output.includes(first.name) && output.includes(second.name), 'Both provinces rendered');
    equal((output.match(/class="comparison-row"/g) ?? []).length, 6, 'Both provinces have all three comparison metrics');
    verify(!output.includes('NaN') && !output.includes('undefined'), 'Comparison contains real values');
  }
}
const previousFirst = state.compare[0];
selectProvince(0, state.compare[1]);
equal(state.compare[1], previousFirst, 'Duplicate choice swaps instead of comparing identical provinces');
verify(state.compare[0] !== state.compare[1], 'Comparison remains distinct');

for (const [name, render] of Object.entries(views).filter(([key]) => /^render(Overview|Population|Economy|HealthEducation|Regions|Sources)$/.test(key))) {
  const output = render(context());
  equal(render(context()), output, `${name} is deterministic`);
}
const chartInputs = [{ name: 'Uji', color: '#0B3D3A', points: [{ year: 2020, value: -2.07 }, { year: 2024, value: 5.03 }] }];
const snapshot = JSON.stringify(chartInputs);
equal(charts.lineChart(chartInputs), charts.lineChart(chartInputs), 'Line chart is deterministic');
equal(JSON.stringify(chartInputs), snapshot, 'Charts do not mutate source data');
verify(charts.barChart([{ label: '<script>', value: 1 }]).includes('&lt;script&gt;'), 'SVG labels are escaped');
verify(charts.donutChart(data.GENERATIONS).includes('stroke-dasharray'), 'Native SVG generation chart');

for (const file of readdirSync(resolve(directory, 'app'))) {
  const contents = readFileSync(resolve(directory, 'app', file), 'utf8');
  verify(!/https?:\/\//i.test(contents), `No external URL in ${file}`);
  verify(!/\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|@import|@font-face/.test(contents), `No network API or external fonts in ${file}`);
  for (const match of contents.matchAll(/(?:from\s*|import\s*)['"](\.\.?\/[^'"]+)['"]/g)) {
    verify(statSync(resolve(directory, 'app', match[1])).isFile(), `Local module exists: ${match[1]}`);
  }
}
const index = readFileSync(resolve(directory, 'app/index.html'), 'utf8');
const css = readFileSync(resolve(directory, 'app/style.css'), 'utf8');
let braceDepth = 0;
for (const character of css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/"[^"\n]*"|'[^'\n]*'/g, '')) {
  if (character === '{') braceDepth += 1;
  if (character === '}') braceDepth -= 1;
  assert.ok(braceDepth >= 0, 'CSS does not close an unopened block');
}
equal(braceDepth, 0, 'All CSS rule and media blocks are balanced');
for (const match of index.matchAll(/(?:src|href)="([^"#][^"]*)"/g)) {
  if (match[1].startsWith('data:')) continue;
  verify(statSync(resolve(directory, 'app', match[1])).isFile(), `Shell resource exists: ${match[1]}`);
}
for (const path of routeNames) verify(index.includes(`href="#${path}"`), `Shell links to ${path}`);
const shots = JSON.parse(readFileSync(resolve(directory, 'shots.json'), 'utf8'));
equal(shots.length, 4, 'Four planned screenshots');
equal(shots.at(-1).viewport, { width: 390, height: 844 }, 'Phone viewport');
visit('/unknown');
verify(root.innerHTML.includes('HALAMAN TIDAK DITEMUKAN') && root.innerHTML.includes('href="#/"'), 'Unknown route has recovery link');
let prevented = false;
skip.listeners.click({ preventDefault() { prevented = true; } });
verify(prevented && root.focused, 'Skip link focuses main without breaking route');

const appDirectory = resolve(directory, 'app');
const tree = readAppTree(appDirectory, { app_max_files: 993, app_max_bytes: 16777216 });
const load = firstLoadOf(tree, htmlFacts(index), (path) => readFileSync(resolve(appDirectory, path), 'utf8'));
equal(load.missing, [], 'Kit first-load scan: no missing resources');
equal(load.laterMissing, [], 'Kit later-load scan: no missing resources');
equal(load.computed, [], 'No opaque dynamic imports');
equal(load.paths.length, 6, 'Only six local files on first load');
equal(sourceUrls(tree.files.map((file) => ({ path: file.path, bytes: readFileSync(resolve(appDirectory, file.path)) }))), [], 'Kit URL scanner: no external origins');
const firstLoadBytes = load.paths.reduce((sum, path) => sum + statSync(resolve(appDirectory, path)).size, 0);
const firstLoadGzip = load.paths.reduce((sum, path) => sum + gzipSync(readFileSync(resolve(appDirectory, path)), { level: 9 }).length, 0);

console.log(`PASS — ${checks} offline checks; six routes; all years and chart selectors; ten sort directions; live searches; all 420 distinct ordered province pairs.`);
console.log(`Kit app caps and reference scan pass: ${tree.count} app files, ${firstLoadBytes} first-load bytes, ${firstLoadGzip} gzip bytes; no missing references or external URLs.`);
console.log('Browser rendering and browser console checks require a permitted localhost socket and Chromium.');
