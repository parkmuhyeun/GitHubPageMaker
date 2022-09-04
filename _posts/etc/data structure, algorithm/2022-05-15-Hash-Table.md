---
layout: post
title: 해시 테이블(Hash Table)
subtitle: 부제목 예시
tags: Hash-table resolve-conflict
description: >
  해시 테이블, 충돌해결
sitemap: true
hide_last_modified: true
categories:
  - etc
  - data structure, algorithm
---

## Hash Table

![](/assets//img/blog/etc/data%20structure%26algorithm/ht_1.PNG)

Hash는 내부적으로 배열을 사용하여 저장하는 Key와 Value로 이루어진 자료구조이다. 
- Key는 고유한 값인데 길이가 다양하기 때문에 그대로 저장하면 다양한 길이만큼 저장소 구성이 필요하다. 그래서 hash function을 이용해 Hash로 변경 후 저장한다.
- Hash Function은 Key를 Hash로 바꿔주는 역활을 하는데 해시 충돌(서로 다른 Key가 같은 Hash가 되는 경우)이 발생할 확률을 최대한 줄이는 함수를 만드는 것이 중요하다.
- Hash는 hash function의 결과로 저장소에서 Value와 매칭되어 저장된다.
- Value는 저장소에 최종적으로 저장되는 값으로 키와 매칭되어 저장, 삭제, 접근, 검색이 가능하다.

## Hash Function
그렇다면 좋은 hash function이란 무엇일까? hash function을 무조건 1:1로 만드는 것보다 충돌을 최소화하는 방향으로 설계하고 발생하는 충돌에 대비해 어떻게 대응할 것인가 가 더 중요하다. 1:1 대응이 되도록하는건 array와 다를바가 없고 메모리낭비가 심하다. 충돌이 많아질 수록 탐색에 필요한 시간이 O(1)에서 O(n)에 가까워진다. 그러므로 좋은 hash function을 선택하는 것은 중요하다.

## Resolve Conflict

### 1. Open Addressing

해시 충돌이 발생하면 다른 해시 버킷에 해당 자료를 삽입하는 방식이다. 공개 주소 방식이라고도 불리는 이 알고리즘은 충돌이 발생하면 데이터를 저장할 장소를 찾는다. 최악의 경우 비어있는 버킷을 찾지 못하고 탐색을 시작한 위치까지 되돌아 올 수 있다. 이 과정에서도 여러 방법들이 있다.
- Linear probing: 순차적으로 탐색하여 비어있는 버킷을 찾을 때까지 진행
- Quadratic probing: 2차 함수를 이용해 탐색할 위치를 찾는다.
- Double hasing probing: 첫번째 해시 함수에서 충돌이 발생하면 2차 해시 함수를 이용해 새로운 주소를 할당.

### 2. Separate Chaining
일반적으로 Open Addressing의 경우 채운 밀도가 높아질수록 Worst Case 발생 빈도가 더 높아지기 때문에 Separate Chaining 보다 느리다. 반면 Seperate Chaining의 경우 해시 충돌이 잘 발생하지 않도록 보조 해시 함수를 통해 조정할 수 있다면 Worst Case에 가까워 지는 빈도를 줄일 수 있다. Java 7 에서는 Separate Chaining을 사용하여 HashMap을 구현했다. 데이터의 개수에 따라 두 가지 구현 방식이 존재한다.
- 연결 리스트를 사용하는 방식 (Linked List)
  - 각각의 버킷들을 연결리스트로 만들어 충돌이 발생하면 해당 bucket의 list에 추가
  - 데이터의 개수가 6개 이하일 때 사용
- Tree를 사용하는 방식 (Red-Black-Tree)
  - 연결리스트 대신 트리를 사용하는 방식.
  - 데이터의 개수가 8개 이상일 때 사용
  - 트리는 기본적으로 메모리 사용량이 많기 때문에 데이터 개수가 적을 때는 링크드 리스트나 트리와의 성능 차이가 거의 없기 때문에 링크드 리스트를 사용한다.

### Open Addressing vs Separate Chaining
일단 두 방식 모두 Worst Case가 O(M)으로 같다. 하지만 Open Addressing은 연속된 공간에 저장하기 때문에 Separate Chaining에 비해 캐시 효율이 높다. 따라서 데이터의 개수가 적다면 Open Addressing이 더 성능이 좋을 수 있다. 하지만 배열의 크기가 커질수록 캐시 효율이라는 Open Addressing의 장점은 사라진다. 또한 Operate Addressing의 경우 버킷을 계속해서 사용하기 때문에 Seperate Chaining 방식이 테이블의 확장을 더 늦출 수 있다.

### 3. Resizing (동적 확장)
해시 버킷의 개수가 적다면 메모리 사용을 아낄 수 있겟지만 해시 충돌로 인해 성능 상 손실이 발생한다. 그래서 저장 공간이 75%가 채워지면 저장 공간을 두 배로 늘린다.

## Hash Table 장점
- 적은 리소스로 많은 데이터를 효율적으로 관리 가능
  - ex) HDD, Cloud에 있는 많은 데이터를 Hash로 매핑하여 관리 가능
- O(1)의 빠른 검색, 삽입, 삭제
- key와 Hash 연관성이 없어 보안 유리
- 데이터 캐시 기능
- 중복 제거 유용

## Hash Table 단점
- 충돌 발생 가능성
- 해시 함수에 의존
- 순서 무시
- 공간 복잡도 증가

## Hash Table 시간복잡도

||평균|최악|
|:---:|:---:|:---:|
탐색|O(1)|O(N)|
삽입|O(1)|O(N)|
삭제|O(1)|O(N)|

---
참고:
[https://d2.naver.com/helloworld/831311](https://d2.naver.com/helloworld/831311)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.