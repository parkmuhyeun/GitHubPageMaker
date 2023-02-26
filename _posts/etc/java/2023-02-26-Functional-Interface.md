---
layout: post
title: 함수형 인터페이스(Functional Interface)에 대해 알아보자
subtitle: 부제목 예시
tags: java Functional-Interface lambda
description: >
  함수형 인터페이스가 뭘까?
sitemap: true
hide_last_modified: true
categories:
  - etc
  - java
---

> Functional Interface...? 인터페이스란 용어도 낯선데 함수형까지 붙으니 더 낯설게 느껴진다.. 이놈에 대해 자세히 알아보자~

## 함수형 인터페이스(Functional Interface)란?

함수형 인터페이스는 다음과 같이 1개의 추상 메소드를 갖는 인터페이스를 말한다.

```java
@FunctionalInterface
interface MoominInterface<T> {
  T printCustom();
}
```

하지만 다음과 같이 default method나 static method는 여러 개 가질 수 있기 때문에 실제로 사용하면 다음과 같이 사용해 볼 수도 있다.

```java
@FunctionalInterface
interface MoominInterface<T> {
  T printCustom();

  default void printDefault() {
    System.out.println("Default");
  }

  static void printStatic() {
    System.out.println("Static");
  }
}


MoominInterface<String> moominInterface = () -> "Custom";

String custom = moominInterface.printCustom();
System.out.println(custom);

moominInterface.printDefault();
MoominInterface.printStatic();

// 실행 결과
// Custom
// Default
// Static
```

이제 우리는 람다식으로 순수 함수를 선언할 수 있게 되었는데 Java에서는 이 순수 함수와 일반 함수를 구분하여 사용하기 위해 함수형 인터페이스가 등장하게 되었다. 함수형 인터페이스를 사용하는 이유는 람다식이 함수형 인터페이스를 반환하기 때문!

>순수 함수란 다음과 같은 부수 효과(Side Effect)를 제거해 함수의 실행이 외부에 영향을 끼치지 않는 함수를 뜻한다.
> - 변수의 값이 변경됨
> - 객체의 필드 값을 설정함
> - 예외나 오류가 발생하며 실행이 중단됨

첫 번째와 같이 람다가 있기 전에는 익명 클래스를 구현해 메서드를 사용하였다. 하지만 함수형 인터페이스의 등장으로 두 번째처럼 람다식을 이용해 구현할 수 있게 되어 코드가 매우 간결해졌다.

```java
@FunctionalInterface
public interface MoominFunction {
  int min(int first, int second);
}

// 익명 클래스를 구현하여 메서드 사용
MoominFunction moominFunction = new MoominFunction() {
  @Override
  public int min(int first, int second) {
      return Math.min(first, second);
  }
};

System.out.println(moominFunction.min(1, 2));

// 람다 사용
MoominFunction lambdaFunction = (int first, int second) -> Math.min(first, second);

System.out.println(lambdaFunction.min(1, 2));
```

그리고 interface 위마다 @FunctionalInterface 애노테이션이 달려있는 걸 볼 수 있는데 이 친구는 해당 인터페이스가 함수형 인터페이스 조건(추상 메서드 1개)에 맞는지 검사를 해주는 역할을 하고있다. 여러 개의 추상 메서드를 선언하면 다음과 같은 컴파일 에러가 발생한다.

![](/assets//img/blog/etc/java/fi_1.png)

## Java에서 제공하는 함수형 인터페이스

함수형 인터페이스 안에 선언된 메소드에 종속되는 람다식 밖에 구현할 수 없기 때문에 매개변수의 타입과 개수, 반환 값의 유무 등을 가진 메소드를 하나의 함수형 인터페이스로 구현할 수 없고, 상황에 따라 함수형 인터페이스를 만들어 줘야 된다. 하지만 자바에서는 기본적으로 많이 사용되는 함수형 인터페이스를 제공해 주기 때문에 직접 함수형 인터페이스를 만드는 경우는 거의 없다.
- Predicate< T >
- Supplier< T >
- Consumer< T >
- Function<T, R>
- Runnable
- Comparator< T >

더 많은 함수형 인터페이스를 보고 싶다면 다음 [링크]를 참고

[링크]:https://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html

### 1. Predicate< T >
```java
@FunctionalInterface
public interface Predicate<T> {

    boolean test(T t);

    default Predicate<T> and(Predicate<? super T> other) {
        Objects.requireNonNull(other);
        return (t) -> test(t) && other.test(t);
    }

    default Predicate<T> negate() {
        return (t) -> !test(t);
    }

    default Predicate<T> or(Predicate<? super T> other) {
        Objects.requireNonNull(other);
        return (t) -> test(t) || other.test(t);
    }

    static <T> Predicate<T> isEqual(Object targetRef) {
        return (null == targetRef)
                ? Objects::isNull
                : object -> targetRef.equals(object);
    }

    @SuppressWarnings("unchecked")
    static <T> Predicate<T> not(Predicate<? super T> target) {
        Objects.requireNonNull(target);
        return (Predicate<T>)target.negate();
    }
}
```

Predicate는 인자 하나를 넘겨받어 처리한 후 boolean 타입을 리턴한다. test() 메소드를 사용해서 비교 결과를 리턴 받을 수 있고 and(), or(), negate()를 사용하여 복수의 조건을 추가할 수 있다.

```java
//예시
Predicate<String> predicateContains = (s) -> s.contains("min");
Predicate<String> predicateStartsWith = (s) -> s.startsWith("oom");

String moomin = "moomin";
boolean containsResult = predicateContains.test(moomin);
boolean startsWithResult = predicateStartsWith.test(moomin);
System.out.println(containsResult); //true
System.out.println(startsWithResult);   //false

boolean orResult = predicateContains.or(predicateStartsWith).test(moomin);
System.out.println(orResult);   //true
```

### 2. Supplier< T >

```java
@FunctionalInterface
public interface Supplier<T> {
    T get();
}
```

Supplier는 아무런 인자를 넘겨받지 않고 T 타입의 객체를 리턴한다. get() 메소드를 사용해 값을 얻을 수 있다.

```java
//예시
int value = 5;

Supplier<Integer> supplier = () -> value * 10;
System.out.println(supplier.get()); //50
```

### 3. Consumer< T >

```java
@FunctionalInterface
public interface Consumer<T> {

    void accept(T t);

    default Consumer<T> andThen(Consumer<? super T> after) {
        Objects.requireNonNull(after);
        return (T t) -> { accept(t); after.accept(t); };
    }
}
```

Consumer는 인자 하나를 넘겨받고 아무것도 리턴하지 않는다. 인자를 받아 accept()를 사용할 수 있고, 여러 개의 Consumer를 연결하여 수행할 수 있는 andThen() 메소드도 있다.

``` java
//예시
Consumer<Integer> plus = (value) -> System.out.println(value + 5);
Consumer<Integer> minus = (value) -> System.out.println(value - 5);

plus.accept(10);    //15
plus.andThen(minus).accept(10); //15 \n 5
```

### 4. Function<T, R>

```java
@FunctionalInterface
public interface Function<T, R> {

    R apply(T t);

    default <V> Function<V, R> compose(Function<? super V, ? extends T> before) {
        Objects.requireNonNull(before);
        return (V v) -> apply(before.apply(v));
    }

    default <V> Function<T, V> andThen(Function<? super R, ? extends V> after) {
        Objects.requireNonNull(after);
        return (T t) -> after.apply(apply(t));
    }

    static <T> Function<T, T> identity() {
        return t -> t;
    }
}
```

Function은 T 타입 인자를 넘겨받어 R 타입을 리턴한다. 파라미터를 받아 로직을 수행한 후 리턴할 때 사용할 수 있다. Consumer와 똑같이 andThen() 메소드를 제공하며 andThen()과 반대 방향으로 순서가 진행되는 compose()도 추가로 제공하고 있다. identity는 파라미터를 그대로 반환하는 static 메서드이다.

```java
//예시
Function<String, Integer> toIntFunction = (string) -> Integer.valueOf(string);
Function<Integer, String> toStringFunction = (value) -> String.valueOf(value);

Integer apply = toIntFunction.apply("5");
System.out.println(apply);   //5 (int)

String andThen = toIntFunction.andThen(toStringFunction).apply("5");
System.out.println(andThen);    //5 (string)   진행 순서: toIntFunction -> toStringFunction

Integer compose = toIntFunction.compose(toStringFunction).apply(5);
System.out.println(compose);    //5 (int)   진행 순서: toStringFunction -> toIntFunction

Function<Integer, Integer> identityFunction = Function.identity();
Integer identity = identityFunction.apply(5);
System.out.println(identity);  //5 (int)
```

### 5. Runnable

```java
@FunctionalInterface
public interface Runnable {

    public abstract void run();
}
```

Runnable은 아무런 인자도 받지 않고 리턴도 하지 않는다. Runnable 이름에 맞게 실행만 할 수 있다.

```java
//예시
Runnable runnable = () -> {
  for (int i = 0; i < 100; i++) {
    System.out.println(i);
  }
};

Thread thread = new Thread(runnable);
thread.start();
```

### 6. Comparator< T >

```java
@FunctionalInterface
public interface Comparator<T> {
    int compare(T o1, T o2);

    ...
}
```

Comparator는 T 타입 인자를 두 개 넘겨받아 int 타입을 리턴한다.

```java
//예시
Comparator<Integer> comparator = (a, b) -> Math.max(a, b);

int max = comparator.compare(1, 2);
System.out.println(max);    //2
```

---

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.