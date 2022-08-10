---
layout: post
title: HTTP vs HTTPS
subtitle: 부제목 예시
tags: HTTP HTTPS
description: >
  http와 https의 차이
sitemap: true
hide_last_modified: true
categories:
  - study
  - http web
---

## HTTP(Hyper Text Transfer Protocol)란?
HTTP는 서버/클라이언트 모델에 따라 데이터를 주고받기 위한 프로토콜이다. 즉, 인터넷에서 하이퍼텍스트를 교환하기 위한 통신 규약으로 주로 80번 포트를 이용한다. HTTP는 TCP/IP 위에서 동작하는 프로토콜로 주요 특징으로는 서버가 요청에 응답을 마치면 연결을 끊는 Connectionless와 이전 통신에 대한 정보를 기억하고 있지 않는 Stateless한 특징을 가지고 있다.

>하이퍼텍스트(HyperText): 중간에 다른 어떤 무언가를 거치지 않고도 다른 페이지로 접근할 수 있는 텍스트. 가장 대표적으로 HTML이 있다.

하지만 암호화 되지 않은 평문 데이터를 전송하는 프로토콜로 기밀한 정보(비밀번호, 주민등록번호 등)를 주고받기에 적절하지 않았는데 이러한 문제를 해결하기 위해 HTTPS가 등장하게 되었다.

>HTTP를 사용할 때 문제점?
>- 위장 가능
>   - 해커가 자신이 클라이언트나 서버인 것처럼 위장이 가능
>- 변조 가능
>   - 내가 받고 있는 데이터가 진짜 서버(클라이언트)가 보낸 것인지 확인을 하지 않기 때문에 중간에 해커가 개입해 변조 가능

## HTTPS(Hyper Text Transfer Protocol over Secure Socket Layer)란?
HTTPS는 HTTP에 암호화가 추가된 프로토콜이고 HTTP와 다르게 443번 포트를 사용한다. 네트워크 상에서 중간에 제3자가 정보를 볼 수 없도록 암호화를 지원하고 있다.

![](/assets//img/blog/study/http-web/htht_1.PNG)

>SSL(Secure Socket Layer): 클라이언트와 서버 사이에 전송되는 데이터를 암호화하여 인터넷 연결을 보호하기 위한 표준 기술로 해커가 전송되고 있는 기밀 정보를 보거나 훔치는 것을 방지한다.

>TLS(Transport Layer Security): SSL와 같은 의미로, TLS가 공식적인 명칭이지만 SSL 이라는 이름이 더 많이 사용되고 있다.

---
다음글에 HTTP와 HTTPS의 자세한 동작 과정을 알아보도록 하겠습니다!

---

참고:
[https://mangkyu.tistory.com/98](https://mangkyu.tistory.com/98)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.