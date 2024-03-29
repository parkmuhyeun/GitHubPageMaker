---
layout: post
title: 운영체제란?
subtitle: 부제목 예시
tags: os booting kernel shell
description: >
  What is Operating System?
sitemap: true
hide_last_modified: true
categories:
  - etc
  - operating system
---

## 운영체제란?

![](/assets//img/blog/etc/operating%20system/os_1.PNG)

운영체제는 사용자가 컴퓨터를 편리하게 사용할 수 있도록 도와주는 소프트웨어이다. 운영체제 사용의 가장 큰 목적은 하드웨어 관리라고 할 수 있다. 컴퓨터에는 수 많은 하드웨어가 존재하는데 CPU, 메모리, 디스크, 키보드, 마우스, 모니터 등 이를 잘 관리해주어야 컴퓨터를 효율적으로 사용할 수 있다. 운영체제가 없다면 위에서 언급한 하드웨어에 관한 모든 관리를 사용자가 직접해야 되기 때문에 매우 불편할 것이다. 즉, 운영체제는 컴퓨터의 성능을 높이고 사용자에게 편의성을 제공하는 프로그램이라 할 수 있다.

## 부팅과정

![](/assets//img/blog/etc/operating%20system/os_2.PNG)

1. 컴퓨터의 전원이 켜지면 프로세서(CPU)는 ROM에 있는 내용을 읽는데 그 중 먼저 POST를 실행시킨다.
   - ROM안에는 현재 컴퓨터의 상태를 검사하는 POST(Power-On Self-Test), 하드디스크에 저장되어 있는 운영체제를 찾아 RAM에 가지고 오는 부트 로더(boot loader)로 이루어져 있다.
2. POST 작업이 끝나면 부트로더가 실행되어 OS를 RAM으로 가져오게 된다.

## 운영체제 구성

![](/assets//img/blog/etc/operating%20system/os_3.PNG)

운영체제는 크게 커널(Kernel)과 쉘(Shell)로 나뉘어집니다.

### 커널(Kernel)
커널은 운영체제의 심장이자 뇌라고 할 수 있는데 대표적으로 여섯가지의 역활이 있다.

1. 시스템 콜 인터페이스: 애플리케이션이 OS를 통해서 어떤 처리를 하고 싶으면 시스템 콜이라고 하는 명령을 이용해서 커널에 명령을 내린다. 이때 명령이 인터페이스를 통해 전달된다. 예를 들어 은행이나 구청 등의 접수 창구와 같다고 생각하면 되겠다.

2. 프로세스 관리: OS는 수백, 수천개의 프로세스를 가동할 수 있는데 이에 비해 물리 서버의 CPU 코어 수는 많아봐야 수십개 정도밖에 안 된다. 그래서 언제, 어떤 프로세스가 어느 정도 CPU 코어를 이용할 수 있는지, 처리 우선순위를 어떻게 결정할 것인지 등을 관리한다.

3. 메모리 관리: 프로세스 관리는 CPU 코어를 고려했지만, 메모리 관리에서는 물리메모리 공간의 최대치를 고려한다.

4. 네트워크 스택: 네트워크에서 발생하는 데이터 처리나 교환에는 다양한 구조가 존재하는데 커널이 TCP/IP를 사용해서 간단히 통신할 수 있는 구조를 제공한다.

5. 파일 시스템 관리: 파일 시스템용 인터페이스를 제공한다. 우리가 사용하는 문서 파일이나 엑셀 파일은 물리 디스크에 기록된 데이터로는 '0111...' 같은 숫자에 불과한데 파일 시스템 덕분에 애플리케이션은 '파일' 단위로 데이터를 작성하거나 삭제할 수 있다. 이 시스템을 관리.

6. 장치 드라이버: 물리 장치용 인터페이스를 제공, 각각의 물리 장치는 제조사가 다양하기 때문에 각각의 대응하는 애플리케이션을 만들기는 어렵다. 그래서 장치 드라이버를 이용해 그 아래에 있는 물리 장치를 은폐한다.

### 쉘(Shell)
쉘은 명령어 해석기로 사용자가 커널(운영체제)에 요청하는 명령어를 해석하여 커널에 요청하고 그 결과를 출력한다. 사용자는 GUI(Grphical User Interface) 나 CLI(Command Line Interface) 같은 방식으로 운영체제 명령을 요청할 수 있다.

---
참고: [https://velog.io/@codemcd/운영체제OS-1.-운영체제란()](https://velog.io/@codemcd/운영체제OS-1.-운영체제란)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.