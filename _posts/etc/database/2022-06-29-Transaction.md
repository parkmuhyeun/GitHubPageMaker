---
layout: post
title: 트랜잭션(Transaction)
subtitle: 부제목 예시
tags: database transaction
description: >
  What is Transaction?
sitemap: true
hide_last_modified: true
categories:
  - etc
  - database
---

## 트랜잭션이란?
데이터베이스의 상태를 변환시키는 하나의 논리적인 작업 단위를 구성하는 연산들의 집합

- 예를들어 A계좌에서 B계좌에서 이체하는 상황일 때
  1. A 계좌의 잔액을 확인
  2. A 계좌의 금액에서 이체할 금액을 빼고 저장
  3. B 계좌의 잔액을 확인
  4. B 계좌의 금액에서 이체할 금액을 더하고 저장
- 이러한 과정이 모두 합쳐져 계좌 이체라는 하나의 작업단위 구성
- 하나의 트랜잭션은 Commit되거나 Rollback 될 수 있다.
  - Commit
    - 트랜잭션이 정상적으로 완료된 상태
  - Rollback
    - 하나의 트랜잭션 처리가 비정상으로 종료되었을 때 이 트랜잭션이 행한 모든 연산을 취소

## 트랜잭션의 특성

### 원자성(Atomicity)
트랜잭션을 처리하는 도중 문제가 발생하면 트랜잭션에 해당하는 어떠한 작업 내용도 수행되지 않고, 아무런 문제가 발생되지 않을 경우에만 정상적으로 모든 작업이 수행되어야 한다.

### 일관성(Consistency)
트랜잭션이 완료된 후에도 트랜잭션이 일어나기 전의 상황과 동일하게 데이터의 일관성을 보장해야한다.

### 고립성(Isolation)
각각의 트랜잭션은 서로 간섭없이 독립적으로 수행되어야 한다.

### 지속성(Durability)
트랜잭션이 정상적으로 종료된 후에는 영구적으로 반영되어야 한다.

## 트랜잭션의 상태

![](/assets//img/blog/etc/database/tra_1.PNG)

### 활동(Active)
트랜잭션이 실행 중인 상태

### 부분 완료(Partially Commited)
트랜잭션의 마지막 연산까지 실행했고, Commit 연산만 남은 상태

### 실패(Failed)
트랜잭션 실행에 오류가 발생해 중단된 상태

### 완료(Committed)
Commit 연산까지 실행해 트랜잭션이 정상적으로 완료된 상태

### 철회(Aborted)
트랜잭션이 비정상적으로 종료된 후 Rollback 연산으로 인해 트랜잭션 실행 전으로 돌아간 상태

>Commit(커밋): 하나의 트랜잭션 작업이 성공적으로 끝났고 데이터베이스가 일관성인 상태에 있을 때, 이 성공적인 작업을 트랜잭션 관리자에게 알려주는 것을 Commit 연산이라고 한다.

>Rollback(롤백): 하나의 트랜잭션 처리가 비정상적으로 종료되어 데이터베이스의 일관성이 깨진경우, 이 트랜잭션의 일부가 정상적으로 처리되었더라도 원자성에 근거해 이 트랜잭션이 행한 모든 연산을 취소하는 연산으로 Rollback시에 변경한 내용을 전부 원래대로 되돌린다.

### Partially Committed 와 Committed 차이점
Commit 요청이 들어오면 Partially Committed 상태가 된다. 이후 Commit을 정상적으로 수행할 수 있으면 Committed 상태가 되고, 만약 오류가 발생하면 Failed 상태가 된다.

## 트랜잭션을 사용할 때 주의할 점
일반적으로 데이터베이스의 커넥션의 개수가 제한적이기 때문에 트랜잭션의 범위를 최소화하는 것이 좋다. 많아지면 커넥션을 가져가기 위해 기다려야하는 상황이 발생한다.

---

참고: 
[https://github.com/WeareSoft/tech-interview](https://github.com/WeareSoft/tech-interview)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.