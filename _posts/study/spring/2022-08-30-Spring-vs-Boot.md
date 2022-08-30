---
layout: post
title: 스프링(Spring) vs 스프링 부트(Spring Boot)
subtitle: 부제목 예시
tags: Java Spring Spring-Boot
description: >
 What's the difference between spring and spring boot?
sitemap: true
hide_last_modified: true
categories:
  - study
  - spring
---

> 스프링 부트를 사용하고 있어도 스프링과 스프링부트가 뭐가 다른지 어떤 차이점이 있는지 헷갈릴 수 있다. 스프링과 스프링 부트에 대해 알아보자

## 스프링(Spring)
스프링은 개발자가 개발에만 집중할 수 있도록 설계된 프레임워크로 다양한 방법으로 편리성을 제공한다. 

### DI(Dependency Injection), IoC(Inversion of Control)
스프링 프레임워크의 가장 핵심적 기술로 DI와 IOC가 있는데 이 둘을 적절히 사용함으로 써, 우리는 느슨하게 결합된 애플리케이션을 개발할 수 있게 된다. 느슨하게 결합되면 코드의 재사용성이 증가하고 단위테스트가 용이해진다.

간단하게 예를 들면, 아래처럼 의존성 주입(DI)이 없는 경우 example을 리턴하기 위해 ExampleService에 의존적이게 된다. 즉, 강하게 결합되는 것을 의미하고 만약에 단위테스트에서 ExampleService에 대한 mock을 생성해야 된다면 어려울 것이다.

```java
@Controller
public class ExampleController{
    private ExampleService service = new ExampleService();
    @RequestMapping("/example)
    public String example() {
        return service.returnExample();
    }
}
```

하지만 의존성 주입(DI)을 이용하면 느슨하게 결합할 수 있다. 우리는 @Component와 @Autowired란 애노테이션을 이용하여 간단하게 외부에서 주입시켜줄 수 있다. 이렇게 되면 단위테스트를 할 때 그냥 ExampleService의 mock을 주입하기만 하면 된다.

```java
@Component
public class ExampleService {
    ...
}

@Controller
public class ExampleController{
    @Autowired
    private ExampleService service;
    @RequestMapping("/example)
    public String example() {
        return service.returnExample();
    }
}
```

>IoC(Inversion of Control): 기존 프로그램은 클라이언트 구현 객체가 스스로 필요한 서버 구현 객체를 생성하고, 연결하고, 실행. 즉, 구현 객체가 프로그램의 제어 흐름을 제어했다. 하지만 이렇게 프로그램의 제어 흐름을 직접 제어하는 것이 아니라 외부에서 관리하는 것을 제어의 역전(IoC)라고 한다.

>자세한건 이 [게시글] 참고

[게시글]: https://parkmuhyeun.github.io/study/spring/2022-02-10-Spring(2)/

### 중복코드 제거
스프링 프레임워크는 의존성 주입뿐 아니라 다음과 같은 스프링 모듈들을 이용해서 의존성 주입의 핵심을 구성
- Spring JDBC
- Spring MVC
- Spring AOP

예를들어 우리가 스프링 프레임워크를 사용하여 DB를 연결할 때는 몇줄 안치고 간단하게 연결했던 기억이 있을거다. 하지만 스프링을 사용하지 않고 순수 JDBC를 연결하려면 매번 길고 중복된 코드를 쳐야되는데 이 불편한 작업을 스프링이 대신해준다고 볼 수 있다.

#### 다른 프레임워크와의 통합
Hibernate, JUnit, Mocktio 같은 프레임워크와 통합이 간단해서 이를 통해 개발하는 프로그램 품질이 향상된다.

---

그래서 스프링은 알겠는데 스프링 부트는 뭐야?

## 스프링 부트(Spring Boot)
위에서 처럼 스프링 프레임워크는 다양한 기능이 있는만큼 환경설정 또한 복잡하다. 이를 또 자동화해주기 위해 도와주는 프레임워크가 스프링 부트이다

### 쉬운 의존성 관리
테스트가 필요할 때 스프링 같은경우 Spring Test, JUnit, Hamcrest 및 Mockito 등 필요한 모든 라이브러리를 종속성으로 추가해야되지만 SpingBoot에선 이러한 라이브러리를 자동으로 포함하기 위해 spring-boot-start-test만 추가하면 된다. 그리고 버전 관리도 자동으로 해준다.

### 내장 서버
스프링 부트 프레임워크는 내장 WAS(Web Application Server)를 가지고 있기 때문에 따로 WAS를 설치하지 않아도 실행이 가능하고 jar파일로 간편하게 배포같은 것도 가능하다.

### 편리한 Configuration 설정 및 AutoConfiguration

JSP 웹 애플리케이션을 생성하는데 스프링 같은 경우 아래 코드들을 정의 해야 한다.

```java
public class MyWebAppInitializer implements WebApplicationInitializer {
 
    @Override
    public void onStartup(ServletContext container) {
        AnnotationConfigWebApplicationContext context
          = new AnnotationConfigWebApplicationContext();
        context.setConfigLocation("com.baeldung");
 
        container.addListener(new ContextLoaderListener(context));
 
        ServletRegistration.Dynamic dispatcher = container
          .addServlet("dispatcher", new DispatcherServlet(context));
         
        dispatcher.setLoadOnStartup(1);
        dispatcher.addMapping("/");
    }
}

@EnableWebMvc
@Configuration
public class ClientWebConfig implements WebMvcConfigurer { 
   @Bean
   public ViewResolver viewResolver() {
      InternalResourceViewResolver bean
        = new InternalResourceViewResolver();
      bean.setViewClass(JstlView.class);
      bean.setPrefix("/WEB-INF/view/");
      bean.setSuffix(".jsp");
      return bean;
   }
}
```

하지만 Spring Boot 같은 경우 web starter를 추가하면 다음과 같이 두줄만 추가하면 된다.

```properties
spring.mvc.view.prefix=/WEB-INF/jsp/
spring.mvc.view.suffix=.jsp
```

그리고 위의 모든 Spring 구성은 Boot web starter를 포함함으로 써 AutoConfiguration에 의해 자동으로 포함된다. 이것이 의미하는 것은 Spring Boot는 애플리케이션에 존재하는 종속성, 속성, 빈을 살펴보고 이를 기반으로 구성을 활성화한다고 볼 수 있다.

참고
- [https://www.baeldung.com/spring-vs-spring-boot](https://www.baeldung.com/spring-vs-spring-boot)
- [https://blog.naver.com/PostView.nhn?isHttpsRedirect=true&blogId=sthwin&logNo=221271008423&parentCategoryNo=&categoryNo=50&viewDate=&isShowPopularPosts=true&from=search](https://blog.naver.com/PostView.nhn?isHttpsRedirect=true&blogId=sthwin&logNo=221271008423&parentCategoryNo=&categoryNo=50&viewDate=&isShowPopularPosts=true&from=search)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.