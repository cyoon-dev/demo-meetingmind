# 5분 데모 시나리오

1. **정상 플로우**: Meeting 시작 → 녹음 시작/정지 → Upload Audio → Generate Summary.
2. **Slow Transcription** 토글 ON 후 전사 호출: latency 증가를 Splunk에서 확인.
3. **Summary Error** 버튼 후 요약 호출: 500 에러 span 및 error rate 확인.
4. **Bad Network** 토글 ON 후 전사/요약 호출: retry_count 속성과 실패/재시도 흐름 확인.
5. **Crash App** 버튼: crash/error 이벤트와 session 타임라인 확인.
