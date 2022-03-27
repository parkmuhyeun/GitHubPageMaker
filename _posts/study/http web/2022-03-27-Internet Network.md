---
layout: post
title: Internet Network
subtitle: 부제목 예시
tags: http IP TCP UDP PORT DNS
description: >
  인터넷 네트워크
sitemap: false
hide_last_modified: true
categories:
  - study
  - http web
---

## 인터넷에서 컴퓨터 둘은 어떻게 통신할까?

![](/assets//img/blog/study/http-web/IN_1.PNG)

## IP 주소 부여

![](/assets//img/blog/study/http-web/IN_2.PNG)

### IP
인터넷 프로토콜 역활
- 지정한 IP 주소에 데이터 전달
- 패킷(Packet)이라는 통신 단위로 데이터 전달

### IP 패킷 정보

![](/assets//img/blog/study/http-web/IN_3.PNG)

### 클라이언트 패킷 전달

![](/assets//img/blog/study/http-web/IN_4.PNG)

### 서버 패킷 전달

![](/assets//img/blog/study/http-web/IN_5.PNG)

### IP 프로토콜의 한계
- 비연결성
  - 패킷을 받을 대상이 없거나 서비스 불능 상태여도 패킷 전송
- 비신뢰성
  - 중간에 패킷이 사라지면?
  - 패킷이 순서대로 안오면?
- 프로그램 구분
  - 같은 IP를 사용하는 서버에서 통신하는 애플리케이션이 둘 이상이면?

## TCP, UDP

### 인터넷 프로토콜 스택의 4계층

![](/assets//img/blog/study/http-web/IN_6.PNG)

### 프로토콜 계층

![](/assets//img/blog/study/http-web/IN_7.PNG)

### TCP/IP 패킷 정보

![](/assets//img/blog/study/http-web/IN_8.PNG)

### TCP 특징
전송 제어 프로토콜(Transmission Control Protocol)
- 연결지향 - TCP 3 way handshake (가상 연결)
- 데이터 전달 보증
- 순서 보증
- 신뢰할 수 있는 프로토콜
- 현재는 대부분 TCP 사용

### TCP 3 way handshake

![](/assets//img/blog/study/http-web/IN_9.PNG)

- SYN: 접속 요청
- ACK: 요청 수락
- 3.ACK와 함께 데이터 전송 가능

### UDP 특징
사용자 데이터그램 프로토콜(User Datagram Protocol)

- 연결지향 X
- 데이터 전달 보증 X
- 순서 보장 X
- 데이터 전달 및 순서가 보장되지 않지만, 단순하고 빠름
- 정리
  - IP와 거의 같지만 PORT + 체크섬 정도만 추가
  - 애플리케이션에 추가 작업 필요

## PORT
같은 IP 내에서 프로세스 구분

![](/assets//img/blog/study/http-web/IN_10.PNG)

- 0 ~ 65535 할당 가능
- 0 ~ 1023 : 잘 알려진 포트, 사용하지 않는 것이 좋음
  - FTP - 20, 21
  - TELNET - 23
  - HTTP - 80
  - HTTPS - 443

## DNS
- IP는 기억하기 어렵다.
  - ex) IP: 200.200.200.2
- IP는 변경될 수 있다.
  - 과거 IP: 200.200.200.2 -> 신규 IP: 200.200.200.3

### DNS
도메인 네임 시스템(Domain Name System)
- 도메인 명을 IP 주소로 변환

![](/assets//img/blog/study/http-web/IN_11.PNG)

참고:
[Http Web](https://www.inflearn.com/course/http-%EC%9B%B9-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC#)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.