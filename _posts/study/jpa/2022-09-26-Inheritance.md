---
layout: post
title: 상속관계 매핑(Inheritance Relationship Mapping)
subtitle: 부제목 예시
tags: JPA Inheritance Mapping
description: >
  Learn about inheritance mapping
sitemap: true
hide_last_modified: true
categories:
  - study
  - jpa
---

## 상속관계 매핑

![](/assets//img/blog/study/jpa/irm_1.PNG)

관계형 데이터베이스는 상속 관계라는 것이 없지만 그와 유사한 슈퍼타입 서브타입 관계가 있다. 그래서 이를 이용해 객체의 상속 구조와 DB의 슈퍼타입 서브타입 관계를 매핑 해보자.

슈퍼타입 서브타입 논리 모델을 실제 물리 모델로 구현하는 방법에는 3가지가 있다.
- 조인 전략으로 각각의 테이블로 변환
- 단일 테이블 전략으로 통합 테이블로 변환
- 구현 클래스마다 테이블 전략으로 서브타입 테이블로 변환

## 조인 전략
조인 전략은 각 객체마다 테이블을 생성하는 전략으로 테이블 구조는 아래 그림처럼 된다. @Inheritance(strategy = InheritanceType.JOINED)를 이용하여 조인 전략을 선택가능, 만약 안 써주면 기본전략인 단일 테이블 전략으로 된다.

![](/assets//img/blog/study/jpa/irm_1.PNG)

```java
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class Item {

  @Id @GenerateValue
  private Long id;

  private String name;
  private int price;
}

@Entity
public class Album extends Item {
  private String artist;
}

@Entity
public class Movie extends Item {
  private String director;
  private String actor;
}

@Entity
public class Book extends Item {
  private String author;
  private String isbn;
}

// DB
// -> Item, ID: 1, NAME: 아저씨, PRICE:10000
// ->       ID: 2, NAME: LOVE DIVE, PRICE:20000
// ->       ID: 3, NAME: 어린왕자, PRICE:15000
// -> Album, ARTIST: IVE, ID: 2
// -> Book, AUTHOR: Antoine de Saint-Exupéry, ISBN: 1231423, ID:3
// -> Movie, ACTOR: 원빈, DIRECTOR: 이정범, ID: 1
```

조인 전략 같은 경우 DTYPE(구분타입)을 안 써도 되지만 써주는게 좋다. 없으면 DB상에서 ITEM만 SELECT해봤을 때 이 ITEM이 ALBUM인지 MOVIE인지 BOOK인지 구별할 수 없음. @DiscriminatorColumn(name=“DTYPE”), @DiscriminatorValue(“XXX”)을 사용해서 편하게 구분 가능

```java
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn  //기본설정이 DTYPE이라 name은 생략
public class Item {

  @Id @GenerateValue
  private Long id;

  private String name;
  private int price;
}

@Entity
@DiscriminatorValue(“A”)
public class Album extends Item {
  private String artist;
}

@Entity
@DiscriminatorValue(“M”)
public class Movie extends Item {
  private String director;
  private String actor;
}

@Entity
@DiscriminatorValue(“B”)
public class Book extends Item {
  private String author;
  private String isbn;
}

// DB
// -> Item, DTYPE: M, ID: 1, NAME: 아저씨, PRICE:10000
// ->       DTYPE: A, ID: 2, NAME: LOVE DIVE, PRICE:20000
// ->       DTYPE: B, ID: 3, NAME: 어린왕자, PRICE:15000
// -> Album, ARTIST: IVE, ID: 2
// -> Book, AUTHOR: Antoine de Saint-Exupéry, ISBN: 1231423, ID:3
// -> Movie, ACTOR: 원빈, DIRECTOR: 이정범, ID: 1
```

위처럼 DTYPE을 해주면 Item만 봤을 때도 구분가능하게 된다.

### 조인 전략의 장단점
조인 전략같은 경우는 테이블이 정규화 되있기 때문에 저장공간이 효율적으로 저장될 수 있고 외래키 참조 무결성 제약조건을 활용가능하다. 하지만 조회시 조인을 많이 사용해서 성능이 저하될 수 있다. 그리고 데이터 저장시 INSERT SQL(ITEM + 상속 객체)이 2번 호출될 수 있다.

## 단일 테이블 전략
단일 테이블은 이름 그대로 하나의 테이블에 상속받은 객체(Album, Movie, Book)의 필드까지 한번에 다 넣는 전략이다. 이 전략 같은 경우 DTYPE(구분 타입)이 없으면 구분이 불가능하기 때문에 @DiscriminatorColumn을 안 적더라도 기본적으로 DTYPE이 적용되어 있다.

![](/assets//img/blog/study/jpa/irm_3.PNG)

```java
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public class Item {

  @Id @GenerateValue
  private Long id;

  private String name;
  private int price;
}

@Entity
public class Album extends Item {
  private String artist;
}

@Entity
public class Movie extends Item {
  private String director;
  private String actor;
}

@Entity
public class Book extends Item {
  private String author;
  private String isbn;
}

//DTYPE 같은 경우 따로 @DiscriminatorValue(“XXX”)을 사용 안 했기 때문에 객체의 기본값이 채워짐(Movie -> Movie)
// DB
// Item: DTYPE: Moive, ID: 1, NAME: 아저씨, PRICE:10000, ARTIST: null, DIRECTOR: 이정범, ACTOR: 원빈, AUTHOR: null, ISBN: null
// Item: DTYPE: Album, ID: 2, NAME: Love Dive, PRICE:20000, ARTIST: IVE, DIRECTOR: null, ACTOR, null, AUTHOR: null, ISBN: null
// Item: DTYPE: Book, ID: 3, NAME: 어린 왕자, PRICE:15000, ARTIST: null, DIRECTOR: null, ACTOR, null, AUTHOR: Antoine de Saint-Exupéry, ISBN: 1231423
```

### 단일 테이블 전략 장단점
하나의 테이블에 있으므로 조인이 필요 없어 일반적으로 조회 성능이 빠르고 조회 쿼리가 단순하다. 하지만 자신과 관련없는 필드에 null을 허용할 수 있는 단점이 있고 단일 테이블에 모든 것을 저장하므로 테이블이 커질 수 있어 상황에 따라서는 조회성능이 오히려 느려질 수도 있다.

## 구현 클래스마다 테이블 전략
이 전략은 ITEM 테이블을 없애고 그 필드들을 아래 객체(Movie, Album, Book)들로 다 내리는 것인데 권장하지 않는 전략이다. 왜냐하면 어떤 item을 찾을려면 Movie, Album, Book 모든 테이블을 다 뒤져봐야 되기 때문에 매우 비효율적

![](/assets//img/blog/study/jpa/irm_4.PNG)

```java
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class Item {

  @Id @GenerateValue
  private Long id;

  private String name;
  private int price;
}

@Entity
public class Album extends Item {
  private String artist;
}

@Entity
public class Movie extends Item {
  private String director;
  private String actor;
}

@Entity
public class Book extends Item {
  private String author;
  private String isbn;
}

// DB
// -> Album, ID: 2, NAME: LOVE DIVE, PRICE:20000, ARTIST: IVE
// -> Book, ID: 3, NAME: 어린왕자, PRICE:15000, AUTHOR: Antoine de Saint-Exupéry, ISBN: 1231423
// -> Movie, ID: 1, NAME: 아저씨, PRICE:10000, ACTOR: 원빈, DIRECTOR: 이정범
```

## 구현 클래스마다 테이블 전략 장단점
서브 타입을 명확하게 구분해서 처리할 때는 효과적이고 필드가 다 사용하기 떄문에 NOT NULL 제약조건 사용이 가능하다. 하지만 여러 테이블을 함께 조회할 때 성능이 느리고 자식 테이블을 통합해서 쿼리하기가 어렵다. 그리고 변경이라는 관점에서 매우 좋지 않은게 새로운 타입이 추가되면 굉장히 고쳐야 될게 많다.

## 어떤 전략이 좋을까?
그래서 어떤 전략을 사용하는게 좋을까? 기본적으로 조인 전략을 생각하고 가는게 좋고 거기서 더 생각해볼게 조인 전략과 단일 테이블을 사용했을 때 서로의 Trade Off를 비교해서 선택을 하면 되겠다.

--- 

추가적으로 @MappedSuperclass를 설명하려고 하는데 이 매핑은 상속관계 매핑과는 상관없고 편의를 제공해주는 어노테이션이다.

## @MappedSuperclass
@MappedSuperclass는 공통적인 매핑 정보가 필요할 때 사용해볼 수 있다. 우리가 객체마다 주로 등록일이나 수정일, 등록자, 수정자 같은 공통 정보를 귀찮게 반복해서 넣어준적이 있을 것이다. 이런 공통 정보를 반복적으로 넣을 필요 없이 상속받아 처리 해줄 수 있다.

```java
@MappedSuperclass
public abstract class BaseEntity {
  private String createBy;
  private LocalDateTime createDate;
  private String  lastModifiedBy;
  private LocalDateTime lastModifiedDate;

  ...
}

@Entity
public class Member extends BaseEntity {
  ...
}

@Entity
public class Team extends BaseEntity {
  ...
}

//DB
// Member, ... + createBy, createDate, lastModifiedBy, lastModifiedDate
// Team, ... + createBy, createDate, lastModifiedBy, lastModifiedDate
```

---

참고:
[JPA](https://www.inflearn.com/course/ORM-JPA-Basic#)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.