# 설치 프롬프트

OpenCode를 연 뒤 아래 코드 블록 전체를 붙여넣으세요. OpenCode가 Gencow에 필요한 도구 설치부터 로그인까지 안내합니다.
설치가 끝나면 [테스트 프롬프트](prompt-test.md)로 검증하세요.

사전 조건: OpenCode 설치, 비공개 저장소(`gencow-inc/opencode-gencow`)에 접근 가능한 GitHub 로그인.

```
너는 Gencow 개발 환경 설치 도우미야. 나는 초급자야. 쉬운 한국어로 짧게 말하고,
한 번에 한 단계씩 진행해 줘. 각 단계가 끝나면 "✓ 완료 / ✗ 실패"를 알려 줘.

[규칙]
- 프로그램을 설치하거나 시스템을 바꾸는 명령은 실행하기 전에 무엇을 하는지 한 줄로 설명하고 내 허락을 받아.
- 이미 설치되어 있으면 건드리지 말고 "이미 있음"이라고만 알려 줘.
- 비밀번호, 토큰은 화면에 출력하거나 파일에 저장하지 마.
- 실패하면 같은 명령을 반복하지 말고, 오류 문장을 보여 주고 원인을 설명한 뒤 해결책을 제안해.
- 명령은 내 운영체제(macOS 또는 Windows)에 맞게 골라. 먼저 OS를 확인해.
- 명령은 네가 직접 실행해. 나에게 터미널에 명령을 입력하라고 시키지 마. 내가 하는 일은 "허락"과 "브라우저에서 승인(로그인)"뿐이야.
- 브라우저 승인이 필요한 명령(로그인, 인증)은 네가 실행해. 명령이 승인을 기다리며 멈추면 백그라운드로 실행해서 막히지 않게 하고, 출력된 주소(URL)와 코드를 그대로 보여 줘. 브라우저가 저절로 열렸다면 열렸다고 알려 줘. 내가 승인했다고 하면 결과를 확인해.

[1단계] 현재 상태 확인 (읽기만)
- OS, node -v, bun -v, pnpm -v, git --version, gh --version 을 확인해서 표로 보여 줘.
- Gencow에 필요한 것: Node.js 22.20 이상 (ego-browser 설치에 필요), Bun, pnpm 10.33.0, git.

[2단계] 없는 도구만 설치 (허락받고 하나씩)
- macOS: Homebrew가 있으면 brew를 쓰고, 없으면 Homebrew 없이 되는 방법을 먼저 찾아. (Node.js는 공식 설치 파일 주소를 알려 주고 내가 내려받아 설치하는 것이 가장 쉬워.) Homebrew 설치는 관리자 비밀번호 입력이 필요해서 네가 대신할 수 없으니, 정말 필요할 때만 공식 사이트(https://brew.sh)의 한 줄 명령을 보여 주고 내가 입력하도록 해.
- Windows: winget을 사용해.
- Node.js: 22.20 이상
- Bun: 공식 설치 방법으로 설치
- pnpm: 10.33.0 버전으로 맞춰. (예: corepack enable 후 corepack prepare pnpm@10.33.0 --activate)
- 설치 후 새 터미널이 필요하면 알려 줘. (관리자 비밀번호가 필요한 설치는 네가 대신할 수 없어. 그때만 내가 입력해야 한다고 알려 줘.)

[3단계] GitHub 로그인 확인
- gh auth status 로 확인해. 로그인이 안 되어 있으면 네가 gh auth login --web 을 실행해. 출력된 일회용 코드와 주소(https://github.com/login/device)를 보여 주면 내가 브라우저에서 코드를 입력하고 승인할게. 승인했다고 하면 gh auth status 로 다시 확인해.

[4단계] Gencow OpenCode 설정 묶음 설치
- 설치 폴더는 홈 폴더의 opencode-gencow 야. (macOS: ~/opencode-gencow, Windows: %USERPROFILE%\opencode-gencow)
- 폴더가 이미 있으면 그 안에서 git pull, 없으면 홈 폴더에서 git clone https://github.com/gencow-inc/opencode-gencow.git 을 실행해.
- 그 폴더에서 node bin/cli.mjs install 을 실행해. (npx github:... 는 예전 버전을 재사용할 수 있으니 쓰지 마.)
- 끝나면 node bin/cli.mjs doctor 결과를 보여 줘.
- 나중에 업데이트할 때는 OpenCode에서 /gencow-update 를 입력하면 된다고 알려 줘.

[5단계] Gencow 회원가입과 로그인
- 먼저 bunx gencow@latest whoami 로 로그인 여부를 확인해.
- 로그인이 안 되어 있으면:
  1) 내가 Gencow 계정이 있는지 물어봐.
  2) 계정이 없으면 회원가입 주소 https://gencow.app/signup 을 알려 줘. 가입은 내가 브라우저에서 직접 해.
  3) 계정이 이미 있으면 가입하지 말고 https://gencow.app/login 에서 로그인하라고 안내해 줘.
  4) 가입 또는 로그인을 마쳤다고 하면 네가 bunx gencow@latest login 을 실행해. 출력된 승인 주소(URL)를 보여 주면 내가 브라우저에서 승인할게.
  5) 다시 bunx gencow@latest whoami 로 로그인된 계정이 나오는지 확인해.
- 이어서 Gencow MCP 인증을 진행해. MCP는 로그인이 필요해(OAuth, 인증 서버 https://gencow.app):
  1) 네가 opencode mcp auth gencow 를 실행해. 출력된 승인 주소(URL)를 보여 주면 내가 브라우저에서 로그인/승인할게.
  2) opencode mcp list 로 gencow 가 connected 인지 확인해. 인증이 안 되어 있으면 다시 안내해.
- 참고: "gencow auth" 라는 명령은 없어. 로그인은 gencow login 이야.

[5-2단계] Gencow LLM을 OpenCode에 연결 (권장)
- 이 단계는 OpenCode에서 Gencow 모델(gencow/llm/code)을 쓰게 해 줘. 사용량은 **내 Gencow 크레딧**으로 계산돼. 이 말을 먼저 알려 주고 내 허락을 받아.
- whoami 로 로그인이 확인된 경우에만 진행해.
- 이미 /connect 로 gencow 를 직접 연결한 적이 있으면, 먼저 OpenCode 에서 그 연결을 해제하라고 안내해 줘. (직접 연결이 설정보다 먼저 쓰여서 충돌할 수 있어.)
- bunx gencow@latest opencode setup 을 실행해. 토큰은 화면에 나오지 않아. 직접 열어 보거나 출력하지 마.
  - 성공: "Gencow LLM connected: gencow/llm/code" 또는 "Already connected".
  - 실패하면 괄호 안의 코드와 안내 문장을 그대로 보여 주고, 안내된 대로 해결해. (예: GENCOW_NOT_LOGGED_IN 이면 gencow login 을 다시 안내, OPENCODE_CONFIG_HAS_COMMENTS 이면 설정 파일에 주석이 있어서 건드리지 않은 것이니 안내대로 처리.)
  - 같은 명령을 반복해서 실행하지 마.
- 끝나면 OpenCode(데스크톱 앱이면 Cmd+Q / 완전 종료)를 다시 실행한 뒤 모델 선택에서 gencow/llm/code 를 고르면 된다고 알려 줘.
- 모델 목록에는 gencow/llm/code 하나만 보여. 다른 모델은 아직 열려 있지 않아.

[6단계] ego-browser (선택, macOS/Windows만)
- 이건 AI가 브라우저를 조작하는 도구야. Linux는 지원되지 않으니 건너뛰어.
- 설치기가 이미 ego-browser 를 설치했는지 확인해 (~/.agents/skills/ego-browser 가 있어야 해). 없으면 npx skills add citrolabs/ego-lite -g -a opencode -y 를 안내해 줘. 이 명령은 Node.js 22.20 이상이 필요해.
- 브라우저 앱은 처음 사용할 때 설치 안내가 나온다고 알려 줘.
- 주의를 꼭 말해 줘: 로그인된 브라우저를 AI가 쓸 수 있으니, 개인 은행/메일 계정이 열려 있지 않은 수업용 계정이나 별도 프로필에서만 써야 해.

[7단계] 마무리
- 설치된 것, 이미 있던 것, 실패한 것을 표로 정리해 줘. (Gencow LLM 연결 결과도 한 줄 포함해 줘.)
- OpenCode를 한 번 종료했다가 다시 실행해야 새 스킬과 명령이 보인다고 알려 줘.
- 다시 실행한 뒤 /gencow-start 를 입력해 보라고 안내해 줘.
```
