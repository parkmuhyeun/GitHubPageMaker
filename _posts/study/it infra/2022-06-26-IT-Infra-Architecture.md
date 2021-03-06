---
layout: post
title: 인프라 아키텍처(Infra Architecture)
subtitle: 부제목 예시
tags: infra architecture
description: >
  인프라 아키텍처를 알아보자
sitemap: true
hide_last_modified: true
categories:
  - study
  - it infra
---

## 인프라(Infra)란?
인프라는 우리말로 하면 '기반'이란 뜻으로, 우리 생활을 지탱하는 바탕이나 토대라는 의미다. IT 인프라도 마찬가지로 IT의 기반이 되는 것으로 우리 생활을 지탱하고 있다. 예를 들어 인터넷 검색 엔진에서 검색을 하면 많은 검색 결과를 얻을 수 있다. 이런 방대한 데이터는 어떻게 관리될까? 이것을 지탱하고 있는 것이 IT 인프라다. 그러면 인프라 아키텍처는 무엇일까? IT 인프라의 구조를 의미한다.

우선 아키텍처에는 어떤 방식이 있는지 간단하게 그림으로 한번 보자. 자세한건 뒤로가며 설명한다.

![](/assets//img/blog/study/it-infra/iia_1.PNG)

## 궁극의 아키텍처는 존재할까?
결론부터 말하자면 없다. 각 아키텍처 설계 요소에는 반드시 장점과 단점이 공존하기 때문에 자기 상황에 맞게 설계하는것이 중요하다. 즉, 시스템의 가장 중요한 장점은 살리고 단점을 최소화하도록 설계하는 것이 중요

## 집약형과 분할형 아키텍처
IT 인프라는 컴퓨터로 구성되는데 기본적인 구성 방식에는 '집약형'과 분할형'이 존재한다.

### 집약형 아키텍처
하나의 대형 컴퓨터를 이용해서 모든 업무를 처리하는 형태. 컴퓨터를 구성하는 주요 부품은 모두 다중화돼 있어서 하나가 고장 나더라도 업무를 계속할 수 있음. 또한, 복수의 서로 다른 업무 처리를 동시에 실행할 수 있도록 유한 리소스 관리도 함.

![](/assets//img/blog/study/it-infra/iia_2.jpg)

장점
- 구성이 간단
- 리소스 관리나 이중화에 의해 안정성이 높고 고성능

단점
- 도입 비용과 유지 비용이 비쌈
- 확장성의 한계

### 분할형 아키텍처
여러 대의 컴퓨터를 조합해서 하나의 시스템을 구축하는 구조. 분할형 아키텍처는 표준 OS나 개발 언어를 이용하기 때문에 '오픈 시스템'이라고도 부르고 여러 대의 컴퓨터를 연결해서 이용하기 떄문에 '분산 시스템'이라 부르는 경우도 있다.

![](/assets//img/blog/study/it-infra/iia_3.PNG)

장점
- 낮은 비용으로 시스템 구축 가능
- 확장성이 높다.

단점
- 관리 구조가 복잡
- 한 대가 망가지면 영향 범위를 최소화하기 위한 구조 검토 필요

## 수직 분할형 아키텍처
분할형에는 서버의 역활 분담을 고려해야 하는데 각각의 서버가 다른 역활을 하는지 아니면 비슷한 작업을하는지에 대한 관점이다. 수직 분할형은 서버별로 다른 역활을 담당하는 관점의 분할이다.

*수직형이라고 표현하는 것은, 특정 서버 측면에서 봤을때 역활에 따라 '위' 또는 '아래' 계층으로 나뉘기 때문

### 클라이언트-서버형 아키텍처
클라이언트-서버형은 수직 분할형의 한 예로 서버에 클라이언트가 접속하는 형태

![](/assets//img/blog/study/it-infra/iia_4.jpg)

장점
- 클라이언트 측에서 많은 처리를 실행할 수 있어 소수의 서버로 다수의 클라이언트 처리 가능

단점
- 클라이언트 측의 소프트웨어 정기 업데이트가 필요하다.
- 확장성의 한계

### 3계층형 아키텍처
클라이언트-서버형 아키텍처의 단점을 개선하려고 한 것이 3계층형이다. 3계층형도 수직 분할형의 예로 '프레젠테이션 계층', '애플리케이션 계층', '데이터 계층'의 3층 구조로 분활돼있다.

![](/assets//img/blog/study/it-infra/iia_5.jpg)

우리가 주로 사용하고 있는 사이트의 대부분이 이 3계층 구조를 사용하고 있다.

장점
- 서버 부하 집중 개선
- 클라이언트 단말의 정기 업데이트 불필요

단점
- 구성이 복잡하다.

## 수평 분할형 아키텍처
더 높은 확장성을 실현하려면 다른 하나의 축으로 분할하는 것이 필요하다. '수평 분할형 아키텍처'는 용도가 같은 서버를 늘려나가는 방식. 서버 대수가 늘어나면 한 대가 시스템에 주는 영향력이 낮아져서 안정성이 향상된다. 그리고 전체적인 성능 향상도 가능하다. 수직 분할형과 수평 분할형은 독립적인 관계가 아니고 대부분의 시스템이 두 가지 방식을 함께 채택

### 단순 수평 분할형 아키텍처
같은 기능을 가진 복수의 시스템으로 단순 분할한다. 수평 분할을 샤딩(Sharding)이나 파티셔닝(Partitioning)이라 부르기도 함

![](/assets//img/blog/study/it-infra/iia_6.jpg)

장점
- 확장성이 향상
- 독립적으로 운영되므로 서로 영향을 주지 않음

단점
- 데이터를 동시에(일원화) 이용 불가
  - 데이터를 양쪽 따로 보유하고 있기 때문
- 업데이트 양쪽을 동시에 해 줘야 함
- 서버별 처리량에 치우침 발생 가능
  - 이용자 수가 한쪽에 대부분이 몰리는 경우

### 공유형 아키텍처
공유형에서는 단순 분할형과 달리 일부 계층에서 상호 접속이 이루어짐

![](/assets//img/blog/study/it-infra/iia_7.jpg)

장점
- 확장성이 향상
- 서로 다른 시스템의 데이터를 참조 가능

단점
- 독립성이 낮아짐
- 공유한 계층의 확장성이 낮아짐

## 지리 분할형 아키텍처
서버를 수직 또는 수평으로 분할한 아키텍처를 조합함으로 목적에 적합한 구성을 만들 수 있다. 업무 연속성 및 시스템 가용성을 높이기 위한 방식으로 지리적으로 분할하는 아키텍처

### 스탠바이형 아키텍처
물리 서버를 최소 두대 준비하여 한 대 고장나면 대기하고 있는 다른 한대로 옮겨 운영. 이 때 소프트웨어 재시작을 자동으로 하는 구조를 '페일오버(Failover)'라고 한다. 한쪽이 계속 놀고 있을 수 있기 때문에 양쪽 서버를 교차 이용하는 경우도 많다.

![](/assets//img/blog/study/it-infra/iia_8.jpg)

### 재해대책형 아키텍처
특정 데이터 사이트에 있는 상용 환경에 고장이 발생하면 다른 사이트에 있는 재해 대책 환경에서 업무 처리를 재개

![](/assets//img/blog/study/it-infra/iia_9.jpg)

---

참고: 그림으로 공부하는 IT 인프라 구조

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.