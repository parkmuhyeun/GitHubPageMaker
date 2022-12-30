---
layout: post
title: 우테코 5기 최종 코딩 테스트 회고
subtitle: 부제목 예시
tags: final-test woowacourse
description: >
  우테코 5기 최종 코딩 테스트 회고
sitemap: true
hide_last_modified: true
categories:
  - woowacourse
---

## 🙌 1차 합격

![](/assets//img/blog/woowacourse/ft_1.png)

지난 한 달간 프리코스에서 정말 좋은 경험을 하며 많은 성장을 했었는데 정말 감사하게도 최종 코딩 테스트 대상자로도 선발되었다!! 🙇🙇🙇 선발 과정은 프리코스에서 진행한 미션의 결과와 미션에 대한 소감문, 지원서에 작성한 내용을 바탕으로 선발했다고 한다.

12월 14일에 오후에 결과가 나왔는데 결과를 보기 전 덜덜 떨었다..😱 그래서 메일을 열고 내용을 볼 때 무서워서 메모장으로 가리고 천천히 내렸던 기억이 난다 ㅋㅋㅋㅋ ~~(예전에 게임에서 카드깡이나 강화 같은 거 할 때 해보셨나요? ㅋㅋㅋㅋㅋ)~~

![](/assets//img/blog/woowacourse/ft_2.png)

## 📃 최종 테스트 준비

12월 17일 토요일에 우테코 5기 선발 과정의 최종 테스트가 예정되어 있었다. 1차 결과가 나오기 전에 연습 삼아 이전 기수의 최종 코테 문제를 풀어봤었는데 5시간 안에 풀기에는 어림도 없었다. 그래서 남은 3일간 이 시간 안에 풀기 위해 문제들을 최적화할 방법을 분석하기 시작했다.

### 1. 핵심 과정 분석

먼저 문제를 푸는데 내가 어떤 과정으로 풀어야 할지 나에게 맞는 방법으로 정형화하기로 했다. 그렇게 아래와 같은 방법을 찾아내게 되었고 이 방법을 몸에 체득화 시키려고 반복했다.

>routine
>1. 전체적으로 간단히 읽기
>2. Flow chart 작성
>3. 기능 목록 작성(상세히 읽으며)
>4. 주어진 테스트 코드 확인
>5. 순서대로 코드 구현

그리고 구현 과정 중에 시간이 어디서 가장 많이 잡아먹히는지 확인한 결과 당연히 주요 기능들쪽이였다. 이 주요 기능을 코드로 구현하기 전에 미리 설계를 잘해놔야 구현할 때 시간이 많이 단축되었다.

그래서 주요 기능을 구현하기 전에는 미리 어떤 로직 순서로 이루어지는지 고려할 조건은 무엇이 있는지 상세하게 설계한 후에 구현하려 했다. 이렇게 한 결과 설계와 구현을 따로 분리하여 구현 과정 중 중간중간 머리가 꼬이는 걸 방지할 수 있었으며 그 결과 시간을 많이 단축할 수 있었다.

### 2. 부가적인 부분 분석
그리고 15일, 16일에 최종 코딩 테스트 환경처럼 미리 연습을 해보며 추가적으로 시간을 더 단축할 수 있는 곳을 찾아보게 되었다.

1. 초기 세팅: 이 부분은 혹시 시험 때 긴장해서 실수할까 봐도 적어놨다.
  ![](/assets//img/blog/woowacourse/ft_3.png)
    - 특히 4번 부분이 정말 중요한 것 같다. 5시간 안에 빠르게  구현하려면 값들을 확인할 때 디버깅 기능을 많이 사용하는데 테스트해 본 결과 기본 설정인 gradle로 진행하게 되면 매 디버깅마다 20초 정도 기다려야 되지만 intellij IDEA로 했을 때 3초 만에 가능했기 때문에 이것이 쌓이고 쌓이면 엄청 크게 작용할 것이라 생각했다.
2. 구현 기능 목록 포맷: 미리 구현 기능을 작성할 때 Format을 준비해놨다.
  ![](/assets//img/blog/woowacourse/ft_4.png)
3. 문제 제출: 제일 중요한 제출 부분때 실수할까 적어놓음
  ![](/assets//img/blog/woowacourse/ft_5.png)
4. 자주 사용할 수 있는 코드 준비
    - Try Catch
      ```java
      private String input() {
          try {
              String input = inputView.input();
              validator.validateInput(input);
              return input;
          } catch (IllegalArgumentException exception) {
              System.out.println(exception.getMessage());
              return input();
          }
      }
      ```
    - 정규식
    
        ![](/assets//img/blog/woowacourse/ft_6.png)
    - Test
      ```java
      //에러 테스트 양식(assertThatThrownBy)
      assertThatThrownBy(() -> 테스트할 메소드())
          .isInstanceOf(IllegalArgumentException.class)
          .hasMessage(에러 메시지);
      ```
      ```java
      //파마리터 여러개 테스트 양식
      @ParameterizedTest
      @ValueSource(strings = {"", "123"})
      @DisplayName("다리 길이 입력 크기가 1보다 작거나 2보다 큰 경우 예외 처리")
      void validateBridgeLength(String input) {
          assertThatThrownBy(() -> validator.validateBridgeSize(input))
                  .isInstanceOf(IllegalArgumentException.class)
                  .hasMessage(ErrorMessage.INCORRECT_BRIDGE_SIZE);
      }
      ```
5. branch 실수 했을 경우 대비(git cherrypick 과정)

    ```
    1. git checkout ${hashcode}
      a. 돌아가고 싶은 커밋(해시코드)으로 checkout (ex. git checkout 6aa2570)
    2. git checkout -b parkmuhyeun
      a. 만들고 싶은 branch 생성
    3. git cherry-pick ed0eb3c^..a3638de
      a. A^..B (A에서 B까지 commit 복사)
    4. git push
    ```

## 👨‍💻 최종 테스트 진행

![](/assets//img/blog/woowacourse/ft_7.PNG)

아무래도 제한 시간 5시간 안에 구현하다 보니깐 당일날 시험을 치기 전까지도 코드 퀄리티는 어떻게 챙겨야 할까, 내가 준비한 방법이 맞을까 등 고민이 많았었는데 위 메일을 받고 조금 걱정을 덜고 시험을 맞이할 수 있었다. 정말 배려 깊은 우테코 ㅠㅠ

5시간이라는 급박한 시간제한을 제일 걱정했기 때문에 이번에 최종 테스트를 위해 연습할 때는 돌아가는 프로그램을 먼저 만들고 퀄리티는 그 뒤에 신경을 써보자로 목표를 잡았다.

전략을 잘 준비한 효과인지..!! 최종 코딩 테스트를 치를 때 실수나 큰 에러 없이 적절한 시간 안에 첫 번째 목표인 돌아가는 프로그램에 도달했다. 물론, 이번 최종 테스트 문제가 이전 기수들의 최종 테스트보다 좀 더 구현할 것이 적었기 때문에 그럴 수도 있겠지만 어쨌든 너무 기뻤다.

일단 돌아가는 프로그램을 만들었기 때문에 여기서 퀄리티를 어떻게 높일까 고민했다. 모든 걸 다 챙기면 좋겠지만 시간제한 때문에 그럴 수 없기 때문에 선택해야 됐고 아키텍처를 좀 더 분리해서 더 깔끔한 설계를 할까 아니면 클린 코드와 테스트 등을 챙기고 요구사항들을 다시 볼까 고민했다.

결국 후자를 선택했는데 전자 같은 경우는 얼마나 걸릴지도 모르고 혹시 고쳤다가 백업해야 되는 상황이 올 수도 있었기 때문에 후자를 선택해 적용했다. 그렇게 놓친 에러 처리, 테스트, 상수 분리, 메소드 분리, 문서 추가 처리 등을 추가적으로 적용하며 마무리했다.

최종 제출 코드
- [https://github.com/parkmuhyeun/java-menu/tree/parkmuhyeun](https://github.com/parkmuhyeun/java-menu/tree/parkmuhyeun)

[![thumbnail](/assets//img/blog/woowacourse/ft_8.PNG)](https://github.com/parkmuhyeun/java-menu/tree/parkmuhyeun)


## 🎤 최종 테스트 후기

역시 인간의 욕심은 끝이 없다고 했는가.. ㅜㅜ 끝나고 나니 이건 왜 이렇게 안 나눴고 저건 왜 이렇게 짰었지 하면서 마음에 걸리는 게 상당히 많았다. 아마 빠른 구현에 초점을 맞춘 방식의 폐해인 것 같다. 하지만 그 5시간 동안 나의 모든 걸 쏟아붓고 나왔기 때문에 정말 후련했었고 후회없이 집에 갔던 기억이 난다.

코드를 제출할 때 소감도 적는 곳이 있는데 그때 막상 소감을 적으려고 하니깐 앞선 시간 동안 모든 집중력을 다 쏟아낸 탓인지 머릿속에 어떤 문장도 생각나지 않았다..ㅋㅋㅋㅋ 머리에 과부하가 걸린 건가.. 그래서 일단 그동안 너무 감사했었기에 감사 인사 정도만 적고 제출했다.

이제 진짜로 우테코의 모든 선발 과정이 끝이 났다.. 지난 한 달 동안 정말 바빴지만 행복한 날들이었다. 짧은 기간이었지만 많은 고민들을 해볼 수 있었으며 많은 성장을 할 수 있었고 앞으로의 방향성도 생각해 볼 수 있었다. 한 달인데도 이런 값진 경험을 했는데 이 과정을 10개월간 지속적으로 한다면 과연 어떤 느낌일까? 생각만 해도 행복사할지도..ㅋㅋ 

결과가 어찌 됐든 이 한 달간 최선을 다하여 임하였고 그 과정 속에서 너무나 값진 것들을 많이 얻었기 때문에 후에 지원을 고민을 하시는 분이 있다면 꼭 추천드립니다. 감사했습니다!

![](/assets//img/blog/woowacourse/ft_9.jpg)

---

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.