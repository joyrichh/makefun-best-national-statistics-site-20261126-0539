const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const number = (value, digits = 2) => new Intl.NumberFormat('id-ID', { maximumFractionDigits: digits }).format(value);
const svg = (width, height, title, content) => `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escape(title)}"><title>${escape(title)}</title>${content}</svg>`;

export function lineChart(series, options = {}) {
  const width = options.width ?? 650;
  const height = options.height ?? 230;
  const margin = { left: 44, right: 35, top: 30, bottom: 32 };
  const points = series.flatMap((item) => item.points).filter((point) => Number.isFinite(point.value));
  if (!points.length) return '';
  const years = [...new Set(points.map((point) => point.year))].sort((first, second) => first - second);
  const values = points.map((point) => point.value);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const padding = Math.max((rawMax - rawMin) * 0.18, 0.6);
  const minimum = options.min ?? Math.floor(rawMin - padding);
  const maximum = options.max ?? Math.ceil(rawMax + padding);
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const x = (year) => margin.left + (year - years[0]) / (years.at(-1) - years[0] || 1) * plotWidth;
  const y = (value) => margin.top + (maximum - value) / (maximum - minimum || 1) * plotHeight;
  const format = options.format ?? ((value) => number(value));
  let content = '';
  for (let tick = 0; tick <= 4; tick += 1) {
    const value = minimum + (maximum - minimum) * tick / 4;
    const position = y(value);
    content += `<line x1="${margin.left}" y1="${position}" x2="${width - margin.right}" y2="${position}" stroke="${Math.abs(value) < 0.001 ? '#A9BAB2' : '#E5E9E1'}" stroke-dasharray="${Math.abs(value) < 0.001 ? '0' : '3 5'}"/><text x="${margin.left - 10}" y="${position + 4}" text-anchor="end" class="axis-label">${escape(number(value, 1))}${escape(options.suffix ?? '')}</text>`;
  }
  for (const year of years) content += `<text x="${x(year)}" y="${height - 7}" text-anchor="middle" class="axis-label">${year}</text>`;
  for (const [index, item] of series.entries()) {
    const valid = item.points.filter((point) => Number.isFinite(point.value)).sort((first, second) => first.year - second.year);
    if (!valid.length) continue;
    const coordinates = valid.map((point) => `${x(point.year)},${y(point.value)}`).join(' ');
    const color = item.color ?? '#0B3D3A';
    if (options.area && series.length === 1) content += `<polygon points="${x(valid[0].year)},${y(minimum)} ${coordinates} ${x(valid.at(-1).year)},${y(minimum)}" fill="${escape(color)}" opacity="0.055"/>`;
    content += `<polyline points="${coordinates}" fill="none" stroke="${escape(color)}" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>`;
    for (const point of valid) {
      const offset = item.labelOffset ?? (index === 0 ? -13 : 23);
      content += `<circle cx="${x(point.year)}" cy="${y(point.value)}" r="4.2" fill="#FFFFFF" stroke="${escape(color)}" stroke-width="2.5"><title>${escape(item.name)} · ${point.year}: ${escape(format(point.value))}${escape(options.suffix ?? '')}</title></circle><text x="${x(point.year)}" y="${y(point.value) + offset}" text-anchor="middle" class="point-label" fill="${escape(color)}">${escape(format(point.value))}</text>`;
    }
  }
  return svg(width, height, options.title ?? series.map((item) => item.name).join(', '), content);
}

export function barChart(items, options = {}) {
  const width = options.width ?? 500;
  const rowHeight = options.rowHeight ?? 36;
  const labelWidth = options.labelWidth ?? 132;
  const right = options.right ?? 58;
  const top = 12;
  const height = items.length * rowHeight + top + 28;
  const maximum = options.max ?? Math.max(...items.map((item) => item.value), 1) * 1.04;
  const plotWidth = width - labelWidth - right;
  const format = options.format ?? ((value) => number(value));
  let content = `<line x1="${labelWidth}" y1="2" x2="${labelWidth}" y2="${height - 23}" stroke="#CCD6CC"/>`;
  for (const [index, item] of items.entries()) {
    const position = top + index * rowHeight;
    const barWidth = Math.max(0, item.value) / maximum * plotWidth;
    content += `<text x="${labelWidth - 12}" y="${position + 14}" text-anchor="end" class="bar-label">${escape(item.label)}</text><rect x="${labelWidth}" y="${position}" width="${plotWidth}" height="21" rx="3" fill="#F0F3EC"/><rect x="${labelWidth}" y="${position}" width="${barWidth}" height="21" rx="3" fill="${escape(item.color ?? options.color ?? '#0B3D3A')}"><title>${escape(item.label)}: ${escape(format(item.value))}</title></rect><text x="${labelWidth + barWidth + 8}" y="${position + 15}" class="bar-value">${escape(format(item.value))}</text>`;
  }
  content += `<text x="${labelWidth}" y="${height - 3}" class="axis-label">0</text><text x="${width - right}" y="${height - 3}" text-anchor="end" class="axis-label">${escape(options.unit ?? '')}</text>`;
  return svg(width, height, options.title ?? 'Grafik batang', content);
}

export function donutChart(parts, options = {}) {
  const width = options.width ?? 210;
  const height = options.height ?? 210;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;
  const circumference = Math.PI * 2 * radius;
  const total = parts.reduce((sum, part) => sum + part.value, 0);
  let offset = 0;
  let content = '';
  for (const part of parts) {
    const length = total ? part.value / total * circumference : 0;
    content += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="none" stroke="${escape(part.color ?? '#0B3D3A')}" stroke-width="27" stroke-dasharray="${Math.max(0, length - 2)} ${circumference}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${centerX} ${centerY})"><title>${escape(part.label)}: ${escape(number(part.value))}%</title></circle>`;
    offset += length;
  }
  content += `<text x="${centerX}" y="${centerY - 2}" text-anchor="middle" class="donut-main">${escape(options.centerText ?? '')}</text><text x="${centerX}" y="${centerY + 19}" text-anchor="middle" class="axis-label">${escape(options.centerSubtext ?? '')}</text>`;
  return svg(width, height, options.title ?? 'Komposisi dalam persen', content);
}
