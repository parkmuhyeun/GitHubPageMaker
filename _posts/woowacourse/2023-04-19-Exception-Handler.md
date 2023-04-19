---
layout: post
title: Exception Handler는 어떤 원리로 처리되는걸까?
subtitle: 부제목 예시
tags: woowacourse spring exception-handler resolver
description: >
  Exception Handler에 대해 자세히 파고 들어가보자
sitemap: true
hide_last_modified: true
categories:
  - woowacourse
---

잘못 입력했을 경우마다 다른 에러 메시지, 상태 코드(400, 404.. 등)를 던져주고 싶어서 @ExceptionHandler, @ControllerAdvice를 적용해 봤다.

```java
@RestControllerAdvice
public class CarControllerAdvice {
    @ExceptionHandler
    public ResponseEntity<ErrorResult> handleException(RacingCarException racingCarException) {
        return ErrorResult.toResponseEntity(String.valueOf(racingCarException.getStatus().value()),
                        racingCarException.getMessage());
    }
}
```

다음과 같이 각 에러마다 다른 메시지, 상태 코드를 던져주는 걸 볼 수 있다. 이게 어떻게 가능한 걸까?

![](/assets/img/blog/woowacourse/exc_1.png)

![](/assets/img/blog/woowacourse/exc_2.png)

## 스프링 부트 기본 오류 처리

스프링 부트는 기본 오류 처리를 제공한다. BasicErrorController 코드를 한번 보자.

```java
...

public class BasicErrorController extends AbstractErrorController {

	@RequestMapping(produces = MediaType.TEXT_HTML_VALUE)
	public ModelAndView errorHtml(HttpServletRequest request, HttpServletResponse response) {
		HttpStatus status = getStatus(request);
		Map<String, Object> model = Collections
			.unmodifiableMap(getErrorAttributes(request, getErrorAttributeOptions(request, MediaType.TEXT_HTML)));
		response.setStatus(status.value());
		ModelAndView modelAndView = resolveErrorView(request, response, status, model);
		return (modelAndView != null) ? modelAndView : new ModelAndView("error", model);
	}

	@RequestMapping
	public ResponseEntity<Map<String, Object>> error(HttpServletRequest request) {
		HttpStatus status = getStatus(request);
		if (status == HttpStatus.NO_CONTENT) {
			return new ResponseEntity<>(status);
		}
		Map<String, Object> body = getErrorAttributes(request, getErrorAttributeOptions(request, MediaType.ALL));
		return new ResponseEntity<>(body, status);
	}
  
  ...
}
```

에러가 터졌을 때 클라이언트 요청의 Accept 헤더 값이 text/html인 경우 errorHtml()을 호출해서 error view를 제공하고, 그 외 경우 error()를 호출해 ResponseEntity()로 HTTP Body에 에러를 JSON 형태로 반환한다. 에러를 따로 잡지 않았을 경우 다음과 같은 기본 500 에러가 터지게 된다. 이걸 발생하는 예외에 따라 다른 상태 코드나 메시지로 처리하려면 어떻게 해야 될까?

![](/assets/img/blog/woowacourse/exc_3.png)

## HandlerExceptionResolver
HandlerExceptionResolver는 매핑 또는 실행 중에 throw된 예외를 해결할 수 있는 인터페이스이다. HandlerExceptionResolver가 적용되기 전을 한번 보자.

![](/assets/img/blog/woowacourse/exc_4.png)

에러가 터지면 정상적으로 처리되지 않고 중간에 끊겨서 WAS로 에러가 전달되고 그 후 후속 조치(띄울 에러 페이지를 다시 요청한다거나)가 일어난다. HandlerExceptionResolver가 적용되고 나면 에러가 터져도 ExceptionResolver가 예외를 해결하고 WAS로 정상적으로 응답을 전달한다.

![](/assets/img/blog/woowacourse/exc_5.png)

우선 가장 원초적인 방법으로 직접 HandlerExceptionResolver를 만들어서 사용해 보자.

```java
public interface HandlerExceptionResolver {
  ModelAndView resolveException(
    HttpServletRequest request, HttpServletResponse reponse, 
    Object handler, Exception ex);
}
```

```java
public class CustomExceptionResolver implements HandlerExceptionResolver {

  @Override
  public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse reponse, Object handler, Exception ex) {
    try {
      if (ex instanceof IllegalArgumentException) {
        response.sendError(HttpServletResponse.SC_BAD_REQUEST, ex.getMessage());
        return new ModelAndView();
      }
    } catch (IOException e) {
      log.error("resolver ex", e);
    }
    
    return null;
  }
}
```

```java
public class WebConfig implements WebMvcConfigurer {
  ...

  @Override
  public void extendHandlerExceptionResolvers(List<HandlerExceptionResolver> resolvers) {
    resolvers.add(new CustomExceptionResolver());
  }

  ...
}
```

IllegalArgumentException이 발생하면 response.sendError(400)을 호출해서 HTTP 상태 코드를 400으로 지정하고 빈 ModelAndView를 반환한다. 이렇게 ModelAndView를 반환하여 Exception을 정상 흐름으로 변경하게 하는 것이다.

HandlerExceptionResolver의 반환 값에 따라 DispatcherServlet의 동작 방식은 각자 다르다. 빈 ModelAndView()가 반환되면 뷰를 렌더링 하지 않고, 정상 흐름으로 서블릿이 리턴된다. ModelAndView 안에 View나 Model 같은 정보가 들어있는 상태로 반환하게 되면 뷰를 렌더링 한다. null이 반환될 시, 다음 HandlerExceptionResolver를 찾아서 실행하고 맞는 resolver가 없을 시 기존에 발생한 예외를 서블릿 밖으로 던진다.

HandlerExceptionResolver를 다음과 같이 활용해볼 수 있다. 
- 예외 상태 코드 반환
  - 서블릿에서 상태 코드에 따른 오류를 처리하도록 위임
  - 이후 WAS는 서블릿 오류 페이지를 찾아서 호출
    - 그래서 이 경우에는 2번(첫 호출, error 후 재호출)의 컨트롤러 호출 과정이 발생하게 됨.
  - ex) response.sendError(xxx);
- 뷰 템플릿 처리
  - ModelAndView에 View나 Model 같은 정보를 넣어 예외에 따른 새로운 오류 화면 제공
  - ex) new ModelAndView("error/500");
- API 응답 처리
  - HTTP 응답 바디에 직접 데이터를 넣어 JSON으로 응답하면 API 응답 처리 가능
  - ex) response.getWriter().println("Error!!");

그런데 각 에러마다 이렇게 직접 HandlerExceptionResolver를 구현해 주려고 하니 상당한 비용이 든다. 그래서 친절한 스프링님께서 HandlerExceptionResolver를 제공해 주는데 어떤 게 있는지 알아보자.

## DefaultHandlerExceptionResolver
앞으로 설명할 3개의 HandlerExceptionResolver 중 가장 우선순위가 낮다. DefaultHandlerExceptionResolver는 표준 Spring MVC 예외들을 해결하고 해당 HTTP 상태 코드로 변환하는 기본 구현체이다. 

예를 들어, 파라미터 바인딩 시점에 타입이 맞지 않으면 내부에서 TypeMismatchException이 발생하고 결과적으로 500 오류가 발생해야 된다. 하지만 파라미터 바인딩은 대부분 클라이언트가 잘못 요청해서 발생하는 문제기 때문에 HTTP에서 400을 사용하도록 되어있다. 그래서 DefaultHandlerExceptionResolver는 이 오류를 500이 아니라 400으로 변경해서 상황에 맞게 처리해 준다.

내부 코드를 살펴보면 다음과 같은 표준 예외들을 처리해 주는 걸 볼 수 있다.

```java
@Override
	@Nullable
	protected ModelAndView doResolveException(
			HttpServletRequest request, HttpServletResponse response, @Nullable Object handler, Exception ex) {

		try {
			if (ex instanceof HttpRequestMethodNotSupportedException) {
				return handleHttpRequestMethodNotSupported(
						(HttpRequestMethodNotSupportedException) ex, request, response, handler);
			}
			else if (ex instanceof HttpMediaTypeNotSupportedException) {
				return handleHttpMediaTypeNotSupported(
						(HttpMediaTypeNotSupportedException) ex, request, response, handler);
			}
			else if (ex instanceof HttpMediaTypeNotAcceptableException) {
				return handleHttpMediaTypeNotAcceptable(
						(HttpMediaTypeNotAcceptableException) ex, request, response, handler);
			}
			else if (ex instanceof MissingPathVariableException) {
				return handleMissingPathVariable(
						(MissingPathVariableException) ex, request, response, handler);
			}
			else if (ex instanceof MissingServletRequestParameterException) {
				return handleMissingServletRequestParameter(
						(MissingServletRequestParameterException) ex, request, response, handler);
			}
			else if (ex instanceof ServletRequestBindingException) {
				return handleServletRequestBindingException(
						(ServletRequestBindingException) ex, request, response, handler);
			}
			else if (ex instanceof ConversionNotSupportedException) {
				return handleConversionNotSupported(
						(ConversionNotSupportedException) ex, request, response, handler);
			}
			else if (ex instanceof TypeMismatchException) {
				return handleTypeMismatch(
						(TypeMismatchException) ex, request, response, handler);
			}
			else if (ex instanceof HttpMessageNotReadableException) {
				return handleHttpMessageNotReadable(
						(HttpMessageNotReadableException) ex, request, response, handler);
			}
			else if (ex instanceof HttpMessageNotWritableException) {
				return handleHttpMessageNotWritable(
						(HttpMessageNotWritableException) ex, request, response, handler);
			}
			else if (ex instanceof MethodArgumentNotValidException) {
				return handleMethodArgumentNotValidException(
						(MethodArgumentNotValidException) ex, request, response, handler);
			}
			else if (ex instanceof MissingServletRequestPartException) {
				return handleMissingServletRequestPartException(
						(MissingServletRequestPartException) ex, request, response, handler);
			}
			else if (ex instanceof BindException) {
				return handleBindException((BindException) ex, request, response, handler);
			}
			else if (ex instanceof NoHandlerFoundException) {
				return handleNoHandlerFoundException(
						(NoHandlerFoundException) ex, request, response, handler);
			}
			else if (ex instanceof AsyncRequestTimeoutException) {
				return handleAsyncRequestTimeoutException(
						(AsyncRequestTimeoutException) ex, request, response, handler);
			}
		}
		catch (Exception handlerEx) {
			if (logger.isWarnEnabled()) {
				logger.warn("Failure while trying to resolve exception [" + ex.getClass().getName() + "]", handlerEx);
			}
		}
		return null;
	}
```

그중 TypeMismatchException를 처리해 주는 코드를 보면 response.sendError()를 통해서 문제를 해결한다. 그래서 WAS에서 다시 오류 페이지(/error)를 내부 요청한다.

```java
	protected ModelAndView handleTypeMismatch(TypeMismatchException ex,
			HttpServletRequest request, HttpServletResponse response, @Nullable Object handler) throws IOException {

		response.sendError(HttpServletResponse.SC_BAD_REQUEST);
		return new ModelAndView();
	}
```

아래와 같은 매핑에서 문자를 입력해서 요청을 하면 TypeMismatchException이 발생하고 주석과 같은 오류가 발생한다.

```java
@GetMapping("/default-handler")
public String defaultHandlerException(@RequestParam Integer data) {
  return "test";
}

// http://localhost:8080/default-handler?data=test 요청시
//
// {
//     "timestamp": "2023-04-18T13:51:14.707+00:00",
//     "status": 400,
//     "error": "Bad Request",
//     "message": "Failed to convert value of type 'java.lang.String' to required type 'java.lang.Integer'; nested exception is java.lang.NumberFormatException: For input string: \"test\"",
//     "path": "/default-handler"
// }
```

> response에 message가 안 뜨면 application.properties에 다음과 같은 옵션을 추가하자
> 
> server.error.include-message=always

## ResponseStatusExceptionResolver
세 개의 HandlerExceptionResolver 중 두 번째의 우선순위를 가진다. @ResponseStatus 애노테이션을 사용하여 예외를 HTTP 응답 코드에 매핑할 수 있게 처리해 준다. 또한, 5.0 부턴 ResponseStatusException을 지원하여 예외를 처리할 수 있다.

다음과 같이 @ResponseStatus 애노테이션을 적용하면 HTTP 상태 코드를 변경해 주고 메시지도 담을 수 있다.

```java
@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "잘못된 요청 오류") 
public class BadRequestException extends RuntimeException {
}

@GetMapping("/response-status")
public String responseStatus() {
    throw new BadRequestException();
}

// http://localhost:8080/response-status 요청시
//
// {
//     "timestamp": "2023-04-18T14:11:22.601+00:00",
//     "status": 400,
//     "error": "Bad Request",
//     "message": "잘못된 요청 오류",
//     "path": "/response-status"
// }
```

ResponseStatusExceptionResolver의 처리 코드를 살펴보면 다음과 같이 sendError를 실행하는 것을 볼 수 있다. 그래서 이것도 마찬가지로 WAS에서 다시 오류 페이지(/error)를 요청한다.

```java
	protected ModelAndView applyStatusAndReason(int statusCode, @Nullable String reason, HttpServletResponse response)
			throws IOException {

		if (!StringUtils.hasLength(reason)) {
			response.sendError(statusCode);
		}
		else {
			String resolvedReason = (this.messageSource != null ?
					this.messageSource.getMessage(reason, null, reason, LocaleContextHolder.getLocale()) :
					reason);
			response.sendError(statusCode, resolvedReason);
		}
	}
		return new ModelAndView();
```

@ResponseStatus는 개발자가 직접 변경할 수 없는 예외에는 적용할 수 없다.(ex. IllegalArgumentException()) 또한. 애노테이션을 사용하기 때문에 조건에 따라 동적으로 변경하는 것도 어려운데 그때는 ResponseStatusException을 사용하면 된다.

```java
  @GetMapping("/response-status-exception")
  public String responseStatusException() {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "잘못된 요청입니다.", new
  IllegalArgumentException());
  }

// http://localhost:8080/response-status-exception 요청시
//
// {
//     "timestamp": "2023-04-18T14:23:25.185+00:00",
//     "status": 404,
//     "error": "Not Found",
//     "message": "잘못된 요청입니다.",
//     "path": "/response-status-exception"
// }
```

## ExceptionHandlerExceptionResolver
  ExceptionHandlerExceptionResolver는 @ExceptionHandler라는 애노테이션을 통해 예외를 해결한다. ExceptionResolver 중에 우선순위가 가장 높고 실무에서도 API 예외 처리는 대부분 이 기능을 사용한다.

  사용 방법은 @ExceptionHandler 애노테이션을 선언하고, 처리하고 싶은 예외를 지정해 주면 된다. 지정한 예외 또는 그 예외의 자식 클래스는 모두 잡아준다.

```java
  public class ErrorResult {
      private String code;
      private String message;
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ErrorResult handleIllegal(IllegalArgumentException e) {
      return new ErrorResult("400", e.getMessage());
  }
```

예외 처리 과정을 보면
1. IllegalArgumentException이 발생하게 되면
2. ExceptionResolver 중 가장 우선순위가 높은 ExceptionHandlerExceptionResolver가 실행
3. ExceptionHandlerExceptionResolver는 해당 컨트롤러에 IllegalArgumentException을 처리할 수 있는 @ExceptionHandler가 있는지 확인
4. handleIllegal을 발견하고 실행

## @ControllerAdvice
엄청나게 많은 @ExceptionHandler가 Controller에 섞여 있으면 가독성이 좋지 않다. 이를 @ControllerAdvice를 사용해 분리해 볼 수 있다. 

```java
@RestControllerAdvice
public class ControllerAdvice {
  @ExceptionHandler
  public ResponseEntity<ErrorResult> ex1(Exception1 e) {
    ...
  }

  @ExceptionHandler
  public ResponseEntity<ErrorResult> ex2(Exception2 e) {
    ...
  }

  @ExceptionHandler
  public ResponseEntity<ErrorResult> ex3(Exception3 e) {
    ...
  }
}
```

@ControllerAdvice는 대상을 지정하지 않으면 모든 컨트롤러에 적용되므로 특정한 컨트롤러에만 적용하고 싶으면 대상 컨트롤러를 지정하자. 지정하는 방법은 다음 [스프링 공식 문서]에 잘 나와있으니 읽어 보자.

[스프링 공식 문서]:https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-controller-advice

---
참고:
- [HandlerExceptionResolver](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/servlet/HandlerExceptionResolver.html)
- [DefaultHandlerExceptionResolver](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/servlet/mvc/support/DefaultHandlerExceptionResolver.html)
- [ResponseStatusExceptionResolver](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/servlet/mvc/annotation/ResponseStatusExceptionResolver.html)
- [ExceptionHandlerExceptionResolver](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/servlet/mvc/method/annotation/ExceptionHandlerExceptionResolver.html)
- [Spring](https://docs.spring.io/)
- [인프런 - Spring MVC1](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-1)

*틀린 부분이 있으면 언제든지 말씀해 주시면 공부해서 수정하겠습니다.