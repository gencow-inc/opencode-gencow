import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const MCP_URL = "https://mcp.gencow.com/api/mcp";
export const EGO_SKILL_SOURCE = "citrolabs/ego-lite";
/** 어느 폴더에서 열어도 로드되도록 전역(-g) 설치, OpenCode 대상(-a opencode), 질문 생략(-y). */
export const EGO_INSTALL_ARGS = ["skills", "add", EGO_SKILL_SOURCE, "-g", "-a", "opencode", "-y"];
export const EGO_INSTALL_CMD = `npx ${EGO_INSTALL_ARGS.join(" ")}`;
const EGO_MIN_NODE = [22, 20];

/** skills CLI 는 Node 22.20 이상이 필요하다. */
export function nodeSupportsEgo(version = process.versions.node) {
  const [maj, min] = version.split(".").map(Number);
  return maj > EGO_MIN_NODE[0] || (maj === EGO_MIN_NODE[0] && min >= EGO_MIN_NODE[1]);
}
const MANIFEST = ".gencow-opencode.json";
const ASSETS = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "assets");

/** OpenCode 설정 폴더. Windows/macOS/Linux 모두 홈 디렉터리 기준으로 계산한다. */
export function configDir(env = process.env, home = os.homedir()) {
  if (env.OPENCODE_CONFIG_DIR) return env.OPENCODE_CONFIG_DIR;
  const base = env.XDG_CONFIG_HOME || path.join(home, ".config");
  return path.join(base, "opencode");
}

/** JSONC(주석, 끝 쉼표 허용) 문자열을 JSON 값으로 읽는다. */
export function parseJsonc(text) {
  let out = "";
  let inStr = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const n = text[i + 1];
    if (inStr) {
      out += c;
      if (c === "\\") out += text[++i];
      else if (c === '"') inStr = false;
    } else if (c === '"') {
      inStr = true;
      out += c;
    } else if (c === "/" && n === "/") {
      while (i < text.length && text[i] !== "\n") i++;
      out += "\n";
    } else if (c === "/" && n === "*") {
      i += 2;
      while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i++;
      i++;
    } else {
      out += c;
    }
  }
  return JSON.parse(out.replace(/,(\s*[}\]])/g, "$1"));
}

function findConfigFile(dir) {
  for (const name of ["opencode.json", "opencode.jsonc"]) {
    const file = path.join(dir, name);
    if (fs.existsSync(file)) return file;
  }
  return path.join(dir, "opencode.json");
}

function readConfig(file) {
  if (!fs.existsSync(file)) return { config: {}, hadComments: false };
  const text = fs.readFileSync(file, "utf8");
  if (text.trim() === "") return { config: {}, hadComments: false };
  let config;
  try {
    config = parseJsonc(text);
  } catch (err) {
    throw new Error(`${file} 을(를) 읽을 수 없습니다 (${err.message}). 파일은 수정하지 않았습니다. JSON 문법을 확인한 뒤 다시 실행하세요.`);
  }
  return { config, hadComments: /\/\/|\/\*/.test(text.replace(/"(?:[^"\\]|\\.)*"/g, '""')) };
}

function walk(root, rel = "") {
  const out = [];
  for (const entry of fs.readdirSync(path.join(root, rel), { withFileTypes: true })) {
    const r = path.join(rel, entry.name);
    if (entry.isDirectory()) out.push(...walk(root, r));
    else out.push(r);
  }
  return out.sort();
}

const stamp = () => new Date().toISOString().replace(/[:.]/g, "-");

function readManifest(dir) {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, MANIFEST), "utf8"));
  } catch {
    return null;
  }
}

function hasCommand(name, platform = process.platform) {
  const r = spawnSync(platform === "win32" ? "where" : "which", [name], { stdio: "ignore" });
  return r.status === 0;
}

/** ego-browser 스킬은 macOS/Windows만 지원된다. 원 저장소의 설치 명령을 그대로 호출한다. */
export function egoSupported(platform = process.platform) {
  return platform === "darwin" || platform === "win32";
}

function defaultRunEgo() {
  const r = spawnSync("npx", ["--yes", ...EGO_INSTALL_ARGS], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  return r.status === 0;
}

export async function install({
  dir,
  dryRun = false,
  skipEgo = false,
  log = () => {},
  platform = process.platform,
  nodeVersion = process.versions.node,
  runEgo = defaultRunEgo,
} = {}) {
  const prefix = dryRun ? "[미리보기] " : "";
  const previous = readManifest(dir);
  const owned = new Set(previous?.files ?? []);
  const installed = [];

  for (const rel of walk(ASSETS)) {
    const dest = path.join(dir, rel);
    const content = fs.readFileSync(path.join(ASSETS, rel));
    const exists = fs.existsSync(dest);
    if (exists && fs.readFileSync(dest).equals(content)) {
      installed.push(rel);
      continue;
    }
    if (exists && !owned.has(rel)) {
      const backup = `${dest}.bak-${stamp()}`;
      log(`${prefix}기존 파일 백업: ${backup}`);
      if (!dryRun) fs.copyFileSync(dest, backup);
    }
    log(`${prefix}${exists ? "업데이트" : "설치"}: ${rel}`);
    if (!dryRun) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, content);
    }
    installed.push(rel);
  }

  // Gencow MCP 등록
  const file = findConfigFile(dir);
  const { config, hadComments } = readConfig(file);
  config.mcp = config.mcp && typeof config.mcp === "object" ? config.mcp : {};
  const had = config.mcp.gencow;
  const wanted = { type: "remote", url: MCP_URL, enabled: true };
  let addedMcp = previous?.addedMcp ?? !had;
  if (had && JSON.stringify(had) === JSON.stringify(wanted)) {
    log(`${prefix}Gencow MCP: 이미 등록됨`);
  } else {
    if (had && !previous?.addedMcp) log(`${prefix}기존 gencow MCP 설정을 교체합니다 (백업 생성).`);
    if (hadComments) log(`${prefix}주의: ${path.basename(file)} 의 주석은 저장 시 사라집니다 (백업 생성).`);
    if (!dryRun) {
      fs.mkdirSync(dir, { recursive: true });
      if (fs.existsSync(file)) fs.copyFileSync(file, `${file}.bak-${stamp()}`);
      config.mcp.gencow = wanted;
      fs.writeFileSync(file, JSON.stringify(config, null, 2) + "\n");
    }
    log(`${prefix}Gencow MCP 등록: ${MCP_URL}`);
  }

  if (!dryRun) {
    fs.writeFileSync(
      path.join(dir, MANIFEST),
      JSON.stringify({ version: 1, files: installed, addedMcp }, null, 2) + "\n",
    );
  }

  // ego-browser (선택적 외부 스킬)
  if (skipEgo) {
    log("ego-browser: --skip-ego 로 건너뜀");
  } else if (!egoSupported(platform)) {
    log("ego-browser: 이 OS(Linux 등)는 아직 지원되지 않아 건너뜁니다. 화면 확인은 playwright 사용을 권장합니다.");
  } else if (!nodeSupportsEgo(nodeVersion)) {
    log(`ego-browser: Node.js 22.20 이상이 필요합니다 (현재 ${nodeVersion}). Node 를 올린 뒤 다시 실행하세요. 나머지 설치는 완료되었습니다.`);
  } else if (dryRun) {
    log(`${prefix}ego-browser 스킬 설치: ${EGO_INSTALL_CMD}`);
  } else {
    log(`ego-browser 스킬 설치 중: ${EGO_INSTALL_CMD}`);
    if (!runEgo()) log("경고: ego-browser 설치에 실패했습니다. 나머지 설치는 완료되었습니다. 나중에 위 명령을 직접 실행하세요.");
    else log("ego-browser 스킬만 설치되었습니다. 브라우저 앱은 따로 설치해야 합니다 (https://lite.ego.app/). 수업용 계정/프로필로만 사용하세요.");
  }

  log(`${prefix}Gencow MCP는 로그인이 필요합니다. 다음 명령으로 인증하세요: opencode mcp auth gencow`);
  log(`${prefix}완료. OpenCode를 실행하고 /gencow-start 를 입력해 보세요. 문제가 있으면: npx github:gencow-inc/opencode-gencow doctor`);
  return { installed, addedMcp };
}

export async function uninstall({ dir, dryRun = false, log = () => {} } = {}) {
  const prefix = dryRun ? "[미리보기] " : "";
  const manifest = readManifest(dir);
  if (!manifest) {
    log("설치 기록이 없습니다. 제거할 항목이 없습니다.");
    return;
  }
  for (const rel of manifest.files) {
    const file = path.join(dir, rel);
    if (!fs.existsSync(file)) continue;
    log(`${prefix}삭제: ${rel}`);
    if (dryRun) continue;
    fs.rmSync(file);
    for (let d = path.dirname(file); d !== dir && d.startsWith(dir); d = path.dirname(d)) {
      if (fs.readdirSync(d).length > 0) break;
      fs.rmdirSync(d);
    }
  }
  if (manifest.addedMcp) {
    const file = findConfigFile(dir);
    const { config } = readConfig(file);
    if (config.mcp?.gencow) {
      log(`${prefix}Gencow MCP 등록 해제`);
      if (!dryRun) {
        fs.copyFileSync(file, `${file}.bak-${stamp()}`);
        delete config.mcp.gencow;
        if (Object.keys(config.mcp).length === 0) delete config.mcp;
        fs.writeFileSync(file, JSON.stringify(config, null, 2) + "\n");
      }
    }
  }
  if (!dryRun) fs.rmSync(path.join(dir, MANIFEST), { force: true });
  log(`${prefix}제거 완료. ego-browser 는 직접 설치한 외부 스킬이므로 그대로 둡니다.`);
}

function opencodeVersion() {
  const r = spawnSync("opencode", ["--version"], { encoding: "utf8", shell: process.platform === "win32" });
  return r.status === 0 ? r.stdout.trim() : null;
}

async function mcpReachable() {
  try {
    const res = await fetch(MCP_URL, { method: "GET", signal: AbortSignal.timeout(5000) });
    return res.status < 500;
  } catch {
    return false;
  }
}

/** 설치 상태를 점검한다. 필수 항목이 하나라도 실패하면 false. */
export async function doctor({
  dir,
  log = () => {},
  platform = process.platform,
  home = os.homedir(),
  checkNetwork = true,
} = {}) {
  let ok = true;
  const pass = (m) => log(`✓ ${m}`);
  const warn = (m) => log(`! ${m}`);
  const fail = (m) => {
    ok = false;
    log(`✗ ${m}`);
  };

  const v = opencodeVersion();
  v ? pass(`OpenCode 설치됨 (${v})`) : fail("OpenCode 를 찾을 수 없습니다. https://opencode.ai/docs/ 에서 먼저 설치하세요.");

  const manifest = readManifest(dir);
  if (!manifest) {
    fail("설치 기록이 없습니다. 먼저 `npx github:gencow-inc/opencode-gencow install` 을 실행하세요.");
  } else {
    const missing = manifest.files.filter((rel) => !fs.existsSync(path.join(dir, rel)));
    missing.length === 0
      ? pass(`스킬/에이전트/명령 ${manifest.files.length}개 설치됨`)
      : fail(`없어진 파일 ${missing.length}개 (예: ${missing[0]}). install 을 다시 실행하세요.`);
  }

  try {
    const { config } = readConfig(findConfigFile(dir));
    config.mcp?.gencow?.url === MCP_URL
      ? pass("Gencow MCP 가 opencode 설정에 등록됨")
      : fail("Gencow MCP 가 등록되어 있지 않습니다. install 을 다시 실행하세요.");
  } catch (err) {
    fail(err.message);
  }

  if (checkNetwork) {
    (await mcpReachable())
      ? pass("Gencow MCP 서버에 연결됨")
      : warn("Gencow MCP 서버에 연결하지 못했습니다. 네트워크를 확인하세요. (MCP 는 선택 지식원이라 앱 빌드/배포에는 영향 없음)");
  }

  if (!egoSupported(platform)) {
    warn("ego-browser: 이 OS는 지원되지 않습니다 (macOS/Windows 만 지원). 선택 항목입니다.");
  } else {
    const places = [
      path.join(dir, "skills", "ego-browser"),
      path.join(home, ".agents", "skills", "ego-browser"),
      path.join(home, ".claude", "skills", "ego-browser"),
    ];
    places.some((p) => fs.existsSync(p))
      ? pass("ego-browser 스킬(AI용 설명서) 설치됨")
      : warn(`ego-browser 스킬이 없습니다 (선택). 설치: ${EGO_INSTALL_CMD}`);
    // 스킬만으로는 브라우저를 쓸 수 없다. 앱(명령)은 별도로 설치해야 한다.
    hasCommand("ego-browser", platform)
      ? pass("ego-browser 앱(명령) 설치됨")
      : warn("ego-browser 앱이 아직 설치되지 않았습니다 (스킬만 있으면 브라우저는 쓸 수 없습니다). https://lite.ego.app/ 에서 설치하세요.");
  }
  return ok;
}
