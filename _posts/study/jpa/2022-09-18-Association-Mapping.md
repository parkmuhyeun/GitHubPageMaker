---
layout: post
title: 연관관계 매핑(Association Mapping)
subtitle: 부제목 예시
tags: JPA Association-Mapping
description: >
  Let's learn about mapping relationships
sitemap: true
hide_last_modified: true
categories:
  - study
  - jpa
---

>객체의 참조와 테이블의 외래 키를 어떻게 매핑하는지 알아보자

## 연관관계가 필요한 이유
만약 연관관계가 없어 객체를 테이블에 맞추어 모델링하는 경우를 생각해보자.

![](/assets//img/blog/study/jpa/rm_1.PNG)

```java
@Entity
public class Member { 

  @Id @GeneratedValue
  private Long id;

  @Column(name = "USERNAME")
  private String name;

  //참조 대신에 외래 키를 그대로 사용
  @Column(name = "TEAM_ID")
  private Long teamId; 

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

이렇게 되면 객체를 다루는 것이 아닌 외래 키 식별자를 직접 다루게 된다.
 식별자로 저장하고 조회하게 되는데 계속 DB한테 물어보며 꺼내게 된다. 이 경우 객체 지향적이지 않다.

```java
//팀 저장
Team team = new Team();
team.setName("TeamA");
em.persist(team);

//회원 저장
Member member = new Member();
member.setName("member1");
member.setTeamId(team.getId());
em.persist(member);

//조회
Member findMember = em.find(Member.class, member.getId()); 

//연관관계가 없음
Team findTeam = em.find(Team.class, team.getId());
```

이렇게 객체를 테이블에 맞추어 데이터 중심으로 모델링 하게되면 협력 관계를 만들 수 없다. 자, 이제 연관관계를 사용해서 해보자.

## 단방향 연관관계

![](/assets//img/blog/study/jpa/rm_2.PNG)

```java
@Entity
public class Member { 
  @Id @GeneratedValue
  private Long id;

  @Column(name = "USERNAME")
  private String name;

  private int age;

  // @Column(name = "TEAM_ID")
  // private Long teamId;

  //객체의 참조와 테이블의 외래 키를 매핑
  @ManyToOne
  @JoinColumn(name = "TEAM_ID")
  private Team team;

  … 
}
```

이렇게되면 참조로 연관관계를 조회할 수 있게 되어 객체끼리 탐색이 가능해진다.

```java
//팀 저장
Team team = new Team();
team.setName("TeamA");
em.persist(team);

//회원 저장
Member member = new Member();
member.setName("member1");
member.setTeam(team); //단방향 연관관계 설정, 참조 저장
em.persist(member);

//조회
Member findMember = em.find(Member.class, member.getId()); 

//참조를 사용해서 연관관계 조회
Team findTeam = findMember.getTeam();

//수정
Team teamB = new Team();
teamB.setName("TeamB");
em.persist(teamB);
// 회원1에 새로운 팀B 설정
member.setTeam(teamB);
```

## 양방향 연관관계와 연관관계의 주인(*매우 중요)

![](/assets//img/blog/study/jpa/rm_3.PNG)

양방향같은 경우 처음 보면 어려울 수 있다. 양방향 연관관계를 이해하려면 객체와 테이블이 관계를 맺는 차이를 알아야 한다.

양방향에서 테이블 연관관계는 위에서 설명한 단방향 테이블에서 변하지 않는다. 즉, 테이블은 방향자체가 없다고 할 수 있다. 굳이 표현하자면 하나의 외래키로 양쪽을 조인하면 되기때문에 양방향이라 할 수 있겠다.

하지만 객체는 방향이 존재하는데 단방향이면 반대방향에서 조회할 수 없다. 그래서 양쪽에서 조회가 필요할 경우 양방향으로 설정해줘야 된다.(각 객체에서 참조값이 있어야 함)

```java
@Entity
public class Member { 

  @Id @GeneratedValue
  private Long id;

  @Column(name = "USERNAME")
  private String name;

  private int age;

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

  @OneToMany(mappedBy = "team") //mappedBy는 뒤에서 설명하겠다.
  List<Member> members = new ArrayList<Member>();
  … 
}
```

위처럼 양방향 관계를 설정해주게 되면 반대 방향으로도 객체 그래프 탐색이 가능하다.

```java
//조회
Team findTeam = em.find(Team.class, team.getId()); 

//역방향 조회
int memberSize = findTeam.getMembers().size(); 
```

### 객체와 테이블의 양방향 관계
사실 객체의 양방향 관계는 양방향 관계가 아니라 서로 다른 단방향 관계 2개이다. 객체를 양방향으로 참조하려면 단방향 연관관계를 2개 만들어야 한다.

```java
class A{
  B b;
}

class B {
  A a;
}
```

하지만 테이블은 외래 키 하나로 두 테이블의 연관관계를 관리한다. 즉, MEMBER.TEAM_ID 외래키 하나로 양쪽을 조인할 수 있다

```sql
SELECT * 
FROM MEMBER M
JOIN TEAM T ON M.TEAM_ID = T.TEAM_ID 

SELECT * 
FROM TEAM T
JOIN MEMBER M ON T.TEAM_ID = M.TEAM_ID
```

![](/assets//img/blog/study/jpa/rm_4.PNG)

테이블 외래 키는 한 갠데 객체에는 두 개기 때문에 혼란이 오게 된다. 그래서 여기서 연관관계의 주인이라는 규칙이 생기게 되었다.

### 연관관계의 주인
양방향 매핑 규칙
- 객체의 두 관계중 하나를 연관관계의 주인으로 지정
- 연관관계의 주인만이 외래키를 관리(등록, 수정)
- 주인이 아닌쪽은 읽기만 가능
- 주인은 mappedBy 속성을 사용하지 않고, 주인이 아니면 mappedBy 속성으로 주인을 지정
  - 위에서 @OneToMany(mappedBy = "team") 사용

그래서 연관관계의 주인을 지정해줘야 되는 건 알겠는데 누구를 주인으로 해야될까? 외래키가 있는 곳(N인곳)을 주인으로 정하면 된다. 반대로 하게 되면 헷갈릴 수 있다.

### 양방향 매핑시 주의
연관관계의 주인에 값을 입력하지 않는 경우

```java
Team team = new Team();
team.setName("TeamA");
em.persist(team);

Member member = new Member();
member.setName("member1");

//역방향(주인이 아닌 방향)만 연관관계 설정
team.getMembers().add(member);

em.persist(member);

//=> Member
//=> ID: 1, USERNAME: member1, TEAM_ID: null
```

team 같은 경우 mappedBy가 설정된 곳이기 때문에 넣어줘도 결국 member의 외래키에는 아무것도 설정되지 않는다.

```java
Team team = new Team();
team.setName("TeamA");
em.persist(team);

Member member = new Member();
member.setName("member1");

team.getMembers().add(member);
//연관관계의 주인에 값 설정
member.setTeam(team);

em.persist(member);

//=> Member
//=> ID: 1, USERNAME: member1, TEAM_ID: 2
```
위처럼 연관관계의 주인인 Member를 이용하여 설정해 주어야 된다. 그럼 그 위의 코드 team.getMembers().add(member);는 필요가 없을까? 아니다. 순수한 객체 관계를 고려하면 항상 양쪽 다 값을 입력해야 된다. 안 넣어주면 나중에 문제가 생긴다.

그래서 양방향 매핑은 항상 좋을까? 오히려 양방향을 쓰게 되면 신경 쓸게 많아진다. 그렇기 때문에 처음에 설계할 때 일단 단방향 매핑만으로만 완성하고 뒤에 양방향이 필요할 때 그때 추가하면 된다.

---

참고:
[JPA](https://www.inflearn.com/course/ORM-JPA-Basic#)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.