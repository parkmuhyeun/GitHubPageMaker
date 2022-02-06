---
layout: post
title: Spring Security를 구현해보자
subtitle: 부제목 예시
tags: 
description: >
  Spring Security 적용
sitemap: false
hide_last_modified: true
categories:
  - study
  - spring security
---

--- 
[이전 글]에서 Spring Security 과정을 이해해보았다. 이번에는 어떻게 적용을 하는지 직접 구현해보면서 알아보자.

--- 

[이전 글]에서 구현하는 방법에 간단하게 구현하는 방법과 직접 AuthenticationProvider을 커스텀하는 방법이 있다고 했는데 먼저 기본적인 방법부터 알아보자.

## Standard Method (DaoAuthenticationProvider)

![img](/assets/img/blog/study/spring-security/Spring-Security(2)_1.PNG)

표준적이고 가장 일반적인 구현방법은 AuthenticationProvider에  DaoAuthenticationProvider을 사용하는 방법인데 따로 Provider을 구현을 할필요가 없기 때문에 사실상 SecurityConfig 설정하고, Userdetails, UserdetailsService만 구현하면된다.

### 0. 설정 셋팅
build.gradle에 dependency 추가
```java
dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
	implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
	implementation 'org.springframework.boot:spring-boot-starter-web'
	implementation 'org.thymeleaf.extras:thymeleaf-extras-springsecurity5'
	compileOnly 'org.projectlombok:lombok'
	annotationProcessor 'org.projectlombok:lombok'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
	testImplementation 'org.springframework.security:spring-security-test'
}
```

SpringSecurity에 대한 기본적인 설정 추가.
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
    // 정적 자원에 대해서는 Security 설정을 적용하지 않음. 
    @Override
    public void configure(WebSecurity web) {
       web.ignoring().requestMatchers(PathRequest.toStaticResources().atCommonLocations()); 
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
      http.csrf().disable();
      http.authorizeRequests()
              .antMatchers("/user/**").authenticated() // /user/** 요청에 대해 로그인 요구
              .antMatchers("/admin/**").access("hasRole('ROLE_ADMIN')") // /admin/** 요청에 대해 ROLE_ADMIN 역활을 가지고 있어야 함
              .anyRequest().permitAll() // 나머지 요청은 로그인 요구x
              .and()
              .formLogin()  //form 기반 로그인 설정
              .loginProcessingUrl("/login")   // 로그인 form의 action에 들어갈 처리 URI
              .loginPage("/loginForm")  //로그인 페이지 설정
              .defaultSuccessUrl("/");  //로그인 성공시 URL
    }
}

    //PasswordEncoder
    @Bean
    public BCryptPasswordEncoder encoderPwd() {
        return new BCryptPasswordEncoder();
    }
```

코드만 적으면 이해하기가 어려울테니 순서에 맞춰서 과정을 설명하며 코드를 구현해보겠다.(구현관련해서만 설명하니 역활 설명과 상세한 과정 설명은 [이전 글]을 보자!)

![img](/assets/img/blog/study/spring-security/Spring-Security(2)_2.PNG)

### 1. 로그인 요청

사용자는 아이디와 비밀번호를 입력해서 로그인 요청을 한다. 이번 예제는 Form 기반으로 요청하는 상황.

### 2. UserPasswordAuthenticationToken 발급
전송이 오면 AuthenticationFilter이 id, password를 가로채 UserPasswordAuthenticationToken 발급. 여기서 유효성을 검사 하기위해 필터를 커스텀해서 추가시킬수 있지만 복잡해지므로 생략한다. 나중에 필요할 때 추가하면 된다.

### 3. UsernamePasswordToken을 Authentication Manager에게 전달
AuthenticationFilter은 생성한 UsernamePasswordToken을 Authentication Manager에게 전달한다. 

### 4. UsernamePasswordToken을 Authentication Provider에게 전달
AuthenticationManager는 전달받은 UsernamePasswordToken을 AuthenticationProvider에게 전달하여 실제 인증 과정을 수행한다. AuthenticationProvider은 입력한 값(token에서 꺼낼수 있음)과 5,6,7 과정을 통해 가져온 값(DB에서 가져온 것)을 비교한다.

이 부분이 Custom을 한 구현방법과 차이나는 부분인데 이 방법에선 AuthenticationProvider을 따로 구현할필요가 없다. (AuthenticationProvider에 DaoAuthenticationProvider이 사용된다)

### 5, 6, 7. DB에서 User정보 UserDetailsService를 통해 UserDetails형태로 가져오기
따로 설명하면 더 헷갈리므로 묶어서 설명하겠다. AuthenticationProvider에서 아이디를 조회하였으면 UserDetailsService로부터 아이디를 기반으로 데이터를 조회해야 한다. UserDetailService는 인터페이스이기 때문에 이를 구현한 클래스를 작성해야 한다.

```java
@RequiredArgsConstructor
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) {
        User user =  userRepository.findByUsername(username);
        if (user == null) {
            return null;
        }
        return new UserDetailsImpl(user);
    }
}
```

UserDetailsServiceImpl의 반환형이 UserDetails이다. User를 담을 UserDetails을 구현해보자

```java
@Data
public class UserDetailsImpl implements UserDetails {

    private User user;

    public UserDetailsImpl(User user) {
        this.user = user;
    }

    //해당 User의 권한을 리턴하는 곳!
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collection = new ArrayList<>();
        collection.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return user.getRole();
            }
        });
        return collection;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
```

### 8. 인증 처리 후 인증된 토큰을 Authentication Manager에게 반환
이제 AuthenticationProvider(현재 구현체 - DaoAuthenticationProvider)에서 UserDetailsServices를 통해 얻어낸 UserDetails와 입력으로 부터 들어온 비밀번호를 PasswordEncoder를 통해 암호화한 것과 비교하여 유효성을 확인하고 Authentication을 반환해준다.

### 9. 인증된 토큰을 AuthenticationFilter에게 전달
AuthenticationProvider에서 받은 Authentication을 AuthenticationFilter에게 반환

### 10. 인증된 토큰을 SecurityContextHolder에 저장
Authentication객체를 SecurityContextHolder에 저장하면 인증이 끝난다.

[github 코드](https://github.com/parkmuhyeun/DaoAuthenticationProvider/tree/master)


## Custom Method
위에서 기본적인 방법을 알아봤으니 AuthenticationProvider을 직접 Custom하는 방식을 알아보자. 외부, 타사 서비스(예를들어 Crowd) 같은 것에 대해 인증하기위해서는 Custom한 Authentication Provider를 구현해야한다. Standard방식에서 추가적으로 CustomAuthenticationProvider를 구현하고 Config에 등록만 하면 된다.

### 4. UsernamePasswordToken을 AuthenticationProvider에게 전달
Standard 방식에서 4, 8번 과정인 AuthenticationProvider 부분만 달라지고 나머지 부분은 윗 부분과 동일하다. AuthenticationManager는 전달받은 UsernamePasswordToken을 AuthenticationProvider에게 전달하여 실제 인증 과정을 수행하며, 실제 인증에 대한 부분은 authenticate 함수에 작성하면 된다. Spring Security에서는 Username으로 DB에서 데이터를 조회한다음, 비밀번호의 일치 여부를 검사하는 방식으로 작동.

```java
public class CustomAuthenticationProvider implements AuthenticationProvider {
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) authentication;

        //입력한 ID, Password 조회
        String userEmail = token.getName();
        String userPw = (String)token.getCredentials();

        // 아래 코드는 8번에서 설명
        ...

    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}
```
### 8. 인증 처리 후 인증된 토큰을 AuthenticationManager에게 반환
5, 6, 7 방법으로 UserDetetailsService를 통해 DB에서 조회한 유저 정보와 입력받은 비밀번호가 일치하는지 확인하고, 일치하면 인증된 토큰을 생성하여 반환해주어야 한다. DB에 저장된 유저 비밀번호는 암호화 되어있기 때문에, 입력된 비밀번호를 PasswordEncoder를 통해 암호화하여 DB에서 조회한 사용자의 비밀번호와 매칭되는지 확인한다.

```java
@RequiredArgsConstructor
public class CustomAuthenticationProvider implements AuthenticationProvider {

    private final UserDetailsService userDetailsService;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) authentication;

        //입력한 ID, Password 조회
        String userId = token.getName();
        String userPw = (String)token.getCredentials();

        //UserDetailsService를 통해 DB에서 조회한 사용자
        UserDetailsImpl dbUser = (UserDetailsImpl) userDetailsService.loadUserByUsername(userId);

        // 비밀번호 매칭되는지 확인
        if (!passwordEncoder.matches(userPw, dbUser.getPassword())) {
            throw new BadCredentialsException(dbUser.getUsername() + "Invalid password");
        }

        return new UsernamePasswordAuthenticationToken(dbUser, userPw, dbUser.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}
```

위와 같이 완성된 CustomAuthenticationProvider를 SecurityConfig에 Bean으로 등록해주고 AuthenticationManager에 넣어주자.

```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final UserDetailsService userDetailsService;

    @Bean
    public BCryptPasswordEncoder encoderPwd() {
        return new BCryptPasswordEncoder();
    }

    // CustomAuthenticationProvider 빈 등록
    @Bean
    public CustomAuthenticationProvider customAuthenticationProvider() {
        return new CustomAuthenticationProvider(userDetailsService, encoderPwd());
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().
                requestMatchers(PathRequest.toStaticResources().atCommonLocations());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.authorizeRequests()
                .antMatchers("/user/**").authenticated()
                .antMatchers("/admin/**").access("hasRole('ROLE_ADMIN')")
                .anyRequest().permitAll()
                .and()
                .formLogin()
                .loginProcessingUrl("/login")
                .loginPage("/loginForm")
                .defaultSuccessUrl("/");
    }

    //AuthenticationManager에 Provider등록
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(customAuthenticationProvider());
    }
}
```

로그인에 성공하고나면 SecurityContextHolder라는 세션을 활용해 로그인이 유지된다.

[github 코드](https://github.com/parkmuhyeun/CustomAuthenticationProvider)

[이전 글]: https://parkmuhyeun.github.io/study/spring%20security/2022-01-29-Spring-Security(1)

참고
- [https://www.baeldung.com/spring-security-authentication-provider](https://www.baeldung.com/spring-security-authentication-provider)
- [https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-authenticationmanager](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-authenticationmanager)
- [https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/dao-authentication-provider.html#servlet-authentication-daoauthenticationprovider](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/dao-authentication-provider.html#servlet-authentication-daoauthenticationprovider)
- [https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/authentication/dao/DaoAuthenticationProvider.html](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/authentication/dao/DaoAuthenticationProvider.html)
- [https://mangkyu.tistory.com/77](https://mangkyu.tistory.com/77)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.