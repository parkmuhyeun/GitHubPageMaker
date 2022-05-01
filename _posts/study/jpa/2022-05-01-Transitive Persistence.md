---
layout: post
title: 영속성 전이
subtitle: 부제목 예시
tags: JPA cascade orphanRemoval
description: >
  Transitive Persistence
sitemap: true
hide_last_modified: true
categories:
  - study
  - jpa
---

## 영속성 전이: CASCADE
- 특정 엔티티를 영속 상태로 만들 때 연관된 엔티티도 함께 영속상태로 만들고 싶을 때
- ex) 부모 엔티티를 저장할 때 자식 엔티티도 함께 저장.

### 영속성 전이: 저장
@OneToMany (mappedBy="parent", cascade=CascadeType.PERSIST)

![](/assets//img/blog/study/jpa/tp_1.PNG)

```java
// Parent Entity
//@OneToMany (mappedBy="parent")
//Private List<Child> childList = new ArrayList<>();

Child child1 = new Child();
Child child2 = new Child();

Parent parent = new Parent();
parent.addChild(child1);
parent.addChild(child2);

em.persist(parent);
em.persist(child1);
em.persist(child2);
```

```java
// Parent Entity에 persist 추가
//@OneToMany (mappedBy="parent", cascade=CascadeType.PERSIST)
//Private List<Child> childList = new ArrayList<>();

Child child1 = new Child();
Child child2 = new Child();

Parent parent = new Parent();
parent.addChild(child1);
parent.addChild(child2);

em.persist(parent);
// 부모 영속화하면 자동으로 자식은 영속화 해줌
```

## 영속성 전이: CASCADE - 주의!
- 영속성 전이는 연관관계를 매핑하는 것과 아무 관련이 없음
- 엔티티를 영속화할 때 연관된 엔티티도 함께 영속화하는 편리함을 제공할 뿐
- Parent와 Child Entity의 LifeCycle이 비슷할 때 사용
- 특정 엔티티가 개인 소유할 때 사용

## CASCADE의 종류
- ALL: 모두 적용
- PERSIST: 영속
- REMOVE: 삭제
- MERGE: 병합
- REFRESH: REFRESH
- DETACH: DETACH

## 고아 객체
- 고아 객체 제거: 부모 엔티티와 연관관계가 끊어진 자식 엔티티를 자동으로 삭제
- orphanRemoval = true

## 고아 객체 - 주의
- 참조가 제거된 엔티티는 다른 곳에서 참조하지 않는 고아 객체로 보고 삭제하는 기능
- 참조하는 곳이 하나일 때 사용해야함!
- 특정 엔티티가 개인 소유할 때 사용
- @OneToOne, @OneToMany만 가능

## 영속성 전이 + 고아 객체, 생명주기
```java
@OneToMany (mappedBy="parent", cascade=CascadeType.PERSIST, orphanRemoval = true)
Private List<Child> childList = new ArrayList<>();
```
- CascadeType.ALL + orphanRemovel = true
- 스스로 생명주기를 관리하는 엔티티는 em.persist()로 영속화, em.remove()로 제거
- 두 옵션을 모두 활성화 하면 부모 엔티티를 통해서 자식의 생명주기를 관리할 수 있음

## CASCADE REMOVE vs orphanRemoval = true
위에 내용들을 공부하다보니 CASCADE중 REMOVE와 orphanRemoval = true의 차이가 뭘까하고 궁금증이 생겼다.
- 알아본바에 의하면 둘다 부모 엔티티가 삭제되면 자식 엔티티가 삭제되는 것은 동일하다.
- 하지만 삭제가아니라 관계를 제거하는경우에 차이가 있었다.
  - REMOVE같은 경우 부모 엔티티가 자식 엔티티와의 관계를 제거해도 자식 엔티티는 삭제되지 않고 그대로 남아있다.
  - orphanRemoval = true 같은 경우 부모 엔티티가 자식 엔티티의 관계를 제거하면 자식은 고아로 취급되어 삭제된다.

=> 무작정 쓰지 말고 영속성 전이를 사용하든 orphanRemoval을 사용하든 주의하여 사용하자

---

참고:
[JPA](https://www.inflearn.com/course/ORM-JPA-Basic#)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.