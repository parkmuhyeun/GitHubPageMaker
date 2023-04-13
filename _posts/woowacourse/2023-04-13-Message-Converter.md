---
layout: post
title: 객체를 요청하거나 반환하면 어떻게 적절하게 처리되는걸까?
subtitle: 부제목 예시
tags: woowacourse spring message-converter
description: >
  How do you process an object if it is requested or returned?
sitemap: true
hide_last_modified: true
categories:
  - woowacourse
---

이번에 콘솔 자동차 경주를 웹 자동차 경주로 바꾸면서 다음과 같은 코드가 있었는데 어떻게 json 입력이 GameInfo 파라미터에 매핑되고, WinnerCarDto가 json으로 출력되는지 궁금해졌다. 난 아무것도 한 게 없는데.. 어떻게 자동으로 변환되는 것일까? 스프링은 신인가..?

```java
@RestController
public class CarController {

    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @PostMapping("/plays")
    public WinnerCarDto playGame(@RequestBody GameInfo gameInfo) {
        final WinnerCarDto winnerCarDto = carService.playGame(gameInfo);
        return winnerCarDto;
    }
}

//request
//{names: "a,b,c", count: "10"}

//response
//{"winners":["a","c"],"racingCars":[{"name":"a","position":6},{"name":"b","position":5},{"name":"c","position":6}]}
```

```java
public class GameInfo {

    private final String names;
    private final String count;

    public GameInfo(final String names, final String count) {
        this.names = names;
        this.count = count;
    }

    public String getNames() {
        return names;
    }

    public String getCount() {
        return count;
    }
}
```

## HttpMessageConverter
JSON 데이터를 HTTP 메시지 바디에서 직접 읽거나 쓰는경우 적절한 HttpMessageConverter가 알맞게 변환시켜준다. HttpMessageConverter는 HTTP 요청 및 응답으로 변환하기 위한 전략 인터페이스이다. 다음의 경우에 HTTP 메시지 컨버터를 적용한다.
- HTTP 요청: @RequestBody, HttpEntity(RequestEntity)
- HTTP 응답: @ResponseBody, HttpEntity(ResponseEntity)

HttpMessageConverter 인터페이스를 살펴보자.
```java
public interface HttpMessageConverter<T> {

  boolean canRead(Class<?> clazz, @Nullable MediaType mediaType);

  boolean canWrite(Class<?> clazz, @Nullable MediaType mediaType);

  List<MediaType> getSupportedMediaTypes();
  
  default List<MediaType> getSupportedMediaTypes(Class<?> clazz) {
		return (canRead(clazz, null) || canWrite(clazz, null) ?
				getSupportedMediaTypes() : Collections.emptyList());
	}

  T read(Class<? extends T> clazz, HttpInputMessage inputMessage)
		throws IOException, HttpMessageNotReadableException;

  void write(T t, @Nullable MediaType contentType, HttpOutputMessage outputMessage)
			throws IOException, HttpMessageNotWritableException;

```
- canRead(), canWrite(): 메시지 컨버터가 해당 클래스, 미디어 타입을 지원하는지 체크한다.
- read(), write(): 메시지 컨버터를 통해서 메시지를 읽고 쓰는 기능

WebMvcConfigurationSupport 클래스의 addDefaultHttpMessageConverters() 메서드를 살펴보면 다양한 메시지 컨버터를 볼 수 있는데 다음과 같은 우선 순위를 가지고 있다. 만약 각 메시지 컨버터에 만족하지 않으면 다음으로 우선순위가 넘어간다.

1. **ByteArrayHttpMessageConverter**
2. **StringHttpMessageConverter**
3. ResourceHttpMessageConverter
4. ResourceRegionHttpMessageConverter
5. SourceHttpMessageConverter
6. Jaxb2RootElementHttpMessageConverter
7. KotlinSerializationJsonHttpMessageConverter
8. **MappingJackson2HttpMessageConverter**
9. GsonHttpMessageConverter
10. ... (너무 많아서 생략)

이 중 대표적인 세가지 메시지 컨버터만 살펴보도록 하자

- ByteArrayHttpMessageConverter: byte[] 데이터 처리
  - 만족 조건
    - 클래스 타입: byte[]
    - 미디어 타입: \*/*
  - 요청 example: @RequestBody byte[] byteRequest
  - 응답 example: @ResponseBody return byte[], 쓰기 미디어타입 application/octet-stream
- StringHttpMessageConverter: String 문자로 데이터 처리
  - 만족 조건
    - 클래스 타입: String
    - 미디어 타입: \*/*
  - 요청 example: @RequestBody String stringRequest
  - 응답 example: @ResponseBody return "test", 쓰기 미디어타입 text/plain
- MappingJackson2HttpMessageConverter: application/json 데이터 처리
  - 만족 조건
    - 클래스 타입: 객체 또는 HashMap
    - 미디어 타입: application/json
  - 요청 example: @RequestBody JacksonData data
  - 응답 example: @ResponseBody return jacksonData, 쓰기 미디어타입 application/json 관련

### 다음과 같은 요청이 오면 어떤 HttpMessageConverter가 작동할까?

```java
content-type: application/json

@RequestMapping
void test(@RequestBody String test) {
  ...
}
```
- HTTP 요청이 와서, 컨트롤러에서 @RequestBody 파라미터 사용
- 올바른 메시지 컨버터를 찾기위해 컨버터를 돌면서 canRead() 호출
  - 대상 클래스 타입을 지원하는가
    - String
  - HTTP 요청의 Content-Type 미디어 타입을 지원하는가
    - application/json
- **StringHttpMessageConverter** 조건을 만족해 read()를 호출하여 객체 생성 후 반환

```java
content-type: application/json

@RequestMapping
void test(@RequestBody TestData test) {
  ...
}
```
- HTTP 요청이 와서, 컨트롤러에서 @RequestBody 파라미터 사용
- 올바른 메시지 컨버터를 찾기위해 컨버터를 돌면서 canRead() 호출
  - 대상 클래스 타입을 지원하는가
    - TestData 객체
  - HTTP 요청의 Content-Type 미디어 타입을 지원하는가
    - application/json
- **MappingJackson2HttpMessageConverter** 조건을 만족해 read()를 호출하여 객체 생성 후 반환

### 다음과 같은 응답을 하면 어떤 HttpMessageConverter가 작동할까?

```java
@ResponseBody
@RequestMapping
TestData test(...) {
  return new TestData(test);
}
```
- 컨트롤러에서 @ResponseBody로 값을 반환
- 올바른 메시지 컨버터를 찾기위해 컨버터를 돌면서 canWrite() 호출
  - 대상 클래스 타입을 지원하는가
    - TestData 객체
  - HTTP 요청의 Accept 미디어 타입을 지원하는가.(produces)
    - application/json
- **MappingJackson2HttpMessageConverter** 조건을 만족해 write() 를 호출하여 HTTP 응답 메시지 바디에 데이터를 생성한다. 

```java
@ResponseBody
@RequestMapping
String test(...) {
  return "test";
}
```
- 컨트롤러에서 @ResponseBody로 값을 반환
- 올바른 메시지 컨버터를 찾기위해 컨버터를 돌면서 canWrite() 호출
  - 대상 클래스 타입을 지원하는가
    - String
  - HTTP 요청의 Accept 미디어 타입을 지원하는가.(produces)
    - text/plain
- **StringHttpMessageConverter** 조건을 만족해 write() 를 호출하여 HTTP 응답 메시지 바디에 데이터를 생성한다. 

> 응답의 경우 produces로 미디어 타입을 정해주지 않으면 어떻게 될까 궁금해서 돌려봤더니 각 클래스 타입을 만족하는 컨버터의 미디어 타입으로 반환되었습니다!
>
> ex) String -> text/plain
>
> ex) 객체 -> application/json 
> 
> ex) byte[] -> application/octet-stream

## 그렇다면 @RequestBody의 객체와 요청 받은 데이터가 다르면 어떻게 될까?

```java
@RestController
public class CarController {

    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @PostMapping("/plays")
    public WinnerCarDto playGame(@RequestBody GameInfo gameInfo) {
        final WinnerCarDto winnerCarDto = carService.playGame(gameInfo);
        return winnerCarDto;
    }
}

//request
//{names: "a,b,c", count: "10", test: "100"}

//request
//{names: "a,b,c"}
```

첫번째 request를 넣게 되면 GameInfo에 names, count밖에 없으므로 test는 누락되게 된다. 두번째 request를 넣게 되면 GameInfo에 names만 채워지고 count는 null로 들어 오게 된다.

---
참고:
- [docs - HttpMessageConverter](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/http/converter/HttpMessageConverter.html
)
- [docs - WebMvcConfigurationSupport](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/servlet/config/annotation/WebMvcConfigurationSupport.html#configureMessageConverters(java.util.List))
- [인프런 - Spring MVC1](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-1)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.