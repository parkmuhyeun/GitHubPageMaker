---
layout: post
title: 인터럽트(Interrupt)
subtitle: 부제목 예시
tags: os polling interrupt
description: >
  What is Interrupt?
sitemap: true
hide_last_modified: true
categories:
  - etc
  - operating system
---

## CPU가 입력을 받아들이는 방법

### 폴링 방식(polling)

![](/assets//img/blog/etc/operating%20system/int_1.PNG)

사용자가 명령어를 사용하여 입력 핀의 값을 계속 읽어서 변화를 알아내는 방식으로 하드웨어의 지원 없이도 언제든지 가능하다.

### 인터럽트 방식(interrupt)

![](/assets//img/blog/etc/operating%20system/int_2.PNG)

MCU 자체가 하드웨어적으로 그 변화를 체크하여 변화 시에만 일정한 동작을 하는 방식으로 하드웨어적으로 지원되는 몇개의 입력 또는 값의 변화에만 대응처리가 가능하다는 제약이 있으나 폴링에 비해 빠르고 특히 실시간 대응에는 필수적인 기능이다.

>MCU(Micro Controller Unit): 마이크로프로세서(CPU)와 입출력 모듈을 하나의 칩으로 만들어 정해진 기능을 수행하는 컴퓨터

만약 인터럽트 기능이 없었다면 마이크로컨트롤러는 특정한 일을 할 시기를 알기 위해 계속 체크(pollling)해야 된다. 근데 폴링을 하는 시간에는 마이크로컨트롤러는 자기 원래 할 일에 집중할 수 없게 돼서 비효율적

## 인터럽트(Interrupt)란?
인터럽트는 프로그램을 실행하는 도중에 예기치 않은 상황이 발생할경우 현재 실행하는 프로그램을 잠깐 중단하고 먼저 필요한 상황을 우선 처리한 후 실행하던 프로그램으로 다시 복귀하여 작업을 처리하는 것이다.

## 인터럽트 종류
- 외부 인터럽트: 입출력장치, 타이밍 장치, 전원 장치 등 외적이 요인으로 발생하는 인터럽트
  - ex) 전원 이상, 기계 착오, 외부 신호, 입출력
  - 주로 하드웨어에서 발생해서 하드웨어 인터럽트라고도 함
- 내부 인터럽트: 잘못된 명령이나 데이터를 사용할 때 발생
  - ex) 0으로 나누기, OverFlow, UnderFlow, 명령어 잘못 사용한 경우
  - 주로 프로그램 내부에서 발생해서 소프트웨어 인터럽트라고도 함

## 인터럽트 처리과정

![](/assets//img/blog/etc/operating%20system/int_3.PNG)

1. 현재 주 프로그램을 실행중 (①)
2. 인터럽트가 발생 (②)
3. 현재 진행중인 프로그램을 중단하고 현재 프로그램 상태를 저장한다. (③)
4. 인터럽트 서비스 루틴으로 점프 후 처리(④, ⑤, ⑥)
7. 인터럽트 작업이 끝나면 원래 하던 프로그램 상태 로드 (⑦, ⑧)
9. 다시 주 프로그램 실행(원래 하던 곳 이어서 진행) (⑨)


> 4번 과정을 추가적으로 설명하자면 인터럽트 벡터는 인터럽트가 발생했을 때, 그 인터럽트를 처리할 수 있는 서비스 루틴(ISR)들의 주소를 가지고 있는 공간이다.

> 운영체제는 각종 인터럽트별로 인터럽트 발생 시 처리해야할 내용이 이미 프로그램되어 있으며 이를 인터럽트 서비스 루틴 또는 인터럽트 핸들러이다.

---
참고:
- [https://m.blog.naver.com/PostView.nhn?blogId=scw0531&logNo=220650635893&proxyReferer=https:%2F%2Fwww.google.com%2F](https://m.blog.naver.com/PostView.nhn?blogId=scw0531&logNo=220650635893&proxyReferer=https:%2F%2Fwww.google.com%2F)
- [https://www.theengineeringprojects.com/2021/12/esp32-interrupts.html](https://www.theengineeringprojects.com/2021/12/esp32-interrupts.html)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.