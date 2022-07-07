---
layout: post
title: 어떤 깃 브랜치 전략을 사용해야 할까?
subtitle: 부제목 예시
tags: git-branch-strategy git-flow github-flow
description: >
  git branch strategy(깃 브랜치 전략)
sitemap: true
hide_last_modified: true
categories:
  - project
---

새로운 팀 프로젝트에 들어가기 앞서 협업을(물론 현재 백엔드는 혼자지만..) 더 효율적으로 하기위해 어느 깃 브랜치 전략을 사용할지 정하기위해 찾아봤는데 대표적으로 git flow와 github flow가 있었다. 둘 중에 자기 팀에게 맞는 전략을 택하면 되는데 일단 둘다 무엇인지 간단하게 알아보자.

(tmi: 이 글과는 관계가 없지만, 다른 팀 프로젝트에 지금 코드리뷰를 적용하고 있는데 조만간 적용과정과 후기를 적겠다.)

---

## 깃 브랜치 전략(git branch strategy)이란?
여러 개발자가 협업하는 환경에서 git 저장소를 효과적으로 활용하기 위한 work-flow. 즉, 브랜치 생성의 규칙을 만들어 협업을 원활하게 하는 방법이다.

## 브랜치 전략이 없다면?
어느 브랜치가 최신인지, 어느 브랜치가 내가 원하는 브랜치인지 알기 힘들다. 이런 상황을 최소화하기 위한 것이 바로 브랜치 전략이다.

## GIT FLOW

![](/assets//img/blog/project/gbs_1.PNG)

GIT-FLOW 전략은 5개의 브랜치를 이용하는 전략으로써 항상 유지되는 2개의 메인 브랜치와 역활을 완료하면 사라지는 3개의 보조 브랜치로 이루어진다.

- 메인 브랜치: 항상 유지
  - master: 제품으로 출시될 수 있는 브랜치
  - develop: 다음 출시 버전을 개발하는 브랜치
- 보조 브랜치: merge되면 사라짐
  - feature: 기능을 개발하는 브랜치
  - release: 출시 버전 준비 브랜치
  - hotfix: 긴급한 버그 수정 브랜치

### GIT-FLOW 개발 프로세스
1. 개발자는 develop 브랜치로부터 본인이 개발할 기능을 위한 feature 브랜치를 생성
2. 기능이 완성되면 develop 브랜치에 merge
3. develop 브랜치에 merge 후, QA를 위해 release 브랜치를 생성
4. release 브랜치에서 오류가 발생한다면 release 브랜치 내에서 수정한다. QA가 끝나면 해당 버전을 배포하기 위해 master 브랜치로 merge, bugfix가 있었다면 해당 내용을 반영하기 위해 develop 브랜치에도 merge
5. 만약 제품(master branch)에서 버그가 발생한다면, hotfix 브랜치를 만든다.
6. hotfix 브랜치에서 버그 픽스가 끝나면, develop과 master 브랜치에 각각 merge

GIT FLOW 과정에 대해 더 상세히 알고 싶다면 [https://www.youtube.com/watch?v=EzcF6RX8RrQ]

[https://www.youtube.com/watch?v=EzcF6RX8RrQ]:https://www.youtube.com/watch?v=EzcF6RX8RrQ

### GIT FLOW의 특징
- 주기적으로 배포를 하는 서비스에 적합
- 가장 유명한 전략인만큼 많은 IDE가 지원

## GITHUB FLOW

![](/assets//img/blog/project/gbs_2.PNG)

최신버전인 master 브랜치만 존재

### GITHUB FLOW 개발 프로세스
1. 기능 개발, 버그 픽스 등 branch 생성
2. 개발(커밋 메시지는 명확하게)
3. 개발 완료 후 pull request 생성
4. 충분한 리뷰와 토의
5. 리뷰가 끝나면 실제 서버(혹은 테스트환경)에 배포
6. 문제가 없다면 master에 merge 후 push 하고, 배포

### GITHUB FLOW의 특징
- 단순해서 처음 접하는 사람에게도 유용
- CI, CD가 자연스럽게 이루어짐

## 어떤 전략 사용?
- GIT FLOW: 한달 이상의 긴 호흡으로 개발하여 주기적으로 배포하고, QA 및 배포, hot fix 등을 수행할 수 있는 여력이 있는 팀이라면 GIT FLOW
- GITHUB FLOW: 항상 릴리즈되어야 할 필요가 있는 서비스와 지속적으로 테스트하고 배포하는 팀이라면 GITHUB FLOW 같은 간단한 workflow

---

어떤 깃 브랜치 전략을 쓸지 정말 고민을 많이 했다. 현재 백엔드는 혼자인 상황으로 간단하고 빠르게 GITHUB FLOW로 가져갈까 생각했으나 추후에 팀원이 늘어날걸 고려, 미리 GIT FLOW 경험, 주마다 배포할 계획으로 GIT FLOW를 선택하기로 생각했다. 하지만 기본적으로 GIT FLOW 모델을 유지하되 현재 상황에 맞게 변형해서 사용하기로 했다. 현재 상황은 혼자로 모든 브랜치를 운영하며 개발하기 힘들기 때문이다. 추후에 필요하면 더 추가하면 될 것 같다.

그래서 결론적으로 현재 가져갈 GIT FLOW 브랜치 전략으로는
- GIT FLOW
  - master - 배포
  - develop - 개발
  - feature - 기능
  - hotfix - 긴급한 버그 수정

1. feature 브랜치가 완성되면 develop 브랜치로 pull request를 날린다. 그러면 팀원이 코드 리뷰를 하고난 후 merge
2. 주마다 master 브랜치로 merge해 배포

가 될것 같다.

현재 코드리뷰 해줄 백엔드 팀원은 없지만.. 나중에 추가될때를 위해 지금부터 팀원이 있다고 생각하며 혼자 코드리뷰를 진행하며 해야겠다.

---

참고
- [https://techblog.woowahan.com/2553/](https://techblog.woowahan.com/2553/)
- [https://www.youtube.com/watch?v=jeaf8OXYO1g](https://www.youtube.com/watch?v=jeaf8OXYO1g)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.