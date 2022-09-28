---
layout: post
title: 가비지 컬렉션(Garbage Collection)
subtitle: 부제목 예시
tags: java Garbage-Collection
description: >
 Garbage Collection
sitemap: true
hide_last_modified: true
categories:
  - etc
  - java
---

> 가비지 컬렉션(Garbage Collection)을 보기 전에 [JVM(Java Virtual Machine)]을 한번 보고 오시는걸 추천합니다.

[JVM(Java Virtual Machine)]: https://parkmuhyeun.github.io/etc/java/2022-06-04-JVM/

## Garbage Collection
Java의 가비지 컬렉터는 그 동작 방식에 따라 매우 다양한 종류가 있지만 공통적으로 다음 2가지 작업을 수행한다.
1. 힙(heap) 내의 객체 중에서 가비지(garbage)를 찾아낸다.
2. 찾아낸 가비지를 처리해서 힙의 메모리를 회수한다.

![](/assets//img/blog/etc/java/gc_1.PNG)

### Minor GC
새로 생성된 대부분의 객체(Instance)는 Eden 영역에에 위치한다. Eden영역에서 GC가 한번 발생한 후 살아남은 객체는 Survivor 영역 중 하나로 이동된다. 이 과정을 반복하다가 계속해서 살아남아 있는 객체는 일정시간 참조되고 있다는 뜻이므로 Old영역으로 이동

### Major GC
Old영역에 있는 모든 객체들을 검사하여 참조되지 않은 객체들을 한꺼번에 삭제한다. 시간이 오래 걸리고 실행 중 프로세스가 정지된다. 이것을 'stop-the-world'라고 하는데 Major GC가 발생하면 GC를 실행하는 스레드를 제외한 나머지 스레드는 모두 작업을 멈추고, 작업을 완료한 이후에야 다시 시작한다.

## GC와 Reachability
Java GC는 객체가 가비지인지 판별하기 위해서 reachability라는 개념을 사용한다. 어떤 객체에 유효한 참조가 있으면 'reachable', 없으면 'unreachable'로 구별하고, unreachable 객체를 가비지로 간주해 GC를 수행한다. 한 객체는 여러 다른 객체를 참조하고, 참조된 다른 객체들도 마찬가지로 또 다른 객체들을 참조할 수 있으므로 객체들은 참조 사슬을 이룬다. 이런 상황에서 유효한 참조 여부를 파악하려면 항상 유효한 최초의 참조가 있어야 하는데 이를 객체 참조의 root set이라고 한다.

JVM에서 메모리 영역인 런타임 데이터 영역(runtime data area)의 구조는 다음과 같다.

![](/assets//img/blog/etc/java/gc_2.PNG)

런타임 데이터 영역은 위와 같이 스레드가 차지하는 영역들과, 객체를 생성 및 보관하는 하나의 큰 힙, 클래스 정보가 차지하는 영역인 메서드 영역, 크게 세 부분으로 나눌 수 있다.

힙에 있는 객체들에 대한 참조는 다음 4가지 경우중 하나이다.
1. 힙 내의 다른 객체에 의한 참조
2. Java Stack, 즉 Java 메서드 실행 시에 사용하는 지역 변수와 파라미터들에 의한 참조
3. Natiave Stack, 즉 JNI(Java Native Inteface)에 의해 생성된 객체에 대한 참조
4. 메서드 영역의 정적 변수에 의한 참조

여기서 2, 3, 4는 root set으로, reachability를 판가름하는 기준이 된다.

root set과 힙 내의 객체를 중심으로 다시 그리면 다음과 같다.

![](/assets//img/blog/etc/java/gc_3.PNG)

위 그림에서 보듯, root set으로부터 시작한 참조 사슬에 속한 객체들은 reachable 객체이고, 이 참조 사슬과 무관한 객체들이 unreachable 객체로 GC 대상이다. 가장 오른쪽 아래 객체처럼 reachable 객체를 참조하더라도, 다른 reachable 객체가 이 객체를 참조하지 않는다면 이 객체는 unreachable 객체이다.

인스턴스가 가비지 컬렉션의 대상이 되었다고 해서 바로 소멸이 되는 것은 아니다. 빈번한 가비지 컬렉션의 실행은 시스템에 부담이 될 수 있기에 성능에 영향을 미치지 않도록 가비지 컬렉션 실행 타이밍은 별도의 알고리즘을 기반으로 계신이 되며, 이 계산결과를 기반으로 가비지 컬렉션이 수행.

---

참고
- [https://asfirstalways.tistory.com/159](https://asfirstalways.tistory.com/159)
- [https://d2.naver.com/helloworld/329631](https://d2.naver.com/helloworld/329631)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.