---
layout: post
title: 클래스 vs 객체 vs 인스턴스
subtitle: 부제목 예시
tags: class object instance
description: >
 클래스 객체 인스턴스의 차이
sitemap: true
hide_last_modified: true
categories:
  - etc
  - java
---

## 클래스(Class)
- 객체를 만들어 내기 위한 설계도 혹은 틀
- 연관되어 있는 변수와 메서드의 집합

```java
// 클래스
public class Animal {
  ...
}
```

## 객체(Object)
- 소프트웨어 세계에 구현할 대상
- 클래스에 선언된 모양 그대로 생성된 실체
- '클래스의 인스턴스'라고도 부른다.
- 객체는 모든 인스턴스를 대표햐는 포괄적인 의미를 갖는다.

```java
public class Main {
  public static void main(String[] args) {
    Animal cat, dog; // '객체'

  }
}
```

## 인스턴스(Instance)
- 설계도를 바탕으로 소프트웨어 세계에 구현된 구체적인 실체
  - 즉, 객체를 소프트웨어세계에 실체화 하면 그것을 '인스턴스'라고 부름
  - 실체화된 인스턴스는 메모리에 할당된다.
- 인스턴스는 객체에 포함된다고 볼 수 있다.

```java
public class Main {
  public static void main(String[] args) {
    Animal cat, dog; 
    
    // 인스턴스화
    cat = new Animal();
    dog = new Animal();
  }
}
```

### 클래스 VS 객체
- 클래스는 '설계도', 객체는 '설계도로 구현한 모든 대상'을 의미

### 객체 VS 인스턴스
- 클래스의 타입으로 선언되었을 때 객체라고 부르고, 그 객체가 메모리에 할당되어 실제 사용될 때 인스턴스라고 부른다.
- 객체는 현실 세계에 가깝고, 인스턴스는 소프트웨어 세계에 가깝다.

---
*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.