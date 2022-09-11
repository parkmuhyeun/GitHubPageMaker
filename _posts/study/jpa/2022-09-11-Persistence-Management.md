---
layout: post
title: 영속성 관리(Persistence Management)
subtitle: 부제목 예시
tags: JPA
description: >
  What is Persistence Management?
sitemap: true
hide_last_modified: true
categories:
  - study
  - jpa
---

## 영속성 컨텍스트(Persistence Context)
엔티티를 영구 저장하는 환경으로 엔티티 매니저를 통해 영속성 컨텍스트에 접근할 수 있다.

## 엔티티의 생명주기

### 비영속(new/transient)
영속성 컨텍스트와 전혀 관계가 없는 새로운 상태

![](/assets//img/blog/study/jpa/pm_1.PNG)

```java
//객체를 생성한 상태(비영속)
Member member = new Member();
member.setId("member1");
member.setUsername("회원1");
```

### 영속(managed)
영속성 컨텍스트에 관리되는 상태

![](/assets//img/blog/study/jpa/pm_2.PNG)

```java
//객체를 생성한 상태(비영속)
Member member = new Member();
member.setId("member1");
member.setUsername("회원1");

EntityManager em = emf.createEntityManager();
em.getTranscation().begin();

//객체를 저장한 상태(영속) -> 아직 DB에 저장된 것은 아님
em.persist(member);
```

### 준영속 (detached)
영속성 컨텍스트에 저장되었다가 분리된 상태

```java
//회원 엔티티를 영속성 컨텍스트에서 분리, 준영속 상태
em.detach(member);
```

### 삭제(removed)
삭제된 상태

```java
//객체를 삭제한 상태(삭제)
e.mremove(member);
```

## 영속성 컨텍스트의 이점

### 1차 캐시(엔티티 조회)
em.persist를 이용해 영속화 하게 되면 먼저 1차 캐시에 저장하게 된다. 그리고 조회를 하면 DB를 거치지 않고 캐시에서 가져오게 됨

![](/assets//img/blog/study/jpa/pm_3.PNG)

```java
Member member = new Member();
member.setId("member1");
member.setUsername("회원1");

//1차 캐시에 저장
em.persist(member);

//1차 캐시에서 조회
em.find(Member.class, "member1");
```

아래 같은 경우 member2가 영속성 컨텍스트에 없기 때문에 DB에서 조회하게 된다. 

```java
Member findMember2 = em.find(Member.class, "member2");
```

사실상 1차 캐시는 큰 도움이 안될 수 있다. 엔티티매니저 같은 경우 영속성 컨텍스트를 트랜잭션 단위로 만들고 끝날 때(ex)고객의 요청 하나 들어오고 끝날 때) 종료 시키기 때문에 그때 1차 캐시도 날라가게 된다. 즉, 애플리케이션 전체에서 사용하는 캐시가 아니라 그 짧은 트랜잭션 순간에서만 이득 볼 수 있기 때문에 큰 도움이 안될 수 있다. 하지만 비즈니스 로직이 굉장히 복잡한 경우에는 도움이 되긴 한다.

### 영속 엔티티의 동일성 보장
```java
Member a = em.find(Member.class, "member1");
Member b = em.find(Member.class, "member1");

System.out.println(a == b);// => true 반환
```

### 트랜잭션을 지원하는 쓰기 지연(엔티티 등록)
쓰기 지연 SQL 저장소를 이용해 쿼리들을 모아놨다가 commit 하기 전에 한번에 보낼 수 있음(버퍼링 기능)

![](/assets//img/blog/study/jpa/pm_4.PNG)

![](/assets//img/blog/study/jpa/pm_5.PNG)

```java
EntityManager em = emf.createEntityManager();
EntityTransaction transaction = em.getTransaction();
//엔티티 매니저는 데이터 변경시 트랜잭션을 시작해야 한다.
transaction.begin(); // [트랜잭션] 시작

em.persist(memberA);
em.persist(memberB);
//여기까지 INSERT SQL을 데이터베이스에 보내지 않는다.

//커밋하는 순간 데이터베이스에 INSERT SQL을 보낸다.
transaction.commit(); // [트랜잭션] 커밋
```

### 변경 감지(엔티티 수정)
영속 엔티티 같은 경우 데이터를 수정할 때 업데이트 코드를 따로 작성하지 않아도 된다. 스냅샷을 이용해 엔티티와 비교 후 마지막에 update를 한다.

*스냅샷: 1차캐시에 제일 처음에 들어온 엔티티를 따로 저장해 놓은 것

![](/assets//img/blog/study/jpa/pm_6.PNG)

```java
EntityManager em = emf.createEntityManager();
EntityTransaction transaction = em.getTransaction();
transaction.begin();

Member memberA = em.find(Member.class, "memberA");

// 영속 엔티티 데이터 수정
memberA.setUsername("hi");
memberA.setAge(10);

//em.update(member) <- 이런 업데이트 코드가 없어도 JPA가 자동으로 해줌

transaction.commit(); // [트랜잭션] 커밋
```

## 플러시
영속성 컨텍스트의 변경내용을 데이터베이스에 반영하는 것으로 반영하고나서 영속성 컨텍스트를 비우지는 않음.

### 플러시 발생하는 경우
- 변경 감지
- 수정된 엔티티 쓰기 지연 SQL 저장소에 등록
- 쓰기 지연 SQL 저장소의 쿼리를 데이터베이스에 전송(등록, 수정, 삭제 쿼리)

### 영속성 컨텍스트를 플러시하는 방법
- em.flush(): 직접 쓸일 거의 없지만 커밋하기전 query를 보고 싶거나 테스트하고 싶은 경우 직접 호출
- 트랜잭션 커밋 - 플러시 자동 호출
- JPQL 쿼리 실행 - 플러시 자동 호출

## 준영속 상태
영속 상태의 엔티티가 영속성 컨텍스트에서 분리(detached)된 상태로 영속성 컨텍스트가 제공하는 기능을 사용하지 못한다.

### 준영속 상태로 만드는 방법
- em.detach(entity): 특정 엔티티만 준영속 상태로 전환
- em.clear(): 영속성 컨텍스트를 완전히 초기화
- em.close(): 영속성 컨텍스트를 종료

```java
//참고로 em.find으로 조회 했을 떄도 그 객체는 영속성 상태가 된다.
Member member = em.find(Member.class, 150L);
member.setName("AAAAA");

em.detach(member);

tx.commit();
```
이 경우 영속성 객체인 member는 준영속 상태가 되어 값을 변경하고 커밋을 하여도 변경감지가 일어나지 않게된다.

준영속 상태로 만드는건 직접 쓸일은 거의 없고 나중에 웹 애플리케이션을 개발할 때 복잡한 상황이 오면 준영속 상태를 처리할 때(변경 감지 기능 사용, 병합(merge)사용)가 있다. 후에 기회가 있으면 자세하게 설명하겠다.

---

참고:
[JPA](https://www.inflearn.com/course/ORM-JPA-Basic#)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.