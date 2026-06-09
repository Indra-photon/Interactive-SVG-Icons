"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Center of each cube's top diamond face — where the ring sits when standing
const CUBE_CENTERS = [
  { x: 98, y: 22.4 }, // Top Centre
  { x: 49, y: 50.7 }, // Bottom-Left
  { x: 147, y: 51.2 }, // Bottom-Right
  { x: 98.4, y: 79.7 }, // Bottom Centre
];

// How far each cube's top face travels from pressed (floor) to standing
const RISE_OFFSETS = [13, 13, 13, 13];

const STAGE_DELAY = 2200; // ms ring spins on each cube before moving on

const SPRING = { type: "spring" as const, stiffness: 160, damping: 18 };

export function NetworkDiagramSVG() {
  const [standing, setStanding] = useState([false, false, false, false]);
  const [activeCube, setActiveCube] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function runSequence() {
      for (let i = 0; i < 4; i++) {
        if (cancelled) return;

        // Ring travels to this cube's center first
        setActiveCube(i);

        // Short pause — let ring arrive before cube rises
        await new Promise((r) => setTimeout(r, 450));
        if (cancelled) return;

        // Cube rises
        setStanding((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });

        // Hold — ring spins on top of standing cube
        await new Promise((r) => setTimeout(r, STAGE_DELAY));
      }
    }

    const t = setTimeout(runSequence, 600);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 195.4 122.8"
      width="100%"
      height="100%"
    >
      <defs>
        <style type="text/css">{`
          .nd-2  { fill:none; stroke:#E3E4E6; stroke-width:0.3; stroke-miterlimit:10; }
          .nd-3  { fill:#FFFFFF; stroke:#6A6D73; stroke-width:0.25; stroke-miterlimit:10; }
          .nd-4r { fill:#F3F3F2; stroke:#9FA3AA; stroke-width:0.15; stroke-linejoin:round; stroke-miterlimit:10; }
          .nd-4l { fill:#E7E7E6; stroke:#9FA3AA; stroke-width:0.15; stroke-linejoin:round; stroke-miterlimit:10; }
          .nd-5  { fill:#202128; }
          .nd-7  { fill:#1B1C20; }
          .nd-8  { fill:#80BA33; }
          .nd-10 { fill:#ED6D45; }
          .nd-11 { fill:none; stroke:#EBEAEC; stroke-width:0.75; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:10; }
        `}</style>

        <linearGradient
          id="ndG5"
          x1="148.5"
          x2="148.5"
          y1="88.88"
          y2="122.9"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DDDDDC" offset="0" />
          <stop stopColor="#F6F5F4" stopOpacity="0" offset="1" />
        </linearGradient>
        <linearGradient
          id="ndL1"
          x1="38.84"
          x2="40.65"
          y1="66.49"
          y2="63.51"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DFDFDE" offset="0" />
          <stop stopColor="#E2E1E2" offset="1" />
        </linearGradient>
        <linearGradient
          id="ndL2"
          x1="41.4"
          x2="43.61"
          y1="66.47"
          y2="64.25"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DFDFDE" offset="0" />
          <stop stopColor="#E2E1E2" offset="1" />
        </linearGradient>
        <linearGradient
          id="ndL3"
          x1="42.72"
          x2="44.94"
          y1="66.92"
          y2="64.7"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DFDFDE" offset="0" />
          <stop stopColor="#E2E1E2" offset="1" />
        </linearGradient>
        <linearGradient
          id="ndL4"
          x1="45.04"
          x2="46.94"
          y1="67.83"
          y2="65.93"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DFDFDE" offset="0" />
          <stop stopColor="#E2E1E2" offset="1" />
        </linearGradient>
        <linearGradient
          id="ndR1"
          x1="136.8"
          x2="139"
          y1="65.54"
          y2="63.41"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DFDFDE" offset="0" />
          <stop stopColor="#E3E4E6" offset="1" />
        </linearGradient>
        <linearGradient
          id="ndR2"
          x1="138.2"
          x2="140.4"
          y1="66.01"
          y2="63.79"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DFDFDE" offset="0" />
          <stop stopColor="#E3E4E6" offset="1" />
        </linearGradient>
        <linearGradient
          id="ndR3"
          x1="139.6"
          x2="141.8"
          y1="66.99"
          y2="64.77"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DFDFDE" offset="0" />
          <stop stopColor="#E3E4E6" offset="1" />
        </linearGradient>
        <linearGradient
          id="ndR4"
          x1="141.2"
          x2="143.4"
          y1="67.88"
          y2="65.67"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DFDFDE" offset="0" />
          <stop stopColor="#E3E4E6" offset="1" />
        </linearGradient>
        <linearGradient
          id="ndR5"
          x1="144.1"
          x2="146.4"
          y1="69.45"
          y2="67.12"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DFDFDE" offset="0" />
          <stop stopColor="#E3E4E6" offset="1" />
        </linearGradient>
      </defs>

      {/* Floor grid */}
      <line className="nd-2" x1="100" y1="0" x2="195.4" y2="53.6" />
      <line className="nd-2" x1="50" y1="0" x2="195.4" y2="81.8" />
      <line className="nd-2" x1="0" y1="0" x2="195.4" y2="109.9" />
      <line className="nd-2" x1="0" y1="28.1" x2="168.3" y2="122.8" />
      <line className="nd-2" x1="0" y1="56.3" x2="118.3" y2="122.8" />
      <line className="nd-2" x1="0" y1="84.4" x2="68.3" y2="122.8" />
      <line className="nd-2" x1="100" y1="0" x2="0" y2="56.3" />
      <line className="nd-2" x1="150" y1="0" x2="0" y2="84.4" />
      <line className="nd-2" x1="195.4" y1="0" x2="0" y2="109.9" />
      <line className="nd-2" x1="195.4" y1="30.1" x2="30.6" y2="122.8" />
      <line className="nd-2" x1="195.4" y1="58.1" x2="80.4" y2="122.8" />
      <line className="nd-2" x1="195.4" y1="86.1" x2="130" y2="122.8" />

      {/* Right panel bar chart */}
      <path
        fill="url(#ndG5)"
        opacity=".5"
        d="m115.5 122.9v-2.5l0.7-0.5 0.2 3m1.3-3.6 0.7-0.5v4.1m1.5-4.9 0.7-0.4 0.1 5.3m1.3-6.2 0.7-0.5v6.7m1.5-7.4 0.8-0.5v7.9m1.4-8.5 0.8-0.5v9m1.4-9.8 0.8-0.5v10.3m1.4-11.1 0.8-0.5v11.6m1.4-12.3 0.8-0.5v12.8m1.4-13.5 0.9-0.5v14m1.3-14.7 0.9-0.5v15.2m1.3-15.8 0.7-0.5 0.1 16.3m1.4-17.1 0.8-0.5v17.6m1.5-18.4 0.7-0.5 0.1 18.9m1.4-19.6 0.7-0.4v20m1.4-20.8 0.8-0.2 0.2 21m1.1-20.7 0.9 0.3 0.1 20.4m1.3-19.5 0.8 0.5v19m1.4-18.4 0.8 0.6v17.8m1.4-17.1 0.9 0.4v15.7m1.3-14.7 0.9 0.5v13m1.4-12.4 0.8 0.5v10.8m1.4-10.1 0.8 0.6v8.3"
      />

      {/* ══ CUBE 0 — Top Centre ══ */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: standing[0] ? 1 : 0 }}
        transition={SPRING}
      >
        <path
          className="nd-3"
          d="m97.9 2.2-35.2 19.9v13.5l35.3 21c0.4 0.2 1 0.3 1.5 0l35.1-20.8 0.1-13.7-35.2-19.9c-0.3-0.2-1.1-0.3-1.6 0z"
        />
        <path
          className="nd-4r"
          d="m98.3 44.6v10.8c0 1 0.7 1.5 1.2 1.2l34.8-20.6c0.3-0.2 0.3-0.4 0.3-4.5v-7.6c0-1.1-0.5-1-1.1-0.7l-34.2 20.4c-0.6 0.3-1 0.5-1 1z"
        />
        <path
          className="nd-4l"
          d="m98.3 44.6c0-0.5-0.3-0.9-0.6-1l-34.1-20.4c-0.7-0.6-0.9-0.6-0.9 0.6v10.6c0 0.5 0.3 1.1 0.8 1.6l34 20.3c1.1 0.6 0.8 0 0.8-0.9v-10.8z"
        />
      </motion.g>
      <motion.g
        initial={{ y: RISE_OFFSETS[0] }}
        animate={{ y: standing[0] ? 0 : RISE_OFFSETS[0] }}
        transition={SPRING}
      >
        <path
          fill="#FFF"
          stroke="#6A6D74"
          strokeMiterlimit="10"
          strokeWidth=".25"
          d="m98 2.2-35 19.7c-0.4 0.2-0.4 0.6 0 0.9l34.9 20.7c0.5 0.4 1.1 0.4 1.6 0.1l34.6-20.6c0.7-0.4 0.7-0.9 0-1.2l-34.6-19.6c-0.3-0.2-1.1-0.3-1.5 0z"
        />
        <ellipse className="nd-7" cx="98.5" cy="3.6" rx=".5" ry=".3" />
        <circle className="nd-7" cx="65.8" cy="22.1" r=".4" />
        <path
          className="nd-5"
          d="m99.1 42.3c-0.5 0-1.2-0.4-0.9-0.6 0.4-0.3 1-0.3 1.2 0s-0.1 0.6-0.3 0.6z"
        />
        <ellipse className="nd-8" cx="130.2" cy="22.1" rx="1" ry=".6" />
        <ellipse
          className="nd-10"
          transform="matrix(.4997 -.8662 .8662 .4997 21.41 118.4)"
          cx="113.4"
          cy="41.8"
          rx=".9"
          ry=".7"
        />
        <ellipse
          className="nd-10"
          transform="matrix(.4997 -.8662 .8662 .4997 23.62 119.5)"
          cx="115.5"
          cy="40.5"
          rx=".8"
          ry=".6"
        />
        <ellipse
          className="nd-10"
          transform="matrix(.4997 -.8662 .8662 .4997 25.96 120.6)"
          cx="117.7"
          cy="39"
          rx=".8"
          ry=".6"
        />
      </motion.g>

      {/* ══ CUBE 1 — Bottom-Left ══ */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: standing[1] ? 1 : 0 }}
        transition={SPRING}
      >
        <path
          className="nd-3"
          d="m49 29.9-35.8 21.1v13.4l35.8 19.9c0.4 0.3 1 0.2 1.5 0l35.4-19.8 0.1-13.5-35.5-21.1c-0.5-0.2-1.1-0.2-1.5 0z"
        />
        <path
          className="nd-4r"
          d="m49.6 72.9v10.2c0 0.8 0.7 1.3 1.3 1l34.3-19.5c0.5-0.2 0.6-0.7 0.6-1l0.1-10.5c-0.1-1.6-0.6-1.4-1.2-1.1l-34.2 19.7c-0.5 0.3-0.9 0.4-0.9 1.2z"
        />
        <path
          className="nd-4l"
          d="m49.6 72.9c0-0.4-0.2-0.8-0.5-1l-35.3-19.9c-0.3-0.4-0.6-0.2-0.6 0.8v10.8c0.1 0.6 0.3 0.9 0.7 1.1l34.7 19.3c1 0.7 1-0.4 1-1.1v-10z"
        />
      </motion.g>
      <motion.g
        initial={{ y: RISE_OFFSETS[1] }}
        animate={{ y: standing[1] ? 0 : RISE_OFFSETS[1] }}
        transition={SPRING}
      >
        <path
          fill="#FFF"
          stroke="#6A6D74"
          strokeMiterlimit="10"
          strokeWidth=".25"
          d="m49 29.9-35.3 20.8c-0.4 0.2-0.4 0.6 0 0.8l35.3 20.2c0.4 0.2 0.9 0.3 1.3 0l35-20c0.6-0.3 0.7-0.7 0-1l-34.8-20.8c-0.5-0.2-1.1-0.3-1.5 0z"
        />
        <ellipse className="nd-7" cx="49.3" cy="31.2" rx=".6" ry=".4" />
        <ellipse className="nd-7" cx="49.7" cy="70" rx=".6" ry=".4" />
        <path
          className="nd-5"
          d="m16.5 51.4c-0.7-0.1-1.1-0.6-0.4-0.8 0.8-0.3 0.9 0.1 0.8 0.4l-0.4 0.4z"
        />
        <ellipse className="nd-8" cx="81.5" cy="50.9" rx="1" ry=".6" />
        <ellipse
          className="nd-10"
          transform="matrix(.4998 -.8661 .8661 .4998 -29.63 93.32)"
          cx="64.7"
          cy="70.2"
          rx=".9"
          ry=".5"
        />
        <ellipse
          className="nd-10"
          transform="matrix(.4998 -.8661 .8661 .4998 -27.43 94.39)"
          cx="66.9"
          cy="68.7"
          rx=".9"
          ry=".6"
        />
        <ellipse
          className="nd-10"
          transform="matrix(.4998 -.8661 .8661 .4998 -25.28 95.59)"
          cx="69.3"
          cy="67.5"
          rx=".9"
          ry=".6"
        />
      </motion.g>

      {/* ══ CUBE 2 — Bottom-Right ══ */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: standing[2] ? 1 : 0 }}
        transition={SPRING}
      >
        <path
          className="nd-3"
          d="m147 30.6-35.8 20.9v13.4l36 20c0.3 0.3 1 0.3 1.4 0l35.4-20v-13.4l-35.4-20.9c-0.5-0.2-1.1-0.2-1.6 0z"
        />
        <path
          className="nd-4r"
          d="m147.7 73.5v10.4c0 0.8 0.7 1 1.3 0.7l34.4-19.5c0.4-0.4 0.5-0.6 0.5-0.9l0.2-10.6c-0.3-1.6-0.8-1.2-1.2-0.8l-34.3 19.6c-0.4 0.2-0.9 0.6-0.9 1.1z"
        />
        <path
          className="nd-4l"
          d="m147.7 73.5c0-0.4-0.1-0.9-0.5-1.1l-35.1-19.7c-0.5-0.5-0.8-0.4-0.8 0.7l-0.1 10.3c0.1 0.8 0.4 1.4 0.8 1.6l34.9 19.3c1.3 0.7 0.8 0 0.8-0.7v-10.4z"
        />
      </motion.g>
      <motion.g
        initial={{ y: RISE_OFFSETS[2] }}
        animate={{ y: standing[2] ? 0 : RISE_OFFSETS[2] }}
        transition={SPRING}
      >
        <path
          fill="#FFF"
          stroke="#6A6D74"
          strokeMiterlimit="10"
          strokeWidth=".25"
          d="m147 30.6-35.1 20.6c-0.4 0.2-0.4 0.7 0 0.8l35.3 20.4c0.4 0.2 0.8 0.2 1.2 0l35-20.1c0.6-0.3 0.5-0.6 0-0.9l-34.8-20.8c-0.5-0.2-1.1-0.2-1.6 0z"
        />
        <ellipse className="nd-7" cx="147.7" cy="31.8" rx=".6" ry=".4" />
        <path
          className="nd-5"
          d="m114.7 52.1c-0.3 0.1-1.1 0-0.8-0.6 0.4-0.5 1.1-0.1 1.2 0.2l-0.4 0.4z"
        />
        <path
          className="nd-5"
          d="m147.8 71c-0.6-0.4-0.3-0.8 0.3-0.7 0.6 0 0.5 0.6 0.3 0.7h-0.6z"
        />
        <ellipse
          className="nd-10"
          transform="matrix(.4998 -.8662 .8662 .4998 21.48 175.5)"
          cx="162.6"
          cy="70.6"
          rx=".9"
          ry=".5"
        />
        <ellipse
          className="nd-10"
          transform="matrix(.4998 -.8662 .8662 .4998 23.62 176.6)"
          cx="164.9"
          cy="69.4"
          rx=".9"
          ry=".6"
        />
        <ellipse
          className="nd-10"
          transform="matrix(.4998 -.8662 .8662 .4998 25.83 177.8)"
          cx="167.3"
          cy="68.1"
          rx=".9"
          ry=".6"
        />
      </motion.g>

      {/* Connector dashes — static */}
      <line
        x1="39.1"
        x2="40.3"
        y1="64.4"
        y2="63.6"
        fill="none"
        stroke="url(#ndL1)"
        strokeLinecap="round"
        strokeWidth=".6"
      />
      <line className="nd-11" x1="40.6" x2="42.1" y1="65.4" y2="64.5" />
      <line
        x1="41.9"
        x2="43.2"
        y1="66.2"
        y2="65.4"
        fill="none"
        stroke="url(#ndL2)"
        strokeLinecap="round"
        strokeWidth=".6"
      />
      <line
        x1="43.4"
        x2="44.6"
        y1="66.7"
        y2="65.9"
        fill="none"
        stroke="url(#ndL3)"
        strokeLinecap="round"
        strokeWidth=".6"
      />
      <line className="nd-11" x1="44.6" x2="46.1" y1="67.6" y2="66.8" />
      <line
        x1="45.6"
        x2="46.5"
        y1="67.6"
        y2="67"
        fill="none"
        stroke="url(#ndL4)"
        strokeLinecap="round"
        strokeWidth=".6"
      />
      <line
        x1="137.4"
        x2="138.6"
        y1="65.1"
        y2="64.4"
        fill="none"
        stroke="url(#ndR1)"
        strokeLinecap="round"
        strokeLinejoin="bevel"
        strokeWidth=".6"
      />
      <line
        x1="138.9"
        x2="140.2"
        y1="65.8"
        y2="64.9"
        fill="none"
        stroke="url(#ndR2)"
        strokeLinecap="round"
        strokeLinejoin="bevel"
        strokeWidth=".6"
      />
      <line
        x1="140.2"
        x2="141.5"
        y1="66.7"
        y2="65.9"
        fill="none"
        stroke="url(#ndR3)"
        strokeLinecap="round"
        strokeLinejoin="bevel"
        strokeWidth=".6"
      />
      <line
        x1="141.9"
        x2="143.1"
        y1="67.6"
        y2="66.8"
        fill="none"
        stroke="url(#ndR4)"
        strokeLinecap="round"
        strokeLinejoin="bevel"
        strokeWidth=".6"
      />
      <line className="nd-11" x1="142.8" x2="144.3" y1="68.4" y2="67.6" />
      <line className="nd-11" x1="144.2" x2="145.5" y1="69.1" y2="68.3" />
      <line
        x1="144.9"
        x2="146.1"
        y1="69.2"
        y2="68.5"
        fill="none"
        stroke="url(#ndR5)"
        strokeLinecap="round"
        strokeLinejoin="bevel"
        strokeWidth=".6"
      />

      {/* ══ CUBE 3 — Bottom Centre ══ */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: standing[3] ? 1 : 0 }}
        transition={SPRING}
      >
        <path
          className="nd-3"
          d="m97.6 59.6-35.1 19.8v13.4l35.2 21.1c0.3 0.3 1 0.4 1.6 0l35.3-20.9v-13.6l-35.4-19.8c-0.4-0.2-1-0.2-1.6 0z"
        />
        <path
          className="nd-4r"
          d="m98.5 102v10.6c0 1 0.6 1.3 1.1 1l34.5-20.4c0.3-0.2 0.4-0.7 0.4-3.7v-8c0-1.1-0.6-1.2-1.1-0.9l-34 20c-0.4 0.3-0.9 0.7-0.9 1.4z"
        />
        <path
          className="nd-4l"
          d="m98.4 101.9c0-0.4-0.1-0.9-0.5-1l-34.3-20.2c-0.6-0.3-0.9-0.2-1 0.6v10.2c0 0.6 0.3 1.6 0.7 1.7l33.9 20.2c1.2 0.6 1.3 0 1.3-0.8l-0.1-10.7z"
        />
      </motion.g>
      <motion.g
        initial={{ y: RISE_OFFSETS[3] }}
        animate={{ y: standing[3] ? 0 : RISE_OFFSETS[3] }}
        transition={SPRING}
      >
        <path
          fill="#FFF"
          stroke="#6A6D74"
          strokeMiterlimit="10"
          strokeWidth=".25"
          d="m97.7 59.6-34.6 19.8c-0.4 0.3-0.6 0.6 0 1l34.6 20.2c0.6 0.3 1.2 0.3 1.7 0l34.5-20c0.4-0.2 0.5-0.6 0-1.1l-34.5-19.9c-0.6-0.2-1.2-0.2-1.7 0z"
        />
        <ellipse className="nd-7" cx="65.8" cy="79.4" rx=".5" ry=".3" />
        <ellipse className="nd-8" cx="130.1" cy="79.5" rx="1" ry=".6" />
        <ellipse className="nd-7" cx="98.6" cy="60.8" rx=".5" ry=".4" />
        <ellipse className="nd-7" cx="98.6" cy="98.8" rx=".6" ry=".4" />
      </motion.g>

      {/* ══ RING — travels to activeCube center, ring dashes march continuously ══ */}
      <motion.g
        animate={{
          x: CUBE_CENTERS[activeCube].x,
          y: standing[activeCube]
            ? CUBE_CENTERS[activeCube].y
            : CUBE_CENTERS[activeCube].y + RISE_OFFSETS[activeCube],
        }}
        initial={{
          x: CUBE_CENTERS[0].x,
          y: CUBE_CENTERS[0].y + RISE_OFFSETS[0],
        }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
      >
        <motion.ellipse
          cx={0}
          cy={0}
          rx={12.9}
          ry={6.5}
          fill="none"
          stroke="#8B8F95"
          strokeWidth="0.35"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeDasharray="0.5,0.85"
          animate={{ strokeDashoffset: -100 }}
          initial={{ strokeDashoffset: 0 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        />
        <ellipse cx={0} cy={0} rx={2.3} ry={1} fill="#ED6B3B" />
      </motion.g>
    </svg>
  );
}
