import Swal from "sweetalert2";
export const apiURL = "http://localhost:8000/api";
export const baseURL = "http://localhost:8000/";
export const wssURL = "ws://localhost:3002";
export const Toast = Swal.mixin( {
  toast: true,
  position: "top-end",
  iconColor: "white",
  customClass: {
    popup: "colored-toast",
  },
  showConfirmButton: false,
  timer: 3000,

  timerProgressBar: true,
} );

// export const apiURL = "https://app.lumed.ai/api";
// export const baseURL = "https://app.lumed.ai/";
// export const wssURL = "wss://app.lumed.ai";
