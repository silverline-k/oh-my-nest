# 티켓 및 굿즈 예약 서비스 - 제품 요구사항 문서

## 목차
1. [개요](#개요)
2. [기능](#기능)
3. [기술 아키텍처](#기술-아키텍처)
4. [데이터베이스 스키마](#데이터베이스-스키마)
5. [API 엔드포인트](#api-엔드포인트)
6. [보안 고려사항](#보안-고려사항)
7. [확장성 및 성능](#확장성-및-성능)
8. [향후 개선사항](#향후-개선사항)

## 개요

티켓 및 굿즈 예약 서비스는 이벤트 티켓 판매, 굿즈 예약, 패키지 상품을 처리하기 위한 확장 가능한 플랫폼입니다. 특히 티켓 오픈 기간 동안의 사용자 경험, 보안, 고가용성을 우선시합니다.

### 비즈니스 목표
- 원활한 티켓 구매 경험 제공
- 다양한 상품 유형 지원 (티켓, 굿즈, 패키지)
- 수요가 많은 기간 동안의 공정한 접근 보장
- 사용자 데이터와 거래에 대한 높은 보안 기준 유지
- 타사 서비스와의 쉬운 통합 가능

### 대상 사용자
- 이벤트 참가자
- 이벤트 주최자
- 굿즈 구매자
- 시스템 관리자

## 기능

### 1. 사용자 관리 및 인증

#### 이메일 기반 인증
- 이메일 회원가입 및 검증
- 5분 만료 6자리 인증 코드
- 비밀번호 재설정 기능
- 이메일 알림 시스템

#### OAuth2.0 통합
- Google 인증
- Naver 인증
- Kakao 인증
- 토큰 갱신 메커니즘

#### WebAuthn 생체 인증
- FIDO2 표준 준수
- 기기 등록
- 생체 인증
- 대체 인증 방법

#### 보안 기능
- 로그인 기록 추적
- IP 기반 보안 모니터링
- 세션 관리
- 요청 제한

### 2. 이벤트 및 상품 시스템

#### 이벤트 관리
- 이벤트 생성 및 설정
- 이벤트 일정 관리
- 수용 인원 관리
- 이벤트 상태 추적

#### 상품 유형
- **티켓**
  - 좌석 지정
  - 가격 등급
  - 수량 제한
  - 오픈 시간

- **굿즈**
  - 재고 추적
  - 예약 시스템
  - 배송 옵션
  - 번들 상품

- **패키지**
  - 맞춤 조합
  - 특별 가격
  - 한정 수량

### 3. 주문 시스템

#### 주문 처리
- 다중 상품 주문
- 주문 상태 추적
- 주문 내역
- 취소 정책

#### 주문 상태
- 대기 중
- 확정
- 취소됨
- 환불됨

### 4. 대기열 시스템

#### 대기열 관리
- Redis 기반 대기열
- WebSocket 알림
- 대기열 위치 추적
- 타임아웃 처리

#### 대기열 기능
- 공정한 대기열 알고리즘
- VIP 사용자 우선 접근
- 대기열 이탈 감지
- 수용 인원 기반 입장

## 기술 아키텍처

### 백엔드 스택
- **프레임워크**: NestJS
- **ORM**: TypeORM
- **데이터베이스**: MySQL
- **캐시**: Redis
- **실시간**: WebSocket
- **인증**: JWT, OAuth2.0, WebAuthn

### 시스템 구성요소

#### 1. API 레이어
- RESTful 엔드포인트
- GraphQL 지원 (향후)
- 요청 제한
- 요청 검증

#### 2. 서비스 레이어
- 비즈니스 로직
- 데이터 처리
- 외부 서비스 통합
- 오류 처리

#### 3. 데이터 레이어
- 데이터베이스 작업
- 캐싱 전략
- 데이터 검증
- 트랜잭션 관리

#### 4. 인증 레이어
- JWT 토큰 관리
- OAuth2.0 통합
- WebAuthn 구현
- 세션 처리

## 데이터베이스 스키마

### 핵심 테이블

#### 사용자
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    name VARCHAR(100),
    nickname VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```

#### 사용자 인증
```sql
CREATE TABLE user_authorization (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    refresh_token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 이벤트
```sql
CREATE TABLE events (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_at TIMESTAMP NOT NULL,
    total_tickets INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 상품
```sql
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    type ENUM('TICKET', 'MERCH', 'PACKAGE') NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id)
);
```

#### 주문
```sql
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELED') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 주문 항목
```sql
CREATE TABLE order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

## API 엔드포인트

### 인증
- `POST /auth/signup` - 사용자 등록
- `POST /auth/login` - 사용자 로그인
- `POST /auth/verify-email` - 이메일 인증
- `POST /auth/refresh` - 토큰 갱신
- `POST /auth/webauthn/register` - WebAuthn 등록
- `POST /auth/webauthn/authenticate` - WebAuthn 인증

### 이벤트
- `GET /events` - 이벤트 목록
- `GET /events/:id` - 이벤트 상세
- `POST /events` - 이벤트 생성 (관리자)
- `PUT /events/:id` - 이벤트 수정 (관리자)

### 상품
- `GET /products` - 상품 목록
- `GET /products/:id` - 상품 상세
- `POST /products` - 상품 생성 (관리자)
- `PUT /products/:id` - 상품 수정 (관리자)

### 주문
- `POST /orders` - 주문 생성
- `GET /orders` - 사용자 주문 목록
- `GET /orders/:id` - 주문 상세
- `PUT /orders/:id/cancel` - 주문 취소

### 대기열
- `POST /queue/join` - 대기열 참가
- `GET /queue/status` - 대기열 상태 확인
- `DELETE /queue/leave` - 대기열 이탈

## 보안 고려사항

### 인증 보안
- JWT 토큰 암호화
- 안전한 비밀번호 해싱
- OAuth2.0 상태 검증
- WebAuthn 증명 검증

### 데이터 보안
- 입력 검증
- SQL 주입 방지
- XSS 방어
- CSRF 방어

### API 보안
- 요청 제한
- IP 기반 제한
- 요청 검증
- 오류 처리

## 확장성 및 성능

### 수평적 확장
- 상태 비저장 아키텍처
- 로드 밸런싱
- 데이터베이스 샤딩
- 캐시 분산

### 성능 최적화
- 데이터베이스 인덱싱
- 쿼리 최적화
- 캐싱 전략
- 연결 풀링

### 모니터링
- 애플리케이션 메트릭
- 오류 추적
- 성능 모니터링
- 사용자 행동 분석

## 향후 개선사항

### 2단계
- 결제 게이트웨이 통합
- 모바일 앱 개발
- 분석 대시보드
- 마케팅 자동화

### 3단계
- AI 기반 추천
- 동적 가격 책정
- 소셜 기능
- 가상 대기열

### 4단계
- 블록체인 통합
- NFT 티켓
- 메타버스 이벤트
- 고급 분석