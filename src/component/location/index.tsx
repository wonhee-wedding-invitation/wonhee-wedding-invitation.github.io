import { Map } from "./map"
import CarIcon from "../../icons/car-icon.svg?react"
import BusIcon from "../../icons/bus-icon.svg?react"
import { LazyDiv } from "../lazyDiv"
import { LOCATION, LOCATION_ADDRESS, LOCATION_DETAIL_ADDRESS } from "../../const"

export const Location = () => {
  return (
    <>
      <LazyDiv className="card location">
        <h2 className="english">Location</h2>
        <div className="addr">
          {LOCATION}
          <div className="detail">{LOCATION_ADDRESS}</div>
          <div className="detail">{LOCATION_DETAIL_ADDRESS}</div>
        </div>
        <Map />
      </LazyDiv>
      <LazyDiv className="card location">
        <div className="location-info">
          <div className="transportation-icon-wrapper">
            <BusIcon className="transportation-icon" />
          </div>
          <div className="heading">교통안내</div>
          <div />
          <div className="content">
            - 지하철 <br/>
            5초선 강동역 3번 출구 바로 앞
          </div>
          <div />
          <div className="content">
            - 버스
            <table title="버스">
              <tbody>
                <tr><td>지선(초록)</td><td>: 3214, 3316</td></tr>
                <tr><td>간선(파랑)</td><td>: 130, 341, 342, 370</td></tr>
                <tr><td>직행(빨강)</td><td>: 1113, 1113-1</td></tr>
                <tr><td>일반(초록)</td><td>: 1-4, 30-3, 112-1, 112-5</td></tr>
                <tr><td>공     항</td><td>: 6200(길동사거리 하차)</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="location-info">
          <div className="transportation-icon-wrapper">
            <CarIcon className="transportation-icon" />
          </div>
          <div className="heading">주차 안내</div>
          <div />
          <div className="content">
            건물내(지하1층~지하3층), 옥외 주차장 및 <br/>지하철 환승 주차장 이용
          </div>
          <div />
        </div>
      </LazyDiv>
    </>
  )
}
