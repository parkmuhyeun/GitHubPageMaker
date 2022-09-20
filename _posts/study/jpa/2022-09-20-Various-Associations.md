---
layout: post
title: 다양한 연관관계 매핑(Various Association Mapping)
subtitle: 부제목 예시
tags: JPA Association
description: >
  What kind of relationship mapping is there?
sitemap: true
hide_last_modified: true
categories:
  - study
  - jpa
---

>[이전글]에서 연관관계가 왜 필요한지, 무엇인지 자세하게 알아보았다. 또한 양방향, 연관관계의 주인에 대해서도 설명했으니 이해가 안가면 읽고오자. 이번에는 어떤 연관관계가 있는지 알아보자.

## 다대일 (N:1)
가장 많이 사용하는 연관관계로 다대일의 반대는 일대다 관계이다.

### 다대일 단방향

![](/assets//img/blog/study/jpa/va_1.PNG)

```java
@Entity
public class Member { 

  @Id @GeneratedValue
  private Long id;

  @Column(name = "USERNAME")
  private String name;

  @ManyToOne
  @JoinColumn(name = "TEAM_ID")
  private Team team; 

  … 
} 

@Entity
public class Team {

  @Id @GeneratedValue
  private Long id;

  private String name; 

  … 
}
```

### 다대일 양방향
외래키가 있는 쪽을 연관관계의 주인으로 하면 되고 양쪽을 서로 참조하도록 반대에도 참조를 추가해주면 된다.

```java
@Entity
public class Member { 

  @Id @GeneratedValue
  private Long id;

  @Column(name = "USERNAME")
  private String name;

  @ManyToOne
  @JoinColumn(name = "TEAM_ID")
  private Team team;
  … 
}

@Entity
public class Team {

  @Id @GeneratedValue
  private Long id;

  private String name;

  @OneToMany(mappedBy = "team") //양방향 추가
  List<Member> members = new ArrayList<Member>();
  … 
}
```

## 일대다 (1:N)
우선 설명하기전에 말하자면 일대다 같은경우는 권장하지 않는다. 그 이유는 밑에서 설명하겠다. 일대다 보단 다대일 관계를 사용하자.

### 일대다 단방향

![](/assets//img/blog/study/jpa/va_2.PNG)

```java
@Entity
public class Member { 

  @Id @GeneratedValue
  private Long id;

  @Column(name = "USERNAME")
  private String name;
  … 
}

@Entity
public class Team {

  @Id @GeneratedValue
  private Long id;

  private String name;

  @OneToMany
  @JoinColumn(name = "TEAM_ID")
  List<Member> members = new ArrayList<>();
  … 
```

그림을 보면 다른 테이블에 연관관계가 매핑되있는걸 알 수 있다. 이게 어쩔 수 없는게 DB입장에서 보면 N쪽에 외래키가 있을 수 밖에 없어서 일(1)쪽에서 단방향을 주게 되면 이렇게 된다. 객체와 테이블의 차이 때문에 반대편 테이블의 외래 키를 관리하는 특이한 구조가 된다.

이렇게 되면 Team을 업데이트 칠때 Member의 외래키를 업데이트 해야되서 자신의 테이블이 아니고 다른 테이블(Member)에 쿼리가 나가게된다. 그러면 쿼리 같은걸 추적할 때 매우 헷갈릴 수 있을 뿐아니라 쿼리가 추가로 나가게 되기 때문에 권장 하지 않는다.

그리고 일대다 같은 경우 @JoinColumn을 꼭 사용해야 되는데 그렇지 않으면 조인테이블 방식을 사용하여 중간에 테이블이 새로 추가된다.

### 일대다 양방향
사실 일대다 양방향은 공식적으로 존재하지는 않고 꼼수를 써서 사용할 수 있다.

![](/assets//img/blog/study/jpa/va_3.PNG)

```java
@Entity
public class Member { 

  @Id @GeneratedValue
  private Long id;

  @Column(name = "USERNAME")
  private String name;

  //양방향 추가
  @ManyToOne  
  @JoinColumn(name = "TEAM_ID", insertable = false, updatable = false)
  private Team team; 

  … 
}

@Entity
public class Team {

  @Id @GeneratedValue
  private Long id;

  private String name;

  @OneToMany
  @JoinColumn(name = "TEAM_ID")
  List<Member> members = new ArrayList<>();
  … 
```

@JoinColumn(insertable=false, updatable=false)으로 읽기 전용필드를 사용해서 양방향 처럼 사용하는 방법이다. 어쨋든 이런 방법이 있지만 가급적 일대다 보단 다대일을 사용하자

## 일대일 (1:1)
일대일 관계같은 경우 주 테이블이나 대상 테이블 중에 외래 키 선택이 가능하고 외래 키에 데이터베이스 유니크(UNI) 제약조건을 추가해야 한다.

### 일대일: 주 테이블에 외래 키 단방향

![](/assets//img/blog/study/jpa/va_4.PNG)

```java
@Entity
public class Member { 

  @Id @GeneratedValue
  private Long id;

  @Column(name = "USERNAME")
  private String name;

  //일대일 추가
  @OneToOne
  @JoinColumn(name = "LOCKER_ID")
  private Locker locker;

  … 
}

@Entity
public class Locker {

  @Id @GeneratedValue
  private Long id;

  private String name;
}
```

### 일대일: 주 테이블에 외래 키 양방향
다대일 같이 단뱡향에서 반대편에 참조(+mappedBy) 추가해주면 된다.

![](/assets//img/blog/study/jpa/va_5.PNG)

```java
@Entity
public class Member { 

  @Id @GeneratedValue
  private Long id;

  @Column(name = "USERNAME")
  private String name;

  @OneToOne
  @JoinColumn(name = "LOCKER_ID")
  private Locker locker;

  … 
}

@Entity
public class Locker {

  @Id @GeneratedValue
  private Long id;

  private String name;

  // 양방향 추가
  @OneToOne(mappedBy = "locker")
  private Member member;
}
```

### 일대일: 대상 테이블에 외래 키 단방향
대상 테이블에 외래키가 있는 경우 단뱡향은 지원하지 않고 양방향만 지원한다.

![](/assets//img/blog/study/jpa/va_6.PNG)

### 일대일: 대상 테이블에 외래 키 양방향
사실 이 경우는 아까 주 테이블에 외래 키 양방향을 뒤집은 것이다.

![](/assets//img/blog/study/jpa/va_7.PNG)

### 일대일 정리
그래서 어디에 외래 키가 있는게 좋을까? 각각 trade off가 있어서 어느게 더 좋다 할 수 없고 DBA와 개발자간의 협의가 필요하다. 각각의 장단점을 보자.

주 테이블에 외래 키
- 객체지향 개발자 선호
- JPA 매핑 편리
- 주 테이블만 조회해도 대상 테이블에 데이터가 있는지 확인 가능하다
- 하지만 값이 없으면 외래키에 null을 허용해서 DBA가 싫어할 수 있음

대상 테이블에 외래 키
- DBA가 선호하는 방법으로 이렇게 하는 경우 주 테이블과 대상 테이블을 일대일에서 일대다 관계로 변경할 때 그냥 유니크 제약조건만 없애면 되기 때문에 테이블 구조 유지 가능
- 하지만 지연 로딩으로 설정해도 항상 즉시 로딩 된다. 프록시 할 때 값이 있는지 없는지 알아야 되기 때문에 그 때 Locker 테이블을 뒤져, 즉시 로딩이 됨

## 다대다 (N:M)

![](/assets//img/blog/study/jpa/va_8.PNG)

관계형 데이터베이스 같은경우 두 개의 테이블로 다대다 관계를 표현할 수 없고 중간에 연결 테이블을 하나 추가해서 일대다, 다대일로 풀어내야 한다.

![](/assets//img/blog/study/jpa/va_9.PNG)

하지만 객체같은 경우 컬렉션을 사용해 객체 두 개로 다대다를 나타낼 수 있다.

```java
@Entity
public class Member { 

  @Id @GeneratedValue
  private Long id;

  @Column(name = "USERNAME")
  private String name;

  @ManyToMany
  @JoinTable(name = "MEMBER_PRODUCT")
  private List<Product> products =  new ArrayList<>();

  … 
}

@Entity
public class Product { 

  @Id @GeneratedValue
  private Long id;

  private String name;

  /* 양방향인 경우 추가
  @ManyToMany(mappedBy = "products")
  private List<Member> members =  new ArrayList<>();
  */
  … 
}
```

@ManyToMany를 사용하여 다대다를 나타낼 수 있으며 @JoinTable로 연결 테이블을 지정할 수 있고 단방향, 양방향 둘다 가능하다. 하지만 편리해보이지만 실무에서는 사용하지 않는다. 왜냐하면 테이블이 숨겨져있기 때문에 중간에 예상치 못한 쿼리가 발생할 수 있으며, 중간에 매핑 정보만 들어가기 때문에 주문시간, 수량 같은 추가 데이터를 넣을 수 없다.

### 다대다 한계 극복

![](/assets//img/blog/study/jpa/va_10.PNG)

연결 테이블을 엔티티로 만들어서 @ManyToMany를 @OneToMany, @ManyToOne으로 나누어서 사용

```java
@Entity
public class Member { 

  @Id @GeneratedValue
  private Long id;

  @Column(name = "USERNAME")
  private String name;

  @OneToMany(mappedby = "member")
  private List<MemberProduct> memberProducts =  new ArrayList<>();

  … 
}

@Entity
public class MemberProduct {

  @Id @GeneratedValue
  private Long id;

  @ManyToOne
  @JoinColumn(name = "MEMBER_ID")
  private Member member;
  
  @ManyToOne
  @JoinColumn(name = "PRODUCT_ID")
  private Product product;
  
  private int count;
  private int price;

  private LocalDateTime orderDateTime;
}

@Entity
public class Product { 

  @Id @GeneratedValue
  private Long id;

  private String name;

  @OneToMany(mappedby = "product")
  private List<MemberProduct> memberProducts =  new ArrayList<>();
  … 
}
```

---

[이전글]:https://parkmuhyeun.github.io/study/jpa/2022-09-18-Association-Mapping/

참고:
[JPA](https://www.inflearn.com/course/ORM-JPA-Basic#)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.