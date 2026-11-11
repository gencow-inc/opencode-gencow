---
name: gencow-getting-started
description: Gencow로 새 앱을 처음 만들 때 사용. 프로젝트 생성, 로컬 실행, 첫 화면 확인까지 초급자 눈높이로 안내한다.
---

# Gencow 첫 앱 만들기

초급자가 따라올 수 있게 **한 번에 한 단계씩**, 쉬운 말로 안내한다. 전문 용어는 처음 나올 때 한 줄로 풀어 쓴다.

## 시작 전에 확인

1. Node.js와 패키지 관리자가 있는지 확인한다 (`node -v`).
2. Gencow CLI는 설치된 `gencow`를 쓰지 않고 항상 `bunx gencow@latest`로 실행한다 (예전 버전이 남아 있어도 최신 버전이 실행된다). 아래 모든 명령이 그렇다.
3. Gencow 로그인을 확인한다 (`bunx gencow@latest whoami`).
   - 로그인되어 있지 않으면 계정이 있는지 묻는다.
   - 계정이 없으면 https://gencow.app/signup 에서 가입하게 한다.
   - 계정이 있으면 https://gencow.app/login 에서 로그인하게 한 뒤 `bunx gencow@latest login`을 실행한다.
   - MCP는 `opencode mcp auth gencow` 로 인증해야 쓸 수 있다.
4. 모르는 기능이나 API는 추측하지 말고 **Gencow MCP**로 먼저 찾는다 (`search_services` → `describe_service` → `call_service`, `gencow-portal-tools` 스킬 참고).

## 순서

1. **무엇을 만들지 한 문장으로 묻는다.** 예: "할 일 목록 앱".
2. **템플릿을 고른다.** 대부분 `task-app` 또는 `default`로 충분하다.
   `bunx gencow@latest init <앱이름> --template task-app`
   (템플릿은 `default`, `task-app`, `admin-tool`, `fullstack`, `ai-chat`. 화면만 만들면 `default`, 데이터 저장이 필요하면 `task-app`이나 `fullstack`이 맞다. 의존성 설치가 오래 걸리거나 실패하면 `--no-install`로 만든 뒤 패키지 설치를 따로 한다.)
3. **폴더로 이동해 로컬에서 실행한다.** `bunx gencow@latest dev --local`
   (의존성이 없다는 오류가 나오면 패키지 설치를 먼저 한다.)
4. **화면이 뜨는지 확인한다.** 주소가 나오면 알려 주고, 브라우저로 열어 보게 한다.
5. **작게 하나만 바꿔 본다.** 예: 제목 글자 바꾸기. 바꾼 뒤 화면에서 확인하게 한다.

## 지킬 것

- 명령을 실행하기 전에 무엇을 하는지 한 줄로 설명한다.
- 클라우드에 올리는 일(`bunx gencow@latest deploy`)은 **사용자가 요청할 때만** 한다. 배포는 `gencow-deploy-my-app` 스킬을 따른다.
- 오류가 나면 `gencow-troubleshoot` 스킬로 넘어간다.
- 파일을 지우거나 덮어쓰기 전에 먼저 알린다.
