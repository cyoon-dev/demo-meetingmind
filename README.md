# demo-meetingmind

Splunk Mobile Monitoring(RUM) + APM 상관분석 데모를 위한 **모바일(Expo) + 백엔드(Express)** 샘플입니다.

## 프로젝트 구조

```text
/demo-meetingmind
  /mobile        Expo + React Native + TypeScript
  /server        Express + TypeScript + OpenTelemetry
  /docs          데모 시나리오
```

## 1) 로컬 실행 방법

### 서버 실행

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 모바일 실행

```bash
cd mobile
npm install
cp .env.example .env
npm run start
```

> 순서: **서버 먼저 실행 → 모바일 실행**

## 2) 모바일 API_BASE_URL 설정

- iOS/Android 에뮬레이터 또는 실기기에서 서버 접근 가능한 주소 사용
- 같은 Wi-Fi 환경이면 `http://<내PC_LAN_IP>:4000`
- 원격 디바이스는 ngrok/tunnel URL 사용 가능
- `mobile/.env`의 `MOBILE_API_BASE_URL` 값을 변경

## 3) 데모 시나리오 (5분)

1. 정상 플로우 1회 (녹음 → 전사 → 요약 → 공유)
2. `Slow Transcription` ON 후 전사 호출 → Splunk latency 확인
3. `Summary Error` 버튼 후 요약 호출 → 500 에러 확인
4. `Bad Network` ON 후 호출 → retry span/이벤트 확인
5. `Crash App` 버튼으로 오류 이벤트 확인

자세한 순서는 [`docs/demo-scenario.md`](docs/demo-scenario.md) 참고.

## 4) Splunk에서 확인할 포인트

- RUM 세션에서 화면 전환 span (`screen.view:*`)
- 사용자 액션 이벤트 (`user.action:*`)
- HTTP client span (`http.client: /transcribe`, `/summarize`)
- 서버 trace에서 `meeting.id`, `demo.*` attribute 확인
- 에러율(500 / timeout / crash) 및 모바일-백엔드 상관관계 분석

## 환경 변수

### mobile/.env

```env
MOBILE_API_BASE_URL=http://localhost:4000
OTEL_EXPORTER_ENDPOINT=http://localhost:4318/v1/traces
OTEL_SERVICE_NAME=meetingmind-mobile
```

### server/.env

```env
PORT=4000
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces
OTEL_SERVICE_NAME=meetingmind-server
LOG_LEVEL=info
```

## 테스트

```bash
cd server
npm test
```
