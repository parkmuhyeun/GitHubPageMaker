---
layout: post
title: PCB와 Context Switching
subtitle: 부제목 예시
tags: os pcb context-switching
description: >
  What is PCB, Context Switching?
sitemap: true
hide_last_modified: true
categories:
  - etc
  - operating system
---

우리는 인터넷을 하고 있는 동시에 음악도 들을 수 있고 채팅도 할 수 있다. 어떻게 컴퓨터는 동시에 처리할까? 컴퓨터는 사실 동시에 처리하는 것이 아니라 각 프로그램을 일정시간 동안 번갈아가면서 실행(TIME SHARING)하고 있는데 그 속도가 매우 빨라서 우리가 동시에하고 있는 것처럼 느낄뿐이다.

프로세스들이 교체되어 수행되고 나면 다시 원래 하고 있던 프로세스를 불러와야 되는데 그때 원래 하던 작업을 기억하고 있어야 겠죠. 이때 프로세스 단위로 정보를 저장하는 구조가 바로 PCB(Process Control Block)입니다.

## PCB(Process Control Block) 란?
- 운영체제가 프로세스를 제어하기 위한 정보를 저장해놓는 곳으로, 프로세스 상태 정보를 저장하고 있는 구조체
- 프로세스 상태 관리와 문맥교환(Context Swiching)을 위해 필요
- PCB는 프로세스 생성 시 만들어지며 주기억장치에 유지

다시 한번 예로 들면, 기존에 어떤 프로세스를 작업하고 있는데 급한 프로세스가 처리해달라고 요청이 오면 원래 하던 프로세스를 어딘가에 임시 저장을 해놓아야 급한 프로세스를 처리하고 나서도 다시 원래하던 애를 이어서 할 수 있겠죠. 즉, 프로세스에 대한 상태 정보를 저장할 공간이 필요한데 그게 바로 PCB입니다.

## PCB 저장 정보

![](/assets//img/blog/etc/operating%20system/pcs_1.png)

- Process ID: 프로세스 고유 식별번호로, PID(Process Identification Number)라고도 한다.
- Process State(프로세스 상태): 프로세스의 현재 상태(준비, 실행, 대기 등의 상태)를 저장
- Program Counter(계수기): 다음에 실행되는 명령어의 주소를 저장
- Process Priority(스케줄링 정보): 프로세스 우선순위 등과 같은 스케줄링 관련 정보를 저장
- CPU Registers: 프로세스의 레지스터 상태를 저장하는 공간
- Account(계정 정보): CPU 사용시간, 각종 스케줄러에 필요한 정보 저장
- 입출력 정보: 프로세스 수행 시 필요한 주변 장치, 파일등의 정보를 저장

이렇게 프로세스에 대한 상태를 저장한 PCB에 의존하여 프로세스를 변경하는데, 다른 프로세스로 변경하는 것을 Context Switching이라 한다.

## Context Switching
멀티 프로세스 환경에서 CPU가 하나의 프로세스를 실행하고 있는 상태에서 인터럽트 요청에 의해 다음 우선 순위의 프로세스가 실행되어야 할 때 기존의 프로세스 상태 값을 PCB에 저장하고 CPU가 다음 프로세스를 실행할 수 있도록 다음 PCB를 읽어 교체하는 작업을 Context Switching이라 한다.

### Context Switching 과정

![](/assets//img/blog/etc/operating%20system/pcs_2.png)

1. 현재 CPU는 process P0을 수행하고 있다가 인터럽트(interrupt)가 걸리게되면 현재 수행하고 있는 것을 먼저 PCB0에 저장을 한다.
2. Waiting 상태로 변하게 되면 CPU는 다른 프로세스(process P1)을 Running으로 바꿔 올린다.
3. CPU가 앞으로 수행할 프로세스(process P1)에 관한 정보로 교체
4. 이번에는 CPU가 process P1을 수행하다 다시 인터럽트(interrupt)가 걸리면 현재 수행하고 있는 것을 PCB1에 저장한다.
5. Waiting 상태로 변하게 되면 CPU는 다른 프로세스(process P0)을 Running으로 바꿔 올린다.
6. CPU가 앞으로 수행할 프로세스(process P0)에 관한 정보로 교체

### 왜 Context Swiching이 필요?
만약 컴퓨터 매번 하나의 Task만 처리한다면 다음 Task를 처리하기 위해선 현재 Task가 끝날 때까지 기다려야 되기 때문에 매우 불편하다. 그래서 동시에 사용하는 것처럼 하기 위해 Context Switching이 필요하게 되었다.

## Context Switching 오버헤드
현재 Context Switching 과정을 보면 P0이 수행되다가 P1이 되고 P1을 수행하다 다시 P0이 수행이 실행이 된다. 이렇게 계속 교체가 되면 현재 수행되던 프로세스를 메모리에 저장하고, 다음 수행할 프로세스를 CPU에 넣어야 되는 이런 번거로운 일(overhead)이 추가가 되는데 왜 이렇게 하는 걸까? 그냥 P0을 한번에 한 다음 P1을 하면 되지 않을까?

프로세스 수행 중 입출력 이벤트가 발생했을 때 CPU를 사용하지 않게 되는데 이 CPU가 낭비되는 시간 동안 차라리 overhead가 발생하더라도 Context Switching을 통해 다른 프로세스를 실행시키는 게 전체적으로 봤을 때 더 효율적이기 때문에 overhead를 감수하고 Context Switching을 하는 것이고 그래서 운영체제가 CPU를 관리하는 것이다.

---
참고: [https://jhnyang.tistory.com/33](https://jhnyang.tistory.com/33)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.