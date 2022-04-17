---
layout: post
title: Uri-Webbrowser
subtitle: 부제목 예시
tags: URI URL URN
description: >
  URI와 웹 브라우저 요청 흐름
sitemap: false
hide_last_modified: true
categories:
  - study
  - http web
---

## URI (Uniform Resource Identifier)

![](/assets//img/blog/study/http-web/uw_1.PNG)

URI는 로케이터(locator), 이름(name) 또는 둘다 추가로 분류될 수 있다.

- URL(Resource Locator)
  - ex) foo://example.com:8042/over/there?name=ferrent#nose
- URN(Resource Name)
  - ex) urn:example:animal:ferret:nose

### URI
- <b>U</b>niform: 리소스 식별하는 통일된 방식
- <b>R</b>esourec: 자원, URI로 식별할 수 있는 모든 것(제한 없음)
- <b>I</b>dentifier: 다른 항목과 구분하는데 필요한 정보

### URL, URN
- URL - Locator: 리소스가 있는 위치를 지정
- URN - Name: 리소스에 이름을 부여
- 위치는 변할 수 있지만, 이름은 변하지 않는다.
- URN 이름만으로 실제 리소스를 찾을 수 있는 방법이 보편화 되지 않음

## URL
전체 문법
- scheme://[userinfo@]host[:port][/path][?query][#fragment]
  - [ ]는 option
- https://www.google.com:443/search?q=hello&hl-ko
  - 프로토콜(https)
  - 호스트명(www.google.com)
  - 포트 번호(443)
  - 패스(/search)
  - 쿼리 파라미터(q=hello&hl=ko)

### scheme
- <b>scheme:</b>//[userinfo@]host[:port][/path][?query][#fragment]
- <b>https:</b>//www.google.com:443/search?q=hello&hl-ko
  - 주로 프로토콜 사용
  - 프로토콜: 어떤 방식으로 자원에 접근할 것인가 하는 약속 규칙
    - 예) http, https, ftp 등등
  - http는 80 포트, https는 443 포트를 주로 사용, 포트는 생략 가능
  - https는 http에 보안 추가 (HTTP Secure)

### userinfo
- scheme://<b>[userinfo@]</b>host[:port][/path][?query][#fragment]
- https://www.google.com:443/search?q=hello&hl-ko
  - URL에 사용자정보를 포함해서 인증
  - 거의 사용하지 않음

### host
- scheme://[userinfo@]<b>host</b>[:port][/path][?query][#fragment]
- https://<b>www.google.com</b>:443/search?q=hello&hl-ko
  - 호스트명
  - 도메인명 또는 IP 주소를 직접 사용가능

### port
- scheme://[userinfo@]host<b>[:port]</b>[/path][?query][#fragment]
- https://www.google.com:<b>443</b>/search?q=hello&hl-ko
  - 접속 포트
  - 일반적으로 생략, 생략시 http는 80, https는 443

### path
- scheme://[userinfo@]host[:port]<b>[/path]</b>[?query][#fragment]
- https://www.google.com:443<b>/search</b>?q=hello&hl-ko
  - 리소스 경로(path), 계층적 구조
  - ex) /user, /user/20

### query
- scheme://[userinfo@]host[:port][/path]<b>[?query]</b>[#fragment]
- https://www.google.com:443/search<b>?q=hello&hl-ko</b>
  - key=value 형태
  - ?로 시작, &로 추가 가능 => ?keyA=value&keyB=valueB
  - query parameter, query string 등으로 불림, 웹서버에 제공하는 파라미터, 문자 형태

### fragment
- scheme://[userinfo@]host[:port][/path][?query]<b>[#fragment]</b>
- https://docs.spring.io/spring-boot/docs/current/reference/html/gettingstarted.html<b>#getting-started-introducing-spring-boot</b>
  - fragment
  - html 내부 북마크 등에 사용
  - 서버에 전송하는 정보 아님

## 웹 브라우저 요청 흐름

![](/assets//img/blog/study/http-web/uw_2.PNG)

```
HTTP 요청 메시지

GET/search?q=hello&hl=ko HTTP/1.1
HOST: www.google.com
```

*DNS가 뭔지 모르겠으면 [이전글]을 참고

[이전글]:https://parkmuhyeun.github.io/study/http%20web/2022-03-27-Internet-Network/#dns

### 패킷 생성

![](/assets//img/blog/study/http-web/uw_4.PNG)

### 요청, 응답 과정

![](/assets//img/blog/study/http-web/uw_3.PNG)

![](/assets//img/blog/study/http-web/uw_5.PNG)

```
HTTP 응답 메시지

HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8
Content-Length: 3423
<html>
 <body>...</body>
</html>
```
![](/assets//img/blog/study/http-web/uw_6.PNG)

### 결과 

![](/assets//img/blog/study/http-web/uw_7.PNG)

---

참고:
[Http Web](https://www.inflearn.com/course/http-%EC%9B%B9-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC#)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.