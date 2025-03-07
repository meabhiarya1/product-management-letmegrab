import React from "react";
import styles from "./NotFound.module.css";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };
  return (
    <div className="flex flex-col justify-center items-center  ">
      <div className={styles.main_wrapper}>
        <div className={styles.main}>
          <div className={styles.antenna}>
            <div className={styles.antenna_shadow}></div>
            <div className={styles.a1}></div>
            <div className={styles.a1d}></div>
            <div className={styles.a2}></div>
            <div className={styles.a2d}></div>
            <div className={styles.a_base}></div>
          </div>
          <div className={styles.tv}>
            <div className={styles.cruve}>
              <svg
                className={styles.curve_svg}
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 189.929 189.929"
                xmlSpace="preserve"
              >
                <path
                  d="M70.343,70.343c-30.554,30.553-44.806,72.7-39.102,115.635l-29.738,3.951C-5.442,137.659,11.917,86.34,49.129,49.13
              C86.34,11.918,137.664-5.445,189.928,1.502l-3.95,29.738C143.041,25.54,100.895,39.789,70.343,70.343z"
                ></path>
              </svg>
            </div>
            <div className={styles.display_div}>
              <div className={styles.screen_out}>
                <div className={styles.screen_out1}>
                  <div className={styles.screen}>
                    <span className={styles.notfound_text}> NOT FOUND</span>
                  </div>
                  <div className={styles.screenM}>
                    <span className={styles.notfound_text}> NOT FOUND</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.lines}>
              <div className={styles.line1}></div>
              <div className={styles.line2}></div>
              <div className={styles.line3}></div>
            </div>
            <div className={styles.buttons_div}>
              <div className={styles.b1}>
                <div></div>
              </div>
              <div className={styles.b2}></div>
              <div className={styles.speakers}>
                <div className={styles.g1}>
                  <div className={styles.g11}></div>
                  <div className={styles.g12}></div>
                  <div className={styles.g13}></div>
                </div>
                <div className={styles.g}></div>
                <div className={styles.g}></div>
              </div>
            </div>
          </div>
          <div className={styles.bottom}>
            <div className={styles.base1}></div>
            <div className={styles.base2}></div>
            <div className={styles.base3}></div>
          </div>
        </div>
        <div className={styles.text_404}>
          <div className={styles.text_4041}>4</div>
          <div className={styles.text_4042}>0</div>
          <div className={styles.text_4043}>4</div>
        </div>
        <div class="gap-12 mt-12">
          <div class="bg-gradient-to-b from-gray-800/40 to-transparent p-[4px] rounded-[16px]">
            <button class="group p-[4px] rounded-[12px] bg-gradient-to-b from-gray-700 to-gray-600 shadow-[0_2px_4px_rgba(0,0,0,0.7)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.6)] active:shadow-[0_0px_1px_rgba(0,0,0,0.8)] active:scale-[0.995] transition-all duration-200">
              <div class="bg-gradient-to-b from-gray-600 to-gray-700 rounded-[8px] px-3 py-2">
                <div class="flex gap-2 items-center">
                  <span class="font-semibold text-white" onClick={handleClick}>
                    Go Back !!!
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
