import { readFileSync } from "node:fs";

const fixture = JSON.parse(
  readFileSync(new URL("./checkout-take.json", import.meta.url), "utf8"),
);
const timeout = Number(process.argv[2] ?? fixture.timeoutMs);

if (!Number.isInteger(timeout) || timeout < 100 || timeout > 3000) {
  process.stderr.write(
    "Usage: node emberlog-replay.mjs [timeout-ms from 100 to 3000]\n",
  );
  process.exitCode = 2;
} else {
  const passed = timeout >= fixture.gatewayDurationMs;
  const output = JSON.stringify(
    {
      take: fixture.id,
      request: `${fixture.method} ${fixture.path}`,
      simulated: true,
      timeoutMs: timeout,
      gatewayDurationMs: fixture.gatewayDurationMs,
      status: passed ? 200 : 504,
      outcome: passed ? "checkout_ok" : "gateway_timeout",
    },
    null,
    2,
  );
  process.stdout.write(`${output}\n`);
  process.exitCode = passed ? 0 : 1;
}
