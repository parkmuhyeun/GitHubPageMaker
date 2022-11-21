---
layout: post
title: JWT를 좀 더 안전하게 저장해보자
subtitle: 부제목 예시
tags: JWT XSS CSRF
description: >
  Let's save the token more safely
sitemap: true
hide_last_modified: true
categories:
  - project
--- 

>[이전 포스트]에서 JWT가 뭔지, 왜 사용했는지에 대해 포스팅했기 때문에 이번 글에서는 XSS, CSRF, JWT를 저장할 수 있는 방법들에 대해 알아보고 최종적으로 프로젝트에 어떤 걸 적용하였는지 알아보자

[이전 포스트]: https://parkmuhyeun.github.io/project/2022-09-07-Jwt/

## XSS, CSRF
먼저 저장하는 방법을 보기 전에 대표적인 웹 취약점 공격 방법인 XSS와 CSRF에 대해 알아보자

### XSS(Cross-Site-Scripting)
XSS는 악의적인 사용자가 공격하려는 사이트에 스크립트 넣는 기법을 말한다. 주로 다른 웹사이트와 정보를 교환하는 식으로 작동하므로 Cross-Site-Scripting이라 부른다.
- 사용자로부터 입력받은 값을 제대로 검사하지 않고 사용할 경우 발생
- 보통 의도치 않은 행동을 수행시키거나 쿠키나 세션 토큰 등의 민감한 정보를 탈취한다.
- 주로 자바스크립트를 사용하여 공격하는 경우가 많음
- 공격 방법에 따라 Stored XSS와 Reflected XSS로 나뉜다.
  - Stored XSS(저장형): 게시판이나 댓글, 닉네임 등에 스크립트가 서버에 저장되어 실행되는 방식
  - Reflected XSS(반사형): URL 파라미터에 스크립트를 넣어 서버에 저장하지 않고 즉시 스크립트를 만드는 방식
- XSS 방지 대책
  1. 쿠키에 중요한 정보를 담지 않고 서버에 중요 정보를 저장
  2. 정보를 암호화
  3. httponly(자바 스크립트에서 쿠키 접속 막는 옵션)

### CSRF(Cross-Site Request Forgery)
CSRF는 사용자가 자신의 의지와는 무관하게 공격자가 의도한 행위(수정, 삭제, 등록 등)를 특정 웹 사이트에 요청하게 하는 공격을 말한다. 즉, 사용자의 권한을 도용해 서버에 대한 악성 공격을 하는 것이다.
- CSRF 공격이 이루어질려면 다음 조건이 만족되야 됨
  1. 위조 요청을 전송하는 서비스에 피해자가 로그인 상태여야 한다.
  2. 피해자는 공격자가 만든 피싱 사이트에 접속해야한다.
- CSRF 방지 대책
  1. 서버에서 요청하는 referrer을 확인하여 domain이 일치하는지 검증
  2. Security Token 사용

## JWT를 어디에 저장하는게 좋을까?
일반적으로 LocalStorage, Cookie, Variable(memory)에 저장할 수 있다. 각 방법마다 의견이 다양하므로 어떤 방법을 사용할지는 다음 내용들을 읽어보고 생각해 보자.

### LocalStorage
간단한 방법으로 편리하다는 장점이 있다. 그리고 자동으로 담기는 쿠키와 다르게 자바스크립트 코드에 의해 헤더에 담기므로 CSRF로부터는 안전하다. 하지만 자바스크립트 코드를 통해 액세스할 수 있음으로 XSS 공격에 취약하다.

### Cookie
쿠키는 기본적으로 XSS, CSRF 공격에 모두 취약하지만 httpOnly, secure, SameSite 등과 같은 옵션을 주어 자바스크립트에서 쿠키에 접근 불가하게 만들 수 있다.

### Variable(memory)
다른 방식에 비해 안전하다고 할 수 있지만 variable은 웹 페이지가 리로드(이동, 새로고침)시 사라지기 때문에 UX(User Experience)상 좋지 않다. 사용자 입장에서 화면이 리로드 될 때마다 로그인해야 된다면 매우 귀찮을 것이다.

## 최종적으로 선택한 방법
결국 최종적으로 그중 안전한 Variable(memory)에 AccessToken을 저장하게 되었는데 하지만 이 경우 앞에서 말했듯이 리로드 시 사라지기 때문에 추가 보충 방법이 필요해 추가적으로 RefreshToken을 이용해 보완하게 되었다. 즉, AccessToken은 variable(memory)에 저장하고 RefreshToken은 HttpOnly, Secure, SameSite 옵션을 적용해서 쿠키에 저장하게 되는데 사용하는 흐름을 한번 보자.
1. 로그인을 하면 서버로부터 AccessToken(헤더), RefreshToken(쿠키)을 받는다.
2. 받은 AccessToken을 Variable(memory)에 저장
3. API 요청 시마다 헤더에 AccessToken 보내도록 설정
4. AccessToken이 만료되거나 페이지 리로드 될 때마다 RefreshToken을 이용해 AccessToken을 재발급 받는다.

이렇게 되면 RefreshToken이 CSRF에 의해 사용되더라도 공격자는 AccessToken을 알 수 없기 때문에 CSRF도 막을 수 있고 옵션 쿠키로 XSS도 막을 수 있다. 그리고 리로드마다 토큰이 사라지던 단점도 해결되기 때문에 최종적으로 적용하게 되었다.

---
참고:
[XSS, CSRF](https://lucete1230-cyberpolice.tistory.com/23)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.