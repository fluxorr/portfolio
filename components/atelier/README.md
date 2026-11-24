# Atelier / 05

[Showcase → Components](http://localhost:6969/showcase#components) features Palimpsest, Glass folder, Liquid glass checkout, Image accordion, and Signature approval. This document also describes the earlier standalone Atelier routes, which are available by direct URL.

Run `bun install` and `bun run dev:next` from the portfolio. The studies are available at `/studies/<slug>`. Run `bun test tests/atelier.test.ts` for calculation and asset checks, and `bun run build` for the production check.

The Playwright CLI runs the browser scenarios against the dev server. Start an isolated Chromium session, then pass the test function without its final formatting semicolon.

```sh
playwright-cli -s=atelier-tests open http://localhost:6969/showcase#components
playwright-cli -s=atelier-tests run-code "$(sed '$s/;[[:space:]]*$//' tests/atelier.browser.mjs)"
```

Each tool imports its scoped CSS. The study layout exposes Instrument Serif and Geist Mono through `atelierFonts` in `lib/atelier/fonts.ts`. For an independent embed, supply those variables or retain its serif and monospace fallbacks. Theme variables are scoped to each tool root.

## Palimpsest · `/studies/palimpsest`

`Palimpsest` accepts an optional `AssetRecord` and callbacks for stage changes, revision selection, copying a digest, and following a source link. Choose an evidence stage through the engraving or the stage buttons, then choose a dated revision. The original Asterion Register and Tidal Index SVGs are bundled in `public/studies`. The sample digest is checked against the supplied artwork. Theme the cabinet through the `--archive-*` variables in `palimpsest.css`.

## Isobar · `/studies/isobar`

`Isobar` accepts an initial city or an explicit forecast fixture and calls `onHourChange` with a Unix timestamp. Search worldwide with Open-Meteo, select a metric, and use the ruler or slider. Arrow keys move one physical hour, while Home and End go to the horizon bounds. Search and live forecast requests require network access. The demo forecast is explicitly labeled and available after a live request fails. The glyph field uses embedded SVG text and needs no separate image asset. Theme it through `--weather-*` in `isobar.css`.

## Switchyard · `/studies/switchyard`

`Switchyard` accepts initial routing settings and publishes changes through `onPolicyChange`. The strategy control supports drag, tap, and native slider keys. Run preview animates the locally derived route. JSON contains the inputs, normalized stage allocation, and illustrative indices. The SVG chassis comes from that policy and needs no external assets. Theme the instrument through `--route-*` in `switchyard.css`.

## Figure / Zero · `/studies/figure-zero`

`FigureZero` accepts an initial shape and an `onMarkChange` callback. Three shape families offer three presets each. Drag the radius or rotation handle, or use the labeled range and numeric controls. The editor supports undo and redo buttons plus scoped keyboard shortcuts. SVG and transparent PNG exports contain the mark only. All geometry is generated from the current parameters. Theme the workbench through `--draft-*` in `figure-zero.css`.

## Meridian · `/studies/meridian`

`Meridian` accepts an initial UTC date and a list of participants with IANA zones and local work hours. `onSelection` receives the start instant and duration. Drag the aperture, use Earlier and Later, or use the keyboard range input. Two to five zones can contribute to the overlap. The browser’s IANA time-zone rules supply local offsets. Copy details or download a UTC calendar file. Theme the chart through `--time-*` in `meridian.css`.
