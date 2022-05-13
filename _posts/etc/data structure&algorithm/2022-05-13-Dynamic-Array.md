---
layout: post
title: Dynamic Array
subtitle: 부제목 예시
tags: Array Dynamic-Array
description: >
  동적 배열
sitemap: true
hide_last_modified: true
categories:
  - etc
  - data structure&algorithm
---

## 동적배열(Dynamic Array)

![](/assets//img/blog/etc/data%20structure%26algorithm/da_1.PNG)

동적 배열이란 크기가 고정되지 않은 배열을 의미한다. 우리가 평소에 말하는 배열은 크기가 고정된 정적배열이다. 미리 자신이 사용할 배열의 크기를 알면 제일 좋겠지만 알 수 없다. 크기를 너무 크게 잡으면 메모리가 낭비될테고, 그렇다고 크기를 작게 잡으면 매번 새로운 배열에 옮겨 담아야 하니 귀찮다. 이럴때 배열의 크기를 동적으로 늘려서 사용하고 싶을 때 필요하다. 예를들어 크기가 추가로 필요할때마다 resize()를 통해 기존배열의 2배 만큼 재할당 받는다.

## 시간복잡도

||배열|동적 배열|
|:---:|:---:|:---:|
검색|O(1)|O(1)|
삽입|O(N)|O(N)|
삭제|O(N)|O(N)|

---
*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.