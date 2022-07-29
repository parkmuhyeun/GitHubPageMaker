---
layout: post
title: 프로세스 동기화(Process Synchronization)
subtitle: 부제목 예시
tags: os process-synchronization semaphore mutex-lock
description: >
  프로세스 동기화란?
sitemap: true
hide_last_modified: true
categories:
  - etc
  - operating system
---

## Critical Section(임계 영역)

![](/assets//img/blog/etc/operating%20system/ps_1.png)

공유하는 자원에 접근하는 코드 영역을 Critical Section이라고 한다. 공유 데이터에 두 개 이상의 프로세스가 동시에 접근하면 데이터 불일치가 발생할 수 있는데 데이터 일관성을 유지하기 위한 매커니즘을 동기화라고 한다. Critical Section으로 인해 발생하는 문제들을 해결하기 위해서는 기본적으로 다음 조건들을 만족해야 한다.

- Mutual Exclusion (상호 배제)
  - 이미 한 프로세스가 Critical Section에서 작업 중이면 다른 프로세스에서는 Critical Section에 진입하면 안된다.
- Progress (진행)
  - Critical Section에서 작업 중인 프로세스가 없다면, Critical Section에 들어가고자 하는 프로세스가 존재하는 경우 진입할 수 있어야 한다.
- Bounded Waiting (한정된 대기)
  - Critical Section에 진입하려는 프로세스가 무한정 기다려서는 안 된다.

## 동기화 방법

## Mutex Lock

![](/assets//img/blog/etc/operating%20system/ps_2.png)

Critical Section 문제를 해결하기 위한 가장 간단한 방법으로 mutext lock이 있다. Critical Section에 진입하는 프로세스는 들어갈 때 Lock을 걸어 이미 하나의 프로세스가 Critical Section에서 작업중일 때는 다른 프로세스가 Critical Section에 들어갈 수 없도록 한다. 그리고 빠져나올 때 다시 lock을 해제하여 동시에 자원을 접근하는 것을 막는다. 단점으로는 Critical Section에 프로세스가 존재할 때, 다른 프로세스들이 계속해서 진입하려고 시도하기 때문에 CPU를 낭비하게 된다(Busy Waiting).

## Semaphore

![](/assets//img/blog/etc/operating%20system/ps_3.png)

Semaphore는 카운터(Counter)를 이용하여 동시에 자원에 접근할 수 있는 프로세스를 제한한다. 주로 s라는 변수로 나타내며, 이는 사용 가능한 자원의 개수를 의미한다. 오직 두개의 atomic한 연산(wait, signal)을 통해서 접근할 수 있다.

### Busy-Wait 방식
이 방식은 P 자원이 모두 사용 중이라면 wait하는 방식으로 자원의 여유가 생기면 s--으로 자원을 획득하고 자원을 모두 사용했다면 s++를 통해 자원을 반납.

```c
//=wait(s)
P(s){
  while(s <= 0) do wait
  s--;
}

//=signal(s)
V(s){
  s++;
}
```

### Block - Wakeup 방식
먼저 세마포어를 아래 처럼 정의해준다.
```c
type struct{
  int value;
  struct process *L;
}semaphore;
```

먼저 자원의 값을 감소시키고, 만약 자원의 개수가 부족하다면 현재 프로세스를 wait queue에 추가시킨후, block을 호출해 중단시킨다.

다른 프로세스가 작업을 완료해 자원의 값을 증가시키며 반납을 했을 때, 자원의 수가 없다면(S.value <= 0) 현재 대기하는 프로세스가 있다는 뜻이므로 wait queue에서 프로세스를 꺼내 wakeup을 호출한다.

```c
//=wait(S)
P(S){
  S.value--;
  if(S.value < 0){
    add this.process to S.L;
    block();
  }
}

//=signal(S)
V(S) {
  S.value++;
  if(S.value <= 0){
    remove a process P from S.L;
    wakeup(P);
  }
}
```

### Busy-wait vs Block-wakeup
Critical Section의 길이가 긴 경우는 Block-wakeup 방식이 유리하고 길이가 짧은 경우에는 오히려 잦은 문맥 교환으로 오버헤드가 생기게 되어 Busy-wait가 유리하다.

## Semaphore vs Mutex
mutex와 semaphore의 가장 큰 차이점은 동기화 대상의 개수로 동기화 대상이 오직 하나일 때는 mutex, 동기화 대상이 하나 이상일 때는 semaphore를 사용한다.

---

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.