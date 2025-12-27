import {
  BRIDE_FULLNAME,
  GROOM_FULLNAME,
  LOCATION,
  SHARE_ADDRESS,
  SHARE_ADDRESS_TITLE,
  WEDDING_DATE,
  WEDDING_DATE_FORMAT,
} from "../../const"
import ktalkIcon from "../../icons/ktalk-icon.png"
import { Button } from "../button";
import { LazyDiv } from "../lazyDiv"
import { useKakao } from "../store"
import { useCopyToClipboard } from "@uidotdev/usehooks";
import styled from "styled-components";
import { message } from "antd";
import { LinkOutlined } from "@ant-design/icons";

const baseUrl = import.meta.env.BASE_URL

const LinkShareButton = styled(Button)`
  color: var(--title-color) !important;
  font-weight: 400 !important;
  align-item: center;
  width: 100%;
  &:hover {
    background-color: rgb(217 125 131 / 48%) !important;
    border-color: rgb(217 125 131 / 48%) !important;
    color: var(--title-color) !important;
  }
  margin-top: 0.5rem;
`;

export const ShareButton = () => {
  const kakao = useKakao()
  const [copyToClipboard, copy] = useCopyToClipboard()
  return (
    <LazyDiv className="footer share-button">
      <LinkShareButton
        className="ktalk-share"
        id="kakaotalk-sharing-btn"
        onClick={() => {
          if (!kakao) {
            return
          }

          kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
              title: `${GROOM_FULLNAME} ❤️ ${BRIDE_FULLNAME}의 결혼식에 초대합니다.`,
              description:
                WEDDING_DATE.format(WEDDING_DATE_FORMAT) + "\n" + LOCATION,
              imageUrl:
                window.location.protocol +
                "//" +
                window.location.host +
                baseUrl +
                "/preview_image.png",
              link: {
                mobileWebUrl:
                  window.location.protocol +
                  "//" +
                  window.location.host +
                  baseUrl,
                webUrl:
                  window.location.protocol +
                  "//" +
                  window.location.host +
                  baseUrl,
              },
            },
            buttons: [
              {
                title: "초대장 보기",
                link: {
                  mobileWebUrl:
                    window.location.protocol +
                    "//" +
                    window.location.host +
                    baseUrl,
                  webUrl:
                    window.location.protocol +
                    "//" +
                    window.location.host +
                    baseUrl,
                },
              },
            ],
          })
        }}
      >
        <img src={ktalkIcon} alt="ktalk-icon" /> 카카오톡으로 공유하기
      </LinkShareButton>
      <LinkShareButton 
        className="ktalk-share"
        onClick={() => {
          copy(window.location.href);
          message.success("청첩장 링크가 복사되었습니다.")
        }
      }>
        <LinkOutlined />
        &nbsp;링크 복사하기
      </LinkShareButton>
    </LazyDiv>
  )
}
