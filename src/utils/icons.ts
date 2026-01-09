// src/utils/icons.ts

export const createSvgIcon = (path: string, viewBox: string = "0 0 24 24") => {
  return `<svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="${viewBox}" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="1.5" 
    stroke-linecap="round" 
    stroke-linejoin="round"
    style="width: 24px; height: 24px; vertical-align: middle; margin-right: 5px;">
      <path d="${path}"/>
  </svg>`;
};

export const icons = {
  // --- GENERAL / UI ---
  logo: createSvgIcon("M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z M9 4v13 M15 7v13"),
  home: createSvgIcon("M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10"),
  search: createSvgIcon("M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"),
  plus: createSvgIcon("M12 4v16m8-8H4"),
  check: createSvgIcon("M5 13l4 4L19 7"),
  close: createSvgIcon("M6 18L18 6M6 6l12 12"),
  menuAlt: createSvgIcon("M4 6h16M4 12h16M4 18h7"),
  mail: createSvgIcon("M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"),
  documentText: createSvgIcon("M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"),
  menu: createSvgIcon("M4 6h16M4 12h16M4 18h7"),
  dotsHorizontal: createSvgIcon("M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"),
  edit: createSvgIcon("M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"),
  trash: createSvgIcon("M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"),
  alertCircle: createSvgIcon("M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"),
  infoCircle: createSvgIcon("M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"),
  
  // --- SESIÓN Y USUARIOS ---
  login: createSvgIcon("M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"),
  logout: createSvgIcon("M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9"),
  users: createSvgIcon("M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M16 3.13a4 4 0 0 1 0 7.75 M23 21v-2a4 4 0 0 0-3-3.87 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"),
  user: createSvgIcon("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"),
  userCheck: createSvgIcon("M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"),
  userX: createSvgIcon("M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"),
  userShield: createSvgIcon("M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"),
  userSettings: createSvgIcon("M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"),
  userOff: createSvgIcon("M8.18 8.189a4.01 4.01 0 0 0 2.616 2.627m3.507 -.545a4 4 0 1 0 -5.59 -5.552 M6 21v-2a4 4 0 0 1 4 -4h4c.412 0 .81 .062 1.183 .178m2.633 2.618c.12 .38 .184 .785 .184 1.204v2 M3 3l18 18"),
  userPlus: createSvgIcon("M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0 M16 19h6 M19 16v6 M6 21v-2a4 4 0 0 1 4 -4h4"),

  // --- ÁREAS Y EDIFICIOS ---
  building: createSvgIcon("M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18 M6 12H4a2 2 0 0 0-2 2v6 M18 12h2a2 2 0 0 1 2 2v6 M6 6h.01 M6 10h.01 M6 14h.01 M6 18h.01 M10 6h.01 M10 10h.01 M10 14h.01 M10 18h.01 M14 6h.01 M14 10h.01 M14 14h.01 M14 18h.01"),
  officeBuilding: createSvgIcon("M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"),
  
  // --- ACTIVIDAD Y ESTADÍSTICAS ---
  receipt: createSvgIcon("M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8"),
  clipboardList: createSvgIcon("M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"),
  clock: createSvgIcon("M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"),
  history: createSvgIcon("M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"),
  refresh: createSvgIcon("M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"),
  palette: createSvgIcon("M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.826.57 3.518 1.543 4.908.243.348.606.592 1.026.592h.856c.924 0 1.675.751 1.675 1.675 0 .393.155.753.407 1.018A2.37 2.37 0 0 0 9.875 22H12z M17.5 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z M7 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z M13.5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"),
  sun: createSvgIcon("M12 3v1 M12 20v1 M4.22 4.22l.707.707 M19.07 19.07l.707.707 M1 12h1 M20 12h1 M4.22 19.78l.707-.707 M19.07 4.93l.707-.707 M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"),
  moon: createSvgIcon("M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"),
  snowflake: createSvgIcon("M2 12h20 M12 2v20 M20 20l-5-5 M4 4l5 5 M4 20l5-5 M20 4l-5 5"),
  eye: createSvgIcon("M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"),
  date: createSvgIcon("M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"),
  filter: createSvgIcon("M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"),
  chat: createSvgIcon("M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"),
  trendingUp: createSvgIcon("M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"),
  barChart: createSvgIcon("M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"),
  inbox: createSvgIcon("M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"),
  list: createSvgIcon("M4 6h16M4 10h16M4 14h16M4 18h16"),
  warning: createSvgIcon("M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"),
  arrowUp: createSvgIcon("M5 10l7-7m0 0l7 7m-7-7v18"),
  arrowDown: createSvgIcon("M19 14l-7 7m0 0l-7-7m7 7V3"),
  sort: createSvgIcon("M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"),
  checkCircle: createSvgIcon("M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"),
  ban: createSvgIcon("M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"),
  gridDots: createSvgIcon("M4 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0 M11 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0 M18 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0 M4 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0 M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0 M18 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0 M4 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0 M11 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0 M18 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"),
  arrowleft: createSvgIcon("M15 18l-6-6 6-6"),
  send: createSvgIcon("M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"),
  clipboard: createSvgIcon("M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"),
  bell: createSvgIcon("M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"),
  chartLine: createSvgIcon("M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 17V3a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2z"),
  chevronDown: createSvgIcon("M6 9l6 6 6-6"),
  loader: createSvgIcon("M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"),
  pause: createSvgIcon("M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"),
  xCircle: createSvgIcon("M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"),
  folderOpen: createSvgIcon("M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"),
  calendar: createSvgIcon("M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"),
  
  // ✅ NUEVOS ICONOS PARA EVENTOS DEL SISTEMA
  settings: createSvgIcon("M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"),
  shield: createSvgIcon("M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"),
  file: createSvgIcon("M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z M13 2v7h7"),
  filePlus: createSvgIcon("M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M12 18v-6 M9 15h6"),
  fileMinus: createSvgIcon("M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M9 15h6"),
  
};

export type IconName = keyof typeof icons;