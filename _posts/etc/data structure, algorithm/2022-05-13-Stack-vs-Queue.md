---
layout: post
title: Stack vs Queue
subtitle: 부제목 예시
tags: Stack Queue
description: >
  스택과 큐, 스택으로 큐 만들기, 큐로 스택 만들기
sitemap: true
hide_last_modified: true
categories:
  - etc
  - data structure, algorithm
---

## Stack

![](/assets//img/blog/etc/data%20structure%26algorithm/sq_1.PNG)

선형 자료구조의 일종으로 가장 늦게 들어간 원소가 가장 먼저 나온다. 하나씩 차곡차곡 쌓이는 구조로 먼저 Stack에 들어간 원소는 바닥에 깔리게 되고 늦게 들어간 원소는 그 위에 쌓이게 되어 호출 시 가장 위에 있는 원소가 호출되는 구조이다. Last In First Out (LIFO)

## Queue

![](/assets//img/blog/etc/data%20structure%26algorithm/sq_2.PNG)

선형 자료구조의 일종으로 먼저 들어간 원소가 가장 먼저 나온다. Stack 과는 반대로 먼저 들어간 원소가 맨 앞에서 대기하고 있다가 먼저 나오는 구조이다. First In First Out (FIFO)

## 2개의 스택을 이용해서 큐 만들기

![](/assets//img/blog/etc/data%20structure%26algorithm/sq_3.png)

1. inbox에 데이터들을 삽입한다. - 1, 2, 3, 4
2. inbox에 있는 데이터들을 pop(추출)하여 outBox에 push(삽입)한다. - 4, 3, 2, 1
3. outBox에 있는 데이터를 pop(추출)한다. - 1, 2, 3, 4 순으로 출력

## 2개의 큐를 이용해서 스택 만들기

2 삽입, main queue - 1, sub queue - 
![](/assets//img/blog/etc/data%20structure%26algorithm/sq_4.png)
1. 데이터가 삽입될 때 main queue에 데이터들을 sub queue로 그대로 옮겨준다.
    - main queue - 2, sub queue - 1
    ![](/assets//img/blog/etc/data%20structure%26algorithm/sq_5.png)
2. 데이터를 삽입한 후 다시 sub queue에 있던 데이터를 main queue로 옮겨준다.
    - main queue - 2 1, sub queue - 
    ![](/assets//img/blog/etc/data%20structure%26algorithm/sq_6.png)
3. main queue에 있는 데이터를 추출한다.
    - 2 1 순으로 출력 

---
*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.