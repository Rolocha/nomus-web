import { chakra } from '@chakra-ui/system'
import * as React from 'react'
import { colors } from 'src/styles'

interface Props extends React.ComponentProps<typeof chakra.svg> {}

const Logo = ({ className, color = colors.primaryBlue }: Props) => (
  <chakra.svg
    color={color}
    className={className}
    width="149"
    height="45"
    viewBox="0 0 149 45"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path
        d="M67.4239 21.9396V31.8181C67.4239 32.0396 67.238 32.2197 67.008 32.2197H65.4513C65.2219 32.2197 65.0354 32.0402 65.0354 31.8181V22.3941C65.0354 20.8798 64.6808 19.7506 63.9828 19.0338C63.2961 18.3222 62.2818 17.9581 60.9741 17.9581C60.1378 17.9581 59.3726 18.151 58.697 18.5361C58.0208 18.9212 57.4777 19.4565 57.0955 20.1198C56.702 20.8155 56.5082 21.559 56.5082 22.3941V31.8174C56.5082 32.0389 56.3224 32.2191 56.0923 32.2191H54.5079C54.2786 32.2191 54.092 32.0396 54.092 31.8174V16.4762C54.092 16.2547 54.2779 16.0746 54.5079 16.0746H55.5671C55.7734 16.0746 55.9487 16.221 55.9783 16.4183L56.1813 17.771C57.05 16.8747 58.2528 16.2331 59.6962 15.8766C59.7193 15.8709 59.7443 15.8664 59.768 15.8633C62.2257 15.5552 64.2168 16.0529 65.6562 17.3375C66.8314 18.3808 67.4239 19.9326 67.4239 21.9396Z"
        fill="currentColor"
      />
      <path
        d="M130.732 16.1757V31.5175C130.732 31.739 130.546 31.9192 130.316 31.9192H129.263C129.057 31.9192 128.882 31.7728 128.852 31.5754L128.649 30.2228C127.706 31.1948 126.419 31.8542 124.747 32.1623C124.727 32.1662 124.707 32.1687 124.687 32.1706C122.399 32.3858 120.535 31.8753 119.169 30.6563C118 29.613 117.407 28.0662 117.407 26.0541V16.1757C117.407 15.9542 117.593 15.774 117.823 15.774H119.374C119.604 15.774 119.79 15.9536 119.79 16.1757V25.6047C119.79 27.114 120.145 28.2432 120.843 28.965C121.547 29.6875 122.533 30.035 123.852 30.035C124.688 30.035 125.453 29.8422 126.129 29.4621C126.805 29.077 127.348 28.5468 127.73 27.8727C128.124 27.1929 128.317 26.4335 128.317 25.6041V16.1757C128.317 15.9542 128.503 15.774 128.733 15.774H130.318C130.546 15.774 130.732 15.9542 130.732 16.1757Z"
        fill="currentColor"
      />
      <path
        d="M84.933 19.5786C84.3293 18.3476 83.4758 17.3953 82.4008 16.7479C81.3206 16.1006 80.0795 15.774 78.6994 15.774C77.3193 15.774 76.073 16.1006 74.9928 16.7479C73.9178 17.3953 73.0643 18.3482 72.4606 19.5786C71.8674 20.783 71.5688 22.2489 71.5688 23.9236V24.373C71.5688 26.0478 71.8681 27.5143 72.4606 28.718C73.0643 29.9434 73.9178 30.8905 74.9928 31.5379C76.0677 32.191 77.314 32.5226 78.6994 32.5226C80.0848 32.5226 81.3259 32.191 82.4008 31.5436C83.4758 30.8905 84.3293 29.9434 84.933 28.718C85.5262 27.5035 85.8307 26.0427 85.8307 24.373V23.9236C85.83 22.2546 85.5255 20.7938 84.933 19.5786ZM78.6994 30.3348C77.2976 30.3348 76.1897 29.8587 75.3137 28.8848C74.4325 27.9058 73.9837 26.45 73.9837 24.5557V23.7422C73.9837 21.853 74.4325 20.3921 75.3137 19.408C76.189 18.4341 77.2976 17.958 78.6994 17.958C80.096 17.958 81.2039 18.4341 82.0792 19.408C82.9604 20.3928 83.4092 21.8536 83.4092 23.7422V24.5557C83.4092 26.45 82.9604 27.9058 82.0792 28.8848C81.2039 29.8587 80.0953 30.3348 78.6994 30.3348Z"
        fill="currentColor"
      />
      <path
        d="M112.193 21.9389V31.8173C112.193 32.0389 112.007 32.219 111.777 32.219H110.193C109.963 32.219 109.777 32.0395 109.777 31.8173V22.3934C109.777 19.4074 108.641 17.9574 106.303 17.9574C105.184 17.9574 104.291 18.3641 103.577 19.1935C102.857 20.0338 102.491 21.1146 102.491 22.3934V31.8167C102.491 32.0382 102.305 32.2184 102.075 32.2184H100.49C100.261 32.2184 100.075 32.0389 100.075 31.8167V22.3934C100.075 19.4074 98.939 17.9574 96.6059 17.9574C95.4808 17.9574 94.5891 18.3641 93.8799 19.1935C93.1543 20.0338 92.7885 21.1095 92.7885 22.3934V31.8167C92.7885 32.0382 92.6026 32.2184 92.3726 32.2184H90.7882C90.5588 32.2184 90.3723 32.0389 90.3723 31.8167V16.4755C90.3723 16.254 90.5582 16.0739 90.7882 16.0739H91.846C92.0503 16.0739 92.2243 16.2177 92.2566 16.4125L92.4669 17.6951C93.2538 16.7893 94.3347 16.1464 95.6687 15.846C95.6911 15.8409 95.7148 15.8371 95.7379 15.8339C97.2458 15.6537 98.6134 15.8804 99.7701 16.48C100.346 16.7836 100.84 17.1763 101.25 17.6608C101.405 17.8428 101.694 17.8543 101.859 17.6818C102.256 17.2661 102.727 16.8995 103.277 16.5818C104.197 16.0465 105.261 15.7741 106.429 15.7741C108.108 15.7741 109.51 16.3037 110.58 17.3476C111.117 17.8721 111.516 18.5194 111.788 19.2846C112.059 20.0497 112.193 20.9383 112.193 21.9389Z"
        fill="currentColor"
      />
      <path
        d="M149 27.4348C149 29.2114 148.346 30.5278 147.055 31.3463C145.825 32.1274 144.152 32.5239 142.09 32.5239C140.517 32.5239 139.215 32.2725 138.218 31.7855C137.209 31.2935 136.472 30.678 136.024 29.9498C135.985 29.8912 135.952 29.8269 135.918 29.7677H135.913C135.469 29.0777 135.243 28.3552 135.243 27.622L135.275 27.1726C135.281 27.0707 135.326 26.9797 135.397 26.9103C135.403 26.9103 135.403 26.9103 135.403 26.9052C135.475 26.8409 135.575 26.7983 135.685 26.7983H137.242C137.47 26.7983 137.658 26.9803 137.658 27.1999V27.5908C137.658 28.0459 137.835 28.4845 138.206 28.9339C138.395 29.1694 138.639 29.3782 138.938 29.5602C139.786 30.0739 140.982 30.3362 142.495 30.3362C143.825 30.3362 144.866 30.0847 145.576 29.5869C146.257 29.1159 146.584 28.5061 146.584 27.7353C146.584 27.1465 146.412 26.7022 146.047 26.3813C145.648 26.0172 145.144 25.7391 144.557 25.5519C143.919 25.3489 143.055 25.1452 141.98 24.9472C140.695 24.7066 139.653 24.4495 138.877 24.198C138.052 23.9307 137.337 23.4972 136.755 22.9084C136.14 22.2929 135.83 21.4424 135.83 20.3826C135.83 19.0128 136.406 17.8887 137.542 17.0325C138.65 16.198 140.284 15.7747 142.401 15.7747C143.787 15.7747 144.956 15.9994 145.881 16.4488C146.817 16.8982 147.515 17.4819 147.959 18.1719C148.402 18.8619 148.629 19.5844 148.629 20.3177L148.596 20.7671C148.58 20.981 148.402 21.1414 148.18 21.1414H146.629C146.401 21.1414 146.213 20.9593 146.213 20.7397V20.3489C146.213 19.8085 145.958 19.284 145.437 18.7435C144.938 18.2298 143.791 17.9568 142.118 17.9568C140.085 17.9568 139.281 18.3584 138.96 18.6952C138.478 19.2037 138.245 19.7384 138.245 20.3164C138.245 20.7817 138.405 21.1458 138.726 21.4297C139.097 21.7505 139.569 22.0026 140.128 22.1738C140.738 22.361 141.591 22.5647 142.672 22.7785C143.946 23.0408 145.01 23.3081 145.824 23.5704C146.694 23.8486 147.442 24.298 148.046 24.9027C148.679 25.5405 149 26.3909 149 27.4348Z"
        fill="currentColor"
      />
      <path
        d="M0.00823962 15.5823C1.45162 10.9693 4.53084 6.74719 8.7529 3.95916C10.8468 2.55178 13.1911 1.47285 15.666 0.792388C18.1468 0.139301 20.7468 -0.131228 23.3212 0.0559143C25.8955 0.222051 28.4495 0.778384 30.8545 1.7211C33.2594 2.67208 35.4548 4.07756 37.3859 5.74592C39.2992 7.42893 41.0036 9.37546 42.213 11.5995C43.4396 13.8083 44.2944 16.2017 44.7314 18.6619C45.1934 21.1227 45.1301 23.6485 44.7268 26.096C44.3076 28.5422 43.514 30.9413 42.2671 33.1056C39.8127 37.4315 35.9656 41.0451 31.2914 43.0171C28.9734 44.0203 26.4953 44.6664 23.973 44.9108C22.7089 44.9693 21.4441 45.047 20.182 44.9585C18.9212 44.8618 17.6689 44.6854 16.4391 44.4079C11.5184 43.2902 7.04523 40.5441 3.90076 36.7701C3.79333 36.6409 3.81442 36.4525 3.94821 36.3481C4.07871 36.2469 4.26853 36.2641 4.37727 36.385L4.37991 36.3882C7.57513 39.9547 11.983 42.4302 16.6928 43.3284C17.8706 43.5511 19.0629 43.6759 20.2565 43.7268C21.4527 43.7695 22.643 43.6511 23.8267 43.5575C26.1862 43.2443 28.4732 42.5575 30.5869 41.553C34.8393 39.5702 38.2737 36.1317 40.2859 32.1113C41.318 30.1068 41.9211 27.9216 42.1794 25.7281C42.414 23.5333 42.3481 21.2965 41.8182 19.1692C41.3279 17.0394 40.5225 14.9904 39.3869 13.124C38.2388 11.2679 36.8343 9.56069 35.1734 8.11639C33.5152 6.66826 31.6164 5.49385 29.589 4.57406C27.5432 3.688 25.3459 3.14312 23.1017 2.89933C20.8536 2.61989 18.5495 2.75865 16.3158 3.21887C14.0704 3.6498 11.8809 4.45057 9.86411 5.58488C7.84535 6.71919 6.02431 8.19404 4.39309 9.87705C2.77374 11.5772 1.45558 13.562 0.403028 15.7122L0.396437 15.7256C0.347665 15.8261 0.223099 15.8688 0.119624 15.821C0.0240575 15.779 -0.0207599 15.6759 0.00823962 15.5823Z"
        fill="currentColor"
      />
      <path
        d="M20.6431 24.6926C20.3815 24.6926 20.1297 24.592 19.9438 24.4132C19.7514 24.2273 19.6466 23.9727 19.6552 23.7098C19.6617 23.4946 19.8568 18.4081 23.3084 15.0745C26.7679 11.734 30.3599 10.7142 32.2449 12.5335C34.1305 14.3552 33.0733 17.8237 29.6138 21.1643C26.1629 24.4978 20.8949 24.6862 20.6734 24.6926C20.6629 24.6926 20.653 24.6926 20.6431 24.6926ZM29.8392 13.5456C28.6549 13.5456 26.7897 14.4125 24.707 16.424C22.6961 18.3661 21.9955 21.142 21.755 22.6646C23.3315 22.4322 26.2057 21.7556 28.2166 19.8135C31.0645 17.0624 31.6978 14.7047 30.8476 13.8836C30.6183 13.6627 30.2749 13.5456 29.8392 13.5456Z"
        fill="currentColor"
      />
      <path
        d="M13.9949 22.0847C13.7662 22.0847 13.5421 22.0077 13.3635 21.8645C13.2376 21.7633 10.2829 19.3464 11.2235 15.932C11.6143 14.5131 12.448 13.3858 13.5711 12.7576C14.4595 12.2611 15.4739 12.1242 16.4249 12.3705C17.3905 12.6201 18.2051 13.2394 18.7198 14.1134C19.3624 15.2044 19.4916 16.5768 19.083 17.9772C18.1187 21.2827 14.3455 22.0364 14.1854 22.0669C14.1227 22.079 14.0588 22.0847 13.9949 22.0847ZM15.4824 14.1605C15.172 14.1605 14.8596 14.2445 14.5623 14.4113C13.9066 14.7779 13.3859 15.5119 13.1341 16.424C12.6754 18.0924 13.699 19.4558 14.275 20.0618C15.0896 19.7932 16.7109 19.0688 17.1809 17.4603C17.4412 16.5685 17.3753 15.6933 17.0023 15.0586C16.7472 14.6258 16.3709 14.3343 15.9141 14.2159C15.7718 14.1783 15.6274 14.1605 15.4824 14.1605Z"
        fill="currentColor"
      />
      <path
        d="M27.3354 33.0134C24.5495 33.0134 22.6737 30.8734 22.5828 30.7684C22.393 30.5475 22.3165 30.256 22.3739 29.974C22.4055 29.8193 23.1852 26.1758 26.6091 25.2445C28.0578 24.8511 29.4787 24.974 30.6084 25.5952C31.5133 26.0924 32.1546 26.8798 32.4136 27.8117C32.6687 28.7321 32.5263 29.7104 32.0122 30.5685C31.3624 31.6538 30.1952 32.459 28.7261 32.8358C28.2416 32.96 27.777 33.0134 27.3354 33.0134ZM24.4473 29.8855C25.0741 30.4418 26.4898 31.4342 28.2173 30.9899C29.1624 30.7474 29.921 30.2451 30.3006 29.6111C30.5537 29.1898 30.6236 28.7385 30.5036 28.3056C30.381 27.8645 30.0792 27.501 29.631 27.2547C28.9739 26.8944 28.0663 26.8307 27.1456 27.0822C25.461 27.5405 24.7195 29.1013 24.4473 29.8855Z"
        fill="currentColor"
      />
      <path
        d="M11.6335 22.5978C10.7253 22.5978 9.83681 22.3126 9.09074 21.7633C8.03291 20.9861 7.4259 19.8034 7.4259 18.5195V17.5647H9.40314V18.5195C9.40314 19.2019 9.72543 19.8301 10.2883 20.2432C10.8511 20.657 11.5643 20.7888 12.2438 20.6067L14.685 19.9543L15.2123 21.7945L12.7717 22.4469C12.3947 22.5488 12.0124 22.5978 11.6335 22.5978Z"
        fill="currentColor"
      />
      <path
        d="M22.9755 31.1547L21.9941 30.205C20.6622 28.9186 19.7276 26.6818 19.6241 24.7225C17.5948 24.6232 15.2788 23.72 13.9468 22.4335L12.9641 21.4844L14.362 20.1343L15.3447 21.0834C16.4915 22.191 18.9097 22.9867 20.5185 22.7912C20.8223 22.7524 21.1261 22.8543 21.3423 23.063C21.5585 23.2718 21.6626 23.5659 21.6244 23.8587C21.4188 25.4131 22.2459 27.748 23.3934 28.8562L24.3754 29.8072L22.9755 31.1547Z"
        fill="currentColor"
      />
      <path
        d="M27.1963 36.6602H26.062C24.761 36.6602 23.5529 36.0943 22.7482 35.107C21.9435 34.1197 21.6561 32.853 21.9606 31.6315L22.6144 29.0071L24.5369 29.4546L23.8825 32.0784C23.721 32.7276 23.8732 33.4011 24.3016 33.9256C24.7294 34.4501 25.3713 34.7506 26.0627 34.7506H27.197V36.6602H27.1963Z"
        fill="currentColor"
      />
    </g>
  </chakra.svg>
)

export default Logo
