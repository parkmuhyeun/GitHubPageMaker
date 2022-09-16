---
layout: post
title: 의식적인 연습으로 TDD, 리팩토링 연습하기 세미나 정리 및 후기
subtitle: 부제목 예시
tags: seminar TDD Refactoring
description: >
 TDD, 리팩토링
sitemap: true
hide_last_modified: true
categories:
  - etc
  - seminar
---

> 이 글은 우아한 테크 세미나, OKKYCON에서 강연을 하신 박재성님의 의식적인 연습으로 TDD, 리팩토링 연습하기에 대한 정리 및 후기입니다. 참고 링크: 우아한 테크 세미나 -[youtube.com/watch?v=bIeqAlmNRrA], OKKYCON - [https://www.youtube.com/watch?v=cVxqrGHxutU]

전에 [코드 리뷰]에 관한 글을 올렸는데, 그래서 서로 의논해서 코드의 품질을 향상시키겠다는 취지인 건 알겠는데 어떻게 향상시키는 거야? 그 Base(방법)를 어떻게 잡아야 되지라는 생각을 할 수 있다. 그래서 오늘의 주제를 포스트하게 되었다. 

사실 이 주제 같은 경우 예전에 해당 세미나를 접하고 공부를 해봤지만 그때 당시엔 어려워서 나중에 다시 공부해서 정리하자 마음먹었는데 최근에 다시 정리하게 됐다.

---

## TDD? 리팩토링?

TDD, 리팩토링 말만 들으면 굉장히 멋져보이지만 막상 해볼려고 하면 절대 쉽지 않다. 심지어 TDD, 리팩토링을 무작정 많이 연습 한다고 해서 느는것도 아니다. 생각만큼 쉽게 연습할 수 있는 놈이 아니고 의식적인 연습이 필요하다. 

의식적인 연습의 7가지 원칙
1. 효과적인 훈련 기법이 수립되어 있는 기술 연마
2. 개인의 컴포트 존(Comfort Zone)을 벗어난 지점에서 진행, 자신의 현재 능력을 살짝 넘어가는 작업을 지속적으로 시도
3. 명확하고 구체적인 목표를 가지고 진행
4. 신중하고, 계획적이다. 즉, 개인이 온전히 집중하고 '의식적'으로 행동할 것을 요구
5. 피드백과 피드백에 따른 행동 변경을 수반
6. 효과적인 [심적 표상]을 만들어내는 한편으로 심적 표상에 의존
7. 기존에 습득한 기술의 특정 부분을 집중적으로 개선함으로써 발전시키고, 수정하는 과정을 수반

-> 무작정하지말고 의식적인 연습으로 효과적으로 연습하자

## 그래서 뭐부터 해야될까?
TDD랑 일단 단위 테스트는 다른데 TDD는 어렵기 때문에 단위테스트 부터 먼저 연습하자.

### 1단계 - 단위테스트 연습
내가 사용하는 API 사용법을 익히기 위한 학습 테스트에서 시작

예를 들어
- 자바 String 클래스의 다양한 메소드(함수) 사용법
- 자바 ArrayList에 데이터를 추가, 수정, 삭제하는 방법

-> 내가 만든 API가 입력을 넣고 결과가 잘 나오는지부터 부터 연습

### 2단계 - TDD 연습
처음부터 어려운 프로젝트를 하지말자. 어려운 문제를 해결하는 것이 목적이 아니라 TDD 연습이 목적, 난이도가 낮거나 자신에게 익숙한 문제로 시작하는 것을 추천. 먼저 장난감 프로젝트를 활용해 연습하면 좋음 (웹, 모바일 UI나 DB에 의존관계를 가지지 않는 요구사항으로 연습)

![](/assets//img/blog/etc/seminar/tr_1.PNG)

TDD Circle of life

Test Fail -> Test Pass -> refactoring인데 처음부터 다하기 힘들다. 그래서 처음에 2단계까지 하는거 추천. Test Fail -> Test Pass 2단계까지 되면 refactoring 추가

### 3단계 Refactoring 연습
테스트 코드는 변경하지 말고 테스트 대상 코드(프로덕션 코드)를 개선하는 연습을 한다.

처음에 클래스는 한가지 역활만 해야 한다고 클래스를 분리하라고 하면 너무 추상적일 수 있다. 그러면 처음하는 사람은 뭘해야될지 막막할 수도 있고 멘붕이 올 것이다. 그래서 우선 측정 가능한 방법으로 작은 것 부터 차근차근 연습을 시작해보자.

예를들어 아래의 과정을 한번 보자. 약간 길 수 있지만 제일 중요한 부분이니 시간내서 봐보자.
- 한 메서드에 오직 한 단계의 들여쓰기(indent)만 한다.
```java
public class StringCalcculator {
  public static int splitAndSum(String text){
    int result = 0;
    if (text == null || text.isEmpty()){
      result = 0;
    }else {
      String[] values = text.split(",|:");
      for (String value : values){          //이 부분이 들여쓰기가 2인 부분
        result += Integer.parseInt(value);
      }
    }
    return result;
  }
}
```

여기서 들여쓰기가 2인 부분을 메소드를 생성하여 1로 줄여 준다.

```java
public class StringCalcculator {
  public static int splitAndSum(String text){
    int result = 0;
    if (text == null || text.isEmpty()){
      result = 0;
    }else {
      String[] values = text.split(",|:");
      result = sum(values);   //변경된 부분
    }
    return result;
  }
}

private static int sum(String[] values){
  int result = 0;
  for (String value : values){
        result += Integer.parseInt(value);
  }
  return result;
}
```

- else 예약어를 쓰지 않는다.
```java
public class StringCalcculator {
  public static int splitAndSum(String text){
    int result = 0;
    if (text == null || text.isEmpty()){
      result = 0;
    }else {     //else 부분
      String[] values = text.split(",|:");
      result = sum(values);
    }
    return result;
  }
}

private static int sum(String[] values){
  int result = 0;
  for (String value : values){
        result += Integer.parseInt(value);
  }
  return result;
}
```

다음 처럼 else를 없애고 사용할 수 있다.

```java
public class StringCalcculator {
  public static int splitAndSum(String text){
    if (text == null || text.isEmpty()){
      return 0;
    }

    String[] values = text.split(",|:");
    return sum(values);
  }
}

private static int sum(String[] values){
  int result = 0;
  for (String value : values){
        result += Integer.parseInt(value);
  }
  return result;
}
```

- 메소드가 한 가지 일만 하도록 구현하기
```java
public class StringCalcculator {
  public static int splitAndSum(String text){
    if (text == null || text.isEmpty()){
      return 0;
    }

    String[] values = text.split(",|:");
    return sum(values);
  }
}

//현재 더하기를 할 뿐아니라 String을 숫자로 바꾸는 역활도 하고 있음.
private static int sum(String[] values){
  int result = 0;
  for (String value : values){
        result += Integer.parseInt(value);
  }
  return result;
}
```

숫자로 바꿔주는 메소드와 덧셈만 하도록 하는 메소드로 나눠 주자

```java
public class StringCalcculator {
  public static int splitAndSum(String text){
    if (text == null || text.isEmpty()){
      return 0;
    }

    String[] values = text.split(",|:");
    int[] numbers = toInts(values);
    return sum(numbers);
  }
}

//숫자로 바꿔주는 메소드
private static int[] toInts(String[] values){ 
  int[] numbers = new int[values.length];
  for (int i = 0; i < values.length; i++) {
    numbers[i] = Integer.parseInt(values[i]);
  }
  return numbers;
}

//값을 더하는 메소드
private static int sum(int[] numbers){
  int result = 0;
  for (int number : numbers){
        result += number;
  }
  return result;
}
```

- 로컬 변수가 정말 필요한가? (다른 곳에서 사용하지 않는다면 굳이 필요없다.)

```java
public class StringCalcculator {
  public static int splitAndSum(String text){
    if (text == null || text.isEmpty()){
      return 0;
    }
    return sum(toInts(text.split(",|:")));  // 로컬 변수들 삭제
  }
}

private static int[] toInts(String[] values){
  int[] numbers = new int[values.length];
  for (int i = 0; i < values.length; i++) {
    numbers[i] = Integer.parseInt(values[i]);
  }
  return numbers;
}

private static int sum(int[] numbers){
  int result = 0;
  for (int number : numbers){
        result += number;
  }
  return result;
}
```

- compose method 패턴 적용
  - compose method: 메소드(함수)의 의도가 잘 드러나도록 동등한 수준의 작업을 하는 여러단계로 나눈다.

```java
public class StringCalcculator {
  public static int add(String text){
    if (isBlank(text)){           //같은 단계로 만들기 위해 isBlank
      return 0;
    }
    return sum(toInts(split(text)));  // 같은 단계로 만들기 위해 split
  }
}

private static boolean isBlank(String text){
  return text == null || text.isEmpty();
}

private static String[] split(String text) {
  return text.split(",|:");
}

private static int[] toInts(String[] values){
  int[] numbers = new int[values.length];
  for (int i = 0; i < values.length; i++) {
    numbers[i] = Integer.parseInt(values[i]);
  }
  return numbers;
}

private static int sum(int[] numbers){
  int result = 0;
  for (int number : numbers){
        result += number;
  }
  return result;
}
```

자 이렇게 하고나면 add() 메소드를 처음 읽는 사람에게 어느 코드가 더 읽기 좋을까?

Refactoring 하기 전
```java
public class StringCalcculator {
  public static int splitAndSum(String text){
    int result = 0;
    if (text == null || text.isEmpty()){
      result = 0;
    }else {
      String[] values = text.split(",|:");
      for (String value : values){
        result += Integer.parseInt(value);
      }
    }
    return result;
  }
}
```

Refactoring 하고난 후
```java
public class StringCalcculator {
  public static int add(String text){
    if (isBlank(text)){
      return 0;
    }
    return sum(toInts(split(text)));
  }
}

private static boolean(String text){
  ...
}

private static String[] split(String text) {
  ...
}

private static int[] toInts(String[] values){
  ...
}

private static int sum(int[] numbers){
  ...
}
```

후자가 더 좋을 것이다. 주의할점은 한 번에 모든 원칙을 지키면서 리팩토링하려고 연습하면 안되고 한번에 한가지 명확하고 구체적인 목표를 가지고 연습해야한다. 그리고 연습할 땐 극단적인 방법으로 하는 것도 더 좋다. 예를 들어 한 메소드의 라인 수 제한을 15라인에서 10라인으로 줄여서 하는 것이다. 이렇게 극단적으로 하게 되면 기존과 다른 방법이 나오게 되기 때문에 도움이 된다.

이렇게 할 수 있는 것부터 하고 나면 이제 아까 처음에 말했던 클래스 분리를 연습하면 된다. 클래스 분리 부분은 여기서 더 설명하면 너무 길어지니 생략하겠다. 이것도 코드로 보면 도움이 많이 되니 직접 영상에서 찾아서 보자. OKKYCON 기준 29:21초에 나온다.

### 4단계 - 장난감 프로젝트 난이도 높이기
앞에서 간단하게 해봤으면 이제 점진적으로 요구사항이 복잡한 프로그램 구현해보자. 앞에서 지켰던 기준을 지키면서 프로그래밍 연습을 해야한다.

TDD, 리팩토링 연습하기 좋은 프로그램 요구사항
- 게임과 같이 요구사항이 명확한 프로그램으로 연습
- 의존관계(모바일 UI, 웹 UI, 데이터베이스, 외부 API와 같은 의존관계)가 없이 연습
- 약간은 복잡한 로직이 있는 프로그램

연습하기 좋은 예(단, UI는 콘솔)
- 로또
- 사다리 타기
- 볼링 게임 점수판
- 체스 게임
- 지뢰 찾기 게임

### 5단계 - 의존관계 추가를 통한 난이도 높이기
이제 웹, 모바일 UI, 데이터베이스와 같은 의존관계를 추가. 이때 필요한 역량은 테스트하기 쉬운 코드와 테스트하기 어려운 코드를 보는 눈 테스트하기 어려운 코드를 테스트 하기 쉬운 코드로 설계하는 감(sense)이 필요하다. 이렇게 해서 자신감이 생기면 현장에 적용할 수 있다.

### 한 단계 더 나아간 연습을 하고 싶다면
- 컴파일 에러를 최소화하면서 리팩토링하기
- ATDD 기반으로 응용 애플리케이션 개발하기
- 레거시 애플리케이션에 테스트 코드 추가해 리팩토링하기

## 결국 TDD, 리팩토링 연습을 위해 필요한것은?
- 조급함 대신 마음의 여유
- 나만의 장난감 프로젝트
- 같은 과제를 반복적으로 구현할 수 있는 인내력

---
## 정리
결국 간단하게 안된다는 것이다. 의식을 가지고 오랜 시간을 들여 연습을 해야 실력이 느는 것이므로 조급해지면 안 될 것 같다. 나도 예전에 조금 공부해 보고 바로 프로젝트에 적용해 보려고 했었는데 당연히 실패했던 기억이 있다. 천천히 작은 것부터 시작해 실력을 길러야겠다. 이번에도 역시 세미나가 정말 뜻깊었고 의미 있는 시간이었다. 강연을 들을 때마다 강연자분들이 정말 대단하시고 멋져보인다. 나도 얼른 성장해서 지식을 나눌 수 있는 개발자가 될 수 있길..

앞으로의 계획은 일단 첫 번째 규칙처럼 효과적인 훈련 기법이 수립되어 있는 기술을 연마하기 위해 우선 [https://edu.nextstep.camp/c/9WPRB0ys/] 을 따라가며 천천히 연습해 보려고 한다. 앞으로 할게 너무 많아서 두려운 한편, 또 성장할 생각에 뭔가 설렌다.

---

[https://edu.nextstep.camp/c/9WPRB0ys/]:https://edu.nextstep.camp/c/9WPRB0ys/
[심적 표상]:https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=stewart7&logNo=220926739938
[코드 리뷰]:https://parkmuhyeun.github.io/etc/seminar/2022-06-13-code-review/
[youtube.com/watch?v=bIeqAlmNRrA]:youtube.com/watch?v=bIeqAlmNRrA
[https://www.youtube.com/watch?v=cVxqrGHxutU]:https://www.youtube.com/watch?v=cVxqrGHxutU

*오타가 있거나 피드백 주실 부분이 있으면 편하게 말씀해 주세요.