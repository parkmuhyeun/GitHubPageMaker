---
layout: post
title: 우테코 - 자동차 경주 미션 회고
subtitle: 부제목 예시
tags: woowacourse racing-car pair-programming
description: >
  자동차 경주 미션을 진행하면서 있었던 과정을 회고해보자
sitemap: true
hide_last_modified: true
categories:
  - woowacourse
---

> 그렇게 기다리고 기다리던 우테코 생활이 2월 7일부터 시작되었다..!!

![](/assets//img/blog/woowacourse/rc_1.jpg)

첫 번째 미션인 자동차 경주가 꽤 지난 지금 회고하는 이유는 그동안 엄청나게 많이 들어오는 새로운 정보(규칙, 일정, 공지 등) 처리에 뇌 정지가 왔고 ㅋㅋㅋㅋ 거기다가 동시에 미션 + 연극 + 새로운 크루들과 친해지기까지 해야 되었기 때문에 엄청나게 바쁜 나날들이었다...(나중에 시간 되면 일상 블로깅도..!) 그리고 제일 치명적이었던 건 너무 급하게 집을 옮기고(2월 6일에 집을 옮김..) 위에 과정들을 진행하며 몸을 거침없이 소비했는데 내 몸이 받쳐주지 않아 몸 컨디션이 많이 악화됐었다.

어제 병원까지 갔다 와서 약 먹으며 한 이틀째 죽을 먹으니깐 이제서야 조금 회복되는 거 같기도 하다. 다음 주부터는 풀 컨디션으로 돌아가서 다시 열심히 달려야지.. 다들 몸 잘 챙기면서 코딩합시다!! 일단 tmi는 여기까지 하고 이제 본 주제인 미션에 대해 얘기해 보자.

---

## 자동차 경주 미션 시작

![](/assets//img/blog/woowacourse/rc_2.jpg)

### 페어 프로그래밍

첫 번째 미션은 자동차 경주 미션이었다. 프리코스 미션과 비슷한데 다른 점이라면은 페어 프로그래밍으로 페어와 함께 미션을 진행해야 된다! 페어 프로그래밍이 어떤 건지 모르겠으면 [다음글] 참고. 페어 프로그래밍은 처음이었는데 정말 쉽지 않았던 것 같다. 

계속해서 서로 대화를 주고받으며 더 나은 코드를 짜기 위해 집중력을 발휘하기 때문에 그만큼 피로감도 두 배, 세배로 상승했다. 그리고 옆에서 누가 나를 감시하는 것 같아 코드를 작성할 때 더욱 긴장이 되었던 것 같다 ㅋㅋㅋ 그래도 정기적인 휴식으로 잘 커버하면서 진행했던 기억이 난다!

하지만 그만큼 얻어 가는 것도 많고 더 좋은 코드를 짤 수 있어 좋은 방법 같다는 생각이 든다. 내가 진행자(드라이버)가 되어 코드를 작성할 때도 페어에게 왜 이렇게 작성했는지, 이런 방향은 어떤지 계속 설명하고 의논하며 코드를 작성해 더욱 근거 있고 좋은 코드를 작성할 수 있게 되는 거 같아서 더욱 마음에 들었다.

[다음글]:https://parkmuhyeun.github.io/woowacourse/2023-02-05-Pair-Programming/

### 전략 패턴을 이용해 랜덤 값 테스트

```java
public void move() {
  if (isMovable()){
    position++;
  }
}

private boolean isMovable() {
  return ((int) (Math.random() * 10)) >= 4;
}
```

4 이상의 값이 나와야 전진이라는 요구사항이 있었다. 그렇다면 이 랜덤 값을 생성하는 로직을 포함하고 있는 move 메소드는 그때그때마다 결괏값이 다를 텐데 어떻게 테스트해야 될까?? 랜덤 값을 생성하는 클래스와 사용하려는 클래스의 강한 결합을 약한 결합으로 낮추기 위한 분리가 필요하다. 이를 위해 전략 패턴(Strategy Pattern)을 사용하였다.

전략 패턴은 객체가 할 수 있는 행위 각각에 대해 전략 클래스를 생성하고 이를 정의하는 공통의 인터페이스를 정의해 행위를 동적으로 바꾸고 싶은 경우 직접 행위를 수정하지 않고 전략을 바꿔끼어주어 행위를 유연하게 확장할 수 있는 방법이다.

다음과 같이 RacingNumberGenerator 인터페이스를 생성한 후 구현체인 전략들을 주입해 주면 테스트해 볼 수 있다.

```java
public interface RacingNumberGenerator {

    int generate();
}
```

```java
//실제 사용 랜덤값(0 ~ 9) 생성 generator
public class RacingRandomNumberGenerator implements RacingNumberGenerator{

    private static final int MIN_VALUE = 0;
    private static final int MAX_VALUE = 9;

    @Override
    public int generate() {
        return (int) (Math.random() * (MAX_VALUE - MIN_VALUE + 1));
    }
}
```

```java
//이동가능한 값을 생성하는 generator (Test Stub)
public class StubMovableRacingNumberGenerator implements RacingNumberGenerator {
    private static final int MOVABLE_VALUE = 4;

    @Override
    public int generate() {
        return MOVABLE_VALUE;
    }
}
```

```java
////이동 불가능한 값을 생성하는 generator (Test Stub)
public class StubUnmovableRacingNumberGenerator implements RacingNumberGenerator {

    private static final int UNMOVABLE_VALUE = 3;

    @Override
    public int generate() {
        return UNMOVABLE_VALUE;
    }
}
```

```java
public void move(RacingNumberGenerator generator) {
  if (isMovable(generator)){
    position++;
  }
}

private boolean isMovable(RacingNumberGenerator generator) {
  return generator.generate() >= 4;
}
```

위에 Stub에 대해서 궁금증이 생겼다면 [Test Double]을 읽어보자. 테스트하려는 객체와 연관된 객체를 사용하기가 어렵고 모호할 때 대신해 줄 수 있는 객체를 테스트 더블이라 한다. Stub은 Test Double의 한 종류로 링크에 자세하게 설명되어 있다! 좋은 방법, 글 추천해 준 페어(지토), 리뷰어(다니)에게 감사 인사를... 🙇🙇🙇

+추가적으로 다양한 테스트 종류에 대해 궁금하다면 다음 글을 추천드립니다! ~~제 리뷰어가 쓰신 글인 건 비밀ㅋㅋ~~
- [단위 테스트 vs 통합 테스트 vs 인수 테스트]

[단위 테스트 vs 통합 테스트 vs 인수 테스트]:https://tecoble.techcourse.co.kr/post/2021-05-25-unit-test-vs-integration-test-vs-acceptance-test/
[Test Double]:https://tecoble.techcourse.co.kr/post/2020-09-19-what-is-test-double/

### 원시 값 포장

이번에 구현할 때 객체지향 생활 체조 원칙을 참고했었는데 모든 원시 값과 문자열을 포장하라는 규칙을 참조해 Car 객체에서 이름과 위치를 나타내는 속성을 다음과 같이 원시 값으로 포장했었다.

```java
public class Car {

    private final Name name;
    private final Position position;

    ...
}
```

원시 값을 포장함으로 써 다음과 같은 장점들을 느껴볼 수 있었다.
- 각각의 데이터에 대한 정보를 숨김
- 한 가지 책임만 잘 줄 수 있고 사용하는 곳 가장 가까운 곳에 코드를 둘 수 있어 유지 보수하기 좋음

## 코드 리뷰

코드 리뷰나 질문을 하나하나 다 적기는 너무 많아 아래 PR들을 참고하면 좋을 거 같고 공유하면 좋을 것 같은 것들을 적어보겠다.
- [1단계 - 자동차 경주 구현](https://github.com/woowacourse/java-racingcar/pull/487)
- [2단계 - 자동차 경주 리팩터링](https://github.com/woowacourse/java-racingcar/pull/578)

### 과연 CarService가 필요할까?

음... 이전까지 계속 사이드 프로젝트를 하고 있었기 때문에 이번 미션에도 자연스럽게 Controller, Service를 무지성으로 생성했던 것 같은데 이번 미션에서는 domain에서만 기능을 부여해서 만들어도 충분히 커버가 가능했기 때문에 Service 영역이 필요 없었다. 

이걸 시작으로 오버 프로그래밍에 대해서 조금 생각해 봤다. 현재 상황에 맞게 하느냐... 아니면 후에 확장성까지 생각하여 추가적으로 구현하느냐(예를 들어 Service, DTO 같은).. 어느 것이 확실하게 정답이라고 할 수 없다. 현재 주어진 상황에 충실하게 짜볼 수도 있는 것이고 아니면 미리 후에 확장성까지 고려할 수 있도록 짜보며 공부해 볼 수도 있을 것이다.

현재 내가 내린 결정은 현재 상황에 맞게 하되 여유가 있으면 추가적으로 적용해 보자였다! 현재 나에게 주어진 상황에 맞게 하지도 못하는데 오버 프로그래밍을 하는 것은 말 그대로 오버라 할 수 있다ㅋㅋㅋ 그래서 우선 기본에 충실한 후 이 기본기가 갖춰지면 조금씩 오버 프로그래밍을 적용해 보려고 한다.

### 공백 처리
기존에 나는 입력에 공백이 있는지 확인하기 위해 trim으로 공백을 제거한 뒤 length를 확인하여 처리했었는데 String의 isBlank()로 바로 처리가 가능하다..ㅜㅠ 아직 자바의 기본 API에 대해 더 공부가 필요함을 느꼈다.

보는김에 [isNull()] vs [isEmpty()] vs [isBlank()]의 차이를 한번 알아보자.
- isNull(): 문자열이 null이면 true를 반환
- isEmpty(): 문자열의 길이가 0이면 true를 반환
- isBlank(): 문자열이 비어있거나 공백만 포함하고 있으면 true 반환

|String|isNull()|isEmpty()|isBlank()|
|:---:|:---:|:---:|:---:|
|""|false|true|true|
|" "|false|false|true|
|null|true|NPE|NPE|

[isNull()]:https://docs.oracle.com/javase/8/docs/api/java/util/Objects.html#isNull-java.lang.Object-
[isEmpty()]:https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#isEmpty()
[isBlank()]:https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#isBlank()

### 리뷰어님의 질문에 대한 나의 답변
- Cars 일급 컬렉션을 만들었을 때 어떤 장점이 있었나요?
  - 관련 상태나 행위를 한곳에서 관리할 수 있습니다.
  - 컬렉션의 불변성을 보장해 줄 수 있습니다.
- isSameAs()와 isEqualTo()는 어떤 차이가 있을까요?
  - isSameAs는 주소를 비교하는 메소드이고 isEqualTo는 값 자체를 비교하는 메소드입니다.
  - isSameAs 같은 경우 원시형 타입은 값 비교를 하고, 객체는 주소를 비교합니다.
  - isEqualTo는 값으로 비교하지만 객체를 비교하게 되는 경우 참조를 비교합니다.

---

## 자동차 경주(첫번째 미션) 미션을 하고 난 뒤 느낀 점

![](/assets//img/blog/woowacourse/rc_3.jpg)

자동차 미션을 제출한 날 참 많은 감정이 느껴졌다. 당연한 거지만.. 많은 부족함을 느꼈고 페어에게도 도움을 많이 주고 싶었는데 그러지 못한 것 같아 아쉬웠다. 다음 페어에게는 더 많은 걸 알려줄 수 있는 좋은 페어가 될 수 있도록 더 열심히 해야겠다는 생각이 들었다. 그리고 앞으로 어떻게 더 좋은 코드를 짤 수 있을지, 다른 사람들은 어떻게 짰는지 보며 많은 고민을 해봐야겠다.

그리고 뭔가 진 거 같은 느낌이 들어 계속해서 분함이 느껴졌다...ㅋㅋㅋ 이 분함이 나를 더 성장시켜주기를... 우테코에 오고 나서 좋은 습관들이 하나 생겼다. 뭐든 그냥 하는 게 아니라 왜라는 걸 붙이는 습관..(좋은 거 맞..나?) 우테코가 물고기를 잡는 법을 알려주는 것이 아닌 물고기를 잡는 환경을 만들어 주다 보니 자연스럽게 이런 습관이 생기게 되었는데 끊임없이 고민하고 생각하게 해주어 엄청난 도움이 되고 있다.

하지만, 이 모든 게 가능하려면 건강(체력)이 제일 중요한 것 같다. 그래서 앞으로 어떻게 루틴을 잡을지, 체력을 유지할 수 있을지도 고민해 봐야겠다. 이 글을 보는 분들도 아프지 않게 꼭 몸 잘 챙기면서 코딩해 보자~ 그럼 첫 번째 회고는 여기서 끝!

---

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.