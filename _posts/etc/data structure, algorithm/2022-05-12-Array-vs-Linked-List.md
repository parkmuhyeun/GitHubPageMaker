---
layout: post
title: Array vs Linked List
subtitle: 부제목 예시
tags: Array Linked-List
description: >
  배열과 링크 리스트 차이
sitemap: true
hide_last_modified: true
categories:
  - etc
  - data structure, algorithm
---

## Array

![](/assets//img/blog/etc/data%20structure%26algorithm/all_1.PNG)
- Array는 논리적 저장 순서와 물리적 저장 순서가 일치한다. 따라서 인덱스(index)로 해당 원소(element)에 접근할 수 있다. 그렇기 때문에 찾고자 하는 원소의 인덱스 값을 알고있으면 Big-O(1)에 해당 원소로 접근가능.
- 하지만 삭제 또는 삽입의 과정에서는 해당 원소에 접근하여 삭제 또는 삽입을 완료한 뒤(O(1)) 추가적인 작업(O(n))이 필요하다.
- 배열에서 어느 원소를 삭제한다고 했을 때 그 원소보다 큰 인덱스를 갖는 원소들을 왼쪽으로 옮겨줘야 되고 그 시간 복잡도가 O(n)이 된다.
- 삽입의 경우도 어느 원소를 추가하고자 한다면 추가하려는 곳의 인덱스 보다 큰 인덱스를 갖는 원소들을 오른쪽으로 옮겨줘야 되기 때문에 O(n)의 시간이 걸린다.

## Linked List

![](/assets//img/blog/etc/data%20structure%26algorithm/all_2.PNG)
- 각각의 원소들은 자기 자신 다음에 어떤 원소인지만을 기억하고 있다. 따라서 이 부분만 다른 값으로 바꿔주면 삭제와 삽입을 O(1)에 해결할 수 있다.
- 하지만 Linked List도 원하는 위치에 삽입을 하거나 삭제를 하고자 하면 Search 과정이 필요하기 때문에 결국 O(n)이 걸린다.

---
*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.