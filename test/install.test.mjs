import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { install, uninstall, doctor, parseJsonc, configDir, MCP_URL, EGO_INSTALL_ARGS, nodeSupportsEgo } from "../src/lib.mjs";

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "gencow-oc-"));
const read = (...p) => fs.readFileSync(path.join(...p), "utf8");
const opts = (dir, extra = {}) => ({ dir, skipEgo: true, ...extra });

test("install: 스킬/에이전트/명령 배치와 MCP 등록", async () => {
  const dir = tmp();
  await install(opts(dir));
  for (const f of [
    "skills/gencow-getting-started/SKILL.md",
    "skills/gencow-deploy-my-app/SKILL.md",
    "skills/gencow-troubleshoot/SKILL.md",
    "skills/git-master/SKILL.md",
    "skills/debugging/SKILL.md",
    "skills/gencow-portal-tools/SKILL.md",
    "agents/gencow-helper.md",
    "commands/gencow-start.md",
    "commands/handoff.md",
    "commands/gencow-update.md",
  ]) assert.ok(fs.existsSync(path.join(dir, f)), f);
  const cfg = JSON.parse(read(dir, "opencode.json"));
  assert.deepEqual(cfg.mcp.gencow, { type: "remote", url: MCP_URL, enabled: true });
});

test("install: 재실행해도 같은 결과이고 백업을 만들지 않는다", async () => {
  const dir = tmp();
  await install(opts(dir));
  const before = read(dir, "opencode.json");
  await install(opts(dir));
  assert.equal(read(dir, "opencode.json"), before);
  assert.deepEqual(fs.readdirSync(dir).filter((n) => n.includes(".bak-")), []);
});

test("install: 기존 설정(주석, 다른 MCP)을 보존하고 백업한다", async () => {
  const dir = tmp();
  fs.writeFileSync(
    path.join(dir, "opencode.json"),
    `{
  // 내 설정
  "model": "x/y",
  "mcp": { "other": { "type": "remote", "url": "https://o.example", }, },
}`,
  );
  const logs = [];
  await install(opts(dir, { log: (l) => logs.push(l) }));
  const cfg = JSON.parse(read(dir, "opencode.json"));
  assert.equal(cfg.model, "x/y");
  assert.equal(cfg.mcp.other.url, "https://o.example");
  assert.equal(cfg.mcp.gencow.url, MCP_URL);
  assert.ok(fs.readdirSync(dir).some((n) => n.startsWith("opencode.json.bak-")));
  assert.ok(logs.some((l) => l.includes("주석")));
});

test("install: 깨진 설정 파일은 건드리지 않고 실패한다", async () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, "opencode.json"), "{ not json");
  await assert.rejects(install(opts(dir)), /수정하지 않았습니다/);
  assert.equal(read(dir, "opencode.json"), "{ not json");
});

test("install: 사용자가 만든 같은 이름 파일은 백업 후 교체한다", async () => {
  const dir = tmp();
  fs.mkdirSync(path.join(dir, "agents"), { recursive: true });
  fs.writeFileSync(path.join(dir, "agents/gencow-helper.md"), "내 파일");
  await install(opts(dir));
  const baks = fs.readdirSync(path.join(dir, "agents")).filter((n) => n.includes(".bak-"));
  assert.equal(baks.length, 1);
  assert.equal(read(dir, "agents", baks[0]), "내 파일");
});

test("install --dry-run: 아무것도 쓰지 않는다", async () => {
  const dir = tmp();
  await install(opts(dir, { dryRun: true }));
  assert.deepEqual(fs.readdirSync(dir), []);
});

test("ego-browser: 지원 OS에서만 설치 명령을 호출하고 실패해도 설치는 끝난다", async () => {
  let calls = 0;
  const dir = tmp();
  await install({ dir, platform: "linux", nodeVersion: "22.23.0", runEgo: () => (calls++, true) });
  assert.equal(calls, 0);
  await install({ dir, platform: "win32", nodeVersion: "22.23.0", runEgo: () => (calls++, true) });
  await install({ dir, platform: "darwin", nodeVersion: "22.23.0", runEgo: () => (calls++, false) });
  assert.equal(calls, 2);
  assert.ok(fs.existsSync(path.join(dir, "agents/gencow-helper.md")));
});

test("uninstall: 설치한 것만 제거하고 사용자의 MCP는 남긴다", async () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, "opencode.json"), JSON.stringify({ mcp: { other: { type: "remote", url: "u" } } }));
  await install(opts(dir));
  await uninstall({ dir });
  const cfg = JSON.parse(read(dir, "opencode.json"));
  assert.deepEqual(Object.keys(cfg.mcp), ["other"]);
  assert.ok(!fs.existsSync(path.join(dir, "skills")));
  assert.ok(!fs.existsSync(path.join(dir, ".gencow-opencode.json")));
});

test("uninstall: 사용자가 미리 등록해 둔 gencow MCP는 지우지 않는다", async () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, "opencode.json"), JSON.stringify({ mcp: { gencow: { type: "remote", url: MCP_URL, enabled: true } } }));
  await install(opts(dir));
  await uninstall({ dir });
  assert.equal(JSON.parse(read(dir, "opencode.json")).mcp.gencow.url, MCP_URL);
});

test("doctor: 설치 전 실패, 설치 후 파일/MCP 항목 통과", async () => {
  const dir = tmp();
  assert.equal(await doctor({ dir, checkNetwork: false, home: dir }), false);
  await install(opts(dir));
  const logs = [];
  await doctor({ dir, checkNetwork: false, home: dir, log: (l) => logs.push(l) });
  assert.ok(logs.some((l) => l.startsWith("✓ Gencow MCP")));
  assert.ok(logs.some((l) => l.startsWith("✓ 스킬/에이전트/명령")));
});

test("configDir: OS와 무관하게 환경변수/홈 기준", () => {
  assert.equal(configDir({ OPENCODE_CONFIG_DIR: "/a" }, "/h"), "/a");
  assert.equal(configDir({ XDG_CONFIG_HOME: "/x" }, "/h"), path.join("/x", "opencode"));
  assert.equal(configDir({}, "/h"), path.join("/h", ".config", "opencode"));
});

test("parseJsonc: 문자열 안의 // 는 주석으로 보지 않는다", () => {
  assert.deepEqual(parseJsonc('{"u":"https://a//b", /* c */ "n":1,}'), { u: "https://a//b", n: 1 });
});

test("ego-browser: 전역(-g)/opencode 대상으로 설치하고 Node 22.20 미만은 건너뛴다", async () => {
  assert.deepEqual(EGO_INSTALL_ARGS.slice(-4), ["-g", "-a", "opencode", "-y"]);
  assert.equal(nodeSupportsEgo("22.19.0"), false);
  assert.equal(nodeSupportsEgo("22.20.0"), true);
  assert.equal(nodeSupportsEgo("24.1.0"), true);
  let calls = 0;
  const logs = [];
  await install({ dir: tmp(), platform: "darwin", nodeVersion: "20.11.0", runEgo: () => (calls++, true), log: (l) => logs.push(l) });
  assert.equal(calls, 0);
  assert.ok(logs.some((l) => l.includes("22.20")));
});
