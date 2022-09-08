---
layout: post
title: 경쟁 상태(Race Condition)
subtitle: 부제목 예시
tags: os Race-Condition
description: >
  What is Race Condition?
sitemap: true
hide_last_modified: true
categories:
  - etc
  - operating system
---

## 경쟁 상태(Race Condition)이란?
공유 자원에 대해 여러 쓰레드가 프로세스가 동시에 접근할 때, 데이터의 불일치를 일으킬 수 있다. 예를들어 원래 User1와 User2의 목적은 계좌에 있던 30만원을 각각 5만원, 4만원을 넣어 39만원을 만들려는 목적인데 동시에 접근해 사용하게 되면 아래처럼 불일치가 일어나는 걸 볼 수 있다.

![](/assets//img/blog/etc/operating%20system/rc_1.png)

## Race Condition이 발생하는 경우
발생하는 경우를 보기전에 먼저 유저모드와 커널모드에 대해 알아보자

>유저모드: 사용자가 접근할 수 있는 영역을 제한적으로 두고, 프로그램의 자원에 함부로 접근하지 못하는 모드. 코드를 작성하고, 프로세스를 실행하는 행동을 할 수 있다.

>커널모드: 모든 자원(CPU, 메모리 등) 접근, 명령 가능한 모드

프로세스간에는 주소 공간이 독립적이지만 커널에 있는 자원은 여러 프로세스가 공유할 수 있기 때문에 주로 유저모드보다 커널모드일 때 Race Condition이 발생한다.

### 1. 커널 작업을 수행하는 중에 인터럽트 발생

![](/assets//img/blog/etc/operating%20system/rc_2.png)

커널 모드에서 데이터를 불러 작업을 수행하다 인터럽트가 발생하면 같은 데이터를 조작하게 된다. 그래서 커널모드에서 작업을 수행할 떄는 인터럽트가 발생되지 않도록 설정하면 된다.

### 2. 프로세스가 시스템 콜(System Call)을 하여 커널모드로 진입하여 작업을 수행하던 중 문맥 교환(Context Switch)이 발생할 때

![](/assets//img/blog/etc/operating%20system/rc_3.png)

프로세스 A가 커널모드에서 데이터를 작업(count값 읽고 증가)하는 도중 문맥교환이 일어나면 같은 프로세스 B에서 같은 데이터를 조작하게 된다. 이때, 프로세스2의 작업은 반영되지 않게 된다. 이 경우는 프로세스가 커널모드에서 작업하는 경우 CPU 제어권을 뺏지 않도록 하면 된다.


### 3. 멀티 프로세서에서 공유 메모리 내의 커널 데이터에 접근할 때

![](/assets//img/blog/etc/operating%20system/rc_4.png)

멀티 프로세스 환경에서 2개의 CPU가 동시에 커널 내부의 공유 데이터에 접근하는 경우도 문제가 생길 수 있는데 커널 내부에 있는 공유 데이터에 접근할 때마다 lock/unlock을 해서 해결할 수 있다.

## Thread-safe
멀티 스레드 환경에서 여러 스레드가 동시에 하나의 객체 및 변수(공유자원)에 접근할 때, 의도한 대로 동작하는 것을 의미한다. Thread-safe하기 위해서는 공유 자원에 접근하는 임계 영역(Critical Section)을 동기화 기법으로 잘 제어해줘야 된다. 동기화 기법에는 Mutex나 Semaphore 등이 있는데 자세하게 알고싶으면 [이 글]을 참고하면 되겠다.

[이 글]: https://parkmuhyeun.github.io/etc/operating%20system/2022-07-29-Process-Synchronization/

---
참고:
- [https://github.com/gyoogle/tech-interview-for-developer](https://github.com/gyoogle/tech-interview-for-developer)
- [https://hibee.tistory.com/297](https://hibee.tistory.com/297)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.