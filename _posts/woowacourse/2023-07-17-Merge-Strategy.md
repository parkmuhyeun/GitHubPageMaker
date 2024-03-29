---
layout: post
title: 이게 머지? 브랜치 Merge 전략 방법
subtitle: 부제목 예시
tags: woowacourse merge-strategy
description: >
  How to Strategy Branch Merge
sitemap: true
hide_last_modified: true
categories:
  - woowacourse
---

이번에 집사의고민 팀에서 브랜치를 정하고 **어떻게 병합**할지에 대해 얘기가 나왔다. 스쿼시 어쩌구저쩌구 리베이스 어쩌구저쩌구... 이런 용어가 나오길래 아 아직도 깃허브에 대해 모르는 게 많구나 다시 한번 느끼고 **Merge 전략**에 대해 정리하고 가고자 한다.

---

## Merge 전략

### Merge Commit

Merge Commit은 일반적인 브랜치 병합 전략으로 **두 개의 브랜치를 병합할 때 새로운 커밋을 생성**한다. 그림으로 보면 다음과 같다.

![](/assets/img/blog/woowacourse/ms_1.png)

- Merge 된 커밋(#4)으로부터 뒤로 돌아가면서 부모를 모두 찾아 브랜치를 구성
- #4는 부모로 #3와 main을 가짐
- #3은 #2를, #2는 #1을, #1은 main을 부모로 가져
- main -> #1 -> #2 -> #3 -> #4의 구조가 히스토리로 남게 됨

Merge Commit은 불필요한 commit message가 생기고 merge 순서와 commit 순서가 별도로 기록되어 history 관리가 어렵다는 단점이 있으나 머지 기록을 남긴다는 게 오히려 어떤 관리 포인트가(ex) n차 스프린트) 될 수도 있지 않을까 한다.

### Squash and Merge

Squash and Merge 전략은 **여러 개의 커밋을 하나로 압축하여 병합**하는 전략으로 브랜치의 모든 커밋이 단일 커밋으로 압축되어 기존 브랜치에 병합된다. 그림으로 보면 다음과 같다.

![](/assets/img/blog/woowacourse/ms_2.png)

- 커밋 #1, #2, #3는 main을 부모로 가진 단일 커밋
- 병합 후 작업한 브랜치의 커밋들은 메인 브랜치와 연관을 가지지 않는다.

main에선 기능별로 합쳐진 깔끔한 history를 가져 히스토리 관리는 쉬우나 rollback이 어렵다는 단점이 있다.

### Rebase and Merge

Rebase and Merge는 **현재 브랜치의 변경 내용을 다른 브랜치의 최신 상태에 병합하는 전략**으로 Merge Commit과 달리 새로운 커밋을 생성하지 않는다. 그림으로 보면 다음과 같다.

![](/assets/img/blog/woowacourse/ms_3.png)

- Base를 main의 최신 커밋(#5, New Base)으로 다시 설정
- 커밋 a, b, c의 관계를 그대로 유지한 채 메인 브랜치에 그대로 추가

Commit 순서가 아닌 Merge 순서대로 기록되어 다른 PR의 커밋 메시지와 섞이지 않아 rollback이 용이하며 commit 단위의 히스토리가 남겨지게 된다. 하지만, rebase에 익숙하지 않은 경우 어려움이 발생할 수 있다.

## 그래서 어떤 방식을 선택?

우선 우리팀은 main, develop, feature, hotfix 브랜치가 있는데 다음과 같은 병합 전략을 선택하기로 했다.

### feature -> develop
- **Squash and Merge** 방식
- 지저분한 커밋 내역을 하나의 커밋으로 묶어어 develop으로 병합하면서 기능 단위로 커밋

### develop -> main
- 롤백할일이 생길 수도 있으니 Squash and Merge 방식은 제외
- **기본적으로 Merge Commit** 방식
  - 매번 스프린트마다 완성되면 main으로 머지해 배포할 계획이니 **N차 스프린트 기록**을 남기기 위해 Merge commit
- 일반적으로 넣는 경우 말고 추가적으로 넣어야 될 때 따로 기록할 필요 없으니 Rebase and Merge 방식

---
참고:
- [https://meetup.nhncloud.com/posts/122](https://meetup.nhncloud.com/posts/122)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.