---
layout: post
title: Java - List, Set, Map
subtitle: 부제목 예시
tags: java list set map
description: >
 What's on the list, map, and set?
sitemap: true
hide_last_modified: true
categories:
  - etc
  - java
---

>Java의 List, Set, Map에 대해 알아보자

![](/assets//img/blog/etc/java/lms_1.png)

## List
List 같은 경우 데이터를 순차적으로 저장하는데 데이터의 중복과 null을 허용한다.

### ArrayList
단방향 포인트 구조로 각 데이터에 대한 인덱스를 가지고 있어 데이터 검색에 적합하다. 하지만 삽입, 삭제 시 해당 데이터 이후 모든 데이터가 복사되므로 삽입, 삭제가 빈번한 데이터에는 부적합

### LinkedList
양방향 포인터 구조로 데이터의 삽입, 삭제 시 해당 노드의 주소지만 바꾸면 되므로 삽입, 삭제가 빈번한 데이터에 적합. 하지만 데이터 검색시 처음부터 노드를 순회하므로 검색에 부적합.

### Vector
ArrayList와 동일한 구조로, 내부에서 자동으로 동기화를 지원해줘서 병렬 처리에 안전하지만, 느리고 무거워서 잘 사용하지 않는다.

## Set
Set 같은 경우 순서없이 Key로만 데이터를 저장하는데 Key의 중복을 허용하지 않는다.

### HashSet
저장 순서를 유지하지 않는 데이터의 집합으로 해시 알고리즘을 이용해 검색 속도가 매우 빠르다.

### LinkedHashSet
링크 리스트를 사용하며 저장 순서를 유지하는 HashSet

### TreeSet
데이터가 정렬된 집합으로 Red Black Tree로 구현이 되어있고 Comparator를 이용해 정렬 방법 지정 가능

## Map
Map 같은 경우 순서없이 Key, Value로 데이터를 저장하는데 Value는 중복을 허용하지만 Key의 중복을 허용하지 않음.

### HashMap
Key와 Value로 데이터를 저장하는데 저장 순서를 유지하지않고 배열의 index는 내부 해쉬 함수를 통해 계산한다. HashMap같은 경우 동기화를 보장하지 않기 때문에 검색하는 속도가 빠르지만 신뢰성과 안정성이 떨어짐.

### LinkedHashMap 
링크리스트를 이용하며 저장 순서를 유지하는 HashMap

### TreeMap
키값이 기본적으로 오름차순 정렬되어 저장되고 레드 블랙 트리로 구현된다. 키값에 대한 정렬방법을 Comparator로 지정가능

### HashTable 
동기화를 보장하기 떄문에 멀티 쓰레드 환경에서 사용가능하다. 하지만 모든 메서드에서 동기화 락을 걸기 때문에 매우 느림.

### ConCurrentHashMap
ConCurrentHashMap 같은 경우도 동기화를 보장해서 멀티 쓰레드 환경에서 사용가능한데 HashTable의 단점을 보완하기 위해서 나옴. 어떤 Entry를 조작하는 경우에만 락을 걸기 때문에 HashTable보다 데이터를 다루는 속도가 빠르다.

---

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.