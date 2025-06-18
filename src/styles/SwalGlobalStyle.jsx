import {createGlobalStyle} from "styled-components";

const SwalGlobalStyle = createGlobalStyle`
    .swal2-popup.custom-swal-popup {
        width: 400px !important;
        padding: 0.6rem !important;
        border-radius: 12px !important;
    }

    .swal2-confirm.custom-swal-button,
    .swal2-cancel.custom-swal-button {
        font-size: 14px !important;
        padding: 10px 30px !important;
        border-radius: 8px !important;
        background-color: black !important;
        color: white !important;
        border: none !important;
        box-shadow: none !important;
    }

    .swal2-cancel.custom-swal-button:hover,
    .swal2-confirm.custom-swal-button:hover {
        background-color: var(--main-color) !important;
    }
`;
export default SwalGlobalStyle;
