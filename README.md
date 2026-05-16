# 말씀카드 메이커

말씀·시·명언과 사진으로 한 장의 카드를 만드는 웹앱. **무료 · 설치 없음 · 휴대폰 앱(PWA) 지원.**

## 기능
- 글귀 입력 + 성경 구절 선택(개역한글·WEB·KJV 자동 / 개역개정·NIV·쉬운성경 참조 자동)
- 배경: 샘플 30종(앱이 직접 그림) · 무료 AI · 내 사진 · 사진검색(위키미디어+Openverse) · DALL·E/Gemini
- **캐릭터/스티커**: 귀여운 동물·성경 상징 이모지를 카드에 추가, 드래그로 위치 이동
- 스타일 3종 · 비율 4종 · 한글 글꼴 7종 · 색/위치/흐림 조절
- PNG 저장 · 모바일 공유 · 설정 자동 저장

## PC에서 쓰기
`index.html` 더블클릭 → 브라우저에서 열림. (단, 휴대폰 앱 설치·오프라인 기능은 아래 웹 배포 후 동작)

## 휴대폰 앱으로 쓰기 (PWA)
1. 아래 "웹에 배포(Vercel)"로 https 주소를 만든다.
2. 휴대폰 브라우저로 그 주소를 연다.
3. **Android(Chrome)**: 메뉴 → "앱 설치" / "홈 화면에 추가"
   **iPhone(Safari)**: 공유 → "홈 화면에 추가"
4. 홈 화면 아이콘으로 앱처럼 실행(전체화면) · 오프라인에서도 카드 제작 가능
   (AI·사진검색·성경 자동 불러오기만 인터넷 필요)

> 앱스토어용 네이티브 앱(APK/IPA)은 별도 빌드 도구가 필요하고 하루 1~5장 사용엔 과합니다.
> PWA가 무료·무설치로 동일한 "앱" 경험을 줍니다.

## GitHub에 저장
이 폴더에서 (git 설치됨, 로컬 커밋은 이미 완료):
```bash
# 1) 깃허브에서 빈 저장소 생성 (예: wordcard-maker)
# 2) 원격 연결 후 푸시
git remote add origin https://github.com/<사용자명>/wordcard-maker.git
git branch -M main
git push -u origin main
```
> 이 PC에는 GitHub CLI가 없어 자동 생성은 불가합니다. github.com 에서 저장소만 만든 뒤 위 3줄을 실행하세요.
> 로그인 창이 뜨면 진행하면 됩니다. (Claude Code에서는 `! git push -u origin main` 처럼 `!` 로 실행)

## 웹에 배포 (Vercel · 무료)
가장 쉬운 방법 — CLI 불필요:
1. vercel.com 로그인(깃허브 계정으로 가능)
2. **Add New → Project → 위 GitHub 저장소 Import**
3. Framework Preset: **Other** (빌드 설정 없음), 그대로 **Deploy**
4. 발급된 `https://....vercel.app` 주소가 완성된 앱 — 휴대폰에서 PWA 설치

대안(드래그 배포): app.netlify.com/drop 에 이 폴더를 끌어다 놓으면 즉시 주소 발급.

## 구성 파일
- `index.html` 앱 본체(단일 파일)
- `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png` — 휴대폰 앱(PWA)
- `PRD.md` 요구사항 문서
