# 뉴스 & 뉴스피드

## About This Project
학교 관리자가 뉴스를 발행, 수정, 삭제 등 행위를 하며,
학생은 학교를 구독, 뉴스 조회, 뉴스 피드를 조회 힙니다.

## Getting Started
1. 사전 준비 사항
    1. Docker
    2. Docker compose
    3. Node (>=v20.10.0)
    4. pnpm (>=7.26.1)
2. Installation
    1. 디렉토리 구조를 생성 합니다
        1. ```mkdir -p classting-coding-test-1```
    2. 리포지토리를 클론 합니다.
        1. ```cd classting-coding-test-1 && git clone https://github.com/dhtmdgkr123/classting-coding-test code```
    3. .env(프로젝트 루트 디렉토리에 위치 합니다) 예제를 복사 합니다
        1.  ```cd code && cp .env.example .env```
    4. MySQL 서버를 구동합니다
        1. ```cd infra && docker compose up -d```
            1. 현재 DB서버 설정
                1. ID: root
                2. PW: root123123
                3. HOST: localhost (해당 부분은 실행 환경에 따라 변경 될 수 있습니다)
                4. PORT: 984 (984 포트를 이미 사용 중 이라면, 984 포트가 아닌 타 포트로 변경 후 서버 구동 부탁드립니다)
    
    5. .env(프로젝트 루트 디렉토리에 위치 합니다)파일 내 내용을 하단 가이드에 맞추어 수정 합니다.
        1. DATABASE_URL
            1. "mysql://데이터베이스_계정명:데이터베이스_계정_암호@데이터베이스_서버_주소:데이터베이스_서버_포트/classting_news
            2. 환경 변수 설정은 MySQL 서버 구동 중 설정한 환경, 계정에 맞춥니다.
        2. PORT
            1. PORT=3000
            2. 어플리케이션 서버가 구동되는 포트 번호 입니다
    
    6. 디펜던시 설치
        1. ```pnpm i```
    
3. 어플리케이션 실행
    1. 어플리케이션 서버 실행
        1. ```pnpm run start:dev```
    2. e2e 테스트 실행
        1. ```pnpm run test:e2e```

## 주의사항
1. "학생" 생성은 API가 따로 없어 직접 생성이 필요로 합니다.

## API 문서 (Swagger)
http://서버호스트_주소:포트번호/api/documentation