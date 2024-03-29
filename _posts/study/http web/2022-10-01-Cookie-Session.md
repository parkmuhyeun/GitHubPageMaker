---
layout: post
title: 쿠키와 세션의 차이는 뭘까?
subtitle: 부제목 예시
tags: NETWORK Cookie Session
description: >
  What is the difference between a cookie and a session?
sitemap: true
hide_last_modified: true
categories:
  - study
  - http web
---

## 쿠키

쿠키는 클라이언트에 저장되는 키와 값으로 이루어진 파일로 이름, 값, 유효 시간, 경로 등을 포함하고 있다. 클라이언트 상태 정보를 브라우저에 저장해 서버에 요청시 Cookie를 넘겨줄 수 있다. 쿠키는 항상 서버로 넘어가기 때문에 최소한의 정보만 사용하는게 좋고 서버에 전송하지 않고 웹 브라우저 내부에서 데이터를 저장하고 싶으면 웹스토리지를 사용하면 된다. 쿠키는 사용자 로그인 세션 관리나 장바구니 같은 곳에서 활용할 수 있다.

>웹스토리지(로컬 스토리지, 세션 스토리지)
>
>로컬스토리지: 브라우저를 닫아도 남아있는 스토리지
>
>세션 스토리지: 브라우저를 닫으면 사라지는 스토리지

쿠키에 대해 더 자세히 알고 싶으면 [다음글] 참고

[다음글]:https://parkmuhyeun.github.io/study/http%20web/2022-05-21-http-header1/#%EC%BF%A0%ED%82%A4


### 쿠키 동작 방식
쿠키의 동작 방식을 로그인 예를 통해 한번 보자

![](/assets//img/blog/study/http-web/cs_1.PNG)

1. 로그인을 하면 서버로 부터 member의 상태값 1을 쿠키에 저장하게 된다.
2. 그 뒤로 서버에 요청하게 되면 쿠키의 memberId 1이 전달되어 누구인지 구별

## 세션

일정시간 동안 같은 브라우저로 들어오는 요청을 하나의 상태로 보고 그 상태를 유지하는 기술이다. 세션 같은 경우도 쿠키를 사용해서 값을 주고받으며 클라이언트 상태 정보를 유지하는데 쿠키에 중요 정보는 넣지 않고 세션 아이디를 넣어서 비교적 안전하게 저장하게 된다.

### 세션 동작 방식
세션의 경우도 로그인을 예를 통해 동작 방식을 확인해보자

![](/assets//img/blog/study/http-web/cs_2.PNG)

1.. 로그인을 하면 서버의 세션 저장소에 sessiondId와 그에 맞는 member를 저장한다.

![](/assets//img/blog/study/http-web/cs_3.PNG)

2.. 그리고 sessionId를 쿠키로 전달하게 되고 그 뒤로 서버에 요청하게 되면 sessionId를 서버로 전달해 구별하게 된다.

## 쿠키 vs 세션

쿠키 같은 경우 저장 위치는 클라이언트이고 세션은 서버에 저장되게 되기 때문에 쿠키 같은 경우 보안에 취약할 수 있다. 하지만 세션 같은 경우 세션id만 쿠키에 저장하기 때문에 비교적 안전하다. 반대로 속도를 보면 쿠키는 클라이언트에 저장되기 때문에 처리속도가 빠르지만, 세션은 실제 저장된 정보가 서버에 있으므로 따로 처리가 필요해 쿠키보다 느리다. 

마지막으로 생명주기를 보면 쿠키는 브라우저를 종료해도 계속해서 남아있을 수 있지만 세션 같은 경우는 만료시간에 상관없이 브라우저를 종료하면 삭제된다.

---
그림 참고:
[https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-2](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-2)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.