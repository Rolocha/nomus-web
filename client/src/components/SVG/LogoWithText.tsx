import * as React from 'react'
import { SVGProps } from './types'
import { colors } from 'src/styles'

const LogoWithText = ({ color, className }: SVGProps) => (
  <svg
    className={className}
    width="192"
    height="60"
    viewBox="0 0 192 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path
        d="M86.8237 29.252V42.4232C86.8237 42.7186 86.5844 42.9587 86.2882 42.9587H84.2835C83.9882 42.9587 83.748 42.7194 83.748 42.4232V29.858C83.748 27.8389 83.2914 26.3332 82.3926 25.3776C81.5082 24.4287 80.202 23.9433 78.5182 23.9433C77.4412 23.9433 76.4558 24.2004 75.5859 24.7139C74.7151 25.2274 74.0157 25.9411 73.5235 26.8255C73.0168 27.7531 72.7673 28.7444 72.7673 29.858V42.4224C72.7673 42.7177 72.5279 42.9579 72.2317 42.9579H70.1914C69.8961 42.9579 69.6559 42.7186 69.6559 42.4224V21.9674C69.6559 21.6721 69.8952 21.4319 70.1914 21.4319H71.5553C71.821 21.4319 72.0467 21.6271 72.0849 21.8902L72.3463 23.6937C73.4649 22.4987 75.0138 21.6432 76.8725 21.1679C76.9022 21.1603 76.9345 21.1544 76.965 21.1501C80.1299 20.7393 82.6939 21.403 84.5475 23.1158C86.0607 24.5068 86.8237 26.576 86.8237 29.252Z"
        fill={color}
      />
      <path
        d="M168.348 21.5676V42.0233C168.348 42.3187 168.109 42.5589 167.812 42.5589H166.456C166.191 42.5589 165.965 42.3637 165.927 42.1006L165.665 40.2971C164.451 41.593 162.793 42.4723 160.641 42.8831C160.615 42.8882 160.589 42.8916 160.564 42.8941C157.617 43.181 155.217 42.5003 153.457 40.875C151.952 39.484 151.189 37.4216 151.189 34.7388V21.5676C151.189 21.2722 151.428 21.032 151.724 21.032H153.722C154.017 21.032 154.258 21.2714 154.258 21.5676V34.1396C154.258 36.1519 154.714 37.6575 155.613 38.62C156.519 39.5833 157.789 40.0467 159.487 40.0467C160.564 40.0467 161.55 39.7895 162.42 39.2828C163.291 38.7694 163.99 38.0624 164.482 37.1636C164.989 36.2572 165.238 35.2446 165.238 34.1388V21.5676C165.238 21.2722 165.478 21.032 165.774 21.032H167.814C168.109 21.032 168.348 21.2722 168.348 21.5676Z"
        fill={color}
      />
      <path
        d="M109.371 26.1048C108.593 24.4634 107.494 23.1937 106.11 22.3306C104.719 21.4674 103.121 21.032 101.344 21.032C99.5663 21.032 97.9614 21.4674 96.5703 22.3306C95.1861 23.1937 94.087 24.4643 93.3096 26.1048C92.5457 27.7106 92.1613 29.6652 92.1613 31.8982V32.4974C92.1613 34.7303 92.5466 36.6858 93.3096 38.2907C94.087 39.9245 95.1861 41.1874 96.5703 42.0505C97.9546 42.9213 99.5595 43.3635 101.344 43.3635C103.128 43.3635 104.726 42.9213 106.11 42.0581C107.494 41.1874 108.593 39.9245 109.371 38.2907C110.135 36.6713 110.527 34.7235 110.527 32.4974V31.8982C110.526 29.6728 110.134 27.725 109.371 26.1048ZM101.344 40.4464C99.5383 40.4464 98.1116 39.8116 96.9837 38.5131C95.8489 37.2077 95.271 35.2667 95.271 32.7409V31.6563C95.271 29.1373 95.8489 27.1895 96.9837 25.8774C98.1108 24.5788 99.5383 23.944 101.344 23.944C103.142 23.944 104.569 24.5788 105.696 25.8774C106.83 27.1903 107.408 29.1381 107.408 31.6563V32.7409C107.408 35.2667 106.83 37.2077 105.696 38.5131C104.569 39.8116 103.141 40.4464 101.344 40.4464Z"
        fill={color}
      />
      <path
        d="M144.474 29.2519V42.4231C144.474 42.7185 144.235 42.9586 143.939 42.9586H141.899C141.603 42.9586 141.363 42.7193 141.363 42.4231V29.8579C141.363 25.8765 139.901 23.9431 136.889 23.9431C135.448 23.9431 134.299 24.4855 133.379 25.5914C132.452 26.7117 131.981 28.1528 131.981 29.8579V42.4223C131.981 42.7176 131.741 42.9578 131.445 42.9578H129.405C129.109 42.9578 128.869 42.7185 128.869 42.4223V29.8579C128.869 25.8765 127.407 23.9431 124.402 23.9431C122.954 23.9431 121.805 24.4855 120.892 25.5914C119.958 26.7117 119.487 28.146 119.487 29.8579V42.4223C119.487 42.7176 119.247 42.9578 118.951 42.9578H116.911C116.615 42.9578 116.375 42.7185 116.375 42.4223V21.9673C116.375 21.672 116.615 21.4318 116.911 21.4318H118.273C118.536 21.4318 118.76 21.6236 118.802 21.8833L119.072 23.5935C120.086 22.3858 121.478 21.5285 123.195 21.128C123.224 21.1212 123.255 21.1161 123.285 21.1118C125.226 20.8716 126.988 21.1738 128.477 21.9733C129.219 22.3781 129.855 22.9018 130.383 23.5476C130.582 23.7904 130.954 23.8057 131.167 23.5757C131.678 23.0214 132.285 22.5326 132.993 22.1091C134.178 21.3953 135.548 21.0321 137.052 21.0321C139.214 21.0321 141.019 21.7382 142.397 23.1301C143.089 23.8294 143.603 24.6926 143.953 25.7127C144.302 26.7329 144.474 27.9177 144.474 29.2519Z"
        fill={color}
      />
      <path
        d="M191.872 36.5797C191.872 38.9485 191.03 40.7036 189.367 41.795C187.784 42.8364 185.629 43.3652 182.974 43.3652C180.948 43.3652 179.271 43.0299 177.987 42.3807C176.688 41.7246 175.739 40.9039 175.161 39.933C175.111 39.8549 175.069 39.7692 175.026 39.6902H175.019C174.448 38.7702 174.156 37.8069 174.156 36.8292L174.198 36.23C174.205 36.0942 174.263 35.9729 174.355 35.8803C174.362 35.8803 174.362 35.8803 174.362 35.8736C174.455 35.7878 174.584 35.731 174.726 35.731H176.731C177.024 35.731 177.266 35.9737 177.266 36.2665V36.7876C177.266 37.3945 177.495 37.9792 177.972 38.5784C178.215 38.8924 178.529 39.1708 178.915 39.4135C180.006 40.0985 181.547 40.4481 183.495 40.4481C185.208 40.4481 186.549 40.1129 187.462 39.4492C188.339 38.8211 188.76 38.0081 188.76 36.9803C188.76 36.1952 188.539 35.6028 188.069 35.1751C187.555 34.6896 186.906 34.3187 186.15 34.0692C185.329 33.7984 184.216 33.5269 182.832 33.2629C181.177 32.9421 179.835 32.5992 178.836 32.264C177.773 31.9075 176.853 31.3295 176.104 30.5445C175.312 29.7238 174.912 28.5899 174.912 27.1768C174.912 25.3503 175.654 23.8515 177.117 22.71C178.544 21.5973 180.648 21.0329 183.375 21.0329C185.159 21.0329 186.664 21.3325 187.855 21.9317C189.061 22.5309 189.96 23.3092 190.531 24.2292C191.102 25.1492 191.394 26.1125 191.394 27.0902L191.352 27.6894C191.33 27.9745 191.102 28.1884 190.816 28.1884H188.818C188.525 28.1884 188.283 27.9457 188.283 27.6529V27.1318C188.283 26.4112 187.954 25.7119 187.284 24.9913C186.641 24.3064 185.164 23.9423 183.01 23.9423C180.391 23.9423 179.357 24.4778 178.943 24.9268C178.322 25.6049 178.022 26.3179 178.022 27.0885C178.022 27.7089 178.229 28.1944 178.642 28.5729C179.12 29.0006 179.727 29.3367 180.447 29.565C181.232 29.8146 182.331 30.0862 183.722 30.3713C185.364 30.721 186.734 31.0775 187.782 31.4271C188.902 31.798 189.865 32.3972 190.643 33.2035C191.459 34.0539 191.872 35.1878 191.872 36.5797Z"
        fill={color}
      />
      <path
        d="M0.010995 20.7781C1.86968 14.6275 5.83489 8.99792 11.2718 5.28054C13.9681 3.40403 16.987 1.96545 20.1739 1.05818C23.3685 0.187392 26.7167 -0.173312 30.0318 0.0762106C33.3469 0.297726 36.6356 1.0395 39.7326 2.29645C42.8296 3.56443 45.6567 5.4384 48.1434 7.66289C50.6072 9.90689 52.802 12.5023 54.3594 15.4677C55.9389 18.4127 57.0396 21.6039 57.6023 24.8842C58.1973 28.1653 58.1158 31.533 57.5964 34.7963C57.0566 38.058 56.0348 41.2568 54.429 44.1424C51.2684 49.9103 46.3144 54.7285 40.2953 57.3578C37.3104 58.6954 34.1192 59.5568 30.8712 59.8827C29.2433 59.9608 27.6146 60.0643 25.9894 59.9464C24.3658 59.8174 22.7532 59.5823 21.1695 59.2122C14.833 57.7219 9.07274 54.0605 5.02351 49.0285C4.88517 48.8562 4.91233 48.605 5.08462 48.4658C5.25267 48.3308 5.4971 48.3537 5.63714 48.515L5.64053 48.5192C9.75511 53.2746 15.4313 56.5753 21.4962 57.7728C23.0129 58.0698 24.5482 58.2362 26.0853 58.3041C27.6257 58.361 29.1585 58.2031 30.6828 58.0783C33.7212 57.6608 36.6662 56.745 39.388 55.4057C44.864 52.762 49.2866 48.1772 51.8777 42.8167C53.2068 40.1441 53.9834 37.2305 54.3161 34.3058C54.6183 31.3794 54.5334 28.397 53.851 25.5606C53.2196 22.7208 52.1824 19.9888 50.7201 17.5004C49.2416 15.0255 47.433 12.7492 45.2943 10.8235C43.1589 8.89268 40.7137 7.32679 38.1031 6.1004C35.4687 4.91899 32.639 4.19248 29.7492 3.86743C26.8542 3.49484 23.8871 3.67986 21.0108 4.29348C18.1192 4.86806 15.2998 5.93575 12.7027 7.44816C10.1031 8.96057 7.75808 10.927 5.6575 13.1711C3.57221 15.438 1.87478 18.0843 0.519376 20.9512L0.510889 20.9691C0.448084 21.1032 0.287677 21.16 0.154428 21.0964C0.0313642 21.0404 -0.0263485 20.9029 0.010995 20.7781Z"
        fill={color}
      />
      <path
        d="M26.5827 32.9234C26.2457 32.9234 25.9215 32.7893 25.6822 32.5508C25.4344 32.303 25.2994 31.9635 25.3104 31.613C25.3189 31.3261 25.5701 24.544 30.0149 20.0993C34.4698 15.6452 39.0953 14.2856 41.5226 16.7112C43.9508 19.1402 42.5895 23.7649 38.1345 28.219C33.6907 32.6637 26.9069 32.9149 26.6217 32.9234C26.6081 32.9234 26.5954 32.9234 26.5827 32.9234ZM38.4248 18.0607C36.8997 18.0607 34.4978 19.2166 31.8159 21.8986C29.2264 24.488 28.3242 28.1893 28.0145 30.2194C30.0446 29.9096 33.7458 29.0074 36.3353 26.418C40.0026 22.7498 40.8182 19.6062 39.7233 18.5113C39.428 18.2168 38.9858 18.0607 38.4248 18.0607Z"
        fill={color}
      />
      <path
        d="M18.0217 29.4462C17.7272 29.4462 17.4386 29.3435 17.2086 29.1526C17.0465 29.0176 13.2417 25.795 14.4528 21.2425C14.9561 19.3507 16.0297 17.8477 17.4759 17.01C18.62 16.348 19.9262 16.1655 21.1509 16.494C22.3943 16.8267 23.4433 17.6525 24.1061 18.8177C24.9336 20.2724 25.1 22.1023 24.5738 23.9694C23.3321 28.3768 18.4732 29.3817 18.2669 29.4225C18.1863 29.4386 18.104 29.4462 18.0217 29.4462ZM19.9372 18.8805C19.5375 18.8805 19.1352 18.9926 18.7524 19.2149C17.9079 19.7038 17.2375 20.6824 16.9132 21.8986C16.3225 24.1231 17.6406 25.941 18.3824 26.749C19.4314 26.3908 21.5192 25.425 22.1244 23.2803C22.4596 22.0912 22.3747 20.9243 21.8944 20.0781C21.5659 19.501 21.0813 19.1122 20.4931 18.9544C20.3098 18.9043 20.1239 18.8805 19.9372 18.8805Z"
        fill={color}
      />
      <path
        d="M35.2005 44.0178C31.613 44.0178 29.1975 41.1644 29.0804 41.0244C28.836 40.7299 28.7375 40.3412 28.8114 39.9652C28.8521 39.759 29.8561 34.9009 34.2652 33.6592C36.1307 33.1347 37.9605 33.2985 39.4152 34.1269C40.5805 34.7897 41.4063 35.8396 41.7398 37.0821C42.0683 38.3094 41.885 39.6138 41.223 40.7579C40.3861 42.205 38.8831 43.2786 36.9913 43.781C36.3675 43.9465 35.7691 44.0178 35.2005 44.0178ZM31.4814 39.8472C32.2885 40.589 34.1116 41.9122 36.3361 41.3198C37.5531 40.9964 38.53 40.3268 39.0189 39.4814C39.3448 38.9196 39.4347 38.3179 39.2803 37.7407C39.1224 37.1526 38.7337 36.6679 38.1566 36.3395C37.3104 35.8591 36.1417 35.7742 34.9561 36.1095C32.7867 36.7206 31.8319 38.8016 31.4814 39.8472Z"
        fill={color}
      />
      <path
        d="M14.9807 30.1303C13.8112 30.1303 12.6671 29.7501 11.7064 29.0176C10.3442 27.9813 9.5625 26.4044 9.5625 24.6926V23.4195H12.1086V24.6926C12.1086 25.6024 12.5237 26.4401 13.2485 26.9909C13.9733 27.5426 14.8916 27.7182 15.7666 27.4755L18.9103 26.6056L19.5892 29.0592L16.4464 29.9291C15.961 30.0649 15.4687 30.1303 14.9807 30.1303Z"
        fill={color}
      />
      <path
        d="M29.5863 41.5396L28.3225 40.2733C26.6073 38.558 25.4038 35.5756 25.2706 32.9633C22.6574 32.8309 19.675 31.6266 17.9597 29.9113L16.6943 28.6459L18.4944 26.8457L19.7598 28.1112C21.2366 29.5879 24.3505 30.6488 26.4223 30.3883C26.8135 30.3365 27.2048 30.4723 27.4832 30.7507C27.7615 31.0291 27.8956 31.4212 27.8464 31.8116C27.5816 33.8841 28.6467 36.9972 30.1244 38.4748L31.389 39.7428L29.5863 41.5396Z"
        fill={color}
      />
      <path
        d="M35.0214 48.8801H33.5608C31.8854 48.8801 30.3297 48.1256 29.2934 46.8092C28.2571 45.4929 27.8871 43.8039 28.2792 42.1753L29.1211 38.676L31.5968 39.2726L30.754 42.7711C30.5461 43.6367 30.7422 44.5347 31.2938 45.234C31.8447 45.9334 32.6713 46.334 33.5616 46.334H35.0222V48.8801H35.0214Z"
        fill={color}
      />
    </g>
  </svg>
)

LogoWithText.defaultProps = {
  color: colors.white,
}

export default LogoWithText