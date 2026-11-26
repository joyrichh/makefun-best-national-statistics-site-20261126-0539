# NusaData — Statistik Indonesia

[![Competition](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![Rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/joyrichh/makefun-best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/leaderboard/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![Reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/joyrichh/makefun-best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/leaderboard/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

An independent, Indonesian-language national statistics explorer. Original NusaData branding, a deep-teal and amber visual system, and locally generated accessible SVG charts bring Indonesia's published BPS figures into focus. Not an official BPS product.

Built for [Make the best national statistics site](https://make.fun/bounty/best-national-statistics-site-20261126-0539). No repository creation or competition submission is performed by this program.

## Run locally

Requires Node.js 22.18 or newer. No dependencies, package installation, bundling, or build step.

```sh
node serve.ts
```

Open `http://localhost:8080`. Optionally use `node serve.ts --port 8090`. Serving these ES modules from a local static server is required; browser security restrictions on `file:` module imports vary. The website makes no external requests: HTML, CSS, JavaScript, data, and graphics are all inside `app/`. Fonts use only the system stack. README badges are external and are deliberately not part of the offline app.

## Explore

| Route | Contents and controls |
| --- | --- |
| `#/` | National headline indicators, population trend, largest provinces, changes in context |
| `#/population` | SUPAS 2025 age structure and generations, verified population trend, provincial population |
| `#/economy` | Working 2020–2024 year selector, chart indicator selector, growth/inflation, nominal GDP, poverty and employment |
| `#/health-education` | IPM and four components, IPM trend, literacy by sex |
| `#/regions` | Live province search, reversible sorting on all five columns, any-two-provinces comparison |
| `#/sources` | BPS publications, reference years, indicator definitions, survey names, caveats |

## Data and integrity

All base figures are the BPS-published values supplied in this competition brief, transcribed into `app/data.js`. The primary reference year is **2024**; age and generation structure explicitly use **SUPAS 2025**.

- **Population:** BPS, Proyeksi Penduduk (2020, 2022–2024); provincial mid-year estimates from Statistik Indonesia 2025, Proyeksi Penduduk Interim.
- **Economy:** BPS, Berita Resmi Statistik — Pertumbuhan Ekonomi Indonesia (2020–2024); Indeks Harga Konsumen, December year-on-year (2021–2024).
- **Employment:** BPS, Sakernas, August (2021–2024); February 2024 is identified separately.
- **Poverty:** BPS, Susenas / Profil Kemiskinan di Indonesia, March and September 2024.
- **Human development:** BPS, Indeks Pembangunan Manusia 2024; literacy: Statistik Pendidikan / Susenas, 2024.
- **Age and generations:** BPS, Survei Penduduk Antar Sensus (SUPAS) 2025.
- **Regional GDP per capita:** BPS, PDRB Provinsi menurut Industri 2021–2025, Table 3, 2024 current-price values in million rupiah per person per year.

The regional dataset covers **21 of 38 provinces**, not all provinces. Papua uses its post-2022 boundaries. Provincial shares divide by the published national population, not the sum of the listed provinces. Totals, shares, differences, and combined shares are computed from the source arrays at render time. Missing 2021 population/IPM and 2020 inflation/unemployment values are omitted, never filled or interpolated. Lines connect verified points only. GDP bars show only the verified nominal value for 2024. Display rounding does not affect sorting or calculations.

## Package the entry

After the four real browser screenshots exist in `screenshots/`:

```sh
mkdir -p out1 out2
MAKEFUN_OUTPUT_DIR=out1 node main.ts
MAKEFUN_OUTPUT_DIR=out2 node main.ts
diff -r out1 out2
```

`main.ts` copies `app/` and `screenshots/` and generates `dossier.json` through the unmodified kit vendor. The default destination is `/output`; `MAKEFUN_OUTPUT_DIR` overrides it. No clock, randomness, remote resource, or dependency installation is used. Packaging requires actual screenshots and intentionally does not manufacture substitutes.

The vendor SHA-256 must remain `4c8da1c8e76490b3a847670f49137d3ec23953e3c988fe6a6cb320fce5739240`. Limits: 163,840 dossier source-text bytes; 4 screenshots, each at most 262,144 bytes; 993 app entries; 16,777,216 app bytes.

## Verification

`node tests/verify.mjs` runs offline data, SVG, route, and control-handler checks using only Node's standard library. It also verifies local resource references, vendor integrity, exact metadata files, and the required missing-data behavior. It does not replace browser rendering or visual inspection.

`shots.json` records the required desktop and phone viewports. See `screenshots/` for actual renders; if the sandbox refuses a listening socket or Chromium, the parent session must capture them before packaging. No screenshots are faked.

## Session handoff

The site was built fresh in the post-opening session and revised after its first offline test run. All six routes and their control handlers pass the included offline tests, as do the kit helper's app limits and first-load reference scan. The app has six first-load local files and no remote origins.

**Browser capture is pending:** this session's sandbox rejected `127.0.0.1:8080` with `listen EPERM`. The screenshot step was stopped as instructed, without attempting to bypass the sandbox or fabricate images. `screenshots/` is intentionally empty. The parent session must supply the four real JPEG renders in `shots.json`, check the real browser console and layout, then run the two packaging commands and `diff` above. Packaging/diff and the full screenshot gate have not yet been run, because they require those real images.

## License

MIT · Copyright (c) 2026 joyrichh. The required kit helper is included verbatim.
