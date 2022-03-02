var tipuesearch = {"pages": [{
    "title": "컴포넌트 스캔",
    "text": "컴포넌트 스캔과 의존관계 자동 주입 시작 지금까지 스프링 빈을 등록할 때는 자바 코드의 @Bean을 이용했다.(또는 XML의 을 사용할 수 도 있음) 등록해야 할 스프링 빈이 수십, 수백개가 되면 일일이 등록하기도 귀찮고, 누락하는 문제도 생긴다. 그래서 스프링은 자동으로 스프링 빈을 등록하는 컴포넌트 스캔이라는 기능 제공 의존관계도 자동으로 주입하는 @Autowired 기능도 제공 @Configuration @ComponentScan public class AppConfig { } 컴포넌트 스캔을 사용하려면 먼저 @ComponentScan을 설정 정보에 붙여주면 된다. 예전의 AppConfig와 달리 @Bean으로 등록한 클래스가 없다. 컴포넌트 스캔은 이름 그대로 @Component 애노테이션이 붙은 클래스를 스캔해서 스프링 빈으로 등록한다. *참고: @Configuration도 컴포넌트 스캔의 대상이 되는데 그 이유는 @Configuration 소스코드를 열어보면 @Component 애노테이션이 붙어있다. 이제 클래스가 컴포넌트 스캔의 대상이 되도록 @Component 애노테이션을 붙여주고 의존관계도 주입해주자. @Component public class MemberServiceImpl implements MemberService { private final MemberRepository memberReepository; @Autowired public MemberServiceImpl(MemberRepository memberRepository) { this.memberRepository = memberRepository; } } 컴포넌트 스캔과 자동 의존관계 주입의 동작순서 1. @ComponentScan @ComponentScan은 @Component가 붙은 모든 클래스를 스프링 빈으로 등록한다. 이때 스프링 빈의 기본 이름은 클래스명을 사용하되 맨 앞글자만 소문자를 사용한다. 빈 이름 기본 전략: MemberServiceImpl 클래스 -&gt; memberServiceImpl 빈 이름 직접 지정: 스프링 빈의 이름을 직접 지정하고 싶으면 @Component(“exmemberService”) 이런식으로 이름을 부여하면 된다. 2. @Autowired 의존관계 자동 주입 생성자에 @Autowired를 지정하면, 스프링 컨테이너가 자동으로 해당 스프링 빈을 찾아서 주입한다. 탐색 위치와 기본 스캔 대상 모든 자바 클래스를 다 컴포넌트 스캔하면 시간이 오래 걸린다. 그래서 꼭 필요한 위치부터 탐색하도록 시작 위치를 지정할 수 있다. @ComponentScan{ basePackages = \"Spring.core\", } basePackages: 탐색할 패키지의 시작 위치를 지정하는데, 이 패키지를 포함해서 하위 패키지를 모두 탐색한다. 만약 지정하지 않으면 @ComponentScan이 붙은 설정 정보 클래스의 패키지가 시작 위치가 된다. 패키지 위치를 지정하지 않고, 설정 정보 클래스의 위치를 프로젝트 최상단에 두는걸 추천. 스프링 부트도 이 방법을 기본으로 제공한다. (@SpringBootApplication이 시작 루트 위치에 있는데 이 설정안에 @ComponentScan이 들어있다.) 컴포넌트 스캔 기본 대상 컴포넌트 스캔은 @Component뿐만 아니라 아래에 있는 것도 대상에 포함한다. @Controller: 스프링 MVC 컨트롤러에서 사용 @Service: 스프링 비즈니스 로직에서 사용 @Repository: 스프링 데이터 접근 계층에서 사용 @Configuration: 스프링 설정 정보에서 사용 컴포넌트 스캔의 용도 뿐만 아니라 다음 애노테이션이 있으면 스프링은 부가 기능을 수행한다. @Controller: 스프링 MVC 컨트롤러로 인식 @Repository: 스프링 데이터 접근 계층으로 인식하고, 데이터 계층의 예외를 스프링 예외로 변환해준다. @Configuration: 스프링 설정 정보로 인식하고, 스프링 빈이 싱글톤으로 유지하도록 추가 처리 @Service: @Service는 스프링에서 따로 특별한 처리를 하지않고, 개발자들이 핵심 비즈니스 로직이 여기에 있겠구나 라고 비즈니스 계층을 인식하는데 도움을 준다. 필터 includeFilters: 컴포넌트 스캔 대상을 추가로 지정한다. excludeFilters: 컴포넌트 스캔에서 제외할 대상을 지정한다. 중복 등록과 충돌 컴포넌트 스캔에서 같은 빈 이름을 등록하면 어떻게 될까? 자동 빈 등록 vs 자동 빈 등록 컴포넌트 스캔에 의해 자동으로 스프링 빈이 등록되는데, 그 이름이 같은 경우 스프링은 오류를 발생시킨다. 수동 빈 등록 vs 자동 빈 등록 이 경우 수동 빈이 자동 빈을 오버라이딩 해버린다.(수동 빈 등록이 우선권) 최근 스프링 부트에서는 수동 빈 등록과 자동 빈 등록이 충돌나면 오류가 발생하도록 기본 값을 바꾸었다. 참고: Spring Core *틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.",
    "tags": "Java Spring study spring",
    "url": "/study/spring/2022-03-02-Spring(5)/"
  },{
    "title": "싱글톤 컨테이너",
    "text": "웹 애플리케이션은 보통 여러 고객이 동시에 요청을 한다. 스프링 없는 순수한 DI 컨테이너는 요청을 할 때 마다 객체를 새로 생성해 메모리 낭비가 심하다. 해결방안은 해당 객체가 딱 1개만 생성되고, 공유하도록 설계하면 된다. -&gt; 싱글톤 패턴 싱글톤 패턴 클래스의 인스턴스가 딱 1개만 생성되는 것을 보장하는 디자인 패턴이다. 그래서 객체 인스턴스를 2개 이상 생성하지 못하도록 막아야 한다. private 생성자를 사용해서 외부에서 임의로 new 키워드를 사용하지 못하도록 막아야 한다. public class SingletonService { //1. static 영역에 객체를 딱 1개만 생성해둔다. private static final SingletonService instance = new SingletonService(); //2. public으로 열어서 객체 인스터스가 필요하면 이 static 메서드를 통해서만 조회하도록 허용한다. public static SingletonService getInstance() { return instance; } //3. 생성자를 private으로 선언해서 외부에서 new 키워드를 사용한 객체 생성을 못하게 막는다. private SingletonService() { } } 싱글톤 패턴을 구현하는 방법은 다양하다. 여기서는 객체를 미리 생성해두는 방식으로 했다. 싱글톤 패턴을 적용하면 고객의 요청이 올 때마다 객체를 생성하는 것이 아니라, 이미 만들어진 객체를 공유해서 효율적으로 사용할 수 있다. 하지만 싱글톤 패턴은 다음과 같은 문제점들을 가지고 있다. 싱글톤 패턴 문제점 싱글톤 패턴을 구현하는 코드 자체가 많이 들어간다. 의존관계상 클라이언트가 구체 클래스에 의존한다. -&gt; DIP를 위반 클라이언트가 구체 클래스에 의존해서 OCP 원칙을 위반할 가능성이 높다. 테스트하기 어렵다. 내부 속성을 변경하거나 초기화 하기 어렵다. private 생성자로 자식 클래스를 만들기 어렵다. 결론적으로 유연성이 떨어진다. 싱글톤 컨테이너 스프링 컨테이너는 싱글톤 패턴의 문제점을 해결하면서, 객체 인스턴스를 싱글톤(1개만 생성)으로 관리한다. 이전 글에서 학습한 스프링 빈이 바로 싱글톤으로 관리되는 빈이다. 스프링 컨테이너는 싱글턴 패턴을 적용하지 않아도, 객체 인스턴스를 싱글톤으로 관리한다. 스프링 컨테이너는 싱글톤 컨테이너 역활을 한다. 이렇게 싱글톤 객체를 생성하고 관리하는 기능을 싱글톤 레지스트리라고 한다. 스프링 컨테이너의 이런 기능 덕분에 싱글턴 패턴의 모든 단점을 해결하면서 객체를 싱글톤으로 유지할 수 있다. 싱글톤 패턴을 위한 지저분한 코드가 들어가지 않아도 된다. DIP, OCP, 테스트, private 생성자로부터 자유롭게 싱글톤을 사용할 수 있다. *참고: 스프링의 기본 빈 등록 방식은 싱글톤이지만, 싱글톤 방식만 지원하는 것은 아니다. 요청할 때 마다 새로운 객체를 생성해서 반환하는 기능도 제공할 수 있다. 싱글톤 방식의 주의점 싱글톤 패턴이든, 스프링 같은 싱글톤 컨테이너를 사용하든, 객체 인스턴스를 하나만 생성해서 공유하는 싱글톤 방식은 여러 클라이언트가 하나의 같은 객체 인스턴스를 공유하기 때문에 싱글톤 객체는 상태를 유지(stateful)하게 설계하면 안된다. 무상태(stateless)로 설계해야 한다. 특정 클라이언트에 의존적인 필드가 있으면 안된다. 특정 클라이언트가 값을 변경할 수 있는 필드가 있으면 안된다. 가급적 읽기만 가능해야 한다. 필드 대신 자바에서 공유되지 않는, 지역변수, 파라미터, ThreadLocal 등을 사용해야 한다. @Configuration과 싱글톤 @Configuration public class AppConfig{ @Bean public MemberService memberService(){ ... } } @Configuration을 적용하지 않고, @Bean만 적용하면 어떻게 될까? @Configuration을 붙이면 바이트코드를 조작하는 CGLIB 기술을 사용해서 싱글톤을 보장하지만, 만약 @Bean만 적용하면 스프링 빈으로만 등록되고, 싱글톤을 보장하지 않는다. (CGLIB 내부 기술이 궁금하면 찾아보자) 스프링 설정 정보는 항상 @Configuration 사용 참고: Spring Core *틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.",
    "tags": "Java Spring study spring",
    "url": "/study/spring/2022-02-24-Spring(4)/"
  },{
    "title": "스프링 컨테이너와 스프링 빈",
    "text": "이전 글에서 AppConfig로 MemberService에 의존성을 넣어줄 수 있었다. 스프링 컨테이너에 적용하면서 스프링 컨테이너에 대해 알아보자 스프링 컨테이너 @Configuration public class AppConfig{ @Bean public MemberService memberService() { return new MemberService(new MemoryMemberRepository()); } } // memberService에 join, find 구현되있다고 가정 public class MemberApp { public static void main(String[] args){ // AppConfig appConfig = new AppConfig(); 기존의 방법 // MemberService memberService = appConfig.memberService(); ApplicationContext applicationContext = new AnnotationConfigApplicationContext(AppConfig.class); MemberService memberService = applicationContext.getBean(\"memberService\", MemberService.class); Member member = new Member(1L, \"memberA\", Grade.VIP); memberService.join(member); Member findMember = memberService.findMember(1L); System.out.println(\"new member = \" + member.getName()); System.out.println(\"find Member = \" + findMember.getName()); } } ApplicationContext를 스프링 컨테이너라 한다. 기존에는 개발자가 AppConfig를 사용해서 직접 객체를 생성하고 DI를 했지만(주석 처리한 방법), 이제부터는 스프링 컨테이너를 통해서 사용한다. 스프링 컨테이너는 @Configuration 붙은 AppConfig를 설정(구성) 정보로 사용한다. 여기서 @Bean 이라 적힌 메서드를 모두 호출해서 반환된 객체를 스프링 컨테이너에 등록한다. 이렇게 스프링 컨테이너에 등록된 객체를 스프링 빈이라 한다. 이전에는 개발자가 필요한 객체를 AppConfig를 사용해서 직접 조회했지만, 이제부터는 스프링 컨테이너를 통해서 필요한 스프링 빈(객체)를 찾아야 한다. 스프링 빈은 applicationContext.getBean() 메서드를 사용해서 찾을 수 있다. 코드가 약간 더 복잡해진 것 같은데, 스프링 컨테이너를 사용하면 어떤 장점이 있는지 알아보자. 스프링 컨테이너 생성 스프링 컨테이너가 생성되는 과정을 알아보자. //스프링 컨테이너 생성 ApplicationContext applicationContext = new AnnotationConfigApplicationContext(AppConfig.class); ApplicationContext는 인터페이스이다. newAnnotationConfigApplicationContext(AppConfig.class);는 ApplicationContext 인터페이스의 구현체이다. 스프링 컨테이너는 XML을 기반으로 만들 수도 있고, 애노테이션 기반의 자바 설정 클래스로도 만들 수 있다. 직전의 AppConfig를 사용했던 방식이 애노테이션 기반의 자바 설정 클래스로 스프링 컨테이너를 만든 것 XML 설정 사용 최근에는 스프링 부트를 많이 사용하면서 XML기반의 설정은 잘 사용하지 않는다. 궁금하면 찾아보자 스프링 컨테이너의 생성 과정 1. 스프링 컨테이너 생성 new AnnotationConfigApplicationContext(AppConfig.class) 스프링 컨테이너를 생성할 때는 구성 정보를 지정해주어야 한다. 여기서는 AppConfig.class를 구성 정보로 지정 2. 스프링 빈 등록 빈 이름은 메서드 이름을 사용한다. 빈 이름을 직접 부여할 수 도 있다. @Bean(name = “memberService2”) *주의: 빈 이름은 항상 다른 이름을 부여해야 함. 같은 이름을 부여하면, 다른 빈이 무시되거나, 기존 빈을 덮어 버리거나 설정에 따라 오류가 발생. 3. 스프링 빈 의존관계 설정 스프링 컨테이너는 설정 정보를 참고해서 의존관계를 주입(DI)한다. 다양한 설정 형식 지원 - 자바 코드, XML 스프링 컨테이너는 다양한 형식의 설정 정보를 받아드릴 수 있게 유연하게 설계되어 있다. 자바코드, XML, Groovy 등등 어떻게 이런 다양한 설정 형식을 지원할까? 그 중심에는 BeanDefinition이라는 추상화가 있다. 조금 더 깊이 있게 들어가보자면 AnnotationConfigApplicationContext 는 AnnotatedBeanDefinitionReader 를 사용해서 AppConfig.class 를 읽고 BeanDefinition 을 생성한다. GenericXmlApplicationContext 는 XmlBeanDefinitionReader 를 사용해서 appConfig.xml 설정정보를 읽고 BeanDefinition 을 생성한다. 새로운 형식의 설정 정보가 추가되면, XxxBeanDefinitionReader를 만들어서 BeanDefinition 을 생성하면 된다. 실무에서 BeanDefinition을 직접 정의하거나 사용할 일은 거의 없으므로 깊게 이해하는 것 보단 이렇게 사용하는 구나 하고 넘어가자. 참고: Spring Core *틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.",
    "tags": "Java Spring study spring",
    "url": "/study/spring/2022-02-18-Spring(3)/"
  },{
    "title": "Spring의 강력한 무기",
    "text": "이전 글에서 스프링은 다음 기술로 다형성과 OCP/DIP를 가능하게 지원한다고 했다. DI(Dependency Injection): 의존관계, 의존성 주입 DI 컨테이너 제공 기술의 적용 코드로 어떻게 DI라는 기술을 적용하는지 보자 기존의 코드를 변경하기 위해선 구현체에 의존하고 있기 때문에 Memory에서 Jdbc로 변경하기위해서는 클라이언트쪽 코드의 변경이 불가피한 상황 public interface MemberRepository{ ... } public class MemoryMemberRepository implements MemberRepository { ... } public class JdbcMemberRepository implements MemberRepository { ... } public class MemberService { // 기존코드 public class MemberService { private MemberRepository memberRepository = new MemoryMemberRepository(); } // 변경코드 public class MemberService { // private MemberRepository memberRepository = new MemoryMemberRepository(); private MemberRepository memberRepository = new JdbcMemberRepository(); } 그럼 어떻게 해야한다는 거야?? 클라이언트 코드인 MemberService는 MemberRepository의 인터페이스 뿐 아니라 구체 클래스도함께 의존중이다. 그래서 구체 클래스를 변경할 때 클라이언트 코드도 함께 변경해야 한다. DIP 위반 -&gt; 추상에만 의존하도록 변경해보자(인터페이스에만 의존) public class MemberService { private MemberRepository memberRepository; } 인터페이스에만 의존하도록 변경했다. 그런데 구현체가 없는데 어떻게 코드를 실행될까??(지금 상태에 실행하면 NPE(null pointer exception)이 발생한다) AppConfig의 등장 애플리케이션의 전체 동작 방식을 구성(config)하기위해 구현 객체를 생성하고, 연결하는 책임을 가지는 별도의 설정 클래스 생성 @Configuration public class AppConfig{ @Bean public MemberService memberService() { return new MemberService(new MemoryMemberRepository()); } } AppConfig에 설정을 구성한다는 뜻의 @Configuration을 붙임 메서드에 @Bean을 붙여준다. 이렇게 하면 스프링 컨테이너에 스프링 빈으로 등록한다. (스프링 컨테이너는 다음 글에서 알아보자.) AppConfig에 실제 동작에 필요한 구현 객체를 생성 MemoryMemberRepository AppConfig는 생성한 객체 인스턴스의 참조(레퍼런스)를 생성자를 통하여 주입(연결)한다. public class MemberService { private MemberRepository memberRepository; public MemberService(MemberRepository memberRepository) { this.memberRepository = memberRepository; } } 설계 변경으로 MemberService는 MemoryRepository를 의존하지 않고 MemberRepository라는 인터페이스에만 의존 MemberService 입장에서 생성자를 통해 어떤 구현 객체가 들어올지(주입될지) 알 수 없다. MemberService의 생성자를 통해서 어떤 구현 객체를 주입할지는 외부(AppConfig)에서 결정 MemberService는 이제 의존관계에 대한 고민은 외부에 맡기고 실행에만 집중하면 됨 객체의 생성과 연결은 AppConfig가 담당 클라이언트인 MemberService 입장에서 보면 의존관계를 마치 외부에서 주입해주는 것 같다고 해서 DI(Dependency Injection) 우리말로 의존관계 주입 또는 의존성 주입이라 한다. AppConfig의 등장으로 애플리케이션의 크게 사용 영역과, 객체를 생성하고 구성(Configuration)하는 영역으로 분리되었다. IoC, DI, 그리고 컨테이너 제어의 역전 IoC(Inversion of Control) 기존 프로그램은 클라이언트 구현 객체가 스스로 필요한 서버 구현 객체를 생성하고, 연결하고, 실행. 한마디로 구현 객체가 프로그램의 제어 흐름을 스스로 조종했다. 반면에 AppConfig가 등장한 이후 구현 객체는 자신의 로직을 실행하는 역활만 담당하고 프로그램의 제어 흐름은 AppConfig가 담당한다. 이렇게 프로그램의 제어 흐름을 직접 제어하는 것이 아니라 외부에서 관리하는 것을 제어의 역전(IoC)이라 한다. IoC 컨테이너, DI 컨테이너 AppConfig처럼 객체를 생성하고 관리하면서 의존관계를 연결해 주는 것을 IC 컨테이너 또는 Di 컨테이너라 한다. 프레임워크 vs 라이브러리 내가 작성한 코드를 제어하고, 대신 실행하면 그것은 프레임워크 반면에 내가 작성한 코드가 직접 제어의 흐름을 담당한다면 그것은 라이브러리 참고: Spring Core *틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.",
    "tags": "Java Spring study spring",
    "url": "/study/spring/2022-02-10-Spring(2)/"
  },{
    "title": "Spring Security를 구현해보자",
    "text": "이전 글에서 Spring Security 과정을 이해해보았다. 이번에는 어떻게 적용을 하는지 직접 구현해보면서 알아보자. 이전 글에서 구현하는 방법에 간단하게 구현하는 방법과 직접 AuthenticationProvider을 커스텀하는 방법이 있다고 했는데 먼저 기본적인 방법부터 알아보자. Standard Method (DaoAuthenticationProvider) 표준적이고 가장 일반적인 구현방법은 AuthenticationProvider에 DaoAuthenticationProvider을 사용하는 방법인데 따로 Provider을 구현을 할필요가 없기 때문에 사실상 SecurityConfig 설정하고, Userdetails, UserdetailsService만 구현하면된다. 0. 설정 셋팅 build.gradle에 dependency 추가 dependencies { implementation 'org.springframework.boot:spring-boot-starter-data-jpa' implementation 'org.springframework.boot:spring-boot-starter-security' implementation 'org.springframework.boot:spring-boot-starter-thymeleaf' implementation 'org.springframework.boot:spring-boot-starter-web' implementation 'org.thymeleaf.extras:thymeleaf-extras-springsecurity5' compileOnly 'org.projectlombok:lombok' annotationProcessor 'org.projectlombok:lombok' testImplementation 'org.springframework.boot:spring-boot-starter-test' testImplementation 'org.springframework.security:spring-security-test' } SpringSecurity에 대한 기본적인 설정 추가. @Configuration @EnableWebSecurity public class SecurityConfig extends WebSecurityConfigurerAdapter { // 정적 자원에 대해서는 Security 설정을 적용하지 않음. @Override public void configure(WebSecurity web) { web.ignoring().requestMatchers(PathRequest.toStaticResources().atCommonLocations()); } @Override protected void configure(HttpSecurity http) throws Exception { http.csrf().disable(); http.authorizeRequests() .antMatchers(\"/user/**\").authenticated() // /user/** 요청에 대해 로그인 요구 .antMatchers(\"/admin/**\").access(\"hasRole('ROLE_ADMIN')\") // /admin/** 요청에 대해 ROLE_ADMIN 역활을 가지고 있어야 함 .anyRequest().permitAll() // 나머지 요청은 로그인 요구x .and() .formLogin() //form 기반 로그인 설정 .loginProcessingUrl(\"/login\") // 로그인 form의 action에 들어갈 처리 URI .loginPage(\"/loginForm\") //로그인 페이지 설정 .defaultSuccessUrl(\"/\"); //로그인 성공시 URL } } //PasswordEncoder @Bean public BCryptPasswordEncoder encoderPwd() { return new BCryptPasswordEncoder(); } 코드만 적으면 이해하기가 어려울테니 순서에 맞춰서 과정을 설명하며 코드를 구현해보겠다.(구현관련해서만 설명하니 역활 설명과 상세한 과정 설명은 이전 글을 보자!) 1. 로그인 요청 사용자는 아이디와 비밀번호를 입력해서 로그인 요청을 한다. 이번 예제는 Form 기반으로 요청하는 상황. 2. UserPasswordAuthenticationToken 발급 전송이 오면 AuthenticationFilter이 id, password를 가로채 UserPasswordAuthenticationToken 발급. 여기서 유효성을 검사 하기위해 필터를 커스텀해서 추가시킬수 있지만 복잡해지므로 생략한다. 나중에 필요할 때 추가하면 된다. 3. UsernamePasswordToken을 Authentication Manager에게 전달 AuthenticationFilter은 생성한 UsernamePasswordToken을 Authentication Manager에게 전달한다. 4. UsernamePasswordToken을 Authentication Provider에게 전달 AuthenticationManager는 전달받은 UsernamePasswordToken을 AuthenticationProvider에게 전달하여 실제 인증 과정을 수행한다. AuthenticationProvider은 입력한 값(token에서 꺼낼수 있음)과 5,6,7 과정을 통해 가져온 값(DB에서 가져온 것)을 비교한다. 이 부분이 Custom을 한 구현방법과 차이나는 부분인데 이 방법에선 AuthenticationProvider을 따로 구현할필요가 없다. (AuthenticationProvider에 DaoAuthenticationProvider이 사용된다) 5, 6, 7. DB에서 User정보 UserDetailsService를 통해 UserDetails형태로 가져오기 따로 설명하면 더 헷갈리므로 묶어서 설명하겠다. AuthenticationProvider에서 아이디를 조회하였으면 UserDetailsService로부터 아이디를 기반으로 데이터를 조회해야 한다. UserDetailService는 인터페이스이기 때문에 이를 구현한 클래스를 작성해야 한다. @RequiredArgsConstructor @Service public class UserDetailsServiceImpl implements UserDetailsService { private final UserRepository userRepository; @Override public UserDetails loadUserByUsername(String username) { User user = userRepository.findByUsername(username); if (user == null) { return null; } return new UserDetailsImpl(user); } } UserDetailsServiceImpl의 반환형이 UserDetails이다. User를 담을 UserDetails을 구현해보자 @Data public class UserDetailsImpl implements UserDetails { private User user; public UserDetailsImpl(User user) { this.user = user; } //해당 User의 권한을 리턴하는 곳! @Override public Collection&lt;? extends GrantedAuthority&gt; getAuthorities() { Collection&lt;GrantedAuthority&gt; collection = new ArrayList&lt;&gt;(); collection.add(new GrantedAuthority() { @Override public String getAuthority() { return user.getRole(); } }); return collection; } @Override public String getPassword() { return user.getPassword(); } @Override public String getUsername() { return user.getUsername(); } @Override public boolean isAccountNonExpired() { return true; } @Override public boolean isAccountNonLocked() { return true; } @Override public boolean isCredentialsNonExpired() { return true; } @Override public boolean isEnabled() { return true; } } 8. 인증 처리 후 인증된 토큰을 Authentication Manager에게 반환 이제 AuthenticationProvider(현재 구현체 - DaoAuthenticationProvider)에서 UserDetailsServices를 통해 얻어낸 UserDetails와 입력으로 부터 들어온 비밀번호를 PasswordEncoder를 통해 암호화한 것과 비교하여 유효성을 확인하고 Authentication을 반환해준다. 9. 인증된 토큰을 AuthenticationFilter에게 전달 AuthenticationProvider에서 받은 Authentication을 AuthenticationFilter에게 반환 10. 인증된 토큰을 SecurityContextHolder에 저장 Authentication객체를 SecurityContextHolder에 저장하면 인증이 끝난다. github 코드 Custom Method 위에서 기본적인 방법을 알아봤으니 AuthenticationProvider을 직접 Custom하는 방식을 알아보자. 외부, 타사 서비스(예를들어 Crowd) 같은 것에 대해 인증하기위해서는 Custom한 Authentication Provider를 구현해야한다. Standard방식에서 추가적으로 CustomAuthenticationProvider를 구현하고 Config에 등록만 하면 된다. 4. UsernamePasswordToken을 AuthenticationProvider에게 전달 Standard 방식에서 4, 8번 과정인 AuthenticationProvider 부분만 달라지고 나머지 부분은 윗 부분과 동일하다. AuthenticationManager는 전달받은 UsernamePasswordToken을 AuthenticationProvider에게 전달하여 실제 인증 과정을 수행하며, 실제 인증에 대한 부분은 authenticate 함수에 작성하면 된다. Spring Security에서는 Username으로 DB에서 데이터를 조회한다음, 비밀번호의 일치 여부를 검사하는 방식으로 작동. public class CustomAuthenticationProvider implements AuthenticationProvider { @Override public Authentication authenticate(Authentication authentication) throws AuthenticationException { UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) authentication; //입력한 ID, Password 조회 String userEmail = token.getName(); String userPw = (String)token.getCredentials(); // 아래 코드는 8번에서 설명 ... } @Override public boolean supports(Class&lt;?&gt; authentication) { return authentication.equals(UsernamePasswordAuthenticationToken.class); } } 8. 인증 처리 후 인증된 토큰을 AuthenticationManager에게 반환 5, 6, 7 방법으로 UserDetetailsService를 통해 DB에서 조회한 유저 정보와 입력받은 비밀번호가 일치하는지 확인하고, 일치하면 인증된 토큰을 생성하여 반환해주어야 한다. DB에 저장된 유저 비밀번호는 암호화 되어있기 때문에, 입력된 비밀번호를 PasswordEncoder를 통해 암호화하여 DB에서 조회한 사용자의 비밀번호와 매칭되는지 확인한다. @RequiredArgsConstructor public class CustomAuthenticationProvider implements AuthenticationProvider { private final UserDetailsService userDetailsService; private final BCryptPasswordEncoder passwordEncoder; @Override public Authentication authenticate(Authentication authentication) throws AuthenticationException { UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) authentication; //입력한 ID, Password 조회 String userId = token.getName(); String userPw = (String)token.getCredentials(); //UserDetailsService를 통해 DB에서 조회한 사용자 UserDetailsImpl dbUser = (UserDetailsImpl) userDetailsService.loadUserByUsername(userId); // 비밀번호 매칭되는지 확인 if (!passwordEncoder.matches(userPw, dbUser.getPassword())) { throw new BadCredentialsException(dbUser.getUsername() + \"Invalid password\"); } return new UsernamePasswordAuthenticationToken(dbUser, userPw, dbUser.getAuthorities()); } @Override public boolean supports(Class&lt;?&gt; authentication) { return authentication.equals(UsernamePasswordAuthenticationToken.class); } } 위와 같이 완성된 CustomAuthenticationProvider를 SecurityConfig에 Bean으로 등록해주고 AuthenticationManager에 넣어주자. @Configuration @EnableWebSecurity @RequiredArgsConstructor public class SecurityConfig extends WebSecurityConfigurerAdapter { private final UserDetailsService userDetailsService; @Bean public BCryptPasswordEncoder encoderPwd() { return new BCryptPasswordEncoder(); } // CustomAuthenticationProvider 빈 등록 @Bean public CustomAuthenticationProvider customAuthenticationProvider() { return new CustomAuthenticationProvider(userDetailsService, encoderPwd()); } @Override public void configure(WebSecurity web) throws Exception { web.ignoring(). requestMatchers(PathRequest.toStaticResources().atCommonLocations()); } @Override protected void configure(HttpSecurity http) throws Exception { http.csrf().disable(); http.authorizeRequests() .antMatchers(\"/user/**\").authenticated() .antMatchers(\"/admin/**\").access(\"hasRole('ROLE_ADMIN')\") .anyRequest().permitAll() .and() .formLogin() .loginProcessingUrl(\"/login\") .loginPage(\"/loginForm\") .defaultSuccessUrl(\"/\"); } //AuthenticationManager에 Provider등록 @Override protected void configure(AuthenticationManagerBuilder auth) throws Exception { auth.authenticationProvider(customAuthenticationProvider()); } } 로그인에 성공하고나면 SecurityContextHolder라는 세션을 활용해 로그인이 유지된다. github 코드 참고 https://www.baeldung.com/spring-security-authentication-provider https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-authenticationmanager https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/dao-authentication-provider.html#servlet-authentication-daoauthenticationprovider https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/authentication/dao/DaoAuthenticationProvider.html https://mangkyu.tistory.com/77 *틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.",
    "tags": "study spring security",
    "url": "/study/spring%20security/2022-02-06-Spring-Security(2)/"
  },{
    "title": "Spring Security 과정을 이해해보자",
    "text": "인터넷을 보고 프로젝트에 Spring Security를 적용시켜봐도 UserDetails, Principal, AuthenticationProvider 등등.. 이게 도대체 무슨 말이야? 도무지 이해가 가지않았던 스프링 시큐리티. 동작 과정을 처음부터 상세하게 이해하고 적용해보자. 처음 보면 어려운게 당연하니 반복해서 학습하자. +구현하는 방법에는 간단하게 구현하는 것(AuthenticationProvider 직접 구현x)도 있고 직접 커스텀해서 하는 방법 (AuthenticationProvider를 직접 구현)도 있기 때문에 그런 디테일한 부분들은 다음 글에서 설명하겠다. Spring Security? Spring Security는 Java 애플리케이션의 인증과 권한 부여를 제공하는 데 중점을 둔 프레임워크. 보안과 관련해서 많은 기능을 제공해주기 때문에 개발자가 직접 보안 관련 로직을 작성하지 않아도 되는 장점이 있다. Architecture 아래 그림은 Spring Security Architecture이다. (더 이해하기 쉽도록 최대한 숫자에 맞춰 과정을 적어봤다 + 역활 설명) 사용자 로그인을 하면 id, password가 Request에 담아져 보내진다. AuthenticationFilter에서 request가 보낸 id, password를 가로채 인증용 객체(UsernamePasswordAuthenticationToken)로 만든다. 인증을 담당할 AuthenticationManager 인터페이스(구현체 - ProviderManager)에게 인증용 객체를 준다. 실제 인증을 할 AuthenticationProvider에게 다시 인증용 객체를 전달한다. 인증 절차가 시작되면 AuthenticationProvider 인터페이스가 실행 -&gt; DB에 있는 이용자의 정보와 화면에서 입력한 로그인 정보 비교 AuthenticationProvider 인터페이스에서는 authenticate() 메소드를 오버라이딩 하게 되는데 이 메소드의 파라미터인 Authentication으로 화면에서 입력한 로그인 정보를 가져올 수 있다. AuthenticationProvider 인터페이스에서 DB에 있는 이용자의 정보를 가져오려면, UserDetailsService 인터페이스를 사용. UserDetailsService 인터페이스는 화면에서 입력한 이용자의 id(username)를 가지고 loadUserByUsername() 메소드를 호출하여 DB에 있는 이용자의 정보를 UserDetails 형으로 가져온다. 만약 이용자가 존재하지 않으면 예외를 던진다. (UserDetails를 User와 Authentication 사이를 채워주는 Adaptor라고 생각하자) 5,6,7을 통해 가져온 정보(DB를 통해 가져온 이용자정보, 화면에서 입력한 이용자 정보)를 비교하고, 일치하면 Authentication 참조를 리턴하고, 일치 하지 않으면 예외를 던진다. -&gt; 인증이 완료되면 사용자 정보를 가진 Authentication 객체를 SecurityContextHolder에 담은 이후 AuthenticationSuccessHandler을 실행.(실패시 AuthenticationFailureHandler 실행) AuthenticationFilter 설정된 로그인 URL로 오는 요청을 감시하며, 유저 인증 처리 AuthenticationManager를 통한 인증 실행 인증 성공 시 얻은 Authentication 객체를 SecurityContext에 저장 후 AuthenticationSuccessHandler 실행 인증 실패시, AuthenticationFailureHandler 실행 UsernamePasswordAuthenticationToken 사용자의 id가 Principal 역활을 하고, password가 Credential의 역활을 한다. 첫번째 생성자는 인증 전의 객체를 생성한다. 두번째 생성자는 인증이 완료된 객체를 생성한다. public class UsernamePasswordAuthenticationToken extends AbstractAuthenticationToken { // 주로 사용자의 ID에 해당함 private final Object principal; // 주로 사용자의 PW에 해당함 private Object credentials; // 인증 완료 전의 객체 생성 public UsernamePasswordAuthenticationToken(Object principal, Object credentials) { super(null); this.principal = principal; this.credentials = credentials; setAuthenticated(false); } // 인증 완료 후의 객체 생성 public UsernamePasswordAuthenticationToken(Object principal, Object credentials, Collection&lt;? extends GrantedAuthority&gt; authorities) { super(authorities); this.principal = principal; this.credentials = credentials; super.setAuthenticated(true); // must use super, as we override } } } public abstract class AbstractAuthenticationToken implements Authentication, CredentialsContainer { } AuthenticationManager 인증에 대한 부분은 SpringSecurity의 AuthenticationManager를 통해 처리하게 되는데, 실질적으로는 AuthenticationManager에 등록된 AuthenticationProvider에 의해 처리된다. public interface AuthenticationManager { Authentication authenticate(Authentication authentication) throws AuthenticationException; } AuthenticationManger(구현체 - ProviderManager)와 AuthenticationProvider가 헷갈리면 이렇게 생각 해보자. AuthenticationManager가 상급자고 AuthenticationProvider가 부하직원이라고 생각하고 상급자가 부하직원에게 인증이란 일을 시킨다고 생각하면 된다. AuthenticationManger를 구현한 ProviderManager는 실제 인증 과정에 대한 로직을 가지고 있는 AuthenticationProvider를 List로 가지고 있으며, for문을 통해 모든 provider를 조회하면서 authenticate 처리를 한다. public class ProviderManager implements AuthenticationManager, MessageSourceAware, InitializingBean { public List&lt;AuthenticationProvider&gt; getProviders() { return providers; } public Authentication authenticate(Authentication authentication) throws AuthenticationException { Class&lt;? extends Authentication&gt; toTest = authentication.getClass(); AuthenticationException lastException = null; Authentication result = null; boolean debug = logger.isDebugEnabled(); //for문으로 모든 provider를 순회하여 처리하고 result가 나올 때까지 반복한다. for (AuthenticationProvider provider : getProviders()) { .... try { result = provider.authenticate(authentication); if (result != null) { copyDetails(authentication, result); break; } } catch (AccountStatusException e) { prepareException(e, authentication); // SEC-546: Avoid polling additional providers if auth failure is due to // invalid account status throw e; } .... } throw lastException; } } AuthenticationProvider를 직접 커스텀해서 만든 경우 AuthenticationManger에 등록 하는 방법은 WebSecurityConfigurerAdapter를 상속해 만든 SecurityConfig에서 할 수 있다. @Configuration @EnableWebSecurity public class SecurityConfig extends WebSecurityConfigurerAdapter { @Bean public AuthenticationManager getAuthenticationManager() throws Exception { return super.authenticationManagerBean(); } @Bean public CustomAuthenticationProvider customAuthenticationProvider() throws Exception { return new CustomAuthenticationProvider(); } @Override protected void configure(AuthenticationManagerBuilder auth) throws Exception { auth.authenticationProvider(customAuthenticationProvider()); } } AuthenticationProvider AuthenticationProvider에서는 실제 인증에 대한 부분을 처리하는데, 인증 전의 인증용 객체를 받아서 5,6,7,8 과정을 거쳐서 인증이 완료된 객체를 반환하는 역활은 한다. 아래와 같은 AuthenticationProvider 인터페이스를 구현해서 Custom한 AuthenticationProvider을 작성해서 바로 위에 설명한 방법처럼 AuthenticationManager에 등록하면 된다. public interface AuthenticationProvider { // 인증 전의 Authenticaion 객체를 받아서 인증된 Authentication 객체를 반환 Authentication authenticate(Authentication var1) throws AuthenticationException; boolean supports(Class&lt;?&gt; var1); } 커스텀하고싶으면 밑에 형식처럼 원하는 부분을 구현하면 된다. 아래를 보면 5,6,7,8번 과정이 모두 일어나는걸 볼 수 있다. public class CustomAuthenticationProvider implements AuthenticationProvider{ @Autowired private UserDetailsService userDetailsService; @SuppressWarnings(\"unchecked\") @Override public Authentication authenticate(Authentication authentication) throws AuthenticationException { // AuthenticaionFilter에서 생성된 토큰으로부터 아이디와 비밀번호를 조회함 String username = (String) authentication.getPrincipal(); String password = (String) authentication.getCredentials(); // UserDetailsService를 통해 DB에서 아이디로 사용자 조회 CustomUserDetails user = (CustomUserDetails) userDetailsService.loadUserByUsername(username); //조회한 것들 비교 if(!matchPassword(password, user.getPassword())) { throw new BadCredentialsException(username); } if(!user.isEnabled()) { throw new BadCredentialsException(username); } return new UsernamePasswordAuthenticationToken(username, password, user.getAuthorities()); } @Override public boolean supports(Class&lt;?&gt; authentication) { return true; } private boolean matchPassword(String loginPwd, String password) { return loginPwd.equals(password); } } Authentication Authentication은 현재 접근하는 주체의 정보와 권한을 담는 인터페이스. Authentication 객체는 SecurityContext에 저장되며 SecurityContextHolder를 통해 SecurityContext에 접근하고 SecurityContext를 통해 Authentication에 접근 할 수 있다. public interface Authentication extends Principal, Serializable { // 현재 사용자의 권한 목록을 가져옴 Collection&lt;? extends GrantedAuthority&gt; getAuthorities(); // credentials(주로 비밀번호)을 가져옴 Object getCredentials(); Object getDetails(); // Principal 객체를 가져옴. Object getPrincipal(); // 인증 여부를 가져옴 boolean isAuthenticated(); // 인증 여부를 설정함 void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException; } UserDetailsService UserDetailsService 인터페이스는 DB에서 유저 정보를 가져오는 역활 public interface UserDetailsService { UserDetails loadUserByUsername(String var1) throws UsernameNotFoundException; } UserDetails 사용자의 정보를 담는 인터페이스, 구현해서 사용하면 됨 public interface UserDetails extends Serializable { Collection&lt;? extends GrantedAuthority&gt; getAuthorities(); String getPassword(); String getUsername(); boolean isAccountNonExpired(); boolean isAccountNonLocked(); boolean isCredentialsNonExpired(); boolean isEnabled(); } SecurityContextHolder SecurityContextHolder는 보안 주체의 세부 정보를 포함하여 응용프로그램의 현재 보안 컨텍스트에 대한 세부 정보가 저장. SecurityContext는 Authentication을 보관하는 역활을 하며, SecurityContext를 통해 Authentication 객체를 꺼내올 수 있다. 이론 설명은 여기까지입니다. 최대한 쉽게 풀어 쓸려고 말을 많이 붙이다 보니 길어졌는 데 도움이 됐는지 모르겠네요ㅜㅜ 다음 글에서는 구현 과정을 설명하겠습니다! 참고 Spring-Security https://mangkyu.tistory.com/76 https://velog.io/@hellas4/Security-%EA%B8%B0%EB%B3%B8-%EC%9B%90%EB%A6%AC-%ED%8C%8C%EC%95%85%ED%95%98%EA%B8%B0-%EC%9D%B4%EB%A1%A0%ED%8E%B8 *틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.",
    "tags": "study spring security",
    "url": "/study/spring%20security/2022-01-29-Spring-Security(1)/"
  },{
    "title": "왜 Spring을 사용할까?",
    "text": "Spring은 왜 만들었나? 스프링은 자바 언어 기반의 프레임워크 자바 언어의 가장 큰 특징 - 객체 지향 언어 스프링은 객체 지향 언어가 가진 특징을 가장 잘 살려내는 프레임워크 스프링은 좋은 객체 지향 애플리케이션을 개발할 수 있게 도와주는 프레임워크 tmi: 옛날 옛적 EJB(Enterprise Java Beans)라는 기술이 있었지만 너무 어렵고 복잡하고 느렸다. 그래서 더 단순하고 사용하기 좋게만들어서 Spring을 만들게 됬는데… 더 궁금하면 검색해보자 객체 지향 프로그래밍? 자꾸 객체 지향 프로그래밍이라는데 그래서 그게 뭐야?? 객체 지향 프로그래밍은 컴퓨터 프로그램을 명령어의 목록으로 보는 시각에서 벗어나 여러개의 독립된 단위, 즉 개체들의 모임으로 파악하는 것이다. 객체 지향 프로그래밍은 프로그램을 유연하고 변경에 용이하게 만들기 때문에 대규모 소프트웨어 개발에 많이 사용된다. 다형성(Polymorphism) 객체 지향 프로그래밍 특징 중 다형성을 알아보자 다형성이란? 다형성이란 하나의 객체가 여러 가지 타입을 가질 수 있는 것을 의미한다 자동차로 비유를 들어보자 우선 역활과 구현으로 세상을 구분할 필요가 있다. 자동차라는 역활(인터페이스)이 있고 그걸 구현한 K3, 아반떼, 테슬라 모델3(구현체)들이 있다. 생각해보자 만약에 운전자가 자동차가 새로 나올때마다 그 자동차의 운전방식을 알아야 된다면 얼마나 불편한가.. 하지만 위와 같이 설계를 함으로 써 K3, 아반떼, 테슬라 모델3 각각의 운전 방식을 알 필요가 없고 자동차라는 역활의 운전 방식만 알면 된다! 역활과 구현을 분리 역활과 구현으로 구분하면 세상이 단순해지고, 유연해지며 변경도 편리해진다. 장점 클라이언트는 대상의 역활(인터페이스)만 알면 된다. 클라이언트는 구현 대상의 내부 구조를 몰라도 된다. 클라이언트는 구현 대상의 내부 구조가 변경되어도 영향을 받지 않는다. 클라이언트는 구현 대상 자체를 변경해도 영향을 받지 않는다. 자 이걸 자바 언어에서는 어떻게 사용할 수 있을까? 자바 언어의 다형성을 활용 역활 = 인터페이스 구현 = 인터페이스를 구현한 클래스, 구현 객체 MemberRepository interface의 메서드를 각 MemoryMemberRepository, JdbcMemberRepository에 오버라이딩 다형성으로 인터페이스를 구현한 객체를 실행 시점에 유연하게 변경 (MemoryMemberRepository or JdbcMemberRepository) 다형성의 본질 인터페이스를 구현한 객체 인스턴스를 실행 시점에 유연하게 변경할 수 있다. 즉, 클라이언트를 변경하지 않고, 서버의 구현 기능을 유연하게 변경할 수 있다. 확장 가능한 설계 -&gt; 인터페이스를 안정적으로 잘 설계하는 것이 중요 스프링과 객체 지향 스프링은 다형성을 극대화해서 이용할 수 있게 도와준다. 스프링에서 이야기하는 제어의 역전(IoC), 의존관계 주입(DI)은 다형성을 활용해서 역활과 구현을 편리하게 다룰 수 있도록 도와준다. 제어의 역전과 의존관계 주입을 몰라도 걱정하지 말자. 뒷 post들에서 설명할테니 스프링과 객체 지향 설계에 대해 제대로 이해하려면 다형성 외에 한가지 더 알아야 된다. 바로 SOLID… 면접에도 자주 나온다고 하니 잘 공부해두자 좋은 객체 지향 설계의 5가지 원칙(SOLID) 클린코드로 유명한 로버트 마틴이 좋은 객체 지향 설계의 5가지 원칙을 정리 SRP: 단일 책임 원칙(Single Responsibility Principle) OCP: 개방-폐쇄 원칙(Open/Closed Principle) LSP: 리스코프 치환 원칙(Liskov Substitution Principle) ISP: 인터페이스 분리 원칙(Interface segregation Principle) DIP: 의존관계 역전 원칙(Dependency Inversion Principle) SRP 단일 책임 원칙(Single Responsibility Principle) 하나의 클래스는 하나의 책임만 가져야 한다. 그런데 하나의 책임이라는 것은 너무 모호하다. 클 수도 있고, 작을 수 도 있다. 문맥과 상황에 따라 다르다. 중요한 기준은 변경이다. 변경이 있을때 파급 효과가 적으면 단일 책임 원칙을 잘 따르는 것 예) UI 변경, 객체의 생성과 사용을 분리 OCP 개방 폐쇄 원칙(Open/Closed Principle) 소프트웨어 요소는 확장에는 열려 있으나 변경에는 닫혀 있어야 한다. 그런데 언뜻 생각하면 확장을 하려면 당연히 기존코드를 변경해야 확장을 하지 아니면 어떻게 변경해?? 라고 이런 모순적인 말이 어딨나 생각이 든다. 다형성을 잘 활용하면 이 개방 폐쇄 원칙을 지킬 수 있다. 지금까지 배운 역활과 구현의 분리를 써서 인터페이스를 구현한 새로운 클래스를 하나 만들어서 새로운 기능을 구현 예를들어 MemberRepository를 구현한 MemoryMemberRepository만 있다고 할때 거기에 JdbcMemberRepository를 새로 구현하더라도 전혀 기존의 코드를 변경하지 않고 확장을 할 수 있다. 그런데 문제점이 있다 // 기존코드 public class MemberService { private MemberRepository memberRepository = new MemoryMemberRepository(); } // 변경코드 public class MemberService { // private MemberRepository memberRepository = new MemoryMemberRepository(); private MemberRepository memberRepository = new JdbcMemberRepository(); } MemberService에서 구현 클래스를 직접 선택할 때 MemberRepository m = new MemoryMemberRepository(); //기존 코드 MemberRepository m = new JdbcMemberRepository(); //변경 코드 구현 객체를 변경하려면 기존의 코드를 변경해야 한다. 분명 다형성을 사용했지만 OCP 원칙을 지킬 수 없다. 어떻게 해결? 객체를 생성하고, 별도의 연관관계를 맺어주는 설정자가 필요 그게 바로 Spring! (어떻게 적용하는지는 뒤로가면서 천천히 알아보자) LSP 리스코프 치환 원칙(Liskov Substitution Principle) 프로그램의 객체는 프로그램의 정확성을 깨뜨리지 않으면서 하위의 인스턴스로 변경이 가능해야 한다. 다형성에서 하위 클래스는 인터페이스 규약을 다 지켜야 한다는 것, 다형성을 지원하기 위한 원칙, 인터페이스를 구현한 구현체는 믿고 사용하려면, 이 원칙이 필요 예) 자동차 인터페이스의 엑셀은 앞으로 가라는 기능, 뒤로 가게 구현하면 LSP 위반, 느리더라도 앞으로 가야한다. ISP 인터페이스 분리 원칙(Interface Segregation Principle) 특정 클라이언트를 위한 인터페이스 여러개가 범용의 인터페이스 하나보다 낫다 자동차 인터페이스 -&gt; 운전 인터페이스, 정비 인터페이스 사용자 클라이언트 -&gt; 운전자 클라이언트, 정비사 클라이언트 분리하면 정비 인터페이스 자체가 변해도 운전자 클라이언트에 영향을 주지 않음 인터페이스가 더 명확해지고 대체 가능성이 높아진다. DIP 의존관계 역전 원칙(Dependency Inversion Principle) 프로그래머는 추상화에 의존해야지 구현체에 의존하면 안된다. 쉽게 말해서 구현 클래스에 의존하지 말고 인터페이스에 의존하라는 뜻 클라이언트가 인터페이스에 의존해야 유연하게 구현체를 변경할 수 있다. 구현체에 의존하게 되면 변경이 매우 어려워짐. 그런데 OCP에서 설명한 MemberService는 인터페이스에 의존하지만, 구현 클래스도 동시에 의존한다. (의존한다는 것은 내가 저 코드를 안다는 것) DIP 위반 -&gt; 객체 지향의 핵심은 다형성이라는데 다형성 만으로는 OCP, DIP를 지킬 수 없다. 뭔가 더 필요하다… 객체 지향 설계와 스프링 스프링 공부하러 왔는데 스프링 얘기는 언제해..? 지금까지는 스프링을 위한 빌드업이라 보면 된다. 스프링은 다음 기술로 다형성 + OCP/DIP를 가능하게 지원 DI(Dipendency Injection): 의존관계, 의존성 주입 DI 컨테이너 제공 클라이언트의 코드 변경 없이 기능 확장 빌드업은 끝났으니 다음 글부터 본격적으로 설명하겠다. 정리 모든 설계에 역활과 구현을 분리하자. 이상적으로는 모든 설계에 인터페이스를 부여하자 하지만 실무에서는 굉장히 고민이 되는게 인터페이스를 도입하면 추상화라는 비용이 발생한다. 기능을 확장할 가능성이 없다면, 구체 클래스를 직접 사용하고, 향후 꼭 필요할 때 리팩터링해서 인터페이스를 도입하는 것도 방법이다. 참고: Spring Core *틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.",
    "tags": "Java Spring study spring",
    "url": "/study/spring/2022-01-26-Spring(1)/"
  },{
    "title": "spring 게시판 테스트",
    "text": "spring 게시판 테스트",
    "tags": "study spring",
    "url": "/study/spring/2022-01-25-spring-test/"
  },{
    "title": "study 게시판 테스트",
    "text": "study 게시판 테스트",
    "tags": "study",
    "url": "/study/2022-01-25-study-test/"
  },{
    "title": "project 게시판 테스트",
    "text": "project 게시판 테스트",
    "tags": "project",
    "url": "/project/2022-01-25-project-test/"
  },{
    "title": "etc 게시판 테스트",
    "text": "etc 게시판 테스트",
    "tags": "etc",
    "url": "/etc/2022-01-14-etc-test/"
  }]};
