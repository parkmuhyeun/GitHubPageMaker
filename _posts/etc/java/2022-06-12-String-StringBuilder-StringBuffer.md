---
layout: post
title: String vs StringBuilder vs StringBuffer
subtitle: 부제목 예시
tags: java String StringBuilder StringBuffer
description: >
 String, StringBuilder, StringBuffer의 차이
sitemap: true
hide_last_modified: true
categories:
  - etc
  - java
---

String, StringBuffer, StringBuilder 모두 문자열을 저장하고, 관리하는 클래스인데 이렇게 여러가지를 만들어놓은 이유는 뭘까

## String
- String과 다른 클래스(StringBuffer, StringBuilder)의 차이점은 immutable(불변)과 mutable(변함)에 있다.
- String 객체는 한번 생성되면 할당된 메모리 공간이 변하지 않는다.
- 새로운 값을 할당할 때마다 새로 클래스에 대한 객체가 생성된다.
  - 기존에 생성된 String 객체에 또 따른 문자열을 붙여도(String + String) 기존 문자열에 새로운 문자열을 붙이는 것이 아니라, 새로운 String 객체를 만든 후 저장하기 때문에 Garbage Collector가 호출되기 전까지 생성된 각각의 String 객체들은 Heap에 쌓여 메모리 관리에 치명적이다.
- String 객체는 이러한 이유로 문자열 연산이 많은 경우, 그 성능이 좋지 않다.
- 하지만, Immutable한 객체는 간단하게 사용가능하고, 동기화에 대해 신경쓰지 않아도 되기때문에(Thread-safe), 내부 데이터를 자유롭게 공유 가능하다.

```java
String result = "";
result += "hello";
result += " ";
result += "world";
System.out.println(result);
//출력값: hello world
```

## StringBuffer, StringBuilder
- StringBuffer와 StringBuilder같은 경우 문자열 연산 등으로 기존 객체의 공간이 부족하게 되는 경우, 새로 만드는 것이 아니라 기존의 버퍼 크기를 늘리며 유연하게 동작한다.
- StringBuffer는 각 메서드별로 Synchronized Keyword가 존재하여, 멀티스레드 환경에서도 동기화를 지원
- 반면 StringBuilder는 동기화를 보장하지 않는다.
- 그렇기때문에 멀티스레드 환경이라면 값 동기화 보장을 위해 StringBuffer을 사용, 단일 스레드 환경이면 StringBuilder을 사용하는 것이 좋다.(단일 스레드 환경에서 StringBuffer를 사용해도 되지만 동기화 관련 처리로 인해 StringBuilder가 더 성능이 좋음)

```java
StringBuffer stringBuffer = new StringBuffer(); 
stringBuffer.append("hello");
stringBuffer.append(" ");
stringBuffer.append("world");
String result = stringBuffer.toString();
System.out.println(result);
//출력값: hello world
```

```java
StringBuilder stringBuilder = new StringBuilder();
stringBuilder.append("hello");
stringBuilder.append(" ");
stringBuilder.append("world");
String result = stringBuilder.toString();
System.out.println(result);
//출력값: hello world
```

## 정리
- String은 짧은 문자열은 더할 경우 사용
- StringBuffer는 스레드에 안전한 프로그램이 필요할 때나, 스레드에 안전한지 모를 경우 사용
- StringBuilder는 스레드에 안전한지 여부가 관계 없는 프로그램을 개발할 때 사용

### Java 버전별 String 객체 변경사항
- JDK1.5버전 이전에서는 문자열연산(+, concat)을 할때에는 조합된 문자열을 새로운 메모리에 할당하여 참조함으로 인해 성능상의 이슈가 있었다.
- 그러나 JDK1.5 버전 이후에는 컴파일 단계에서 String 객체를 사용하더라도 StringBuilder로 컴파일 되도록 변경
- 그래서 JDK 1.5이후 버전에서는 String 클래스를 활용해도 StringBuilder와 성능상으로 차이가 없어짐.
- 하지만 반복 루프를 사용해서 문자열을 더할 때에는 객체를 계속 추가한다는 사실에는 변함이 없기때문에 String 클래스를 쓰는 대신, 스레드와 관련이 있으면 StringBuffer, 없으면 StringBuilder를 사용하는 것을 권장

---

참고
- [https://12bme.tistory.com/42](https://12bme.tistory.com/42)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.