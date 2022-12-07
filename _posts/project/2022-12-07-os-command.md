---
layout: post
title: EC2 배포과정에서 OS에 따른 명령어 차이에 의한 오류
subtitle: 부제목 예시
tags: error os ec2 command 
description: >
  Error due to command differences according to OS
sitemap: true
hide_last_modified: true
categories:
  - project
--- 

>EC2에 배포하는 과정에서 테스트부분에서 계속 오류가 발생했었는데 어떤 에러가 났었고 어떻게 해결했는지 한번 보자

## 부족한 에러 로그

![](/assets//img/blog/project/osc_1.PNG)

위 사진처럼 DefaultCacheAwareContextLoaderDelegate 에러와 BeanCreationException이 발생했었다. 어느 곳에서 빈이 제대로 생성이 안된건 알 수 있었지만 정확히 어디에서 발생한지 자세하게 보여주지 않아 한참 지레짐작으로 끙끙앓고 있었다.

그러다 명령어 옵션들을 보던 중 ---scan 옵션을 같이 이용하면 더 자세한 것들을 제공해줄 것 같아 ./gradlew ---scan clean build으로 입력해보았는데 아래처럼 빌드 스캔 링크를 제공해주었다.

![](/assets//img/blog/project/osc_2.PNG)

그 링크에 들어가 email을 입력하면 gradle에서 email로 빌드 스캔 결과를 제공해준다. 빌드 스캔 결과를 보면 다음과 같이 빌드 중 어떤 과정이 일어났는지 상세하게 적혀있다.

![](/assets//img/blog/project/osc_3.PNG)

## OS에 따른 명령어 차이에 의한 에러

![](/assets//img/blog/project/osc_4.PNG)

EmbeddedRedisConfig에서 빈 생성이 제대로 안된 걸 확인할 수 있었고 어떤 명령어("cmd.exe")를 수행하지 못하고 있었다. 해당 클래스는 EmbeddedRedis를 위한 설정파일로 실행, 정지 그리고 추가 기능에 대한 설정이 적혀있다. 그 중, 예전에 EmbeddedRedis 충돌 방지를 위한 코드를 설정한 적이 있었는데 해당 port를 사용중인 프로세스를 확인하는 쉘을 실행하는 부분이 문제를 일으키고 있는걸 확인했다.

현재 로컬에서는 윈도우 환경이기 때문에 다음과 같은 코드로 문제없이 잘 진행하고 있었다.

```java
private Process executeGrepProcessCommand(int port) throwsIOException {
    String command = String.format("netstat -nao | find \"LISTEN\" | find \"%d\"", port);
    String[] shell = {"cmd.exe", "/y", "/c", command};
    return Runtime.getRuntime().exec(shell);
}
```

하지만 EC2 환경은 Linux로 위 코드가 제대로 실행 되지 않았기 때문에 계속 EmbeddedRedisConfig가 생성되지 않아 오류를 일으키고 있었던 것이다.

```java
private Process executeGrepProcessCommand(int port) throwsIOException {
    String command = String.format("netstat -nat | grep LISTEN|grep %d", port);
    String[] shell = {"/bin/sh", "-c", command};
    return Runtime.getRuntime().exec(shell);
}
```

그래서 위와 같이 Linux에 맞는 코드들로 변경시켜 주었더니 잘 되는 것을 확인하였다!

![](/assets//img/blog/project/osc_5.PNG)

---

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.