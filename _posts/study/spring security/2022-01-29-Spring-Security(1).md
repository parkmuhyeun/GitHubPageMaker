---
layout: post
title: Spring Security 과정을 이해해보자
subtitle: 부제목 예시
tags: 
description: >
  Spring Security 이해
sitemap: false
hide_last_modified: true
categories:
  - study
  - spring security
---

---
인터넷을 보고 프로젝트에 Spring Security를 적용시켜봐도 UserDetails, Principal, AuthenticationProvider 등등.. 이게 도대체 무슨 말이야? 도무지 이해가 가지않았던 스프링 시큐리티. 동작 과정을 처음부터 상세하게 이해하고 적용해보자. 처음 보면 어려운게 당연하니 반복해서 학습하자.

+구현하는 방법에는 간단하게 구현하는 것(AuthenticationProvider 직접 구현x)도 있고 직접 커스텀해서 하는 방법 (AuthenticationProvider를 직접 구현)도 있기 때문에 그런 디테일한 부분들은 다음 글(구현과정)에서 설명하겠다.

----

## Spring Security?
- Spring Security는 Java 애플리케이션의 인증과 권한 부여를 제공하는 데 중점을 둔 프레임워크. 
- 보안과 관련해서 많은 기능을 제공해주기 때문에 개발자가 직접 보안 관련 로직을 작성하지 않아도 되는 장점이 있다.

## Architecture
아래 그림은 Spring Security Architecture이다.

![img](/assets/img/blog/study/spring-security/Spring-Security(1)_1.PNG)

(더 이해하기 쉽도록 최대한 숫자에 맞춰 과정을 적어봤다 + 역활 설명)

1. 사용자 로그인을 하면 id, password가 Request에 담아져 보내진다.

2. [AuthenticationFilter]에서 request가 보낸 id, password를 가로채 인증용 객체([UsernamePasswordAuthenticationToken])로 만든다.

3. 인증을 담당할 [AuthenticationManager] 인터페이스(구현체 - ProviderManager)에게 인증용 객체를 준다.

4. 실제 인증을 할 [AuthenticationProvider]에게 다시 인증용 객체를 전달한다.

5. 인증 절차가 시작되면 AuthenticationProvider 인터페이스가 실행 -> DB에 있는 이용자의 정보와 화면에서 입력한 로그인 정보 비교
    - AuthenticationProvider 인터페이스에서는 authenticate() 메소드를 오버라이딩 하게 되는데 이 메소드의 파라미터인 [Authentication]으로 화면에서 입력한 로그인 정보를 가져올 수 있다.

6. AuthenticationProvider 인터페이스에서 DB에 있는 이용자의 정보를 가져오려면, [UserDetailsService] 인터페이스를 사용.

7. UserDetailsService 인터페이스는 화면에서 입력한 이용자의 id(username)를 가지고 loadUserByUsername() 메소드를 호출하여 DB에 있는 이용자의 정보를 [UserDetails] 형으로 가져온다. 만약 이용자가 존재하지 않으면 예외를 던진다. (UserDetails를 User와 Authentication 사이를 채워주는 Adaptor라고 생각하자)

8. 5,6,7을 통해 가져온 정보(DB를 통해 가져온 이용자정보, 화면에서 입력한 이용자 정보)를 비교하고, 일치하면 Authentication 참조를 리턴하고, 일치 하지 않으면 예외를 던진다.

    -> 인증이 완료되면 사용자 정보를 가진 Authentication 객체를 [SecurityContextHolder]에 담은 이후 AuthenticationSuccessHandler을 실행.(실패시 AuthenticationFailureHandler 실행)

###  AuthenticationFilter
- 설정된 로그인 URL로 오는 요청을 감시하며, 유저 인증 처리
- AuthenticationManager를 통한 인증 실행
- 인증 성공 시 얻은 Authentication 객체를 SecurityContext에 저장 후 AuthenticationSuccessHandler 실행
- 인증 실패시, AuthenticationFailureHandler 실행

[AuthenticationFilter]: /study/spring%20security/2022-01-29-Spring-Security(1)/#authenticationfilter

### UsernamePasswordAuthenticationToken
- 사용자의 id가 Principal 역활을 하고, password가 Credential의 역활을 한다.
- 첫번째 생성자는 인증 전의 객체를 생성한다.
- 두번째 생성자는 인증이 완료된 객체를 생성한다.

```java
public class UsernamePasswordAuthenticationToken extends AbstractAuthenticationToken {
  // 주로 사용자의 ID에 해당함 
  private final Object principal; 

  // 주로 사용자의 PW에 해당함 
  private Object credentials;

  // 인증 완료 전의 객체 생성 
  public UsernamePasswordAuthenticationToken(Object principal, Object credentials) {
    super(null);
    this.principal = principal; 
    this.credentials = credentials;
    setAuthenticated(false);
  }

  // 인증 완료 후의 객체 생성 
  public UsernamePasswordAuthenticationToken(Object principal, Object credentials, 
            Collection<? extends GrantedAuthority> authorities) {
        super(authorities); 
        this.principal = principal;
        this.credentials = credentials;
        super.setAuthenticated(true); // must use super, as we override }
    }
}

public abstract class AbstractAuthenticationToken implements Authentication, CredentialsContainer {
}
```

[UsernamePasswordAuthenticationToken]: /study/spring%20security/2022-01-29-Spring-Security(1)/#usernamepasswordauthenticationtoken

### AuthenticationManager
인증에 대한 부분은 SpringSecurity의 AuthenticationManager를 통해 처리하게 되는데, 실질적으로는 AuthenticationManager에 등록된 AuthenticationProvider에 의해 처리된다.

```java
public interface AuthenticationManager { 
  Authentication authenticate(Authentication authentication) 
    throws AuthenticationException; }
```

* AuthenticationManger(구현체 - ProviderManager)와 AuthenticationProvider가 헷갈리면 이렇게 생각 해보자. AuthenticationManager가 상급자고 AuthenticationProvider가 부하직원이라고 생각하고 상급자가 부하직원에게 인증이란 일을 시킨다고 생각하면 된다.

AuthenticationManger를 구현한 ProviderManager는 실제 인증 과정에 대한 로직을 가지고 있는 AuthenticationProvider를 List로 가지고 있으며, for문을 통해 모든 provider를 조회하면서 authenticate 처리를 한다.
```java
public class ProviderManager implements AuthenticationManager, MessageSourceAware,
        InitializingBean {
    public List<AuthenticationProvider> getProviders() {
        return providers;
    }
    
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        Class<? extends Authentication> toTest = authentication.getClass();
        AuthenticationException lastException = null;
        Authentication result = null;
        boolean debug = logger.isDebugEnabled();
        //for문으로 모든 provider를 순회하여 처리하고 result가 나올 때까지 반복한다.
        for (AuthenticationProvider provider : getProviders()) {
            ....
            try {

            result = provider.authenticate(authentication);

            if (result != null) {
                copyDetails(authentication, result);
                break;
            }
        } catch (AccountStatusException e) {
            prepareException(e, authentication);
            // SEC-546: Avoid polling additional providers if auth failure is due to
            // invalid account status
            throw e;
        }
        ....
        }
        throw lastException;
    }
}
```

AuthenticationProvider를 직접 커스텀해서 만든 경우 AuthenticationManger에 등록 하는 방법은 WebSecurityConfigurerAdapter를 상속해 만든 SecurityConfig에서 할 수 있다.
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
    @Bean
    public AuthenticationManager getAuthenticationManager() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public CustomAuthenticationProvider customAuthenticationProvider() throws Exception {
        return new CustomAuthenticationProvider();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(customAuthenticationProvider());
    }
}
```

[AuthenticationManager]: /study/spring%20security/2022-01-29-Spring-Security(1)/#authenticationmanager

### AuthenticationProvider
AuthenticationProvider에서는 실제 인증에 대한 부분을 처리하는데, 인증 전의 인증용 객체를 받아서 5,6,7,8 과정을 거쳐서 인증이 완료된 객체를 반환하는 역활은 한다. 아래와 같은 AuthenticationProvider 인터페이스를 구현해서 Custom한 AuthenticationProvider을 작성해서 바로 위에 설명한 방법처럼 AuthenticationManager에 등록하면 된다.

```java
public interface AuthenticationProvider {

	// 인증 전의 Authenticaion 객체를 받아서 인증된 Authentication 객체를 반환
    Authentication authenticate(Authentication var1) throws AuthenticationException;

    boolean supports(Class<?> var1);
    
}
```

커스텀하고싶으면 밑에 형식처럼 원하는 부분을 구현하면 된다. 아래를 보면 5,6,7,8번 과정이 모두 일어나는걸 볼 수 있다.
```java
public class CustomAuthenticationProvider implements AuthenticationProvider{
	
	@Autowired
	private UserDetailsService userDetailsService;

	@SuppressWarnings("unchecked")
	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        // AuthenticaionFilter에서 생성된 토큰으로부터 아이디와 비밀번호를 조회함
        String username = (String) authentication.getPrincipal();
        String password = (String) authentication.getCredentials();
        
        // UserDetailsService를 통해 DB에서 아이디로 사용자 조회
        CustomUserDetails user = (CustomUserDetails) userDetailsService.loadUserByUsername(username);
        
        //조회한 것들 비교
        if(!matchPassword(password, user.getPassword())) {
            throw new BadCredentialsException(username);
        }
 
        if(!user.isEnabled()) {
            throw new BadCredentialsException(username);
        }
        
        return new UsernamePasswordAuthenticationToken(username, password, user.getAuthorities());
    }
 
    @Override
    public boolean supports(Class<?> authentication) {
        return true;
    }
    
    private boolean matchPassword(String loginPwd, String password) {
        return loginPwd.equals(password);
    }

}
```

[AuthenticationProvider]: /study/spring%20security/2022-01-29-Spring-Security(1)/#authenticationprovider

### Authentication
Authentication은 현재 접근하는 주체의 정보와 권한을 담는 인터페이스. Authentication 객체는 SecurityContext에 저장되며 SecurityContextHolder를 통해 SecurityContext에 접근하고 SecurityContext를 통해 Authentication에 접근 할 수 있다.

```java
public interface Authentication extends Principal, Serializable { 
    
    // 현재 사용자의 권한 목록을 가져옴 
    Collection<? extends GrantedAuthority> getAuthorities(); 
    
    // credentials(주로 비밀번호)을 가져옴 
    Object getCredentials();
    
    Object getDetails();
    
    // Principal 객체를 가져옴.
    Object getPrincipal(); 
    
    // 인증 여부를 가져옴 
    boolean isAuthenticated(); 
    
    // 인증 여부를 설정함 
    void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException;
}
```

[Authentication]: /study/spring%20security/2022-01-29-Spring-Security(1)/#authentication

### UserDetailsService
UserDetailsService 인터페이스는 DB에서 유저 정보를 가져오는 역활

```java
public interface UserDetailsService {
  
  UserDetails loadUserByUsername(String var1) throws UsernameNotFoundException;
  
  }
```

[UserDetailsService]: /study/spring%20security/2022-01-29-Spring-Security(1)/#userdetailsservice

### UserDetails
사용자의 정보를 담는 인터페이스, 구현해서 사용하면 됨

```java
public interface UserDetails extends Serializable { 
  
  Collection<? extends GrantedAuthority> getAuthorities(); 

  String getPassword(); String getUsername(); 

  boolean isAccountNonExpired(); boolean isAccountNonLocked(); 

  boolean isCredentialsNonExpired(); 

  boolean isEnabled(); 

}
```
[UserDetails]: /study/spring%20security/2022-01-29-Spring-Security(1)/#userdetails

### SecurityContextHolder
- SecurityContextHolder는 보안 주체의 세부 정보를 포함하여 응용프로그램의 현재 보안 컨텍스트에 대한 세부 정보가 저장.
- SecurityContext는 Authentication을 보관하는 역활을 하며, SecurityContext를 통해 Authentication 객체를 꺼내올 수 있다.

[SecurityContextHolder]: /study/spring%20security/2022-01-29-Spring-Security(1)/#securitycontextholder

--- 
이론 설명은 여기까지입니다. 최대한 쉽게 풀어 쓸려고 말을 많이 붙이다 보니 길어졌는 데 도움이 됐는지 모르겠네요ㅜㅜ 다음 글에서는 구현 과정을 설명하겠습니다!

---

참고
- [Spring-Security](https://spring.io/projects/spring-security)
- [https://mangkyu.tistory.com/76](https://mangkyu.tistory.com/76)
- [https://velog.io/@hellas4/Security-%EA%B8%B0%EB%B3%B8-%EC%9B%90%EB%A6%AC-%ED%8C%8C%EC%95%85%ED%95%98%EA%B8%B0-%EC%9D%B4%EB%A1%A0%ED%8E%B8](https://velog.io/@hellas4/Security-%EA%B8%B0%EB%B3%B8-%EC%9B%90%EB%A6%AC-%ED%8C%8C%EC%95%85%ED%95%98%EA%B8%B0-%EC%9D%B4%EB%A1%A0%ED%8E%B8)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.
