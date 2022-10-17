---
layout: post
title: Spring - Transaction(트랜잭션)
subtitle: 부제목 예시
tags: Java Spring Transaction
description: >
 What is Transaction?
sitemap: true
hide_last_modified: true
categories:
  - study
  - spring
---

## 왜 Transation을 사용할까?
규모가 큰 프로그램을 개발하다 보면 여러 개의 쿼리를 처리해야 상황이 많다. 이 때, 처리하던 도중에 중간에 문제가 생겨버리면 시스템에 큰 오류가 생길 수 있기 때문에 다시 DB의 데이터들은 이전 상태로 되돌아가야 한다. 이렇게 여러 작업을 진행하다 문제가 생겼을 경우 이전 상태로 롤백하기 위해 사용되는 것이 Transaction이다.

## 어떻게(How)?

![](/assets//img/blog/study/spring/tra_1.png)

Transaction은 여러개의 쿼리를 하나의 커넥션으로 묶어 DB에 전송하는데 도중에 문제가 생기면 모든 작업을 이전 상태로 되돌린다. 이를 위해 Transaction은 여러개의 쿼리를 처리할 때 동일한 Connection 객체를 공유한다.

## Spring이 제공하는 Transaction 기술

### Transaction 동기화

개발자가 직접 코드를 작성해서 여러개의 작업을 하나의 트랜잭션으로 관리하려면 굉장히 불필요하고 중복적인 작업이 많을 것이다. 이를 위해 Spring에서 트랜잭션 동기화(Transaction Synchronization) 기술을 제공하고 있다. 트랜잭션 동기화는 트랜잭션을 하기 위한 Connection 객체를 특별한 저장소에 보관해두고 필요할 때 사용할 수 있는 기술이다. 아래와 같이 적용할 수 있다.

```java
// 동기화 시작
TransactionSynchronizeManager.initSynchronization();
Connection connection = DataSourceUtils.getConnection(dataSource);

// 작업 진행

// 동기화 종료
DataSourceUtils.releaseConnection(connection, dataSource);
TransactionSynchronizeManager.unbindResource(dataSource);
TransactionSynchronizeManager.clearSynchronization();
```

하지만 개발자가 위와 같이 JDBC 종속적인 트랜잭션 동기화 코드를 사용한다면 다른 기술(Hibernate, JTA 등)을 사용할 때 문제가 발생하게 되는데 이런 기술 종속적인 문제를 해결하기 위해 Spring은 트랜잭션 관리 부분을 추상화한 기술을 제공한다.

### Transaction 추상화

![](/assets//img/blog/study/spring/tra_2.PNG)

Spring은 PlatformTransactionManager를 이용해 트랜잭션 기술을 공통화한 트랜잭션 추상화 기술을 제공하고 있다. 이로 인해 종속적이지 않고 공통적으로 트랜잭션을 처리할 수 있다. 아래와 같이 트랜잭션을 커밋하고 롤백할 수 있다.

```java
public Object invoke(MethodInvoation invoation) throws Throwable {
	TransactionStatus transactionStatus = this.transactionManager.getTransaction(new DefaultTransactionDefinition());
	
	try {
    //성공일시 commit
		Object return = invoation.proceed();
		this.transactionManager.commit(transactionStatus);
		return return;
	} catch (Exception e) {
    //에러 발생시 rollback
		this.transactionManager.rollback(transactionStatus);
		throw e;
	}
}
```

위와 같은 코드는 비즈니스 로직 코드와 트랜잭션 관리 코드가 함께 있어 2가지 책임을 가지는데 *AOP를 이용해 핵심 비즈니스 로직과 부가적인 로직으로 분리할 수 있다.

>AOP(Aspect Oriented Programming): 관점 지향 프로그래밍으로 어떤 관점을 기준으로 비즈니스 로직과 공통 모듈로 분리하는 것.

### AOP를 이용한 Transaction 분리

```java
public void addUsers(List<User> users) {
	TransactionStatus transactionStatus = this.transactionManager.getTransaction(new DefaultTransactionDefinition());
	
	try {
    //비즈니스 로직
		for (User user: users) {
			if(isEmailNotDuplicated(user.getEmail())){
				userRepository.save(user);
			}
		}
    
		this.transactionManager.commit(transactionStatus);
	} catch (Exception e) {
		this.transactionManager.rollback(transactionStatus);
		throw e
	}
}
```

위를 보면 트랜잭션 관리 코드와 비즈니스 로직 코드가 함께 있어 여러 책임을 가지므로 SRP에 위반되어 분리하는 것이 좋다. 그래서 Spring은 해당 로직을 클래스 밖으로 빼내 별도의 모듈로 만드는 AOP를 적용하여 @Transactional 애노테이션을 제공한다. 이를 적용하면 아래처럼 깔끔하게 비즈니스 로직만 남기고 Transaction을 적용할 수 있다.

>SRP(Single Responsibility Principle): 클래스는 단 하나의 책임만 가져야 한다.

```java
@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public void addUsers(List<User> users) {
        for (User user : users) {
            if (isEmailNotDuplicated(user.getEmail())) {
                userRepository.save(user);
            }
        }
    }
}
```

## 스프링에서 Transaction 활용

Transaction을 아무데서나 적용하는 것은 좋지않고 데이터를 처리하는 비즈니스 로직을 담고있는 서비스 계층에 적용하는 것이 좋다. 그리고 전체적으로는 읽기전용인 트랜잭션 애노테이션을 선언하고 데이터가 추가, 수정, 삭제가 되는 작업이 이루어지는 메소드에 따로 @Transactional 애노테이션을 선언하는 것이 더 좋다.

```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void addUsers(List<User> users) {
        for (User user : users) {
            if (isEmailNotDuplicated(user.getEmail())) {
                userRepository.save(user);
            }
        }
    }
}
```

--- 
참고:
[https://mangkyu.tistory.com/m/154](https://mangkyu.tistory.com/m/154)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.