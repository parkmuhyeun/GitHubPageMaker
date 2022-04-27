---
layout: post
title: HTTP 메서드
subtitle: 부제목 예시
tags: HTTP http-method
description: >
  http-method
sitemap: true
hide_last_modified: true
categories:
  - study
  - http web
---

## HTTP 메서드 종류
주요 메서드
- GET: 리소스 조회
- POST: 요청 데이터 처리, 주로 등록에 사용
- PUT: 리소스를 대체, 해당 리소스가 없으면 생성
- PATCH: 리소스 부분 변경
- DELETE: 리소스 삭제

기타 메서드
- HEAD: GET과 동일하지만 메시지 부분을 제외하고, 상태 줄과 헤더만 반환
- OPTIONS: 대상 리소스에 대한 통신 가능 옵션(메서드)을 설명(주로 CORS에서 사용)
- CONNECT: 대상 자원으로 식별되는 서버에 대한 터널을 설정
- TRACE: 대상 리소스에 대한 경로를 따라 메시지 루프백 테스트를 수행

## GET

![](/assets//img/blog/study/http-web/hm_1.PNG)

- 리소스 조회
- 서버에 전달하고 싶은 데이터는 query(쿼리 파라미터, 쿼리 스트링)를 통해서 전달
- 메시지 바디를 사용해서 데이터를 전달할 수 있지만, 지원하지 않는곳이 많아서 권장하지 않음

## POST

![](/assets//img/blog/study/http-web/hm_2.PNG)

- 요청 데이터 처리
- 메시지 바디를 통해 서버로 요청 데이터 전달
- 서버는 요청 데이터를 처리
  - 메시지 바디를 통해 들어온 데이터를 처리하는 모든 기능을 수행
- 주로 전달된 데이터로 신규 리소스 등록, 프로세스 처리에 사용

## PUT

![](/assets//img/blog/study/http-web/hm_3.PNG)

- 리소스를 대체
  - 리소스가 있으면 대체
  - 리소스가 없으면 생성
  - 원래 있던 것에 덮어버림
- 클라이언트가 리소스를 식별!
  - 클라이언트가 리소스 위치를 알고 URI 지정
  - POST와 차이점

*리소스를 완전히 대체하기 때문에 주의해야한다.
- ex) "username" = "ex1", "age" = 25 일때, PUT 요청으로 "age" = 20을 보낸다면 username은 삭제되고 "age" = 20만 남게 됨.

## PATCH

![](/assets//img/blog/study/http-web/hm_4.PNG)

- 리소스 부분 변경

## DELETE

![](/assets//img/blog/study/http-web/hm_5.PNG)

- 리소스 제거

## HTTP 메서드의 속성
- 안전(Safe Methods)
- 멱등(Idempotent Methods)
- 캐시가능(Cacheable Methods)

![](/assets//img/blog/study/http-web/hm_6.PNG)

## 안전(Safe)
- 호출해도 리소스를 변경하지 않는다.

## 멱등(Idempotent)
- f(f(x)) = f(x)
- 한 번 호출하든 두 번 호출하든 100번 호출하든 결과가 같다.
- 멱등 메서드
  - GET: 한번 조회하든, 두 번 조회하든 같은 결과가 조회
  - PUT: 결과를 대체한다. 따라서 같은 요청을 여러번 해도 최종 결과는 같음
  - DELETE: 결과를 삭제한다. 같은 요청을 여러번 해도 삭제된 결과는 똑같다.
  - POST: 멱등이 아님! 두 번 호출하면 같은 결제가 중복해서 발생

## 캐시가능(Cacheable)
- 응답 결과 리소스를 캐시해서 사용해도 되는가?
- GET, HEAD, POST, PATCH 캐시 가능
  - 실제로는 GET, HEAD 정도만 캐시로 사용
  - POST, PATCH는 본문 내용까지 고려해야 되서 어려움

---

참고:
[Http Web](https://www.inflearn.com/course/http-%EC%9B%B9-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC#)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.