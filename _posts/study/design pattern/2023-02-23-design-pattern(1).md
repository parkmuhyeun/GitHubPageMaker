---
layout: post
title: 디자인 패턴 - 전략 패턴, 템플릿 메서드 패턴, 상태 패턴
subtitle: 부제목 예시
tags: design-pattern strategy template-method state
description: >
  전략 패턴, 템플릿 메서드 패턴, 상태 패턴에 대해 알아보자
sitemap: true
hide_last_modified: true
categories:
  - study
  - design pattern
---

## 디자인 패턴에 대해 관심을 가진 이유

![](/assets//img/blog/study/design%20pattern/dp(1)_1.jpg)

프리코스부터 시작해서 현재 우테코 미션을 진행하다 보니 어느 순간 계속해서 같은 형태의 코드만 양산하고 있는 듯한 느낌이 들었다. 기능을 정의하고 mvc 패턴에 따라 클린 코드, 객체지향 법칙을 적용하며 코드를 작성한다.. 라 매번 이렇게 같은 방식에 약간 재미도 없어지고 뭔가 어떻게 하면 더 성장할 수 있을까 고민에 빠지게 되었다.

매일 같은 메뉴만 먹는다고 생각해보자.. 삶이 재미가 있을까? 물론 저걸 완벽하게 다 할 수 있다는 건 아니다ㅋㅋㅋ 하지만 가끔은 다른 반찬도 먹고 싶은 법.. 그래서 어떤 게 좋을까 생각하다 책을 보며 이론을 채우기로 했다. 그중 디자인 패턴에 대해 공부해 보기로 했고 가능하면 적용해 보려고 한다. 

자동차 경주 미션 때 전략 패턴을 적용해 봤는데 굉장히 인상 깊었던 기억이 있어서 그런가.. 디자인 패턴에 관심이 갔다! 근데 담당 코치님인 구구가 디자인 패턴을 싫어한다고 들었던 거 같은데.. 왜 그런지 조만간 물어봐야겠다.

## 디자인 패턴이란?

디자인 패턴에 대해 처음으로 시작하는 글이니 만큼 간단하게 디자인 패턴의 정의에 대해 알아보고 패턴으로 넘어가자. 객체지향 설계를 하다 보면, 이전과 비슷한 상황에서 사용했던 설계를 재사용하는 경우가 종종 발생한다. 이런 설계는 특정 상황에 맞는 해결책을 빠르게 찾을 수 있도록 도와주는데, 이렇게 반복적으로 사용되는 설계는 일정 패턴을 가지며 이를 디자인 패턴이라 한다. 이런 패턴을 잘 습득하면 상황에 맞는 올바른 설계를 더 빠르게 적용할 수도 있고, 각 패턴의 장단점을 통해 설계를 선택하는 데 도움을 얻을 수도 있다.

## 전략(Strategy) 패턴

전략 패턴은 객체가 할 수 있는 행위 각각에 대해 전략 클래스를 생성하고 이를 정의하는 공통의 인터페이스를 정의해 행위를 동적으로 바꾸고 싶은 경우 직접 행위를 수정하지 않고 전략을 바꿔끼어주어 행위를 유연하게 확장할 수 있는 방법이다. 우리는 말보다 코드가 더 친숙하니 코드로 한번 봐보자!

다음과 같은 할인 정책을 적용하고 있는 매장이 있다고 해보자
```java
public class Calculator {

  public int calculate(boolean firstGuest, List<Item> item) {
    int sum = 0;
    for (Item item : items) {
      if (firstGuest){
        sum +=  (int) (item.getPrice() * 0.9); // 첫 손님 10% 할인
      }else if (!item.isFresh()){
        sum += (int) (item.getPrice() * 0.8); //덜 신선한 경우 20% 할인
      }else{
        sum += item.getPrice();
      }
    }
  }
}
```

위와 같은 코드의 경우 다음과 같은 문제점이 있다.
- 모든 할인 정책들이 하나의 코드에 있어, 정책이 추가될 때마다 코드 분석이 힘들어진다.
- 가격 정책이 추가될 때마다 if 블록이 추가되기 때문에 유지 보수가 더 힘들어진다.

그럼 어떻게 하면 좋을까?? 이때 전략 패턴을 적용해 볼 수 있다. 각각의 가격 할인 정책을 전략으로 두고 별도 객체로 분리하는 것이다. 아래와 같이 분리하면 Calculator라는 콘텍스트에서는 전략을 직접 선택하지 않고 클라이언트에서 DI(의존 주입)를 이용해 전략을 전달해 줄 수 있다.

![](/assets//img/blog/study/design%20pattern/dp(1)_2.png)

그러면 다음과 같이 코드를 작성할 수 있을 것이다.
```java
public class Calculator {
  
  private DiscountStrategy discountStrategy;

  public Calculatr(DiscountStrategy discountStrategy) {
    this.discountStrategy = discountStrategy;
  }

  public int calculate(List<Item> item) {
    int sum = 0;
    for (Item item : items) {
      sum += discountStrategy.getDiscountPrice(item);
    }
    return sum;
  }
}
```

이렇게 되면 이제 새로운 할인 정책이 추가되더라도 Calculator 클래스의 코드는 변경되지 않고 단지 새로운 전략 클래스만 추가 되어 바꿔 끼어질 수 있다. 즉, 개방 폐쇄 원칙인 OCP를 만족하게 된 것이다!

> 객체지향 프로그래밍 5가지 원칙인 SOLID에 대해 자세히 알아보고 싶으면 다음 링크를 참고해보자
> - [예를 들어가며 SOLID에 대해 알아보자(1)](https://parkmuhyeun.github.io/etc/java/2022-12-25-OOP-Ex(1)/)
> - [예를 들어가며 SOLID에 대해 알아보자(2)](https://parkmuhyeun.github.io/etc/java/2022-12-29-OOP-Ex(2)/)

## 템플릿 메서드(Template Method) 패턴

프로그램을 구현하다 보면 완전히 동일한 절차를 가진 코드를 작성하게 될 때가 있다. 예를 들어 다음과 같이 사용자 정보를 가져오는 부분의 구현만 다를 뿐 인증을 처리하는 과정은 완전히 동일할 수 있다.

```java
public class DbAuthenticator {
  public Auth authenticate(String id, String pw) {
    //사용자 정보로 인증 확인
    User user = userDao.seletById(id);
    boolean auth = user.equalPassword(pw);
    //인증 실패시 익셉션 발생
    if (!auth){
      throw createException()
    }
    //인증 성공시, 인증 정보 제공
    return new Auth(id, user.getName());
  }
}

private AuthException createException() {
  return new AuthException();
}

public class LdapAuthenticator {
  public Auth authenticate(String id, String pw) {
    //사용자 정보로 인증 확인
    boolean lauth = IdapClient.authenticate(id, pw);
    //인증 실패시 익셉션 발생
    if (!auth){
      throw createException()
    }
    //인증 성공시, 인증 정보 제공
    LdapContext ctx = IdapClient.find(id);
    return new Auth(id, ctx.getAttribute("name"));
  }
}

private AuthException createException() {
  return new AuthException();
}
```

DB나 LDAP가 아닌 다른 인증 서버를 두더라도 위의 과정을 유사하게 거칠 것이다. 이렇게 실행 과정/단계는 동일한테 각 단계 중 일부의 구현이 다른 경우 사용할 수 있는 패턴이 템플릿 메서드 패턴이다. 템플릿 메서드 패턴은 다음과 같이 두 가지로 구성될 수 있다.
- 실행 과정을 구현한 상위 클래스
- 실행 과정의 일부 단계를 구현한 하위 클래스

상위 클래스는 실행 과정을 구현한 메서드를 제공하고 이 메서드는 구현하는데 필요한 각 단계를 정의하며 이 중 일부 단계는 추상 메서드를 호출하는 방식으로 구현된다. 예를 들어 다음과 같이 작성될 수 있다.

```java
public abstract Authenticator {
  //템플릿 메서드
  public Auth authenticate(String id, String pw) {
    if (!doAuthenticate(id, pw)) {
      throw createException();
    }

    return createAuth(id);
  }

  protected abstract boolean doAuthenticate(String id, String pw);

  private RuntimeException createException() {
    throw new AuthException();
  }

  protected abstract Auth createAuth(String id);
}
```

두 클래스에서 차이가 나는 부분인 인증 여부 확인(doAuthenticate), 객체 생성 단계(createAuth)는 추상 메서드로 분리하였다. authenticate() 메서드는 모든 하위 타입에 동일하게 적용되는 실행 과정을 제공하기 때문에, 이 메서드를 템플릿 메서드라 한다.

위처럼 Authenticator 클래스를 생성한 후 이제 하위 클래스에서 상속받아 추상 메서드 부분만 알맞게 재정의 해주면 된다.

```java
public class LdapAuthenticator extends Authenticator {

  @Override
  protected boolean doAuthenticate(String id, String pw) {
    return IdapClient.authenticate(id, pw);
  }
  
  @Override
  protected Auth createAuth(String id) {
    LdapContext ctx = IdapClient.find(id);
    return new Auth(id, ctx.getAttribute("name"));
  }
}
```

이제 새로운 인증 서버가 추가되더라도 다른 부분만 추가적으로 구현해 주면 되니 중복 코드를 제거할 수 있다. 이렇게 템플릿 메서드 패턴을 사용함으로 써 코드 중복 문제를 제거하면서 동시에 코드를 재사용할 수 있게 되었다!

## 상태(State) 패턴

상태에 따라 다르게 동작하는 자판기를 구현한다고 생각해 보자

```java
public class VendingMachine {
  public static enum State { NOCOIN, SELECTABLE }

  private State state = State.NOCOIN;

  public void insertCoin(int coin) {
    switch(state) { 
      case NOCOIN:
        increaseCoin(coin);
        state = State.SELECTABLE;
        break;
      case SELECTABLE:
        increaseCoin(coin);
    }
  }

  public void select(int productId) {
    switch(state) {
      case NOCOIN:
        //아무 행동 X
        break;
      case SELECTABLE:
        provideProduct(productId);
        decreaseCoin();
        if (hasNocoin()){
          state = State.NOCOIN;
        }
    }
  }
  
  ...
}
```

위와 같은 경우 새로운 상태가 추가될 때 마다 insertCoin() 메서드와 select() 메서드에 조건문이 추가된다. 그렇게 되면 후에 유지 보수가 매우 어렵게 될 것이다.(매번 조건문을 어렵게 찾고 수정해야 함)

그러면 어떻게 해야 될까..? 위의 코드를 보면 각 상태에 따라 다르게 기능들이 동작하는 걸 볼 수 있다. 이렇게 기능이 상태에 따라 다르게 동작해야 할 때 사용할 수 있는 패턴이 상태 패턴이다. 상태 패턴에서는 아래와 같이 상태를 별도로 분리하고 각 상태별로 맞는 하위 타입을 구현한다.

![](/assets//img/blog/study/design%20pattern/dp(1)_3.png)

>근데 이렇게 보다 보니깐 전략 패턴과 상태 패턴이 서로 헷갈렸다. 둘이 공통의 인터페이스로 분리한 후 각각의 상황에 맞게 기능을 구현하는 거까지 비슷하다 보니.. 전략 패턴은 한 번 인스턴스를 생성하고 나면, 상태가 거의 바뀌지 않는 경우에 사용하고 상태 패턴은 한 번 인스턴스를 생성하고 난 뒤, 상태를 바꾸는 경우가 잦은 경우에 사용할 수 있다!

분리하고 나면 이제 VendingMachine 코드는 아래와 같이 되고

```java
public class VendingMachine {
  private State state;

  public VendingMachine() {
    state = new NoCoinState();
  }

  public void insertCoin(int coin) {
    state.increaseCoin(coin, this); // 상태 객체에 위임
  }

  public void select(int productId) {
    state.select(productId, this); // 상태 객체에 위임
  }

  public void changeState(State newState) {
    this.state = newState;
  }

  ...
}
```

각각의 상태를 구현한 클래스들은 아래와 같이 된다.

```java
public class NoCoinState implements State {

  @Override
  public void increaseCoin(int coin, VendingMachine vm) {
    vm.increaseCoin(coin);
    vm.changeState(new SelectableState());
  }

  @Override
  public void select(int productId, VendingMachine vm) {
    SoundUtil.beep();
  }
}

public class SelectableState implements State {

  @Override
  public void increaseCoin(int coin, VendingMachine vm) {
    vm.increaseCoin(coin);
  }

  @Override
  public void select(int productId, VendingMachine vm) {
    vm.provideProduct(productId);
    vm.decreaseCoin();

    if (vm.hasNoCoin()) {
      vm.changeState(new NoCoinState());
    }
  }
}
```

이렇게 상태 패턴을 적용하게 되면 새로운 상태가 추가되더라도 콘텍스트 코드(Vending Machine)가 받는 영향은 최소화되어 유지 보수에 유리하다. 새로운 상태가 추가되더라도 insertCoin() 메서드와 select() 메서드 코드는 그대로 유지되고 구현 코드가 각 상태 별로 구분되기 때문에 상태 별 동작을 수정하기 쉽다.

### 상태 변경은 누가하는게 좋을까?
그런데 여기서 한 가지 더 고민해 볼 게 있다. 상태 변경을 누가 하느냐에 관한 것이다. 콘텍스트(VendingMachine)가 될 수도 있고 위에서 한 것처럼 상태 객체가 할 수도 있다. 콘텍스트에서 상태를 변경할 경우 코드는 아래처럼 된다. 콘텍스트에서 변경할 경우 콘텍스트 코드가 약간 복잡해질 수 있다.

```java
public class VendingMachine {
  private State state;

  public VendingMachine() {
    state = new NoCoinState();
  }

  public void insertCoin(int coin) {
    state.increaseCoin(coin, this);
    if (hasCoin()) {
      changeState(new SelectableState()); //콘텍스트에서 상태 변경
    }
  }

  public void select(int productId) {
    state.select(productId, this);
    if (state.isSelectable() && hasNoCoin()) {
      changeState(new NoCoinState()); //콘텍스트에서 상태 변경
    }
  }

  public void changeState(State newState) {
    this.state = newState;
  }

  private boolean hasCoin() {
    ...
  }

  private boolean hasNoCoin() {
    return !hasCoin();
  }

  ...
}

public class SelectableState implements State {

  // 콘텍스트가 상태를 변경하므로, 상태 객체는 자신이 할 작업만 처리
  @Override
  public void select(int productId, VendingMachine vm) {
    vm.provideProduct(productId);
    vm.decreaseCoin();
  }
}
```

그럼 어떤 방식이 더 좋을까..? 상태 변경을 누가 할지는 주어진 상황에 맞게 선택해야 된다. 위와 같이 콘텍스트에서 상태를 변경하는 방식은 상태 개수가 적고 상태 변경 규칙이 거의 바뀌지 않는 경우에 유리하다. 왜냐하면 상태 종류가 지속적으로 변경되거나 상태 변경 규칙이 자주 바뀌면 그만큼 콘텍스트 상태 변경 처리 코드가 복잡해질 가능성이 높기 때문에 유연성이 떨어질 수 있다.

반면에 상태 객체에서 상태를 변경하는 경우, 콘텍스트에 영향을 주지 않으면서 상태를 추가하거나 상태 변경 규칙을 바꿀 수 있게 된다. 하지만, 상태 변경 규칙이 여러 클래스에 분산되어 있기 때문에, 클래스가 많아질수록 상태 변경 규칙을 파악하기 어려울 수 있다. 또한, 한 상태 클래스에서 다른 상태 클래스에 대한 의존도 발생하게 된다.
 
---

참고:
[개발자가 반드시 정복해야 할 객체지향과 디자인 패턴](https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=%EA%B0%9C%EB%B0%9C%EC%9E%90%EA%B0%80+%EB%B0%98%EB%93%9C%EC%8B%9C+%EC%A0%95%EB%B3%B5%ED%95%B4%EC%95%BC+%ED%95%A0+%EA%B0%9D%EC%B2%B4%EC%A7%80%ED%96%A5%EA%B3%BC+%EB%94%94%EC%9E%90%EC%9D%B8+%ED%8C%A8%ED%84%B4)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.