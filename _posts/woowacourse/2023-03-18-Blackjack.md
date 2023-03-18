---
layout: post
title: 우테코 - 블랙잭 미션 회고
subtitle: 부제목 예시
tags: woowacourse blackjack pair-programming tdd
description: >
  블랙잭 미션을 진행하면서 있었던 과정을 회고해보자
sitemap: true
hide_last_modified: true
categories:
  - woowacourse
---

![](/assets//img/blog/woowacourse/bla_1.jpg)

이번 세 번째 미션은 블랙잭 미션! 세 번째 미션부터 어렵다고 소문을 들었기 때문에 시작하기 전에 겁을 먹고 있었다(사실 설렜을지도..?). 카드에 어떤 카드가 있는지도 정확하게 몰랐고 심지어 미션을 구현하기 전까지 블랙잭의 룰도 몰랐다. 하지만 역시 인간은 적응의 동물? 하기 전까지는 겁을 먹고 있었지만 막상 다가오니 어떻게든 했던 것 같다 ㅋㅋ

하지만 시간 분배도 잘못했던 거 같고 아직 tdd에 익숙하지 않아 오래 걸렸기 때문에 위험할 뻔했던 기억이 난다. 이번 회고를 통해 블랙잭 미션을 다시 되돌아보자

## Over README

![](/assets//img/blog/woowacourse/bla_2.jpg)

처음 페어랑 만난 날 거의 모든 시간을 기능 목록 작성에만 쏟았던 기억이 난다.. 그렇게 다음과 같은 [README]가 만들어졌지만 다시 해보라 하면 못할 거 같다.ㅋㅋㅋ 지금 생각해 보면 너무 상세하게 적어서 시간이 많이 소모되었던 거 같은데 어차피 세부 구현 사항은 추후에 바뀌므로 그렇게 공들일 필요가 없었을 거 같다. 

다음에는 간단히 도메인 다이어그램 정도 그리고 도메인별 기능 정도만 작성해 주면 좋을 거 같다! 다이어그램 작성을 도와주는 [mermaid]라는 툴을 알게 되었는데 매우 유용해 보여 다음 체스 미션에 적용해 볼 예정이다.

[README]:https://github.com/parkmuhyeun/java-blackjack/tree/step2/docs
[mermaid]:https://mermaid.js.org/syntax/classDiagram.html

## 카드 상속

이번에 우리는 각 카드를 구현할 때 abstract class인 Card를 생성하고 이 Card를 상속받는 AceCard, CourtCard, StandardCard를 생성했다. 앞으로 각자의 카드마다 추가적인 기능이 추가될 경우를 위해 이렇게 구조를 잡았는데 생각해 보니 지금 구조에서는 카드마다 특별한 행위는 없기 때문에 분리할 필요가 없어 보인다. 

이에 리뷰어님께서도 지금 구조에서는 딱히 분리할 필요가 없어 보이고 필요한 시점에 분리해 보는 건 어떨까라는 답변을 주셨다. 그래서 상속에 대해 좀 더 깊게 알아보고 싶었고 다음과 같이  상속과 조합에 대해 정리해 보았다.

많은 사람들이 중복을 제거하기 위한 관점으로 상속을 사용하곤 한다. 물론 나도 그랬고, 하지만 중복을 제거하기 위한 방법이 상속만 가능하냐? 아니다. 조합을 이용해서도 가능하다. 중복을 제거하기 위해 사용한다는 관점보다는 각 객체들 간의 관계에 대해 생각해 보면 좋을 것 같다는 리뷰어님의 말씀을 듣고 둘에 대한 차이가 궁금해졌다.

Efftective Java item 18에서 "상속보다는 조합을 사용해라"라는 말이 나온다. 왜 그럴까? 상속을 적절히 사용하면 그 장점들은 강력하지만 잘못 사용하면 두 가지 관점에서 설계에 안 좋은 영향을 미친다. 첫 번째는 캡슐화를 위반하여 하위 클래스가 상위 클래스에 강하게 결합하게 되고 변화에 유연하게 대처하기 어려워진다.


```java
public class Moomin {
  protected List<Integer> integers;

  ...
}

public class Momin extends Moomin{
  publi Momin(List<Integer> integers) {
    super(integers);
  }

  ...
}
```

예를 들어 무민 클래스의 인스턴수 변수가 List< Integer >에서 int[]로 변경되면 무민을 상속받고 있는 하위 클래스들은 모두 수정을 해야 된다. 두 번째로는 설계가 유연하지 않다. 상속은 부모 클래스와 자식 클래스 사이의 관계를 컴파일 시점에 결정하기 때문에 실행 시점에 객체의 종류를 변경하는 것이 불가능하다.

그렇다면 조합을 사용하게 되면 어떻게 될까? 조합은 기존의 클래스가 새로운 클래스의 구성요소(인스턴스)로 쓰이는 걸 말한다. 새로운 클래스는 기존 클래스의 메서드를 호출하여 사용할 수 있다.

```java
public class Momin {
  private Moomin moomin;

  ...
}
```

위와 같이 사용하게 되면 메서드를 호출하여 동작하기 때문에 캡슐화를 깨뜨리지 않는다. 그리고 기존 클래스가 변화되더라도 그 영향은 적어 비교적 안전하다. 조합 방식 같은 경우 Moomin의 인스턴스 변수 타입이 변경되더라도 메서드로 호출하기 때문에 영향을 받지 않게 된다.

그렇기 때문에 웬만하면 유연하지 않은 상속보단 조합을 사용하도록 하자. 그러면 상속은 언제 사용해야 될까? 상속이 적절하게 사용되려면 다음과 같은 조건을 만족해야 한다.

1. 부모와 자식 클래스가 is-a 관계인 경우
    - 자식 클래스는 부모 클래스라고 할 수 있을 때
    - ex) cat은 Animal이다.
2. 행동 호환성이 만족하는 경우
    - 행동 호환성: 클라이언트 입장에서 부모 클래스와 자식 클래스의 차이를 몰라야 된다.
    - 부모 클래스를 새로운 자식 클래스로 대체하더라도 시스템이 문제없이 동작할 것이라는 것을 보장

```java
//펭귄과 새의 관계가 있을 때 일반적으로 새는 날 수 있지만 펭귄은 날 수 없다.
//하지만 다음과 같이 구현하게 되면 행동 호환성에 오류가 발생하게 된다.
//(클라이언트는 모든 새는 날 수 있다고 알지만 사실 펭귄은 못 날기 때문)
public class Bird {
  
  publi void fly(){
    ...
  }
}

//따라서 다음과 같이 클라이언트의 예상에 맞게 분리하게 되면 만족할 수 있다.
public class Bird {

}

public classs FlyginBird extends Bird {
  
  publi void fly() {
    ...
  }
}

public class Penguin extends Bird {

}
```

하지만 저 조건들을 만족하더라도 캡슐화를 깨뜨리기 때문에 상황에 맞게 쓰자!

그리고 [is-a와 has-a 차이점] 글도 한번 읽어보면 좋을 것 같다.
- is-a: A는 B이다, 한 클래스가 다른 클래스의 서브 클래스
  - 밀접하게 결합되므로 클래스 계층구조에서 좀 더 안정적인 기반을 마련
- has-a: ~에 속한다(belong), 한 오브젝트가 다른 오브젝트에 속한다.
  - 느슨하게 결합되므로 변경이 발생하더라도 구성 요소를 쉽게 변경할 수 있다(유연성 제공)

[is-a와 has-a 차이점]:https://minusi.tistory.com/entry/%EA%B0%9D%EC%B2%B4-%EC%A7%80%ED%96%A5%EC%A0%81-%EA%B4%80%EC%A0%90%EC%97%90%EC%84%9C%EC%9D%98-has-a%EC%99%80-is-a-%EC%B0%A8%EC%9D%B4%EC%A0%90

## 캐싱

캐싱이라는 걸 알고 있었지만 지금까지 적용해 본 적은 없었는데 이번 블랙잭 미션에서 적용해 보게 되었다. 이번 블랙잭에서는 게임을 플레이하기 위한 Deck(카드 52장)이 존재한다. 지금 구조에서는 Deck을 생성할 때마다 매번 52장의 카드들이 생성되고 있기 때문에 미리 생성 해놓고 재사용함으로 써 자원 낭비를 줄여볼 수 있다!

```java
public class Deck {

  private static final List<Card> CACHE;

  static {
    final Pattern[] values = Pattern.values();

    List<Card> cards = new ArrayList<>();
    for (Pattern pattern : values) {
        addAllCardByPattern(cards, pattern);
    }
    CACHE = cards;
  }
}
```

## 좋은 설계를 위한 책임, 역할, 협력

최근에 미션들을 진행하다 각 객체의 적절한 역할들에 대해 고민해 볼 생각이 많았고 그때 읽고 있던 오브젝트에 관련 좋은 내용이 있기에 혼자 보기 아까워 한번 정리해봤다. 오브젝트 이 놈... 진짜 맛있다. 꼭 읽어보길 강추!
- [좋은 설계를 위한 책임, 역할, 협력](https://parkmuhyeun.github.io/woowacourse/2023-03-12-RRC/)


## 그 외 피드백

### 테스트 코드 더 명확히 하기

```java
@Test
void testDealerBurstResult() {
  //given
  Participant dealer = new Dealer();
  dealer.hit(createStandCard(Pattern.CLUB, "10"));
  dealer.hit(createStandCard(Pattern.CLUB, "4"));
  dealer.hit(createStandCard(Pattern.CLUB, "9"));
  Players players = createPlayers();

  //when
  List<Result> result = referee.judgeResult(dealer, players);

  //then
  Assertions.assertThat(result)
      .isEqualTo(List.of(Result.WIN, Result.WIN, Result.WIN, Result.LOSE));
}
```

현재 위의 테스트는 딜러가 버스트가 된 경우 Result가 어떻게 되는지 테스트해 보려고 하는데 각 플레이어의 상태가 어떤지 드러나지 않기 때문에 무엇을 테스트하려는지 애매모호하다. 다음과 같이 given 부분을 좀 더 명확하게 바꿔주어 가독성을 높여줄 수 있다.

![](/assets//img/blog/woowacourse/bla_3.PNG)

## 마지막 줄 개행

다음과 같은 피드백이 왔다. 마지막 줄에 개행이 없으면 No newline at end of life라는 경고문이 뜬다. 이것은 [POSIX]의 명세로 줄 바꿈이 하나의 행을 정의하여 파일 끝에 newline 문자가 없으면 끝나지 않은 행으로 여긴다. 특히, 마지막에 개행이 없다면 파일 간 차이를 알기 어렵고 줄 바꿈이 없으면 파일을 올바르게 처리하지 못하는 프로그램도 있다. 그래서 github에서 사전에 방지하기 위해 경고를 띄워준다!

![](/assets//img/blog/woowacourse/bla_4.PNG)

[POSIX]:https://ko.wikipedia.org/wiki/POSIX

## 비슷한 메서드도 모두 테스트?

애송이: 클래스가 분리되어 있다 보니깐 player가 bet을 하는 과정에서 Player -> Players -> BlackjackGame -> BlackjackController로 계속해서 bet을 호출하는 과정이 일어나는데 여기서 모든 bet 메소드를 테스트 할 필요가 있는가 고민이 듭니다. 

애송이: 이렇게 호출만 하는과정에서는 오히려 테스트를 모두 하게되면 제일 아래 하나를 고치면 모두 고쳐야되는 비용이 추가 되기 때문에 하지 않아도 된다고 생각하는데 또링은 어떻게 생각하는지 궁금합니다!!

리뷰어: 좋은 고민이네요. 이번 미션은 아래와 같은 요구사항이 있었는데요, 요구사항을 지키기 위해서는 모두 작성했어야 하지 않을까요~?

모든 기능을 TDD로 구현해 단위 테스트가 존재해야 한다. 단, UI(System.out, System.in) 로직은 제외

리뷰어: TDD외 관점에서도 궁금하실 것 같아 추가로 의견 남겨드리자면, 저는 모두 테스트하는게 맞다고 생각해요. 제일 아래 하나를 고치면 모두 고쳐야되는 비용이 추가 된다고 하셨는데요, 아무래도 테스트의 목적이 프로그램이 잘 돌아가는지 검증하는 것이기 때문에, 하나의 메서드가 변경되면 관련 로직에서도 테스트를 변경해주어야 하는것이 당연하다고 생각해요. (메서드의 구현 방법이 바껴서 테스트가 깨지는 것과는 다른 이야기입니다! 요런 경우는 생기지 않도록 최대한 지양해야겠죠.)

## 디미터 법칙은 어디까지..?

```java
public List<Integer> getAmounts() {
      return players.stream()
              .map(player -> player.getAmount().getValue())
              .collect(Collectors.toList());
  }
```

애송이: 코드를 짜다보니깐 계속해서 디미터 법칙이 거슬리게 되는거 같은데.. 디미터 법칙을 위반하게 되면 캡슐화를 위반하게 되고 객체를 객체스럽게 사용하지 못하기 때문에 좋지 않은것은 납득이 되었습니다!

애송이: 하지만 실제 사용이 필요한 출력부분이나 또는 이번에 수익을 계산하기 위해 배팅금액을 사용하기 위해선 내부까지 접근을 해야되기 때문에 위반하게 되었는데 이러한 때는 예외적으로 허용할 수 있는 부분일까요..? 뭔가 기준이 정립되지 않고 계속 혼돈이 와 또링의 의견이 궁금합니다!

리뷰어: 예외상황에 대한 기준은 무민이 미션을 수행해나가면서 세워보시면 좋겠습니다. 다만, 개인적으로는 이런 경우도 Players는 Player의 Amount가 Value로 구성되어있다는 사실은 몰라도 되기 때문에 getAmountValue()정도로 감쌀 수 있겠네요.
(+ 사실 저는 List<Amount> 를 넘겨줄 것 같긴 합니다. 금액에 대해 원시값으로 돌아다니는 것은 금액을 Amount라는 객체로 감싼 이점을 포기하는 것과 같아서요.)

---

+리뷰어님께 받은 코드 리뷰에 대해 관심이 있으면 다음 PR들을 참고!
- [1단계 - 블랙잭 게임 실행](https://github.com/woowacourse/java-blackjack/pull/473)
- [2단계 - 블랙잭(베팅)](https://github.com/woowacourse/java-blackjack/pull/529)

---

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.