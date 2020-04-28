import * as React from 'react'
import { colors } from 'src/styles'
import { SVGProps } from 'src/components/SVG/types'

const Logo = ({ className, width }: SVGProps) => (
  <svg
    width={width}
    className={className}
    viewBox="0 0 155 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0)">
      <path
        d="M145.918 16.5279C144.821 16.3619 144.243 15.1866 144.372 14.1771C144.449 13.5687 144.691 12.9533 145.042 12.4071C144.456 11.4323 144.137 10.4539 144.116 9.93884C144.109 9.70723 144.123 9.47907 144.155 9.2509C143.429 9.02274 142.683 8.63556 142.28 8.23801C142.013 7.97873 141.726 7.58809 141.463 7.11794C139.966 7.21474 138.189 6.29172 138.48 4.58743C138.501 4.46643 138.536 4.33853 138.617 4.24519C138.697 4.14839 138.838 4.09308 138.953 4.13802C139.104 4.19333 139.156 4.37655 139.209 4.52866C139.437 5.18894 140.18 5.35488 140.814 5.50699C140.495 4.3005 140.495 2.9177 141.228 1.70776C142.273 -0.020735 144.151 -0.224697 145.15 0.17977C145.722 0.411388 146.202 0.978334 146.43 1.69739C146.71 2.57892 146.57 3.55033 146.041 4.36272C145.199 5.65564 144.109 6.32975 143.054 6.71348C143.173 6.89324 143.289 7.03843 143.391 7.13869C143.608 7.35302 144.172 7.63649 144.691 7.79206C144.789 7.62958 144.898 7.47056 145.021 7.31499C146.812 5.05066 150.159 2.87276 153.09 3.08018C153.994 3.14587 154.699 3.67133 154.926 4.45261C155.179 5.32722 154.779 6.32629 153.931 6.93818C151.625 8.60445 148.834 9.47561 145.83 9.47561C145.792 9.47561 145.757 9.47561 145.718 9.47561C145.697 9.61043 145.69 9.74871 145.694 9.89045C145.701 10.1221 145.865 10.6233 146.153 11.1834C146.458 10.9517 146.78 10.7685 147.117 10.651C148.855 10.0426 150.349 10.091 151.32 10.7858C151.979 11.2594 152.333 11.9923 152.312 12.8565C152.294 13.4995 152.045 14.0561 151.586 14.464C150.962 15.0206 149.998 15.2661 148.796 15.1727C147.73 15.0932 146.822 14.5297 146.1 13.7934C146.023 13.9904 145.967 14.1875 145.943 14.3776C145.883 14.8581 145.96 15.4666 146.44 15.7155C147.176 16.0992 146.812 16.5866 146.097 16.5486C146.03 16.5451 145.974 16.5382 145.918 16.5279ZM147.022 12.4866C147.541 13.0882 148.186 13.5652 148.911 13.6205C149.648 13.6758 150.236 13.5618 150.524 13.306C150.608 13.2299 150.724 13.0951 150.731 12.8151C150.738 12.4659 150.629 12.2101 150.391 12.0407C149.868 11.6673 148.841 11.695 147.639 12.1133C147.432 12.1859 147.222 12.3173 147.022 12.4866ZM152.694 4.61854C150.622 4.61854 148.091 6.19147 146.581 7.89577C148.961 7.7644 151.158 7.01078 153.002 5.67984C153.367 5.41711 153.472 5.07832 153.412 4.87782C153.37 4.72917 153.223 4.6462 152.978 4.62546C152.879 4.622 152.788 4.61854 152.694 4.61854ZM144.162 1.55565C143.71 1.55565 143.033 1.74579 142.578 2.49941C142.059 3.3602 142.122 4.40075 142.395 5.29265C143.251 5.00227 144.071 4.50446 144.712 3.51922C145.087 2.9419 145.007 2.4199 144.923 2.16062C144.814 1.81838 144.625 1.64553 144.547 1.61442C144.467 1.58331 144.33 1.55565 144.162 1.55565Z"
        fill={colors.primaryGold}
      />
      <path
        d="M46.4474 10.1428C47.8775 11.3458 48.5961 12.9222 48.5961 14.872C48.5961 15.5288 48.5085 16.2617 48.3297 17.0706C47.9091 18.8648 47.1204 20.4343 45.9672 21.7825C44.814 23.1272 43.3979 24.1678 41.7224 24.9007C40.0469 25.6336 38.2312 26 36.2788 26C33.1942 26 30.9124 25.3916 29.4367 24.1782C27.961 22.9648 27.2214 21.3504 27.2214 19.3349C27.2214 18.6574 27.309 17.9003 27.4878 17.0706C27.9084 15.3629 28.7146 13.8487 29.8993 12.5247C31.0876 11.2006 32.5388 10.1705 34.2598 9.43758C35.9809 8.7047 37.8176 8.33826 39.77 8.33826C42.788 8.33826 45.0138 8.93977 46.4474 10.1428ZM38.1891 12.4901C37.6669 13.3129 37.05 14.8581 36.3419 17.1363C35.6304 19.4144 35.2763 21.0116 35.2763 21.9311C35.2763 22.4117 35.3534 22.7366 35.5112 22.8991C35.6654 23.0616 35.8757 23.1445 36.1421 23.1445C36.6083 23.1895 37.092 22.7954 37.5898 21.9622C38.0875 21.1291 38.7149 19.5112 39.4721 17.1017C40.1591 14.9791 40.5026 13.4373 40.5026 12.4728C40.5026 12.013 40.429 11.695 40.2853 11.5221C40.1415 11.3458 39.9347 11.2594 39.6683 11.2594C39.2057 11.2594 38.7114 11.6708 38.1891 12.4901Z"
        fill={colors.primaryTeal}
      />
      <path
        d="M61.4076 2.16407C62.0175 2.64459 62.3225 3.30142 62.3225 4.13455C62.3225 4.61507 62.2453 5.08522 62.0876 5.545L56.8614 22.2907C56.7948 22.5534 56.7632 22.7815 56.7632 22.9786C56.7632 23.2621 56.8193 23.4868 56.928 23.6527C57.0401 23.8152 57.1944 23.9742 57.3941 24.1298C57.5484 24.2819 57.6605 24.4098 57.7271 24.5066C57.7937 24.6068 57.8043 24.7313 57.7587 24.8834C57.6465 25.1669 57.4257 25.3743 57.0927 25.5056C56.7597 25.637 56.2479 25.7027 55.5609 25.7027H47.9722C47.3938 25.7027 46.9732 25.6094 46.7068 25.4227C46.4404 25.236 46.3528 24.9906 46.4404 24.6829C46.528 24.4202 46.7629 24.192 47.1379 23.9949C47.4709 23.8186 47.7478 23.6112 47.9687 23.3727C48.1895 23.1307 48.3788 22.7504 48.5365 22.225L53.598 5.8423C53.6646 5.64526 53.6962 5.48278 53.6962 5.35141C53.6962 5.10942 53.6366 4.91237 53.5139 4.76027C53.3912 4.60816 53.23 4.45259 53.0302 4.30049C52.8093 4.12418 52.6481 3.97207 52.5465 3.84071C52.4483 3.70934 52.4308 3.53304 52.4974 3.31525C52.6306 2.81053 53.3316 2.37495 54.5935 2.00159C55.8589 1.62824 57.1803 1.44156 58.5544 1.44156C59.8478 1.44156 60.7977 1.68355 61.4076 2.16407Z"
        fill={colors.primaryTeal}
      />
      <path
        d="M78.9827 10.1428C80.4128 11.3458 81.1314 12.9222 81.1314 14.872C81.1314 15.5288 81.0437 16.2617 80.865 17.0706C80.4443 18.8648 79.6557 20.4343 78.5025 21.7825C77.3493 23.1272 75.9332 24.1678 74.2577 24.9007C72.5822 25.6336 70.7665 26 68.8141 26C65.7295 26 63.4476 25.3916 61.9719 24.1782C60.4963 22.9648 59.7567 21.3504 59.7567 19.3349C59.7567 18.6574 59.8443 17.9003 60.0231 17.0706C60.4437 15.3629 61.2499 13.8487 62.4346 12.5247C63.6229 11.2006 65.074 10.1705 66.7951 9.43758C68.5162 8.7047 70.3529 8.33826 72.3053 8.33826C75.3268 8.33826 77.5491 8.93977 78.9827 10.1428ZM70.7279 12.4901C70.2057 13.3129 69.5887 14.8581 68.8807 17.1363C68.1691 19.4144 67.8151 21.0116 67.8151 21.9311C67.8151 22.4117 67.8922 22.7366 68.05 22.8991C68.2042 23.0616 68.4145 23.1445 68.6809 23.1445C69.1471 23.1895 69.6308 22.7954 70.1285 21.9622C70.6263 21.1291 71.2537 19.5112 72.0108 17.1017C72.6979 14.9791 73.0414 13.4373 73.0414 12.4728C73.0414 12.013 72.9678 11.695 72.824 11.5221C72.6803 11.3458 72.4735 11.2594 72.2071 11.2594C71.7409 11.2594 71.2467 11.6708 70.7279 12.4901Z"
        fill={colors.primaryTeal}
      />
      <path
        d="M96.9083 8.74617C97.9283 9.1299 98.724 9.65536 99.2883 10.3226C99.8527 10.9898 100.137 11.7296 100.137 12.5385C100.137 13.4131 99.8316 14.1356 99.2217 14.706C98.6118 15.2764 97.7846 15.5599 96.7401 15.5599C95.6745 15.5599 94.8437 15.2937 94.2444 14.7544C93.645 14.2186 93.347 13.4892 93.347 12.5696C93.347 12.3 93.5643 11.7572 93.2384 11.6362C92.7792 11.4634 92.2779 11.7054 91.8468 11.9404C91.5629 12.096 91.2965 12.3898 91.0651 12.618C90.3431 13.3301 89.8629 14.267 89.6175 15.4251C89.4843 16.0819 89.4177 16.673 89.4177 17.1985C89.4177 18.3808 89.7507 19.2796 90.4167 19.8915C91.0827 20.5034 92.0361 20.8111 93.2804 20.8111C94.3916 20.8111 95.4011 20.5345 96.3159 19.888C96.5368 19.7325 96.7471 19.5596 97.0029 19.4732C97.2588 19.3868 97.5743 19.4041 97.7566 19.6011C98.058 19.9226 97.9564 20.6728 97.8442 21.053C97.6689 21.6442 97.3394 22.18 96.9574 22.664C96.2598 23.549 95.2924 24.2957 94.0621 24.8972C92.8318 25.4987 91.4472 25.7995 89.9189 25.7995C88.3206 25.7995 86.908 25.5091 85.6741 24.9283C84.4438 24.3476 83.4869 23.5179 82.8104 22.4324C82.1339 21.3503 81.7939 20.0851 81.7939 18.6401C81.7939 17.9625 81.8815 17.2054 82.0603 16.3757C82.6597 13.662 83.9846 11.6155 86.0387 10.2361C88.0927 8.85679 90.5253 8.16885 93.347 8.16885C94.7 8.17231 95.8883 8.3659 96.9083 8.74617Z"
        fill={colors.primaryTeal}
      />
      <path
        d="M119.009 21.174C118.917 21.4679 118.714 22.0175 119.117 22.1973C119.559 22.3944 120.018 21.9484 120.263 21.6684C120.821 21.0289 121.371 21.5405 121.29 22.3702C121.21 23.1791 120.849 23.7944 120.337 24.4236C119.047 26.0035 117.056 26.0035 115.146 26.0035C113.681 26.0035 112.517 25.6716 111.651 25.0009C110.785 24.3337 110.34 23.4418 110.319 22.3252C110.319 21.5163 110.519 20.6071 110.919 19.6011L112.748 14.872C112.86 14.5885 112.913 14.3569 112.913 14.184C112.913 13.9005 112.818 13.6758 112.629 13.5099C112.44 13.3474 112.212 13.2645 111.946 13.2645C111.525 13.2645 111.097 13.4546 110.663 13.8383C110.228 14.222 109.881 14.8408 109.615 15.6947V15.6256L107.519 22.2907C107.452 22.5534 107.42 22.7815 107.42 22.9786C107.42 23.2621 107.476 23.4868 107.585 23.6527C107.697 23.8152 107.852 23.9742 108.051 24.1298C108.206 24.2819 108.318 24.4098 108.384 24.5066C108.451 24.6068 108.461 24.7313 108.416 24.8834C108.304 25.1669 108.083 25.3743 107.75 25.5056C107.417 25.637 106.905 25.7027 106.218 25.7027H98.6364C98.058 25.7027 97.6374 25.6094 97.371 25.4227C97.1046 25.236 97.017 24.9906 97.1046 24.6829C97.1922 24.4202 97.4271 24.192 97.8021 23.9949C98.1351 23.8186 98.412 23.6112 98.6329 23.3727C98.8537 23.1307 99.043 22.7504 99.2007 22.225L104.262 5.8423C104.329 5.64526 104.36 5.48278 104.36 5.35141C104.36 5.10942 104.301 4.91237 104.178 4.76027C104.055 4.60816 103.894 4.45259 103.694 4.30049C103.474 4.12418 103.312 3.97207 103.211 3.84071C103.113 3.70934 103.095 3.53304 103.162 3.31525C103.295 2.81053 103.996 2.37495 105.258 2.00159C106.523 1.62824 107.845 1.44156 109.219 1.44156C110.505 1.44156 111.455 1.68355 112.065 2.16407C112.675 2.64459 112.98 3.30142 112.98 4.13455C112.98 4.61507 112.903 5.08522 112.745 5.545L110.947 11.3216C111.812 10.205 112.727 9.4272 113.691 8.99162C114.655 8.55258 115.707 8.33479 116.839 8.33479C118.192 8.33479 119.285 8.73926 120.116 9.54819C120.947 10.3571 121.364 11.4081 121.364 12.701C121.364 13.3785 121.252 14.0457 121.031 14.7026C121.042 14.706 119.009 21.174 119.009 21.174Z"
        fill={colors.primaryTeal}
      />
      <path
        d="M141.638 21.3227C141.508 21.4713 141.319 21.6684 141.102 21.7859C141.018 21.817 140.927 21.8309 140.832 21.8309C140.541 21.8309 140.397 21.658 140.397 21.3054C140.397 21.174 140.408 21.0669 140.432 20.977L141.796 16.4483C142.062 15.5288 142.195 14.706 142.195 13.9835C142.195 12.0822 141.431 10.6648 139.9 9.73488C138.368 8.80495 136.324 8.33826 133.772 8.33826C131.221 8.33826 129.324 8.69778 128.08 9.42029C126.839 10.1428 126.215 11.052 126.215 12.1479C126.215 12.8462 126.52 13.4339 127.134 13.904C127.744 14.3742 128.592 14.6092 129.678 14.6092C130.832 14.6092 131.722 14.3119 132.342 13.7208C132.963 13.1331 133.275 12.4313 133.275 11.6224C133.275 11.37 133.022 10.7478 133.31 10.6372C133.397 10.6026 133.496 10.606 133.59 10.613C133.923 10.6337 134.34 10.7236 134.607 10.931C134.94 11.1937 135.115 11.5878 135.14 12.1133C135.14 12.618 134.992 13.3301 134.705 14.2462L133.874 16.4138C132.097 15.8468 130.288 15.5599 128.448 15.5599C126.804 15.5599 125.392 15.9436 124.203 16.7111C123.015 17.4751 122.244 18.6159 121.89 20.1231C121.823 20.4515 121.788 20.7938 121.788 21.1429C121.788 21.9311 121.984 22.6813 122.37 23.39C122.759 24.1021 123.355 24.6829 124.154 25.1323C124.953 25.5817 125.938 25.8064 127.116 25.8064C128.157 25.8064 129.135 25.5921 130.046 25.1634C130.954 24.7382 131.743 24.1298 132.409 23.3416C132.721 24.1505 133.289 24.7624 134.105 25.1807C135.111 25.6958 136.089 25.8444 137.6 25.7822C138.974 25.7234 140.66 25.3605 141.708 24.0745C142.224 23.4487 142.585 22.8334 142.665 22.0245C142.746 21.1948 142.195 20.6832 141.638 21.3227ZM132.476 20.3202C132.321 20.7799 132.069 21.1256 131.725 21.3573C131.382 21.5854 131.066 21.6995 130.779 21.6995C130.467 21.6995 130.229 21.5923 130.06 21.3711C129.896 21.1533 129.812 20.8698 129.812 20.5172C129.812 19.971 130.008 19.4628 130.393 18.9927C130.783 18.5225 131.287 18.2875 131.908 18.2875C132.374 18.2875 132.798 18.3186 133.173 18.3843L132.476 20.3202Z"
        fill={colors.primaryTeal}
      />
      <path
        d="M24.6907 13.4823C23.6882 14.1944 22.4403 14.6369 20.9471 14.8132C22.0092 14.8996 22.7979 15.2073 23.3096 15.7328C23.8214 16.2582 24.0632 16.9462 24.0317 17.8C24.0177 18.1284 23.9476 18.5329 23.8179 19.0134L23.3902 20.6209C23.3377 20.8387 23.3096 20.9943 23.3061 21.0807C23.2641 22.225 24.7608 22.2561 25.602 22.0037C25.8544 21.9277 26.1033 21.8171 26.3627 21.7859C26.622 21.7548 26.9165 21.8205 27.0602 22.0348C27.1268 22.1351 27.5053 22.8645 26.4328 23.9604C26.0086 24.396 25.3847 24.7831 24.8239 25.0217C23.2851 25.6785 21.6867 26.0242 19.9867 25.9931C18.5671 25.9654 17.2036 25.9343 16.0363 25.0355C15.1951 24.389 14.7955 23.466 14.8411 22.263C14.8586 21.8032 14.9427 21.3123 15.0969 20.7869L15.7103 18.685C15.8085 18.4015 15.8646 18.1042 15.8786 17.8C15.8961 17.2953 15.7384 16.9358 15.4019 16.718C15.0654 16.5002 14.5221 16.3896 13.765 16.3896H12.4996L10.761 21.8378C10.7119 21.9692 10.6839 22.1351 10.6769 22.3287C10.6664 22.6364 10.733 22.8991 10.8802 23.1169C11.0274 23.3347 11.2307 23.5663 11.4866 23.8048C11.6794 23.9569 11.8301 24.1056 11.9352 24.2473C12.0404 24.389 12.0895 24.5377 12.086 24.6898C12.0719 25.0632 11.8827 25.3259 11.5251 25.478C11.1641 25.6301 10.6383 25.7096 9.9513 25.7096H1.5949C1.01654 25.7096 0.588907 25.6059 0.308491 25.3985C0.028075 25.1911 -0.059555 24.9007 0.0420958 24.5273C0.0946738 24.3303 0.182304 24.1713 0.308491 24.0503C0.434678 23.9293 0.623959 23.7944 0.872828 23.6389C1.2584 23.4211 1.56686 23.1895 1.7982 22.9509C2.02954 22.709 2.22233 22.3391 2.37305 21.8343C2.45017 21.5751 2.5413 21.3227 2.62192 21.0634C3.33699 18.8648 4.04854 16.6627 4.7636 14.464C5.1667 13.223 5.5698 11.9819 5.9729 10.7374C6.28836 9.766 6.66693 8.51457 6.8492 7.63995C7.06652 6.58903 6.12362 5.95294 5.16319 6.2053C4.67247 6.33321 4.43762 6.49914 4.58484 6.96584C4.67597 7.25277 5.10361 7.13869 5.36299 7.62958C5.82918 8.51111 5.78362 9.73834 4.7601 10.2915C4.25184 10.5646 3.63493 10.5818 3.10214 10.3952C2.83574 10.3018 1.88233 10.0149 1.53181 8.7531C1.2584 7.76786 1.44418 6.56483 1.98047 5.6591C2.75863 4.34199 4.33246 3.80615 7.07704 3.80615C11.5111 3.80615 15.2582 3.84072 19.6958 3.84072C21.2275 3.84072 22.556 4.06888 23.6812 4.52866C24.8063 4.98844 25.6581 5.61761 26.24 6.41618C26.8218 7.21474 27.0917 8.11701 27.0532 9.123C27.0357 9.58278 26.9515 10.0426 26.8008 10.5023C26.3977 11.7814 25.6932 12.7701 24.6907 13.4823ZM18.5005 9.03312C18.5425 7.87502 17.9221 7.29425 16.6357 7.29425H15.2371L13.5546 13.1054H14.9532C15.819 13.1054 16.5095 12.898 17.0248 12.4832C17.5401 12.0683 17.9607 11.3009 18.2937 10.1843C18.4199 9.67957 18.49 9.29585 18.5005 9.03312Z"
        fill={colors.primaryTeal}
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <path d="M0 0H155V26H0V0Z" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

Logo.defaultProps = {
  width: '180px',
}

export default Logo
