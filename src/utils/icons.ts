// src/utils/icons.ts

export const createSvgIcon = (path: string, viewBox: string = "0 0 24 24") => {
  // CAMBIO IMPORTANTE:
  // 1. fill="none": Quitamos el relleno negro.
  // 2. stroke="currentColor": El color viene del borde.
  // 3. stroke-width="1.5": Define el grosor "Light".
  // 4. stroke-linecap/join="round": Para que las puntas sean redondeadas y suaves.
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
logo: createSvgIcon("M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z M9 4v13 M15 7v13"),
  
  home: createSvgIcon("M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10"),

  receipt: createSvgIcon("M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8"),

  users: createSvgIcon("M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M16 3.13a4 4 0 0 1 0 7.75 M23 21v-2a4 4 0 0 0-3-3.87 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"),

  building: createSvgIcon("M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18 M6 12H4a2 2 0 0 0-2 2v6 M18 12h2a2 2 0 0 1 2 2v6 M6 6h.01 M6 10h.01 M6 14h.01 M6 18h.01 M10 6h.01 M10 10h.01 M10 14h.01 M10 18h.01 M14 6h.01 M14 10h.01 M14 14h.01 M14 18h.01"),

  timeline: createSvgIcon("M12 20v-6M6 20V10M18 20V4"), 
  
  palette: createSvgIcon("M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.826.57 3.518 1.543 4.908.243.348.606.592 1.026.592h.856c.924 0 1.675.751 1.675 1.675 0 .393.155.753.407 1.018A2.37 2.37 0 0 0 9.875 22H12z M17.5 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z M7 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z M13.5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"),

  snowflake: createSvgIcon("M2 12h20 M12 2v20 M20 20l-5-5 M4 4l5 5 M4 20l5-5 M20 4l-5 5"),

  sun: createSvgIcon("M12 3v1 M12 20v1 M4.22 4.22l.707.707 M19.07 19.07l.707.707 M1 12h1 M20 12h1 M4.22 19.78l.707-.707 M19.07 4.93l.707-.707 M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"),

  moon: createSvgIcon("M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"),

  
  logout: createSvgIcon("M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9"),
};

export type IconName = keyof typeof icons;