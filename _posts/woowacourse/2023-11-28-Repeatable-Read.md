---
layout: post
title: 과연 MySQL의 REPEATBLE READ에서는 PHANTOM READ 현상이 일어나지 않을까?
subtitle: 부제목 예시
tags: woowacourse transaction repeatable-read PHANTOM_READ
description: >
  I wonder if phantom reads happen with REPEATBLE READ in MySQL?
sitemap: true
hide_last_modified: true
categories:
  - woowacourse
---

MySQL의 REPEATBLE READ 격리 수준에서는 PHANTOM READ 현상이 발생하지 않는다고 많이 본거 같은데 과연 진짜일까?

## REPEATABLE READ이란?

REPEATABLE READ는 **동일 트랜잭션 내에서는 동일한 결과**를 보장할 수 있는 격리 수준으로 MySQL의 InnoDB 스토리지 엔진에서 **기본**으로 사용되는 격리 수준이다. 어떻게 동일한 결과를 보장해 줄 수 있을까? **MVCC**(Multi Version Concurrency Control)라는 매커니즘을 이용해 언두 영역에 이전 데이터를 백업해두고 실제 레코드 값을 변경한다.

> MVCC: 데이터베이스에서 동시성을 제어하기 위해 사용하는 방법으로 새로운 값을 업데이트하면 이전 값은 언두(UNDO) 영역에 관리함으로써 하나의 레코드에 대해 여러 개의 버전이 동시에 관리된다. MVCC의 가장 큰 목적은 잠금을 사용하지 않는 일관된 읽기를 제공하는 데 있음.

### REPEATABLE READ 동작 과정

![](/assets/img/blog/woowacourse/rr_1.png)

1. 사용자 B가 처음 SELECT(emp_no = 500000) 했을 때 결과로 Lara를 반환받음
2. 사용자 A가 Lara를 Toto로 UPDATE 하면 언두 로그에 이전 데이터 복사
3. 그 후에 사용자 B가 다시 SELECT로 읽었을 때 언두 로그를 이용해 같은 값인 Lara 반환

사용자 B가 두 번째 읽었을 때 해당 레코드의 TRX-ID(12)가 자신의 TRX-ID(10)보다 늦게 시작되었기 때문에 언두 로그를 통해 읽었다. 여기서 궁금증이 생겼다. 다음과 같이 자신의 트랜잭션 ID보다 작은 경우에는 어떻게 될까?

![](/assets/img/blog/woowacourse/rr_2.png)

확인해 본 결과 같은 값인 moomin2를 들고 온다. 자신보다 큰 트랜잭션 ID인 경우에 언두 로그에 들어가서 가져오는 건가 했었는데 이런 경우도 있기 때문에 select 할 때 해당 레코드가 변경되었는지 혹은 해당 언두로그들이 있는지 확인 후 가져오는 매커니즘이 있는 것 같다.

## PHANTOM READ(유령 읽기)

REPEATABLE READ 격리 수준에서는 DIRTY READ, NON REPEATBLE 문제는 해결할 수 있으나 **PHANTOM READ** 문제는 여전히 발생한다. REPEATABLE READ에서 새로운 레코드의 삽입까지는 막지 않기 때문에 SELECT로 조회했을 때 다른 트랜잭션에 의해 추가된 데이터를 얻을 수 있는데 이를 PHANTOM READ라 한다.

위에서 설명한 MVCC 덕분에 일반적인 조회에서는 PHANTOM READ가 발생하지 않는다. 자신보다 나중에 실행한 트랜잭션이 추가하는 레코드는 무시하면 된다. (자신보다 먼저 시작된 트랜잭션이 추가한 레코드도 무시하는지 실행해 보았는데 무시하는 걸로 보아 스냅샷이나 원래 없던 데이터라고 언두로그에 반영을 하는 것 같다. for update로 잠금을 걸고 조회 시 보임)

하지만, 잠금을 하고 읽는 경우 달라진다. **언두 레코드에는 잠금을 걸 수 없기 때문에 잠금을 하고 조회하는 레코드의 경우 언두 영역의 변경 전 데이터를 가져오는 것이 아니라 현재 레코드의 값을 가져오게 된다.** 이로 인해 데이터의 부정합이 일어나 PHANTOM READ가 발생한다.

다음 4가지의 경우에 **갭락**이 있는 MySQL과 일반적인 RDBMS에서 어떻게 작동하는지 알아보자.
1. SELECT FOR UPDATE -> INSERT -> SELECT
2. SELECT FOR UPDATE -> INSERT -> SELECT FOR UPDATE
3. SELECT -> INSERT -> SELECT
4. SELECT -> INSERT -> SELECT FOR UPDATE

> 갭락: 레코드가 아닌 레코드와 레코드 사이의 간격을 잠금으로써 레코드의 생성, 수정 및 삭제를 제어

### SELECT FOR UPDATE -> INSERT -> SELECT

#### 일반적인 RDBMS의 경우

![](/assets/img/blog/woowacourse/rr_3.png)

1. 일반적인 RDBMS의 경우 갭락은 없기 때문에 2번 레코드에만 잠금이 걸림.
2. moomin3 정상적으로 INSERT
3. MVCC 덕분에 User B가 두 번째 조회 시 moomin2만 나옴

-> MVCC 덕분에 PHANTOM READ 발생 X

### MySQL의 경우

![](/assets/img/blog/woowacourse/rr_4.png)

1. MySQL의 경우 2번 레코드에 레코드 락과 id가 2보다 큰 범위에는 갭락으로 넥스트 키 락이 걸리게 된다.
2. moomin3을 INSERT 하려고 하지만 갭락으로 인해 대기
3. User B가 두 번째 조회했을 때 moomin2만 반환하게 됨
4. User B의 트랜잭션이 커밋 되고 나면 갭락이 해제되면서 User A의 트랜잭션이 진행

-> 갭락덕분에 PHANTOM READ 발생 X

### SELECT FOR UPDATE -> INSERT -> SELECT FOR UPDATE

#### 일반적인 RDBMS의 경우

![](/assets/img/blog/woowacourse/rr_5.png)

1. 일반적인 RDBMS의 경우 갭락은 없기 때문에 2번 레코드에만 잠금이 걸림.
2. moomin3 정상적으로 INSERT
3. 잠금 있는 읽기는 데이터 조회가 언두 로그가 아닌 테이블에서 수행되기 때문에 두 번째 조회 시 moomin2와 moomin3 2건이 나오게 됨.

-> 잠금 읽기 때문에 PHANTOM READ 발생

### MySQL의 경우

![](/assets/img/blog/woowacourse/rr_6.png)

1. MySQL의 경우 2번 레코드에 레코드 락과 id가 2보다 큰 범위에는 갭락으로 넥스트 키 락이 걸리게 된다.
2. moomin3을 INSERT 하려고 하지만 갭락으로 인해 대기
3. 언두 로그 대신 테이블을 읽지만 어차피 아직 데이터가 Insert가 되지 않아 User B가 두 번째 조회했을 때 moomin2만 반환하게 됨
4. User B의 트랜잭션이 커밋 되고 나면 갭락이 해제되면서 User A의 트랜잭션이 진행

-> 갭락덕분에 PHANTOM READ 발생 X

### SELECT -> INSERT -> SELECT

이 경우에는 일반적인 RDBMS나 MySQL 둘 다 같음.

![](/assets/img/blog/woowacourse/rr_7.png)

1. User B는 아무 잠금 없이 조회.
2. 잠금이 없으므로 moomin3 정상적으로 INSERT
3. MVCC 덕분에 User B가 두 번째 조회 시 moomin2만 나옴

-> MVCC덕분에 PHANTOM READ 발생 X

### SELECT -> INSERT -> SELECT FOR UPDATE

MySQL의 경우 갭락 덕분에 일반적으로 PHANTOM READ가 발생하진 않는다. 하지만, 유일하게 **이 경우**에만 발생하게 된다. 마찬가지로, 일반적인 RDBMS 경우도 여기서 또 발생하게 됨.

![](/assets/img/blog/woowacourse/rr_8.png)

1. User B는 아무 잠금 없이 조회.
2. 잠금이 없으므로 moomin3 정상적으로 INSERT
3. 사용자 B가 두 번째 조회 시 SELECT FOR UPDATE로 조회했기 때문에 2건의 결과 획득

-> 잠금 읽기 때문에 PHANTOM READ 발생

---

마지막으로 표로 요약하자면 다음과 같다.

![](/assets/img/blog/woowacourse/rr_9.png)

---
참고: Real MySQL 8.0

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.