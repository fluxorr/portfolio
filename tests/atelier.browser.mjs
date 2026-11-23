async (page) => {
  const base = "http://localhost:6969";
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const check = (condition, label) => {
    if (!condition) throw new Error(label);
  };
  const visit = (name) => page.goto(`${base}/studies/${name}`);
  const button = (name) => page.getByRole("button", { name, exact: true });
  const text = (value) => page.getByText(value, { exact: false });
  const download = async (name) => {
    const event = page.waitForEvent("download");
    await button(name).click();
    const file = await event;
    const stream = await file.createReadStream();
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    return [file.suggestedFilename(), Buffer.concat(chunks)];
  };

  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.setViewportSize({ width: 1440, height: 880 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${base}/showcase#components`);
  check(
    (await page.locator(".atelier-entry-link").count()) === 5,
    "Five index links",
  );
  await page
    .getByRole("link", { name: "Inspect record · Palimpsest" })
    .press("Enter");
  await button("Inspect Origin").press("Space");
  await page.locator(".archive-checksum code").waitFor();
  const hash = await page.locator(".archive-checksum code").textContent();
  await button("Copy hash").click();
  check(
    (await page.evaluate(() => navigator.clipboard.readText())) === hash,
    "Copied actual digest",
  );
  await button("Inspect Revisions").click();
  await page.getByRole("button", { name: /v01/ }).press("Enter");
  await text("Drafted the baseline contours").waitFor();
  await button("Inspect Custody").click();
  await text("Unconfirmed").waitFor();

  await visit("isobar");
  await text("Live forecast from").waitFor({ timeout: 14000 });
  const city = page.getByRole("searchbox", { name: "Find a city" });
  await city.fill("Springfield");
  await text("matching cities").waitFor({ timeout: 12000 });
  check(
    (await page.locator(".isobar-results button").count()) >= 2,
    "Disambiguated locations",
  );
  await page.locator(".isobar-results button").first().click();
  await page
    .getByRole("heading", { name: "Springfield" })
    .waitFor({ timeout: 14000 });
  await page.getByRole("slider", { name: "Forecast hour" }).press("End");
  await text("Hour 48 / 48").waitFor();
  await button("Wind").click();
  await button("Use Fahrenheit and miles per hour").click();
  check(
    (await page.locator(".isobar-value").textContent()).includes("mph"),
    "Unit follows selected metric",
  );
  await page.getByLabel("Condition").selectOption("Low wind");
  await button("Find window ↗").click();
  await page.locator(".isobar-recommendation").waitFor();
  const abortForecast = (route) => route.abort();
  await page.route("https://api.open-meteo.com/v1/forecast?*", abortForecast);
  await page.goto(`${base}/studies/isobar?fixture=1`);
  await button("Load demo data").click();
  await text("Demo data · Berlin").waitFor();
  await page.unroute("https://api.open-meteo.com/v1/forecast?*", abortForecast);

  await visit("switchyard");
  await page.getByLabel("Task", { exact: true }).selectOption("classification");
  await page.getByRole("slider", { name: "Strategy bias" }).press("Home");
  await button("Off").click();
  await button("Run preview").click();
  await text("Route complete · policy ready").waitFor();
  const [policyName, policyBytes] = await download("Download JSON");
  const policy = JSON.parse(policyBytes.toString());
  check(
    policyName.endsWith(".json") &&
      policy.settings.strategy === 0 &&
      policy.stages[1].mode === "bypass" &&
      policy.stages[3].weight === 0,
    "Current routing policy exported",
  );

  await visit("figure-zero");
  await button("Guides").click();
  const radius = page.getByRole("spinbutton", {
    name: "Radius value",
    exact: true,
  });
  const startRadius = await radius.inputValue();
  const handle = page.locator(".figure-hit").first();
  const bounds = await handle.boundingBox();
  check(bounds, "SVG handle is visible");
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2 + 30,
    { steps: 6 },
  );
  await page.mouse.up();
  check(
    (await radius.inputValue()) !== startRadius,
    "Handle changes actual geometry",
  );
  await button("Undo").click();
  check(
    (await radius.inputValue()) === startRadius,
    "One undo restores the entire drag",
  );
  await button("Bloom").click();
  const [svgName, svg] = await download("Export SVG");
  check(
    svgName.endsWith(".svg") &&
      svg.toString().startsWith("<svg") &&
      !svg.toString().includes("guide"),
    "Exported mark excludes guides",
  );
  const [pngName, png] = await download("Export PNG ↗");
  check(
    pngName.endsWith(".png") &&
      png.toString("ascii", 1, 4) === "PNG" &&
      png.readInt32BE(16) === 1024 &&
      png.readInt32BE(20) === 1024 &&
      png[25] === 6,
    "Transparent 1024px PNG export",
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await visit("meridian");
  await text("All zones available").waitFor();
  const scroller = page.locator(".meridian-scroll");
  check(
    (await scroller.evaluate((node) => node.scrollLeft)) > 0,
    "Selected aperture stays visible on mobile",
  );
  const range = page.getByRole("slider", { name: "Meeting start in UTC" });
  await range.press("End");
  await text("Time conflict").waitFor();
  await button("Find next overlap ↗").click();
  await text("No matching window at or after this time").waitFor();
  await range.press("Home");
  await button("Find next overlap ↗").click();
  await text("All zones available").waitFor();
  const [icsName, ics] = await download("Download .ics");
  check(
    icsName.endsWith(".ics") &&
      ics.toString().includes("DTSTART:20261123T140000Z") &&
      ics.toString().includes("DTEND:20261123T143000Z"),
    "Calendar matches selected 30 minute interval",
  );
  await page.getByLabel("Meeting date in UTC").fill("2026-07-07");
  await page.locator(".meridian-times").getByText("UTC-4").waitFor();
  await text("Edit zones and work hours").click();
  await page
    .getByRole("searchbox", { name: "Search supported zones" })
    .fill("Tokyo");
  await button("Add zone +").click();
  await text("Asia/Tokyo").waitFor();
  await button("Remove Tokyo").click();

  for (const path of [
    "showcase",
    "palimpsest",
    "isobar",
    "switchyard",
    "figure-zero",
    "meridian",
  ]) {
    await page.setViewportSize({ width: 390, height: 525 });
    if (path === "showcase") await page.goto(`${base}/showcase#components`);
    else await visit(path);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    const width = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    check(width === 390, `Two-times text zoom overflow · ${path} · ${width}`);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  const protocol = await page.context().newCDPSession(page);
  await protocol.send("Emulation.setTouchEmulationEnabled", {
    enabled: true,
    maxTouchPoints: 1,
  });
  await visit("meridian");
  const aperture = page.locator(".meridian-aperture");
  await aperture.scrollIntoViewIfNeeded();
  const rect = await aperture.boundingBox();
  check(rect, "Mobile aperture is visible");
  const position = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  await protocol.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [position],
  });
  await protocol.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ ...position, x: position.x + 35 }],
  });
  await protocol.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  check(
    (await page
      .getByRole("slider", { name: "Meeting start in UTC" })
      .inputValue()) !== "56",
    "Touch drag moves the selected appointment",
  );
  await protocol.send("Emulation.setTouchEmulationEnabled", { enabled: false });
  check(errors.length === 0, errors.join("\n"));
  return "All five study interactions, real forecast lookup, fixture, clipboard, downloads, and 200% text zoom passed.";
};
