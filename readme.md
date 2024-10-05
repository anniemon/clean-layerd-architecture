## Relations

- User : Lecture = M : N
- User : Enrollment = 1 : N
  - (Enrollment - User - Lecture = 1 - 1 - 1)
  - 하나의 유저는 하나의 강의에 하나의 수강 신청을 갖는다 (제약 조건)
- Lecture : Enrollment = 1 : N

## Event

- 수강 신청
  - Lecture의 slot 확인
  - Enrollment 생성(PENDING? 상태)
  - 낙관적 락으로 구현해보자..
  - Lecture slot 확인
  - Lecture slot 차감
    - 이때 slot이 다 차버렸으면 (남은 slot이 0이면)
  - Enrollment 상태를 다시 변경하고(CANCELED) **롤백**
  - 성공하면(slot이 0보다 크면) Enrollment 상태를 COMPLETED로 변경

## Schema

- User
  - name
  - email
  - password
  - createdAt
  - updatedAt
  - deletedAt
- Lecture
  - date
  - faculty
  - title
  - subtitle
  - description
  - slot
    - 30 by default
  - isAvailable
  - createdAt
  - updatedAt
  - deletedAt
- Enrollment
  - id(pk)
  - lectureId
  - userId
  - state(enum)
    - PENDING, ENROLLED, CANCELED
  - createdAt
  - updatedAt
  - deletedAt
- EnrollmentHistory (??)
  - enrollmentId
  - from_state
  - to_state
  - updatedAt

## API

- POST /enrollments
  - Parameter:
    - body:
      - ...lecture
      - userId
      - enrollmentId
  - Response:
    - status: 201
    - message: "Success"
  - Error:
    - status: 422 ? 429?
    - message: "No remain slots"
- GET /enrollments?userId=:userId&state=ENROLLED
  - Parameter:
    - query:
      - userId
  - Response:
    - status: 200
    - type: array
    - example: {data: [{enrollment1, ...lecture1}, {enrollment2, ...lecture2}]}
- GET /lectures/:state
  - Parameter:
    - path:
      - state:
        - type: enum
  - Response:
    - status: 200
    - type: array
    - example: {data: [{...lecture}]}
