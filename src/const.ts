import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import "dayjs/locale/ko"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale("ko")

export { dayjs }

export const WEDDING_DATE = dayjs.tz("2026-02-07 14:00", "Asia/Seoul")
export const WEDDING_DATE_FORMAT = `YYYY년 MMMM D일 dddd A h시${WEDDING_DATE.minute() === 0 ? "" : " m분"}`

// 예식 당월 휴무일. 켈린더에 표시하기 위함.
// 예: 예식일 8월 -> 8월 15일 광복절
export const HOLIDAYS = [16, 17, 18]

export const LOCATION = "강동 KDW웨딩"
export const LOCATION_ADDRESS = "서울 강동구 천호대로 1102"
export const LOCATION_DETAIL_ADDRESS = "강동 KDW웨딩 3층 블랙스톤홀"

// 카카오톡 공유 시 위치 정보로 사용할 주소.
// LOCATION 과 동일하게 설정해도 무방하나, 필요에 따라 좀 더 상세히 작성 가능.
export const SHARE_ADDRESS = LOCATION
export const SHARE_ADDRESS_TITLE = LOCATION

// 네이버 지도 및 카카오 네비게이션에 사용할 좌표. [경도, 위도] 형식.
export const WEDDING_HALL_POSITION = [127.133740, 37.535053]

// 네이버 지도의 웨딩홀 장소 ID
// 네이버 지도 웹페이지에서 웨딩홀 검색 후 URL에서 확인 가능.
// 예: https://map.naver.com/p/entry/place/13321741 -> 13321741
export const NMAP_PLACE_ID = 11608511

// 카카오 지도의 웨딩홀 장소 ID
// 카카오 지도 웹페이지에서 웨딩홀 검색 후 해당 장소에서 상세보기 클릭 시 URL에서 확인 가능.
// 예: https://place.map.kakao.com/8634826 -> 8634826
export const KMAP_PLACE_ID = 10124741

export const BRIDE_FULLNAME = "김태희"
export const BRIDE_FIRSTNAME = "태희"
export const BRIDE_TITLE = "차녀"
export const BRIDE_FATHER = "김성일"
export const BRIDE_MOTHER = "박서영"
export const BRIDE_INFO = [
  {
    relation: "신부",
    name: BRIDE_FULLNAME,
    phone: "010-9301-7697",
    account: "카카오뱅크 3333-17-4986978",
  },
]

export const GROOM_FULLNAME = "우지원"
export const GROOM_FIRSTNAME = "지원"
export const GROOM_TITLE = "장남"
export const GROOM_FATHER = "우경하"
export const GROOM_MOTHER = "강선희"
export const GROOM_INFO = [
  {
    relation: "신랑",
    name: GROOM_FULLNAME,
    phone: "010-2902-3163",
    account: "토스뱅크 1000-8425-5123",
  },
]
