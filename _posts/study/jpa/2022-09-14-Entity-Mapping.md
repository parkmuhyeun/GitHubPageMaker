---
layout: post
title: 엔티티 매핑(Entity Mapping)
subtitle: 부제목 예시
tags: JPA Mapping
description: >
  What is Entity Mapping?
sitemap: true
hide_last_modified: true
categories:
  - study
  - jpa
---

## 객체와 테이블 매핑

### @Entity
테이블과 매핑할 클래스는 @Entity가 필수로 @Entity가 붙은 클래스는 JPA가 관리한다.
- 기본 생성자 필수
- final 클래스, enum, interface, inner 클래스 사용x
- 저장할 필드에 final 사용x
- 속성: name
  - JPA에서 사용할 엔티티 이름을 지정
  - 기본값: 클래스 이름을 그대로 사용(ex: Member)

```java
@Entity(name = "Member")
public class Member { 
  ...
}
``` 
### @Table
엔티티와 매핑할 테이블 지정
- name: 매핑할 테이블 이름
- catalog: 데이터베이스 catalog 매핑
- schema: 데이터베이스 schema 매핑
- uniqueConstraints(DDL): DDL 생성시에 유니크 제약 조건 생성

```java
@Entity
@Table(name = "MBR)
public class Member { 
  ...
} 
```

---

## 데이터베이스 스키마 자동 생성
필드와 컬럼 매핑을 알아보기전에 데이터베이스 스키마 자동 생성에 대해 알아보자

DDL을 애플리케이션 실행 시점에 자동 생성으로 해줄 수 있는데 이렇게 생성된 DDL은 개발 장비에서만 사용, 생성된 DDL은 운영서버에서는 사용하지 않거나, 적절히 다듬은 후 사용

### 데이터베이스 스키마 자동 생성 - 속성
hibernate.hbm2ddl.auto 추가
- create: 기존테이블 삭제 후 다시 생성 (DROP + CREATE)
- create-drop: create와 같으나 종료시점에 테이블 DROP
- update: 변경분만 반영
- validate: 엔티티와 테이블이 정상 매핑되었는지만 확인
- none: 사용하지 않음

운영 장비에는 절대 create, create-drop, update를 사용하면 안되고 validate 또는 none만 사용

### DDL 생성 기능
- 제약조건 추가: 회원이름은 필수, 10자 초과X
  - @Column(nullable = false, length = 10)
- DDL 생성 기능은 DDL을 자동 생성할 때만 사용되고 JPA의 실행 로직에는 영향을 주지 않음.

```java
@Entity
public class Member { 

  @Id
  private Long id;

  @Column(unique = true, length = 10)
  private String name;

  ...
}
```

---

## 필드와 컬럼 매핑
- @Column: 컬럼 매핑
- @Enumerated: enum 타입 매핑
- @Temporal: 날짜 타입 매핑
- @Lob: BLOB, CLOB 매핑
- @Transient: 특정 필드를 컬럼에 매핑하지 않음

```java
@Entity 
public class Member {     
  @Id 
  private Long id;

  @Column(name = "name") 
  private String username;

  private Integer age; 

  @Enumerated(EnumType.STRING)
  private RoleType roleType;

  @Temporal(TemporalType.TIMESTAMP) 
  private Date createdDate;
  
  @Temporal(TemporalType.TIMESTAMP) 
  private Date lastModifiedDate; 

  @Lob 
  private String description; 
  
  @Transient
  private int temp;

  ...
} 
```

### @Column 속성
- name: 필드와 매핑할 테이블의 컬럼 이름, 기본값: 객체의 필드 이름
- insertable, updatable: 등록, 변경 가능 여부, 기본값: TRUE
- nullable(DDL): null값의 허용 여부를 설정. False로 설정하면 DDL 생성시에 not null 제약 조건이 붙음
- unique(DDL): @Table의 uniqueConstraints와 같지만 한 컬럼에 간단히 유니크 제약조건을 걸 때 사용
- length(DDL): 문자 길이 제약조건으로 String 타입에만 사용, 기본값: 255
- columnDefinition(DDL): 데이터베이스 컬럼 정보를 직접 입력 가능

### @Enumerated 속성
- value: Enumerated 방식으로 2가지 방법이 있음, 기본값: EnumType.ORDINAL
  - EnumType.ORDINAL: enum 순서를 데이터베이스에 저장
  - EnumType.STRING: enum 이름을 데이터베이에 저장
  - ORDINAL을 사용하게되면 숫자를 기반으로 하기 때문에 순서가 바뀌게 되면 데이터가 엉킬 수 있으므로 사용X

### @Temporal 속성
날짜 타입(java.utill, Date, java.util.Calendar)을 매핑할 때 사용할 수 있는데, 최근에는 LocalDate, LocalDateTime이 나와서 생략 가능
- value: 3가지 방법이 있음
  - TemporalType.DATE: 날짜, 데이터베이스 date 타입과 매핑(2022-09-14)
  - TemporalType.TIME: 시간, 데이터베이스 time 타입과 매핑(18:27:34)
  - TemporalType.TIMESTAMP: 날짜와 시간, 데이터베이스 timestamp 타입과 매핑(2022-09-14 18:27:34)

### @Lob
데이터베이스 BLOB, CLOB 타입과 매핑되고 @Lob 같은 경우 속성이 없다. 매핑하는 필드 타입이 문자면 CLOB이 매핑되고 나머지는 BLOB으로 매핑

### @Transient
데이터베이스에 저장되지않으며 주로 메모리상에서만 임시로 어떤 값을 보관하고 싶을 때 사용

---

## 기본키 매핑
```java
@Id @GeneratedValue(strategy = GenerationType.AUTO)
private Long id;
```

- 직접 할당: @Id만 사용
- 자동 생성(@GeneratedValue)
  - IDENTITY: 데이터베이스에 위임, MYSQL
  - SEQUENCE: 데이터베이스 시퀀스 오브젝트 사용, ORACLE
    - @SequenceGenerator 필요
  - TABLE: 키 생성용 테이블 사용, 모든 DB에서 사용
    - @TableGenerator 필요
  - AUTO: 방언에 따라 자동 지정, 기본값

### IDENTITY 전략

```java
@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```

기본 키 생성을 데이터베이스에 위임하며 주로 MYSQL, PostgreSQL, SQL Server, DB2에서 사용한다. 단점으로 JPA의 버퍼링 기능을 사용못한다는 것인데 JPA는 보통 트랜잭션 커밋 시점에 INSERT SQL을 한번에 실행하는데 IDENTITY 전략은 데이터베이스에 INSERT SQL을 실행 한 이후에 ID값을 알 수 있기 때문에 즉시 INSERT SQL를 실행하게 됨.

### SEQUENCE 전략

```java
@Entity 
public class Member { 
  @Id 
  @GeneratedValue(strategy = GenerationType.SEQUENCE) 
  private Long id;

  ...
}
```
유일한 값을 순서대로 생성하는 특별한 데이터베이스 오브젝트로 오라클, PostgreSQL, DB2, H2에서 사용한다. SEQUENCE 방식은 다음 ID값을 DB에있는 시퀀스에서 가져오기 때문에 INSERT 쿼리를 나중에 보낼 수 있기 때문에 버퍼링이 가능하다.

*테이블마다 따로 시퀀스를 관리하고 싶다면 @SequenceGenerator 사용
```java
@Entity 
@SequenceGenerator( 
 name = "MEMBER_SEQ_GENERATOR", 
 sequenceName = "MEMBER_SEQ"     //매핑할 데이터베이스 시퀀스 이름
 initialValue = 1, allocationSize = 1) 
public class Member { 
  @Id 
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "MEMBER_SEQ_GENERATOR") 
  private Long id;

  ...
}
```

@SequenceGenerator 속성
- name: 식별자 생성기 이름, 필수 값
- sequenceName: 데이터베이스에 등록되어 있는 시퀀스 이름, 기본 값: hibernate_sequence
- initialValue: DDL 생성 시에만 사용됨, 시퀀스 DDL을 생성할 때 처음 시작하는 수를 지정, 기본값: 1
- allocationSize: 시퀀스 한 번 호출에 증가하는 수로 allocationSize를 이용하여 성능 최적화가 가능, 기본값: 50
  - 위에서 다음 ID를 DB에서 가져온다 했는데 매번 한개씩 가져오는 것 보다 allocationSize를 높여 미리 그만큼 사용할 ID를 떙겨와 성능을 높일 수 있다.

### TABLE 전략
키 생성 전용 테이블을 하나 만들어서 데이터베이스 시퀀스를 흉내내는 전략으로 모든 데이터베이스에 적용 가능하다. 하지만 테이블을 직접 사용하다보니 성능이 조금 떨어질 수 있다. TABLE 전략 같은 경우도 SEQUENCE 전략처럼 ALLOCATION으로 성능 최적화가 가능하다.


```java
@Entity 
@TableGenerator( 
 name = "MEMBER_SEQ_GENERATOR", 
 table = "MY_SEQUENCES", 
 pkColumnValue = "MEMBER_SEQ", allocationSize = 1) 
public class Member { 
  @Id 
  @GeneratedValue(strategy = GenerationType.TABLE, generator = "MEMBER_SEQ_GENERATOR") 
  private Long id;

  ...
}
```

위처럼 적게되면 데이터베이스에 아래와 같이 생성 되게 됨

```sql
create table MY_SEQUENCES ( 
 sequence_name varchar(255) not null, 
 next_val bigint, 
 primary key ( sequence_name ) 
)
```
---

참고:
[JPA](https://www.inflearn.com/course/ORM-JPA-Basic#)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.