# 업데이트 프롬프트

이미 [설치 프롬프트](prompt-install.md)로 설치한 PC에서, 최신 스킬·에이전트·명령으로 갱신할 때 붙여넣으세요.
OpenCode가 최신 파일을 받아 다시 설치하고 결과를 알려 줍니다. 직접 명령을 칠 필요가 없습니다.

> 이 프롬프트는 **한 번만** 붙여넣으면 됩니다. 업데이트가 끝난 뒤부터는 OpenCode에서 `/gencow-update` 만 입력하면 같은 일을 합니다. (`/gencow-update` 명령이 아직 없는 오래된 설치에서만 아래 프롬프트가 필요합니다.)

```
너는 opencode-gencow 설정 묶음을 최신으로 업데이트하는 도우미야.
쉬운 한국어로 짧게 말하고, 단계마다 "✓ 완료 / ✗ 실패"를 알려 줘.
업데이트 외에는 아무것도 수정하거나 삭제하지 마. 비밀번호와 토큰은 출력하지 마.

[1단계] 최신 파일 받기
- 설치 폴더는 홈 폴더의 opencode-gencow 야. (macOS: ~/opencode-gencow, Windows: %USERPROFILE%\opencode-gencow)
- 폴더가 이미 있으면 그 안에서 git pull 을 실행해.
  - 충돌이나 수정된 파일 때문에 실패하면 강제로 덮어쓰지 말고, 오류를 보여 주고 나에게 알려 줘.
- 폴더가 없으면 git clone https://github.com/spaceflo-io/opencode-gencow.git 을 홈 폴더에서 실행해.
- 받아 온 최신 커밋을 git log -1 --format="%h %s" 로 보여 줘.
- 접근 권한 오류가 나면 gh auth status 로 GitHub 로그인을 확인하고, 안 되어 있으면 gh auth login 을 안내해 줘.

[2단계] 다시 설치
- 그 폴더에서 node bin/cli.mjs install 을 실행해. (npx github:... 는 예전 버전을 재사용할 수 있으니 쓰지 마.)
- 출력에서 "업데이트" 또는 "설치"로 표시된 파일 목록을 보여 줘.
  모두 "이미 최신"이면 그렇다고 알려 줘.

[3단계] Gencow LLM 연결 갱신
- bunx gencow@latest whoami 로 로그인되어 있으면 bunx gencow@latest opencode setup 을 실행해. 이미 연결되어 있으면 "Already connected" 로 끝나고, 예전 방식으로 연결된 설치(OpenCode 데스크톱에서 키를 못 읽던 경우)는 새 토큰 없이 자동으로 고쳐져. 토큰은 출력하지 마.
- 로그인이 안 되어 있으면 이 단계는 건너뛰고, gencow login 후 다시 실행하라고 알려 줘.
- 실패하면 괄호 안의 코드와 안내 문장을 그대로 보여 주고 반복 실행하지 마.

[4단계] 점검
- node bin/cli.mjs doctor 를 실행하고 결과를 보여 줘.
- opencode mcp list 로 gencow 가 connected 인지 확인해.
  "needs authentication" 이면 opencode mcp auth gencow 를 안내해 줘. (브라우저 로그인은 내가 해.)

[5단계] 마무리
- 바뀐 것, 그대로인 것, 실패한 것을 표로 정리해 줘.
- 새 내용은 OpenCode를 완전히 종료했다가 다시 실행해야 적용된다고 알려 주고(Gencow LLM 연결을 갱신했다면 데스크톱 앱은 Cmd+Q 로 완전히 종료), 여기서 멈춰 줘.
```
