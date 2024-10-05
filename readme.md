## Relations

- User : Lecture = M : N
- User : Enrollment = 1 : N
  - (Enrollment - User - Lecture = 1 - 1 - 1)
  - 하나의 유저는 하나의 강의에 하나의 수강 신청을 갖는다 (제약 조건)
- Lecture : Enrollment = 1 : N

## Event

- 수강 신청
  - Lecture의 slot 차감(낙관적 락)
    - 이때 slot이 0이면 에러
  - 성공하면(slot이 0보다 크면) Enrollment 상태를 ENROLLED로 생성

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
  - slot(30 by default)
  - createdAt
  - updatedAt
  - deletedAt
- Enrollment
  - lectureId
  - userId
  - state(enum)
    - ENROLLED만 사용 중
  - createdAt
  - updatedAt
  - deletedAt
  - unique index: lectureId - userId

## API

- POST /enrollments
  - body:
    - userId
    - lectureId
  - Response:
    - status: 201
    - example:
      ```json
      {
        "userId": 13,
        "lectureId": 1,
        "status": "ENROLLED",
        "deletedAt": null,
        "id": "071f619c-0ff7-41b5-83cf-3dfaed1286f7",
        "createdAt": "2024-10-05T11:07:14.000Z",
        "updatedAt": "2024-10-05T11:07:14.000Z"
      }
      ```
  - Error:
      - 중복 수강 신청 시
        - status: 400
        - message: "Duplicated enrollment"
      - 수강 신청 실패 시(슬롯 0)
        - status: 500
        - message: "Enrollment failed"
   
- GET /enrollments
  - Parameter:
    - query:
      - userId
      - status(ENROLLED)
  - Response:
    - status: 200
    - example:
      ```json
      {
        "enrollments": [
          {
            "id": "29b24090-beb3-473e-af3c-809d65e21ce9",
            "status": "ENROLLED",
            "createdAt": "2024-10-05T10:59:15.000Z",
            "updatedAt": "2024-10-05T10:59:15.000Z",
            "deletedAt": null
          }
        ]
      }
      ```

- GET /lectures/available
  - Parameter:
    - query:
      - date:
        - type: string(YYYY-MM-DD)
  - Response:
    - status: 200
    - type: array
    - example:
      ```json
      [
        {
          "id": "1",
          "date": "2024-10-05",
          "faculty": "bazFaculty0",
          "title": "foo0",
          "subtitle": "baz0",
          "description": "bar0",
          "slot": 30,
          "version": 1,
          "createdAt": "2024-10-05T10:56:07.953Z",
          "updatedAt": "2024-10-05T10:56:07.953Z",
          "deletedAt": null
        }
      ]
      ```
