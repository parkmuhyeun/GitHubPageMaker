---
layout: post
title: 쿼리 카운터를 이용하여 좀 더 효율적으로 개발하기
subtitle: 부제목 예시
tags: woowacourse query-counter query efficient
description: >
  Use query counters to develop more efficiently
sitemap: true
hide_last_modified: true
categories:
  - woowacourse
---

최근에 **쿼리를 개선**하는 과정에 다음과 같은 **불편함**이 있었다.
- 쿼리가 몇 개가 나가고 있는지 수동으로 위로 올리며 직접 체크
  - 그러다 API 여러 개 겹치면 지금 보려는 쿼리가 어디인지 모르겠고 그럴 때마다 클리어하고 다시 날리고...

또한, 다음과 같은 상황에서도 유용하게 사용해 볼 수 있을 것 같다.
- 비정상적으로 많이 나가는 쿼리는 없는지
- N+1 발생한지 체크

+최근에 리플렉션에 대해 학습을 했는데 어디 적용해볼 수 있을까 하던 차에 적용해 볼 수 있을 거 같아서 재밌어 보이기도 했다..

그래서 앞으로 유용하게 사용할 수 있을 것 같아 적용하기로 결정.

## Hibernate StatementInspector

![](/assets/img/blog/woowacourse/qc_1.png)

우선 사용하고 있는 프레임워크에서 이런 기능을 제공하는지 먼저 확인해 볼 필요가 있다. 이미 있으면 만들 필요는 굳이 없기 때문에. 사용하고 있는 ORM 프레임워크인 Hibernate에서 실행된 각 SQL 명령을 검사하고 처리할 수 클래스를 제공하긴 한다.

하지만, 생각해 보면 네이티브 쿼리를 날리는 경우도 있을 수 있고 Hibernate에 종속적이고 싶진 않았다. 결국, 자바의 표준 데이터 접근 기술인 **JDBC 단에서 카운트**를 세는 게 맞다고 판단 후 어떻게 이를 셀 수 있을지 생각해 보다가 이런 로직은 비즈니스 로직이 아닌 기능으로 **AOP**와 접목시키면 좋을 것 같다고 생각했다.

## 어떻게 만들어 볼까?

아이디어가 머릿속에 바로 떠오르면 좋겠지만 복잡한 기술들이 많이 섞여있어 '팟'하고 떠오르진 않았다. 그래서 알고리즘 풀 듯이 슈도코드를 한번 작성해 보면서 만들어봤다.

1. Count를 어떻게 셀까?
2. Jdbc에 쿼리가 날아가는 과정을 한번 보자
3. Datasource에서 connection을 얻어 그 connection을 이용하여 쿼리를 실행
  - ![](/assets/img/blog/woowacourse/qc_2.png)
  - ![](/assets/img/blog/woowacourse/qc_3.png)
  - 그림 출처: 김영한님의 [데이터 접근 핵심 원리](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-db-1)
4. 그 과정에서 prepareStatement가 실행되는 걸 확인
5. Connection에 AOP를 적용해 prepareStatement가 실행될 때 잡아서 카운트하자

## 프록시 구현?

근데 한 가지 문제점이 있다. AOP는 **스프링 빈**에만 적용할 수 있기 때문에 Connection에 적용하지 못한다. 하지만, 스프링 부트의 경우 **DataSource는 스프링 빈**으로 자동 등록되기 때문에 여기에 AOP를 적용할 수 있다. 그렇기 때문에 다음과 같이 DataSource에 AOP를 적용하고 추가 기능을 확장할 Connection은 **프록시 객체**로 만들자

![](/assets/img/blog/woowacourse/qc_4.png)

프록시는 타겟의 기능을 확장하거나 타깃에 대한 접근을 제어하기 위한 목적으로 사용하는 클래스를 말한다. 근데 Connection을 프록시로 구현을 하려면 Connection의 모든 메서드를 구현해 줘야 되는데 이걸 언제 다 구현할까? 그래서 **다이나믹 프록시**라는 기술을 이용하여 간단하게 프록시를 생성해 주자.

> 다이나믹 프록시: 동적인 시점(런타임 시점)에 프록시를 자동으로 만들어서 적용해주는 기술

## 쿼리 카운터 구현하기

자 앞에 서론이 길었는데 이제 구현을 해보자.

### Counter 객체 생성

```java
@Getter
@Component
@RequestScope
public class QueryCounter {

    private int count;

    public void increaseCount() {
        count++;
    }

}
```

카운트 역할을 하는 이 객체의 생명주기는 특정 스레드의 **요청** 동안만 사용된다. ThreadLocal을 써서 저장, 삭제해 줄 수도 있겠지만 Spring에서 **RequstScope**를 지원해 주기 때문에 이를 활용해 준다.

### ConnectionProxyHandler 생성

Connection 다이나믹 프록시 구현을 위해 handler를 먼저 만들어야 된다. 원하는 동작(카운트)을 설정할 수 있도록 **InvocationHandler**를 구현해 준다.

```java
public class ConnectionProxyHandler implements InvocationHandler {

    private static final String QUERY_PREPARE_STATEMENT = "prepareStatement";

    private final Object connection;
    private final QueryCounter queryCounter;

    public ConnectionProxyHandler(Object connection, QueryCounter queryCounter) {
        this.connection = connection;
        this.queryCounter = queryCounter;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        countQuery(method);
        return method.invoke(connection, args);
    }

    private void countQuery(Method method) {
        if (isPrepareStatement(method) && isRequest()) {
            queryCounter.increaseCount();
        }
    }

    private boolean isPrepareStatement(Method method) {
        return method.getName().equals(QUERY_PREPARE_STATEMENT);
    }

    private boolean isRequest() {
        return RequestContextHolder.getRequestAttributes() != null;
    }

}
```

**invoke 메서드가 실제 target의 메서드 호출을 가로채**기 때문에 이 부분에 추가적으로 적용할 기능을 추가하면 된다. prepareStatement 메서드가 실행될 때마다 count를 추가해 줬다. 현재 QueryCounter가 RequestScope를 사용하고 있기 때문에 isRequest 분기가 없으면 다음과 같은 에러가 발생하니 꼭 추가해 주자.

>Scope 'request' is not active for the
current thread; consider defining a scoped proxy for this bean if you intend to
refer to it from a singleton;

## AOP 적용, Connection 다이나믹 프록시 구현

DataSource가 getConnection() 메소드를 호출할 때 Connection을 추가 기능이 장착된 **프록시 객체로 덮어씌워**줘야 된다. 방금 만든 Handler를 이용하여 Connection 다이나믹 프록시를 구현해 보자.

우선 자바에서 다이나믹 프록시는 Java.lang.reflect.Proxy 클래스의 **newProxyInstance()** 메소드를 이용하여 생성할 수 있다.

![](/assets/img/blog/woowacourse/qc_5.png)

- 첫 번째 파라미터: 프록시 클래스를 정의하는 클래스 로더
- 두 번째 파라미터: 구현할 프록시 클래스의 인터페이스 목록
- 세 번째 파라미터: 메소드 호출을 전달하는 호출 핸들러

```java
@Aspect
@Component
@RequiredArgsConstructor
public class QueryCounterAop {

    private final QueryCounter queryCounter;

    @Around("execution(* javax.sql.DataSource.getConnection(..))")
    public Object getConnection(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        Object connection = proceedingJoinPoint.proceed();
        return Proxy.newProxyInstance(
                connection.getClass().getClassLoader(),
                connection.getClass().getInterfaces(),
                new ConnectionProxyHandler(connection, queryCounter)
        );
    }

}
```

AOP를 상세히 설명하기에는 글이 너무 길어질 것 같아서 AOP의 키워드나 동작과정은 콩하나의 [테코톡](https://www.youtube.com/watch?v=7BNS6wtcbY8)을 한번 보고 오시면 좋을 것 같습니다. 👍🏻


## 쿼리 카운트 로깅 인터셉터 추가

자, 이제 마지막으로 앞에서 계산한 카운터를 인터셉터를 이용해서 로깅해주자.

```java
@Slf4j
@Component
@RequiredArgsConstructor
public class LoggingInterceptor implements HandlerInterceptor {

    private static final String QUERY_COUNT_LOG = "METHOD: {}, URL: {}, STATUS_CODE: {}, QUERY_COUNT: {}";
    private static final String QUERY_COUNT_WARN_LOG = "쿼리가 {}번 이상 실행되었습니다!!!";
    private static final int WARN_QUERY_COUNT= 8;

    private final QueryCounter queryCounter;

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
                                Object handler, Exception ex) {
        int queryCount = queryCounter.getCount();
        log.info(QUERY_COUNT_LOG, request.getMethod(), request.getRequestURI(), response.getStatus(), queryCount);
        if (queryCount >= WARN_QUERY_COUNT) {
            log.warn(QUERY_COUNT_WARN_LOG, WARN_QUERY_COUNT);
        }
    }

}
```

위처럼 구현하고 나면 다음과 같이 쿼리 개수를 편하게 확인 가능하다 🙌

![](/assets/img/blog/woowacourse/qc_6.png)

---
참고:
- [https://docs.jboss.org/hibernate/orm/6.2/javadocs/org/hibernate/resource/jdbc/spi/StatementInspector.html](https://docs.jboss.org/hibernate/orm/6.2/javadocs/org/hibernate/resource/jdbc/spi/StatementInspector.html)
- [https://docs.oracle.com/javase/8/docs/api/java/sql/Connection.html](https://docs.oracle.com/javase/8/docs/api/java/sql/Connection.html)
- [https://docs.oracle.com/javase/7/docs/api/java/lang/reflect/Proxy.html#newProxyInstance(java.lang.ClassLoader,%20java.lang.Class[],%20java.lang.reflect.InvocationHandler)](https://docs.oracle.com/javase/7/docs/api/java/lang/reflect/Proxy.html#newProxyInstance(java.lang.ClassLoader,%20java.lang.Class[],%20java.lang.reflect.InvocationHandler))

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.