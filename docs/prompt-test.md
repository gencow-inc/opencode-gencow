# 테스트 프롬프트

[설치 프롬프트](prompt-install.md)를 끝내고 OpenCode를 **재시작한 뒤** 붙여넣으세요. 읽기와 확인만 하며 아무것도 수정하지 않습니다.

```
너는 opencode-gencow 설정 묶음이 제대로 설치되었는지 점검하는 검증자야.
아무것도 수정하거나 삭제하지 말고, 읽기와 확인만 해. 결과는 항목별 ✓/✗ 표로 써 줘.

1. 스킬 확인
   - 사용할 수 있는 스킬 목록에 다음 5개가 있는지 확인해: gencow-getting-started, gencow-deploy-my-app, gencow-troubleshoot, git-master, debugging
   - macOS/Windows라면 ego-browser 스킬도 확인해.
   - 각 스킬의 description을 한 줄로 적어 줘.

2. 에이전트·명령 확인
   - gencow-helper 에이전트가 있는지 확인해.
   - 다음 명령이 있는지 확인해: /gencow-start, /gencow-deploy, /gencow-fix, /handoff

3. Gencow MCP 확인
   - gencow MCP가 연결(인증 완료)되어 있는지 확인해. 인증이 필요하다는 상태면 opencode mcp auth gencow 를 안내해.
   - 제공되는 도구 이름을 전부 나열해.
   - 문서 검색 도구로 "gencow deploy 사용법"을 검색해서 결과가 나오는지 확인해.
   - 오류 진단 도구에 "db:push 중 마이그레이션 오류"를 넣어서 답이 나오는지 확인해.

4. 로그인 확인
   - bunx gencow@latest whoami 로 로그인된 계정이 나오는지 확인해. (토큰은 출력하지 마.)

5. 스킬 내용 검증
   - gencow-getting-started와 gencow-deploy-my-app 스킬에 적힌 gencow 명령(init, dev --local, deploy, deploy status, whoami 등)이 MCP 문서의 내용과 일치하는지 비교해.
   - 틀렸거나 MCP 문서에 없는 명령이 있으면 어느 스킬의 어느 줄인지 알려 줘.

6. ego-browser 확인 (macOS/Windows만)
   - ego-browser 스킬이 인식되는지, 브라우저 앱 설치 안내가 나오는지만 확인해. 실제 사이트 조작은 하지 마.

7. 초급자 시나리오 점검
   - 내가 "할 일 목록 앱을 만들고 싶어"라고 말했다고 가정하고, gencow-helper가 어떻게 안내할지 첫 응답만 보여 줘. (명령은 실행하지 마.)
   - 어렵거나 어색한 표현이 있으면 알려 줘.

마지막에 "고쳐야 할 것" 목록을 우선순위 순서로 정리해 줘.
```
