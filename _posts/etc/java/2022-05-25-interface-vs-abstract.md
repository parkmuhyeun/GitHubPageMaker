---
layout: post
title: 인터페이스 vs 추상 클래스
subtitle: 부제목 예시
tags: interface abstract-class abstract-method
description: >
 인터페이스와 추상 클래스의 차이
sitemap: true
hide_last_modified: true
categories:
  - etc
  - java
---

## 추상 메서드(Abstract Method)와 추상 클래스(Abstract Class)

- 추상 메서드(Abstract Method)
  - 코드가 구현되지 않은 메서드

```java
public abstract String getName(); // 추상 메서드
public abstract String getName() { return "name" } //추상 메서드 X, 오류 발생
```

- 추상 클래스(Abstract Class)
  - 개념: abstract 키워드로 선언된 클래스
    - 최소 한개의 추상 메서드를 포함하는 경우 반드시 추상 클래스로 선언
    - 추상 메서드가 하나도 없는 경우라도 추상 클래스로 선언 가능
  - 추상 클래스의 구현
    - 서브 클래스에서 슈퍼 클래스의 모든 추상 메서드를 오버라이딩하여 실행가능한 코드로 구현
  - 추상 클래스의 목적
    - 객체(인스턴스)를 생성하기 위함이 아니라 상속을 위한 부모 클래스로 활용하기 위한 것
    - 여러 클래스들의 공통된 부분을 추상화하여 상속받는 클래스에게 구현을 강제화하기 위한 것(메서드의 동작을 구현하는 자식의 책임을 위임)
    - 즉, 추상 클래스의 추상 메서드를 자식 클래스가 구체화하여 그 기능을 확장하는데 목적
    
```java
// 최소 한개의 추상 메서드 포함
abstract class Appliance {
  a() {...}
  void b() {...}
  abstract public void c(); //추상 메서드
}

// 추상 메서드 하나도 없는 경우
abstract class Appliace {
  a() {...}
  void b() {...}
}

// 추상 클래스 구현
class TV extend Appliance {
  public void c() { System.out.println("TV")}  // 추상 메서드 (오버라이딩)
  void d() { System.out.println("티비")}
}
```

## 인터페이스(Interface)
- 개념: 추상 메서드와 상수만을 포함하며, interface 키워드를 사용하여 선언
- 인터페이스의 구현
  - 인터페이스를 상속받고, 추상 메서드로 작성한 클래스를 모두 구현
  - implements 키워드를 사용하여 구현
- 인터페이스의 목적
  - 상속받을 서브 클래스에게 구현할 모든 메서드들의 원형을 모두 알려주어, 클래스가 자신의 목적에 맞게 메서드를 구현하도록 한다.
  - 구현 객체의 같은 동작을 보장하기 위한 목적이 있다.
  - 서로 관련이 없는 클래스에서 공통적으로 사용하는 방식이 필요하지만 기능을 각각 구현할 필요가 있는 경우에 사용
- 인터페이스의 특징
  - 인터페이스는 상수 필드와 추상 메서드만으로 구성된다.
  - 모든 메서드는 추상 메서드로서, abstract public 속성이며 생략 가능
  - 상수는 public static final 속성이며, 생략하여 선언 가능
  - 인터페이스를 상속받아 새로운 인터페이스를 만들 수 있다.
  
```java
// 인터페이스
interface A {
  int a = 5; // 상수 필드(public static final int a = 5;과 동일)
  void b(); // 추상 메서드 (abstract public void b();과 동일)
  absract public void c(); // 추상 메서드
}

// 인터페이스 구현
class Aimpl implements A {
  public void b() {...}
  public void c() {...}
  public int d() {...} // 추가적으로 다른 메서드도 작성 가능
}
```

## 추상 클래스 VS 인터페이스
- 공통점
  - 인스턴스(객체)는 생성할 수 없다
  - 자식클래스가 메서드의 구체적인 동작을 구현하도록 책임을 위임
- 차이점
  - 서로 다른 목적
    - 추상 클래스는 추상 메서드를 자식 클래스가 구체화하여 그 기능을 확장하는데 목적(상속을 위한 부모 클래스)
      - Appliance(추상 클래스) - TV, Refrigerator
    - 인터페이스는 서로 관련이 없는 클래스에서 공통적으로 사용하는 방식이 필요하지만 기능을 각각 구현할 필요가 있는 경우에 사용(구현 객체의 같은 동작을 보장)
      - Flyable(인터페이스) - Plane, Bird
  - 추상 클래스는 클래스이지만 인터페이스는 클래스가 아니다.
  - 추상 클래스는 단일 상속이지만 인터페이스는 다중 상속이 가능


---
*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.