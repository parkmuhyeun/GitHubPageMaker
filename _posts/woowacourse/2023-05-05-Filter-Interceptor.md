---
layout: post
title: 공통 인증 로직 어디서 처리 할 수 있을까?(feat. Interceptor, Filter, Resolver)
subtitle: 부제목 예시
tags: woowacourse spring interceptor filter argumentresolver
description: >
  Where can I handle common authentication logic?
sitemap: true
hide_last_modified: true
categories:
  - woowacourse
---

이번에 장바구니 미션에서 공통 인증 기능을 추가하기 위해 argumentResolver을 사용했다. 아래 코드와 같이 구현할 수도 있을 것이고 책임을 분리해서 인증 처리 관련 로직은 Interceptor에서 하고 argumentReoslver에서는 인증 정보만 가공해서 넘겨주도록 사용할 수도 있을 것이다. 또한, 필터를 사용해서 처리할 수도 있을 텐데 어떤 상황에서 어떤 걸 사용해야 될까 궁금해졌다. 

```java
@Component
public class LoginArgumentResolver implements HandlerMethodArgumentResolver {
  private static final String BASIC_TYPE = "Basic";
  private static final String DELIMITER = ":";

  private final MemberDao memberDao;

  public LoginArgumentResolver(final MemberDao memberDao) {
    this.memberDao = memberDao;
  }

  @Override
  public boolean supportsParameter(final MethodParameter parameter) {
    return parameter.hasParameterAnnotation(Login.class);
  }

  @Override
  public Object resolveArgument(final MethodParameter parameter, final ModelAndViewContainer mavContainer,
      NativeWebRequest webRequest, WebDataBinderFactory binderFactory)  {
    final String authorization = getAuthorization(webRequest);
    final String emailAndPassword = new String(Base64.getDecoder().decode(authorization));
    final String[] splitEmailAndPassword = emailAndPassword.split(DELIMITER);
    final MemberEntity memberEntity = new MemberEntity(splitEmailAndPassword[0], splitEmailAndPassword[1]);
    final MemberEntity findEntity = memberDao.findByMemberEntity(memberEntity)
        .orElseThrow(() -> new AuthenticationException("올바른 인증정보를 입력해주세요."));

    return findEntity.getId();
  }

  private static String getAuthorization(NativeWebRequest webRequest) {
    final HttpServletRequest request = (HttpServletRequest) webRequest.getNativeRequest();
    final String header = request.getHeader(HttpHeaders.AUTHORIZATION);
    if (header == null) {
        throw new AuthenticationException("Authorization header가 비어있습니다.")
    }
    return header.substring(BASIC_TYPE.length()).trim();
  }
}
```

>만약 이러한 중복되는 로직을 처리해 줄 수 있는 기능(Interceptor, Resolver, Filter)들을 사용하지 않으면 어떻게 될까? 인증이 필요한 곳마다 중복되는 코드가 들어가 매우 번거로울 것이다.

## 공통 인증 로직 어떤 걸 사용해볼 수 있을까?
크게 Filter, Interceptor, AOP 3가지가 있을 것 같다. AOP 같은 경우는 설명하려면 길어질 거 같아 나중에 따로 글을 포스팅하려고 한다. 우선 Filter와 Interceptor를 알아보기 전에 Spring의 요청 과정을 보자.

![](/assets/img/blog/woowacourse/fi_1.PNG)

요청이 들어오면 Filter를 거쳐 DispatcherServlet에게 전달되고 DispatcherServlet은 HandlerMapping을 통해 요청을 처리할 Controller를 찾는다. 이때, 조건에 맞는(ex. url) Interceptor가 있는 경우 Interceptor가 실행된다.

### Filter

![](/assets/img/blog/woowacourse/fi_2.PNG)

필터는 리소스에 대한 요청이나 리소스의 응답에 대해 부가 작업을 처리할 수 있는 기능을 제공할 수 있는 Object이다. J2EE 표준 스펙 기능으로 디스패처 서블릿에 도달하기 전에 처리하므로 스프링 범위 밖인 웹 컨테이너(ex.톰켓)에서 처리가 된다.
```java
public interface Filter {

    public default void init(FilterConfig filterConfig) throws ServletException {}

    public void doFilter(ServletRequest request, ServletResponse response,
        FilterChain chain) throws IOException, ServletException;

    public default void destroy() {}
}
```
- init(): 웹 컨테이너가 호출하여 필터가 서비스 중임을 필터에게 알린다. 서블릿 컨테이너는 필터를 인스턴스화한 후 정확히 한 번만 init 메서드를 호출한다. 필터가 필터링 작업을 수행하도록 요청받기 전에 init 메서드가 성공적으로 완료되어야 한다.
    - 필터 초기화
- doFilter(): 필터의 doFilter 메서드는 리소스에 대한 클라이언트 요청으로 인해 요청/응답 쌍이 체인을 통과할 때마다 컨테이너에 의해 호출된다. 이 메서드에 전달된 FilterChain은 필터가 요청과 응답을 체인의 다음 엔티티로 전달할 수 있도록 한다. 여기에 공통 로직을 넣어서 원하는 작업을 처리할 수 있다.
    - 전/후 처리
- destroy(): 웹 컨테이너가 필터가 서비스 중단 중임을 알리기 위해 호출한다. 이 메서드는 필터의 doFilter 메서드 내의 모든 스레드가 종료되거나 시간 초과 기간이 지난 후에만 호출된다. 웹 컨테이너가 이 메서드를 호출한 후에는 필터의 이 인스턴스에서 doFilter 메서드를 다시 호출하지 않는다.
    - 필터 종료

### Filter 사용해보기

```java
public class MoominFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        //...
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        //전처리 로직
        chain.doFilter(request, response);
        //후처리 로직
    }

    @Override
    public void destroy() {
        //...
    }
}
```

```java
@Configuration
public class WebMvcConfiguration implements WebMvcConfigurer {

    @Bean
    public FilterRegistrationBean filterRegistrationBean() {
        FilterRegistrationBean registrationBean = new FilterRegistrationBean(new MoominFilter(MoominFilter.class.getSimpleName()));
        registrationBean.addUrlPatterns("/*");
        registrationBean.setOrder(1);
        return registrationBean;
    }
}
```

### 그래서 필터는 어디에 사용해볼 수 있을까?

필터는 스프링과 무관하게 주로 요청 자체에 대한 공통 처리를 담당한다. 주로 다음과 같이 사용될 수 있다고 한다.

1. Authentication Filters(인증 필터)
2. Logging and Auditing Filters (로깅 및 감사 필터)
3. Image conversion Filters(이미지 변환 필터)
4. Data compression Filters(데이터 압축 필터)
5. Encryption Filters(암호화 필터)
6. Tokenizing Filters(토큰화 필터)
7. Filters that trigger resource access events(리소스 액세스 이벤트를 트리거하는 필터)
8. XSL/T filters(XSL/T 필터)
9. Mime-type chain Filter(마임형 체인 필터)
10. +Spring MVC에서 분리하려는 모든 기능

>+필터는 스프링 빈으로 등록이 가능할까?
>
>옛날에는 필터가 스프링 빈으로 등록되지 못하였지만, DelegatingFilterProxy가 등장하면서 빈으로 등록할 수도 있게 되었고 다른 빈을 주입받을 수도 있게 되었다.
>
>궁금하면 [다음글](https://mangkyu.tistory.com/221)을 한번 읽어보자

### Interceptor

![](/assets/img/blog/woowacourse/fi_3.PNG)

인터셉터를 사용하여 애플리케이션은 특정 handler들에 대해 기존 또는 커스텀 인터셉터를 등록하여 각 handler 구현체에 대해 수정할 필요 없이 공통 전처리 동작을 추가할 수 있다. 인터셉터는 스프링이 제공하는 기술으로 컨트롤러를 호출하기 전과 후로 요청과 응답에 공통 작업을 처리할 수 있다.

위의 Spring 요청 과정에서 Dispatcher Servlet은 핸들러 매핑을 통해 컨트롤러를 찾는다 했는데 그 결과값으로 실행 체인을 반환한다. 이 실행 체인에 인터셉터들이 등록되어 있다면 각 인터셉터를 거쳐 컨트롤러를 실행하고 없으면 바로 컨트롤러가 실행된다.

```java
public interface HandlerInterceptor {

	default boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
		return true;
	}

	default void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
            @Nullable ModelAndView modelAndView) throws Exception {
	}

	default void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler,
			@Nullable Exception ex) throws Exception {
	}
}
```
- preHandle(): 핸들러 실행 전의 인터셉션 지점이다. HandlerMapping이 적절한 핸들러 객체를 결정한 후 HandlerAdapter가 핸들러를 호출하기 전에 호출된다.
    - 컨트롤러 이전에 처리해야 되는 전처리 작업
    - 3번째 파라미터 handler 파라미터는 컨트롤러 빈에 매핑되는 HandlerMethod라는 새로운 타입의 객체로써, @RequestMapping이 붙은 메소드의 정보를 추상화한 객체
    - preHandle의 반환 값이 true면 다음 단계로 진행, false면 이후 작업은 진행되지 않음.
- postHandle(): 핸들러가 성공적으로 실행된 후의 인터셉션 지점이다. HandlerAdapter가 실제로 핸들러를 호출한 후 DispatcherServlet이 뷰를 렌더링하기 전에 호출된다. 지정된 ModelAndView를 통해 뷰에 추가 모델 객체를 노출할 수 있다.
    - 컨트롤러 이후 처리해야 되는 후처리 작업
    - 컨트롤러에서 작업을 진행하다 중간에 예외가 발생하면 postHandle은 호출되지 않음.
- afterCompletion(): 요청 처리가 완료된 후, 즉 뷰를 렌더링한 후 호출된다. 핸들러 실행의 모든 결과에 대해 호출되므로 적절한 리소스 정리가 가능하다.
    - afterCompletion은 컨트롤러 중간에 예외가 터지더라도 호출된다.

### Interceptor 사용해보기

```java
public class MoominInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //전처리 로직
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        //후처리 로직
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        //afterCompletion
    }
}
```

```java
@Configuration
public class WebMvcConfiguration implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new MoominInterceptor())
            .addPathPatterns("/**");
    }
}
```

### 그래서 인터셉터는 어디에 사용해볼 수 있을까?

사실 이 부분을 적다가 정말 시간이 많이 걸렸다. 필터와 인터셉터 둘 다 요청, 응답에 대한 전후 처리를 담당할 수 있는데 많은 글, 토론, 문서들에서 필터와 인터셉터의 용도 차이 관련 내용을 봤을 때 "어..? 필터에 적힌 내용은 인터셉터에서도 가능한 부분인데..? 어..? 인터셉터에 적힌 것도 필터에서 충분히 가능한 것들이잖아..?" 하고 무한 도르마무에 빠지게 되었다.. 

일단 많은 사람들이 말하는 인터셉터의 용도는 인터셉터는 스프링 내부에서 작동하다 보니 필터보다 좀 더 정교한 작업들이 가능하다는 것이다. 그렇게 말하고 막상 밑에 나오는 예시들을 보면 위에 적힌 필터와 내용이 비슷하다. 봤던 예시들로는 보안 및 인증, 로깅, 정보 가공 등... 음..? 필터랑 뭐가 다름? 이러면 뭘 사용하라는 거지..? 취향에 따라 사용하라는 건가?

그래서 좀 더 **기준**을 잡는 데 도움이 될 수 있도록 **filter나 interceptor에서만 가능한 것**들을 알아보자.

### 공식문서에는?
우선 HandlerInterceptor 문서를 보면 다음과 같이 나와있다.

> HandlerInterceptor is basically similar to a Servlet Filter, but in contrast to the latter it just allows custom pre-processing with the option of prohibiting the execution of the handler itself, and custom post-processing. Filters are more powerful, for example they allow for exchanging the request and response objects that are handed down the chain.

핸들러 인터셉터는 기본적으로 서블릿 필터와 유사하지만, 필터와 달리 핸들러 자체의 실행을 금지하는 옵션이 있는 사용자 정의 사전 처리와 사용자 정의 사후 처리를 허용한다. 필터는 체인을 통해 전달되는 요청 및 응답 객체를 교환할 수 있는 등 더 강력하다고한다.

>Note that a filter gets configured in web.xml, a HandlerInterceptor in the application context.
As a basic guideline, fine-grained handler-related preprocessing tasks are candidates for HandlerInterceptor implementations, especially factored-out common handler code and authorization checks. On the other hand, a Filter is well-suited for request content and view content handling, like multipart forms and GZIP compression. This typically shows when one needs to map the filter to certain content types (e.g. images), or to all requests.

필터는 애플리케이션 컨텍스트의 핸들러 인터셉터인 web.xml에서 구성된다는 점에 유의해야한다. 기본 지침으로, 세분화된 핸들러 관련 전처리 작업, 특히 팩터링된 공통 핸들러 코드와 권한 검사 등이 HandlerInterceptor 구현의 후보가 될 수 있다. 반면에 필터는 여러 부분으로 구성된 양식 및 GZIP 압축과 같은 요청 콘텐츠 및 보기 콘텐츠 처리에 적합하다. 이는 일반적으로 특정 콘텐츠 유형(예: 이미지) 또는 모든 요청에 필터를 매핑해야 하는 경우에 나타난다.

### 예외 처리
필터와 인터셉터는 실행 시점이 다르기 때문에 서로 예외 처리하는 부분에서 다르다. Filter는 스프링 밖의 서블릿 영역에서 관리되기 때문에 에외가 발생하면 Spring의 도움을 받을 수 없다. 만약 인증이 되지 않아 401을 던져줘야 하는 상황이 있다고 해보자. 필터에서 Exception이 던져졌다면 에러가 처리되지 않고 Servlet으로 다시 올라온다. 그러면 서버에 문제가 있다고 판단하여 500으로 응답해버린다. 해결하려면 아래와 같이 응답 객체에 예외 처리를 추가해 줘야 된다.

```java
@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    HttpServletResponse servletResponse = (HttpServletResponse) response;
    servletResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    servletResponse.getWriter().print("INVALID AUTHENTICATION");
}
```

하지만 Interceptor에서 예외가 발생하면? 인터셉터 같은 경우 스프링의 도움을 받아 @ExceptionHandler를 사용해서 전역적으로 예외를 처리해 줄 수 있다. 또한, 에러가 Servlet까지 올라오지 않아 다시 ErrorController를 호출하지 않는다. 예외 처리를 잘 모르면 [다음글]을 참고해 보자. 만약 전후 처리 로직에서 예외를 전역적으로 잡고 싶다면 인터셉터를 고려해 보자!

```java
@ExceptionHandler(AuthenticationException.class)
public ResponseEntity<String> handleMyException(AuthenticationException e) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
}
```

[다음글]:https://parkmuhyeun.github.io/woowacourse/2023-04-19-Exception-Handler/

### ServletRequest, ServletResponse 교체 가능

Filter에서는 ServletRequest와 ServletResponse를 교체할 수 있다. 내부 상태를 변경한다는 것이 아니다.(내부 상태는 Interceptor도 변경 가능, 하지만 객체 자체를 교체하지 못함) 다음과 같이 다른 객체로 교체할 수 있다는 것이다.

```java
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
    //다음 필터를 호출하기 위해 필터체이닝을 호출 해주는데 이때 request, response를 교체해줄 수 있음
    chain.doFilter(new MoominServletRequest(), new MoominServletResponse());       
}
```

실제로 바꿔줄 일이 없어 보이지만 있다!! 예를 들어, HttpServletRequest의 body를 로깅할 때 바꿔줄 필요가 있을 것이다. HttpServletRequest는 본문을 읽기 위해 getInputStream()을 사용하는데 InputStream은 한 번 읽으면 다시 읽을 수 없다. 즉, body를 읽기 위해 Interceptor나 Filter에서 body를 읽게 되면 이후 Controller에서 Json 데이터를 바인딩 처리할 때 아래와 같은 에러를 만나게 된다.

>java.lang.IllegalStateException: getReader() has already been called for this request
org.springframework.http.converter.HttpMessageNotReadableException: Could not read JSON: Stream closed; nested exception is java.io.IOException: Stream closed

그래서 body를 로깅하기 위해서는 다음과 같이 여러 번 읽을 수 있도록 하는 커스트마이징 된 request가 필요할 것이다.

```java
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
    chain.doFilter(new CustomCachedServletRequest(request), response);       
}
```

### 좀 더 세분화된 제어 가능
Interceptor의 preHandle() 파라미터에서 handler라는 이름으로 HandlerMethod 객체가 들어온다고 했었다. 이 HandlerMethod를 통해 실제 핸들러에 접근할 수 있기 때문에 필터보다 더 세밀하게 제어할 수 있다. 즉, 요청이 실제로 수행하는 작업에 따라 수행하는 작업이 달라질 수 있다. (서블릿 필터는 모든 요청에 일반적으로 적용되어 각 요청 변수만 고려할 수 있음)

또한 Interceptor의 postHandle()에서 ModelAndView()가 들어온다고 했는데 이걸로 view를 렌더링 하기 전에 추가 작업을 해줄 수 있다. 예를 들어, 페이지가 권한에 따라 view를 다르게 노출해주는 부분이 있을 때 따로 처리를 해줄 수 있을 것이다.

-> 동작이 대상 핸들러에 따라 달라지거나 요청 처리와 뷰 렌더링 사이에 무언가를 수행하려는 경우 HandlerInterceptor를 사용하면 좀 더 세밀하게 제어 가능하다!

### 사전 차단

필터는 Servlet Container에서 실행되며, Servlet Container 레벨에서 HTTP 요청/응답을 처리하므로 Filter에서 불필요한 요청을 미리 걸러내면 스프링 컨테이너에 도달하기 전에 막을 수 있어 약간이라도 성능과 안정성을 높일 수 있을 것 같다.

--- 

보통 Spring Security를 이용해서 인증, 인가를 구현하는 걸 많이 봤는데

## 왜 Spring Security는 Filter를 사용하는 걸까?

>Spring Security's web infrastructure is based entirely on standard servlet filters. It doesn't use servlets or any other servlet-based frameworks (such as Spring MVC) internally, so it has no strong links to any particular web technology. It deals in HttpServletRequests and HttpServletResponses and doesn't care whether the requests come from a browser, a web service client, an HttpInvoker or an AJAX application.

Spring Security의 웹 인프라는 전적으로 표준 서블릿 필터를 기반으로 한다. 내부적으로 서블릿이나 기타 서블릿 기반 프레임워크(ex. Spring MVC)를 사용하지 않으므로 특정 웹 기술과의 강력한 연결고리가 없다. 이 필터는 HttpServletRequests와 HttpServletResponses를 처리하며 요청이 브라우저, 웹 서비스 클라이언트, HttpInvoker 또는 AJAX 애플리케이션에서 오는지 여부는 상관하지 않는다고 한다.

즉, 특정 서블릿에 관계없이 사용하기 위해서인거 같은데.. 이름부터 Spring이 들어가는데 Spring에 의존적인거 아닐까 생각이 들 수 있다. Spring 프레임워크를 기반으로 개발된 프레임워크이기 때문에 Spring이 이름이 들어가나 Spring Security는 Spring 프레임워크에 종속되는 부분을 최소화하고 서블릿 API에 종속되는 부분을 추상화하여 Spring 프레임워크와 종속적이지 않은 보안 프레임워크로 설계되어 있다고 한다. 또한, 다양한 환경에서 사용할수 있도록 유연성을 갖추고 있다.

> 여기에 대해 더 관심 있으면 FilterChainProxy, DelegatingFilterProxy에 대해 찾아보자

---

그럼 ArgumentResolver는 뭘까?

## ArgumentResolver
주어진 요청의 컨텍스트에서 메서드 매개변수를 인자 값으로 해석하기 위한 전략 인터페이스이다. 즉, 요청에 들어온 값으로부터 원하는 객체를 만들어 반환해 줄 수 있다.

```java
public interface HandlerMethodArgumentResolver {
    boolean supportsParameter(MethodParameter parameter);

    @Nullable
	Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer,
			NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception;
}
```
- supportsParameter(): 주어진 메서드 매개변수가 이 리졸버에서 지원되는지 여부이다.
    - 실행되길 원하는 파라미터 앞에 특정 애노테이션을 붙일 수 있다.
    - 특정 애노테이션을 포함하고 있으면 true을 반환
- resolveArgument(): 메서드 매개변수를 주어진 요청의 인자 값으로 해석한다.
    - supportsParameter에서 true를 받은 경우, parameter를 원하는 형태로 반환하는 메서드

--- 

## 정리
공통 로직들을 작성할 때 Filter, Interceptor를 사용할 수 있을 것이다. 둘 다 전후 처리를 해줄 수 있어 어느 것을 사용하여도 상관없을 수 있다. 하지만 각자 할 수 있는 부분도 있기 때문에 이 차이점을 파악하고 사용하면 좀 더 능동적인 개발을 할 수 있지 않을까 한다. 이 글이 그 차이점을 파악하는 데 도움이 되었으면 좋겠다!

---
참고: 
- [https://docs.oracle.com/javaee/6/api/javax/servlet/Filter.html](https://docs.oracle.com/javaee/6/api/javax/servlet/Filter.html)
- [https://docs.spring.io/spring-framework/docs/3.0.x/javadoc-api/org/springframework/web/servlet/HandlerInterceptor.html](https://docs.spring.io/spring-framework/docs/3.0.x/javadoc-api/org/springframework/web/servlet/HandlerInterceptor.html)
- [https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/method/support/HandlerMethodArgumentResolver.html](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/method/support/HandlerMethodArgumentResolver.html)
- [https://docs.spring.io/spring-security/site/docs/3.1.4.RELEASE/reference/security-filter-chain.html](https://docs.spring.io/spring-security/site/docs/3.1.4.RELEASE/reference/security-filter-chain.html)
- [https://justforchangesake.wordpress.com/2014/05/07/spring-mvc-request-life-cycle/](https://justforchangesake.wordpress.com/2014/05/07/spring-mvc-request-life-cycle/)
- [https://mangkyu.tistory.com/173](https://mangkyu.tistory.com/173)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.