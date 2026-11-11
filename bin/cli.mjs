#!/usr/bin/env node
import { install, uninstall, doctor, configDir } from "../src/lib.mjs";

const HELP = `gencow-opencode — OpenCode용 Gencow 설정 묶음

사용법:
  npx github:gencow-inc/opencode-gencow install     설치 (MCP, 스킬, 에이전트, 명령, ego-browser)
  npx github:gencow-inc/opencode-gencow doctor      설치 상태 점검
  npx github:gencow-inc/opencode-gencow uninstall   설치한 항목 제거

옵션:
  --dry-run            실제로 쓰지 않고 할 일만 보여 줌
  --skip-ego           ego-browser 스킬 설치를 건너뜀
  --config-dir <경로>  OpenCode 설정 폴더 직접 지정
`;

function parse(argv) {
  const opts = { cmd: argv[0], dryRun: false, skipEgo: false, dir: undefined };
  for (let i = 1; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") opts.dryRun = true;
    else if (a === "--skip-ego") opts.skipEgo = true;
    else if (a === "--config-dir") opts.dir = argv[++i];
    else throw new Error(`알 수 없는 옵션: ${a}`);
  }
  return opts;
}

try {
  const opts = parse(process.argv.slice(2));
  const dir = opts.dir ?? configDir();
  const log = (line) => console.log(line);
  if (opts.cmd === "install") {
    await install({ dir, dryRun: opts.dryRun, skipEgo: opts.skipEgo, log });
  } else if (opts.cmd === "uninstall") {
    await uninstall({ dir, dryRun: opts.dryRun, log });
  } else if (opts.cmd === "doctor") {
    const ok = await doctor({ dir, log });
    process.exitCode = ok ? 0 : 1;
  } else {
    console.log(HELP);
    process.exitCode = opts.cmd && opts.cmd !== "help" && opts.cmd !== "--help" ? 1 : 0;
  }
} catch (err) {
  console.error(`오류: ${err.message}`);
  process.exitCode = 1;
}
