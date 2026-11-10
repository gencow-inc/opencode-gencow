# opencode-gencow

[OpenCode](https://opencode.ai)에서 Gencow를 쉽게 쓰기 위한 설정 묶음입니다. 초급자와 교육용을 대상으로, 어렵거나 복잡한 기능은 넣지 않았습니다.

> 상태: 비공개 초안(v0.1.0). 아직 npm에 발행하지 않았습니다.

## 처음 쓰는 방법 (OpenCode에 붙여넣기)

1. [설치 프롬프트](docs/prompt-install.md): Node/Bun/pnpm 설치, 이 묶음 설치, Gencow 회원가입·로그인(`gencow login`), ego-browser 안내까지 OpenCode가 단계별로 진행합니다.
2. [테스트 프롬프트](docs/prompt-test.md): 설치 후 OpenCode를 재시작하고 붙여넣어 검증합니다.
3. [서비스 연결 점검 프롬프트](docs/prompt-service-check.md): Gencow MCP에 새 서비스를 등록한 뒤 검색, 설명, 호출이 되는지 확인합니다.

설치와 테스트는 별도 단계입니다. 아래는 설치기를 직접 실행하는 방법입니다.

## 설치 (GitHub에서 바로)

아직 npm에 발행하지 않았으므로 GitHub 저장소를 직접 사용합니다. 비공개 저장소라서 **설치할 컴퓨터에서 이 저장소에 접근 권한이 있는 GitHub 계정으로 로그인**되어 있어야 합니다 (`gh auth login` 또는 git 자격 증명). 먼저 OpenCode(1.4.0 이상)와 Node.js 20 이상이 필요합니다.

```bash
# 방법 1: 한 줄 (권장)
npx github:spaceflo-io/opencode-gencow install

# 방법 2: 내려받아 실행 (방법 1이 인증 문제로 안 될 때)
git clone https://github.com/spaceflo-io/opencode-gencow.git
cd opencode-gencow
node bin/cli.mjs install
```

방법 2에서는 이후 명령도 `node bin/cli.mjs doctor`처럼 실행합니다. 업데이트는 `git pull` 후 `install`을 다시 실행하세요. macOS, Windows, Linux 모두 같은 명령입니다.

| 명령 | 하는 일 |
|---|---|
| `install` | 아래 구성 요소를 OpenCode 설정 폴더에 설치 |
| `doctor` | 설치 상태 점검 (OpenCode, 파일, MCP 등록·연결, ego-browser) |
| `uninstall` | 설치한 항목만 제거 |

옵션: `--dry-run`(미리보기), `--skip-ego`(ego-browser 건너뜀), `--config-dir <경로>`.

설치 후 OpenCode를 실행하고 `/gencow-start`를 입력하세요.

## 로그인이 필요합니다

Gencow MCP(`mcp.gencow.com`)는 **Gencow 계정으로 로그인해야** 쓸 수 있습니다. 로그인하지 않으면 OpenCode에서 `needs authentication`으로 표시되고 MCP 도구를 쓸 수 없습니다.

1. 계정이 없으면 https://gencow.app/signup 에서 회원가입합니다. 이미 있으면 https://gencow.app/login 에서 로그인합니다.
2. CLI 로그인: `bunx gencow@latest login` (확인: `bunx gencow@latest whoami`)
3. MCP 인증: `opencode mcp auth gencow` 를 실행하고 브라우저에서 승인합니다.
4. 확인: `opencode mcp list` 에서 `gencow` 가 `connected` 이면 됩니다.

설치 프롬프트가 이 과정을 안내합니다. 로그인하지 않아도 스킬, 에이전트, 명령은 동작하지만, MCP 기반 문서 검색과 오류 진단은 쓸 수 없습니다.

## 들어 있는 것

| 구분 | 이름 | 설명 |
|---|---|---|
| MCP | `gencow` | `https://mcp.gencow.com/api/mcp` 원격 MCP를 `opencode.json`에 등록 (로그인 필요, 위 참고) |
| 스킬 | `gencow-getting-started` | 첫 앱 만들기 |
| | `gencow-deploy-my-app` | 개발 환경 배포와 확인 |
| | `gencow-troubleshoot` | 오류 진단 (MCP 사용) |
| | `git-master` | 쉬운 git 안내 |
| | `debugging` | 재현→관찰→검증→수정 순서 |
| | `gencow-portal-tools` | 이미지 생성 등 Gencow 도구 호출 (search → describe → call) |
| | `ego-browser` | 외부 스킬 ([CitroLabs/ego-lite](https://github.com/CitroLabs/ego-lite)), 아래 참고 |
| 에이전트 | `gencow-helper` | 쉬운 말로 설명하는 기본 도우미 |
| 명령 | `/gencow-start` `/gencow-deploy` `/gencow-fix` `/handoff` | |

훅, 멀티 에이전트, 모델 지정은 의도적으로 넣지 않았습니다.

## 설치 위치

OpenCode 설정 폴더는 `OPENCODE_CONFIG_DIR`, 없으면 `$XDG_CONFIG_HOME/opencode`, 없으면 `~/.config/opencode`입니다 (Windows는 `%USERPROFILE%\.config\opencode`).

- `skills/`, `agents/`, `commands/` 에 파일 복사
- `opencode.json` 의 `mcp.gencow` 추가
- `.gencow-opencode.json` 에 설치 기록 (제거할 때 사용)

안전 장치: 다시 실행해도 같은 결과이고, 덮어쓰는 기존 파일과 `opencode.json`은 `.bak-<시각>`으로 백업합니다. 설정 파일이 깨져 있으면 아무것도 쓰지 않고 중단합니다.

## ego-browser (macOS/Windows만)

브라우저를 에이전트가 조작하는 외부 도구입니다. 설치기는 원 저장소의 명령(`npx skills add citrolabs/ego-lite -g -a opencode -y`)을 호출할 뿐 파일을 복사하지 않습니다. 전역(`-g`)으로 `~/.agents/skills/ego-browser`에 설치되어 어느 폴더에서 열어도 로드됩니다. 이 명령은 **Node.js 22.20 이상**이 필요해서, 낮으면 건너뛰고 안내합니다. 브라우저 앱은 첫 사용 때 설치 안내가 나옵니다. Linux는 아직 지원되지 않아 건너뜁니다. 설치 실패는 경고만 하고 나머지 설치는 완료됩니다.

교육 시 주의: 로그인된 브라우저를 에이전트가 쓸 수 있으므로 수업용 계정이나 별도 프로필을 쓰세요. 앱의 교육용 사용 조건은 CitroLabs에 확인이 필요합니다.

## 개발

```bash
npm test      # Node 20 이상, 외부 의존성 없음
```

구조: `bin/cli.mjs`(CLI), `src/lib.mjs`(설치·제거·점검), `assets/`(설치되는 파일 원본), `test/`.

## 알려진 한계 / 다음 작업

- 패키지 이름(`@gencow/opencode`)과 npm 소속은 미정입니다. 소속 조직은 `spaceflo-io`입니다.
- 라이선스 미지정 (공개 전에 결정).
- 2차 후보: `init-deep`(gencow용 AGENTS.md 생성), `playwright` 화면 확인.
