import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useTranslation } from "react-i18next";

import "./index.scss";

const MAX_SECTION_HEIGHT = 900;

export default function Cover() {
  const { t, i18n } = useTranslation();
  const [sectionHeight, setSectionHeight] = useState(MAX_SECTION_HEIGHT);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Handle viewport height
  useEffect(() => {
    const updateHeight = () => {
      const h = window.innerHeight;
      setSectionHeight(h < MAX_SECTION_HEIGHT ? h : MAX_SECTION_HEIGHT);
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <section className="cover" style={{ height: `${sectionHeight}px` }}>
      <div className="names-kr-box">
        <span className="names kr">우지원</span>
        <span className="names kr">그리고</span>
        <span className="names kr">김태희</span>
      </div>

      <div className="cover-title-container">
        <div className="names-en-box">
          <span className="names en-sacramento">
            Ted & Zoe
          </span>
        </div>

        <div className="event-date-and-place-box">
          <span className={`event-date-and-time ${i18n.language}`}>
            {t("26.02.07 14:00")}
          </span>

          <span className={`event-place ${i18n.language}`}>
            {t("강동 KDW웨딩 블랙스톤홀")}
          </span>
        </div>
      </div>
    </section>
  );
}
