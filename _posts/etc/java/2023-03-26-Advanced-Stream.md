---
layout: post
title: Stream을 좀 더 잘 활용 해보자
subtitle: 부제목 예시
tags: java stream
description: >
  Stream이 뭔지는 알겠는데 어떻게 더 활용해볼 수 있을까?
sitemap: true
hide_last_modified: true
categories:
  - etc
  - java
---

> Stream이 뭔지, 어떻게 사용하는지는 기본적으로 다들 알 것이다. 혹시 Stream에 대해 처음 들어봤다면 [Stream API]을 보고 오자. 하지만 이를 어떻게 더 잘 활용해 볼 수 있을지 한번 알아보자

[Stream API]:https://parkmuhyeun.github.io/etc/java/2022-10-26-Stream/

## peek
주로 디버깅을 지원하기 위해 존재하며, 특정 지점을 거치는 데이터들을 보기 위해 사용할 수 있다. 파라미터로 Consumer 함수형 인터페이스를 받는다.

```java
Stream.of("one", "two", "three", "four")
        .filter(e -> e.length() > 3)
        .peek(e -> System.out.println("Filtered value: " + e))
        .map(String::toUpperCase)
        .peek(e -> System.out.println("Mapped value: " + e))
        .collect(Collectors.toList());

// Filtered value: three
// Mapped value: THREE
// Filtered value: four
// Mapped value: FOUR
```

## Stream <-> 기본형 Stream
Stream을 기본형 Stream으로 바꾸거나 기본형 Stream을 Stream으로 바꿔야 될 경우가 있다. 이를 위해, mapToInt(), mapToLong(), mapToDouble()을 지원하고 있으며 해당 메서드로 IntStream, LongStream, DoubleStream으로 변경할 수 있다. 역으로 mapToObj를 이용하여 Stream으로 다시 바꿀 수도 있다.

```java
// 기본형 Stream(IntStream) -> Stream(Stream<Integer>)
IntStream.range(1, 10)
      .mapToObj(v -> v + 1)

// Stream(Stream<Integer>) -> 기본형 Stream(IntStream)
Stream.of(1, 2, 3, 4)
    .mapToInt(v -> v + 2)
```

그렇다면 언제 사용할 수 있을까..? 예를 들어, 점수의 합을 구한다고 가정해보자
```java
int score = student.stream()
                .map(Student:getScore)
                .reduce(0, Integer::sum);
```

위와 같이 하게 되면 합계를 계산하기 전에 Integer를 기본형으로 언박싱해야 되기 때문에 추가 비용이 들게 된다. 그래서 효율적으로 처리할 수 있도록 기본형 특화 스트림(primitive stream specialization)이 제공되기 때문에 기본형 Stream으로 변경 후 계산할 수 있다.

```java
int score = student.stream()
                .mapToInt(Student:getScore)
                .sum();
```

## Collect를 좀 더 활용해보자

### Collectors.joining()
Stream 값을 delimiter, prefix, suffix를 이용하여 간단하게 하나의 String 값으로 만들어 줄 수 있다.

```java
String join = List.of("a", "b", "c").stream()
                .collect(Collectors.joining(", ", "(", ")"));

//(a, b, c)
```

### Collectors.groupingBy()
제공한 Type T에 따라 요소를 그룹화하고 Map으로 결과를 반환한다. 파라미터로 Function 함수형 인터페이스를 받는다.

```java
List<User> users = List.of(new User(1, "a"), new User(2, "b"),
                new User(2, "c"), new User(1, "d"));

Map<Integer, List<User>> collect = users.stream()
        .collect(Collectors.groupingBy(User::getAge));

//{1=[User{age=1, name='a'}, User{age=1, name='d'}],
// 2=[User{age=2, name='b'}, User{age=2, name='c'}]}
```

### Collectors.partitioningBy()
입력받은 요소들을 Predicate에 따라 분류하고 Boolean을 키값으로 Map을 반환한다. 파라미터로 Prediate 함수형 인터페이스를 받는다.

```java
List<User> users = List.of(new User(1, "a"), new User(2, "b"),
        new User(2, "c"), new User(1, "d"));

Map<Boolean, List<User>> collect = users.stream()
        .collect(Collectors.partitioningBy(user -> user.getAge() == 1));

//{false=[User{age=2, name='b'}, User{age=2, name='c'}],
// true=[User{age=1, name='a'}, User{age=1, name='d'}]}
```

## flatMap
flatMap은 스트림의 요소에 일대다 변환을 적용한 다음 결과 요소를 새 스트림으로 평면화한다. 즉, 2중 배열 혹은 2중 리스트인 경우 구조를 허물고 이를 1차원으로 반환해 준다. 파라미터로 Function 함수형 인터페이스를 받고 있다.

```java
List<List<String>> lists = List.of(List.of("a, b, c"), List.of("d, e, f"));

List<String> flat = lists.stream()
        .flatMap(Collection::stream)
        .collect(Collectors.toList());

//[a, b, c, d, e, f]
```

## reduce
해당 스트림의 요소들을 연관 누적 함수(reduce 괄호 안 BinaryOperator)를 이용하여 연산하고 Optional 값을 반환하게 된다. BinaryOperator는 BiFunction을 상속받았기 때문에 2개의 T 타입 파라미터를 넘기고 T 타입을 반환하는 함수이다.

```java
List<Integer> list = List.of(1, 2, 3, 4);

Optional<Integer> reduce = list.stream()
        .reduce(Integer::sum);

System.out.println(reduce.get());

//10 (1 + 2 + 3 + 4)
```

BinaryOperator 앞에 계산을 처리하기 위한 초깃값을 설정해 줄 수 있다.
```java
List<Integer> list = List.of(1, 2, 3, 4);

Integer reduce = list.stream()
        .reduce(100, Integer::sum);

System.out.println(reduce);

//110 (100(초기값) + 1 + 2 + 3 + 4)
```

## 실행 순서

과연 Stream API의 연산들의 실행 순서도 성능과 관련이 있을까? 관련이 있다. 어떻게 동작되는지 모른 채로 사용하게 되면 비효율적으로 사용할 수 있다. 실행 순서에 따라 어떻게 되는지 한번 살펴보자

우선 Stream이 어떤 구조로 돌아가는지 한번 확인해 보자. 과연 아래와 같이 코드를 작성하면 어떻게 출력이 될까? 1번? 2번?
```java
List<Integer> list = List.of(1, 2, 3, 4);

list.stream()
        .filter(v -> {
            System.out.println("first: " + v);
            return v >= 1;
        })
        .forEach(v -> System.out.println("second: " + v));

//1번
//first:1
//first:2
//first:3
//..

//2번
//first:1
//second:1
//first:2
//second:2
//..
```

```java
//정답: 2번
first: 1
second: 1
first: 2
second: 2
first: 3
second: 3
first: 4
second: 4
```

정답은 2번이다. 각 연산을 한 번에 다하고 그다음으로 넘어가는 게 아니라 하나씩 수직적으로 돌게 된다. 왜 이런 구조로 돌아가는 걸까? 결론부터 말하자면 수직적으로 실행되는 것이 더 효율적이기 때문이다.

```java
List<Integer> list = List.of(1, 2, 3, 4);

list.stream()
        .filter(v -> {
            System.out.println("first: " + v);
            return v >= 1;
        })
        .anyMatch(v -> {
            System.out.println("second " + v);
            return v == 1;
        });

//실행 결과
//first: 1
//second 1
```

위 코드가 만약 수평적으로 돌아가게 된다면 filter에서 4번, anyMatch에서 1번으로 총 5번의 연산이 발생할 것이다. 하지만 수직적으로 돌아가기 때문에 실제로는 filter 1번, anyMatch 1번으로 총 2번의 연산이 발생한다.

그렇다면 실행 순서에 따른 연산 개선을 한번 해보고 Stream을 여기서 마무리해 보자. (여기선 간단하게 예로 filter 두 개를 써서 약간 어색할 수 있지만 넘어가 주세요... ㅋㅋㅋ)
```java
List<Integer> list = List.of(1, 2, 3, 4, 5, 6);

list.stream()
        .filter(v -> {
            System.out.println("first: " + v);
            return v >= 1;
        })
        .filter(v -> {
            System.out.println("second: " + v);
            return v == 4;
        })
        .forEach(v -> System.out.println("third: " + v));

//실행 결과
// first: 1
// second: 1
// first: 2
// second: 2
// first: 3
// second: 3
// first: 4
// second: 4
// third: 4
// first: 5
// second: 5
// first: 6
// second: 6
```
위와 같이 v >=1 필터가 먼저 온 경우에는 총 연산이 13번 이루어졌다. 하지만 다음과 같이 v == 4 필터가 먼저 오면 어떻게 될까?

```java
List<Integer> list = List.of(1, 2, 3, 4, 5, 6);

list.stream()
        .filter(v -> {
            System.out.println("first: " + v);
            return v == 4;
        })
        .filter(v -> {
            System.out.println("second: " + v);
            return v >= 1;
        })
        .forEach(v -> System.out.println("third: " + v));

//실행 결과
// first: 1
// first: 2
// first: 3
// first: 4
// second: 4
// third: 4
// first: 5
// first: 6
```

두 번째 연산을 앞으로 옮김으로써 총 연산이 8번 이루어졌다. 물론 현재는 5번밖에 차이가 안 나지만, 나중에 대량의 데이터를 연산할 때는 그 차이가 어마어마할 것이다. 이렇게 실행 순서에 따라 같은 입력과 결과에 대해 더 적게 연산을 처리할 수 있으므로 Stream을 사용할 때는 주의해서 사용하자.

---
참고:
- [https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html)
- [https://docs.oracle.com/javase/8/docs/api/java/util/stream/Collectors.html](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Collectors.html)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.