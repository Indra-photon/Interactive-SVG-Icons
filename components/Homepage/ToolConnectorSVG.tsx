"use client";

import { motion } from "framer-motion";

const CYCLE = 7.5;

const trails = [
  // Pair 1 → Stack 1
  { d: "m91.1 13.6h117.3c7.1 0 11.1 3.5 11.1 10.9v36.9", delay: 0.0, duration: 1.0, seg: 0.12 },
  { d: "m28.4 48h141.5c6.4 0 12.6 3.2 12.6 13.4", delay: 0.1, duration: 1.0, seg: 0.12 },
  // Pair 2 → Stack 2
  { d: "m91.1 83.6h72.4", delay: 2.2, duration: 0.6, seg: 0.28 },
  { d: "m28.4 118.2h135.1", delay: 2.3, duration: 0.6, seg: 0.18 },
  { d: "m91.1 152.8h72.4", delay: 2.25, duration: 0.6, seg: 0.28 },
  // Pair 3 → Stack 3
  { d: "m28.4 188.5h141.5c5.7 0 12.3-3.9 12.1-11.6", delay: 4.2, duration: 1.0, seg: 0.12 },
  { d: "m91.1 223.1h116.2c8 0 12.2-4.3 12.2-11.4v-37.8", delay: 4.2, duration: 1.15, seg: 0.12 },
];

function stackAnim(entryDelay: number) {
  const t1 = entryDelay / CYCLE;
  const t2 = (entryDelay + 0.5) / CYCLE;
  const t3 = 7.1 / CYCLE;
  return {
    animate: {
      opacity: [0, 0, 1, 1, 0] as number[],
      y: [10, 10, 0, 0, 10] as number[],
      filter: ["blur(6px)", "blur(6px)", "blur(0px)", "blur(0px)", "blur(6px)"],
    },
    transition: {
      duration: CYCLE,
      times: [0, t1, t2, t3, 1],
      repeat: Infinity,
      ease: ["linear", [0.16, 1, 0.3, 1], "linear", "easeIn"] as never,
    },
  };
}

export function ToolConnectorSVG() {
  const s1 = stackAnim(1.1);
  const s2 = stackAnim(3.05);
  const s3 = stackAnim(5.4);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 310 235.5"
      width="100%"
      height="100%"
    >
      <defs>
        <style type="text/css">{`
          .cls-1  { fill:#D2D0FF; }
          .cls-2  { fill:#FFFFFF; }
          .cls-3  { fill:none; stroke:#8174E8; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:10; stroke-dasharray:1,3; }
          .cls-4  { fill:#5E4AE3; }
          .cls-5  { fill:#FFFFFF; }
          .cls-6  { fill:#52B153; }
          .cls-7  { fill:#F1BD2E; }
          .cls-8  { fill:#3367B0; }
          .cls-9  { fill:#D7702B; }
          .cls-10 { fill:#EFA72C; }
          .cls-11 { fill:#374F94; }
          .cls-12 { fill:#F2C333; }
          .cls-13 { fill:#CD475C; }
          .cls-14 { fill:#891539; }
          .cls-15 { fill:#4FB9E9; }
          .cls-16 { fill:#3395D3; }
          .cls-17 { fill:#9891F9; }
          .cls-18 { fill:#7766F5; }
          .cls-19 { fill:url(#SVGID_2_); }
          .cls-20 { fill:url(#SVGID_3_); }
          .cls-21 { fill:#51ABE6; }
          .cls-22 { fill:#4A7C35; }
          .cls-23 { fill:#81A358; }
          .cls-24 { fill:#F1F1EF; }
          .cls-25 { fill:#C8C6F7; }
          .cls-26 { fill:#938BF6; }
          .cls-27 { fill:#5C4DEF; }
        `}</style>
        <linearGradient id="SVGID_2_" x1="181.8" x2="258.6" y1="126" y2="126" gradientUnits="userSpaceOnUse">
          <stop stopColor="#BCB8F8" offset="0" />
          <stop stopColor="#8174F6" offset="1" />
        </linearGradient>
        <linearGradient id="SVGID_3_" x1="182" x2="258.6" y1="126.2" y2="126.2" gradientUnits="userSpaceOnUse">
          <stop stopColor="#BCB8F8" offset="0" />
          <stop stopColor="#8174F6" offset="1" />
        </linearGradient>
      </defs>

      {/* Main box */}
      <path className="cls-1" d="m264.4 173.5h-88.4c-6.4 0-11.6-5.2-11.6-11.6v-88.1c0-6.4 5.2-11.6 11.6-11.6h88.4c6.6 0 12.6 4.8 12.6 11.6v88.1c0 6.4-5.2 11.6-12.6 11.6z" />

      {/* Dashed connector lines */}
      <path className="cls-3" d="m91.1 13.6h117.3c7.1 0 11.1 3.5 11.1 10.9v36.9" />
      <path className="cls-3" d="m91.1 83.6h72.4" />
      <path className="cls-3" d="m28.4 48h141.5c6.4 0 12.6 3.2 12.6 13.4" />
      <path className="cls-3" d="m28.4 118.2h135.1" />
      <path className="cls-3" d="m91.1 152.8h72.4" />
      <path className="cls-3" d="m28.4 188.5h141.5c5.7 0 12.3-3.9 12.1-11.6" />
      <path className="cls-3" d="m91.1 223.1h116.2c8 0 12.2-4.3 12.2-11.4v-37.8" />

      {/* Junction dots */}
      <circle className="cls-4" cx="91.1" cy="13.6" r="1.6" />
      <circle className="cls-4" cx="28.4" cy="48.1" r="1.6" />
      <circle className="cls-4" cx="91.1" cy="83.6" r="1.6" />
      <circle className="cls-4" cx="163.7" cy="83.6" r="1.6" />
      <circle className="cls-4" cx="182.1" cy="61.3" r="1.6" />
      <circle className="cls-4" cx="219.6" cy="61.5" r="1.6" />
      <circle className="cls-4" cx="28.4" cy="118.2" r="1.6" />
      <circle className="cls-4" cx="163.7" cy="118.2" r="1.6" />
      <circle className="cls-4" cx="91.1" cy="152.8" r="1.6" />
      <circle className="cls-4" cx="163.7" cy="152.8" r="1.6" />
      <circle className="cls-4" cx="28.3" cy="188.5" r="1.6" />
      <circle className="cls-4" cx="182" cy="173.3" r="1.6" />
      <circle className="cls-4" cx="219.5" cy="173.5" r="1.6" />
      <circle className="cls-4" cx="91.1" cy="223.1" r="1.6" />

      {/* Google Analytics bars */}
      <path className="cls-9" d="m9.1 48.3v6.5c0 2.6 4.3 3.7 5 0.4v-6.9c0-2.6-4.5-3.4-5 0z" />
      <path className="cls-10" d="m15.8 41.4v14.4c0.2-14.2 0 2.4 0.2-0.4 0 2.2 3.7 3.3 4-0.2v-13.9c-0.1-2.7-4.2-2.7-4.2 0.1z" />
      <path className="cls-9" d="m5.3 52.6c-2.2 0.5-2.3 3.9 0.4 4.3 3.2 0 3.2-4.5-0.4-4.3z" />

      {/* Google Ads triangle */}
      <path className="cls-6" d="m4.2 121.3c1.1-1 3-1 4.1 0 1.1 1.1 1.3 2.8 0.2 4.1-1.1 1.1-3 1.3-4.1 0.2-1.3-1.1-1.3-3-0.2-4.3z" />
      <path className="cls-7" d="m9.6 112.6-5.4 8.7c1.1-1 3-1 4.3 0 0.7 0.7 1.1 1.6 1.1 2.6l3.2-5.3-3.2-6z" />
      <path className="cls-8" d="m19.9 125.9c-1.3 0.8-3.2 0.8-4.1-0.7l-5.8-10.4c-0.9-1.3-0.6-3.2 0.9-4.5 1.3-0.7 3-0.7 3.8 0.8l5.4 10.2c1.1 1.8 1.1 3.7-0.2 4.6z" />

      {/* Shopify icon */}
      <path className="cls-22" d="m18.2 182s-0.2-0.2-0.4-0.2l-1.5-0.2-1.1-1.1-0.9-0.2c-0.4-0.9-1.3-2.2-2.6-2.2-2.6 0-3.7 3.4-4.1 5l-1.9 0.6-1.5 12.5 10.3 1.9 5.6-1.3-1.9-14.8zm-6.5-3.2c0.7 0 1.1 0.6 1.5 1.3l-1.9 0.6c0-1.1 0.2-1.7 0.4-1.9zm-1 0.2c-0.1 0.6-0.1 1.3-0.1 1.9l-1.9 0.7c0.4-1.1 1.1-2.2 2-2.6zm1.2-0.5c-0.2 0.3-0.2 1.3-0.2 2.4l1.7-0.4c-0.2-0.9-0.8-2-1.5-2z" />
      <path className="cls-23" d="m14.3 180.5 0.2 17.6-10.3-1.9 1.5-12.5 1.9-0.6c0.4-1.6 1.5-5 4.1-5 1.3 0 2.2 1.3 2.6 2.4z" />
      <path className="cls-24" d="m12.4 185.5-0.9 2.1c-0.9-0.6-2.4-0.6-2.6 0.4-0.2 1.3 2.8 1.5 2.6 4.1-0.2 3.2-3.5 3.8-5.6 2.1l0.6-1.7c1.3 0.8 2.6 1 2.8-0.2 0.1-1.5-2.5-1.3-2.3-3.6 0-1.9 1.5-3.9 5.4-3.2z" />

      {/* Facebook f */}
      <path className="cls-11" d="m81.8 74h-15.9c-0.7 0-1.1 0.4-1.1 1v16.5c0 0.6 0.4 1 1.1 0.8h9.1v-6.4h-2.4l0.2-3h2.2v-2.4c0-2.1 1.1-3.4 3-3.4h2.3l0.2 2.6h-1.9c-0.8 0-0.8 0.4-0.8 1.1v1.7h2.1l-0.4 3h-1.9l-0.2 6.8h4.4c0.7 0 1.1-0.4 1.1-0.8v-16.3c0-0.7-0.4-1.2-1.1-1.2z" />

      {/* Stack cube */}
      <path className="cls-12" d="m73.7 145.5-7.8 3.2 8.2 3.7 8.2-3.7-7.8-3.2h-0.8z" />
      <path className="cls-13" d="m64.6 149.6v6.6c0 0.4 0.4 0.6 0.8 0.4l7.8-3.4-7.8-3.6c-0.4-0.2-0.8 0-0.8 0z" />
      <path className="cls-14" d="m64.8 149.6v1.7l6.7 2.8 1.7-0.7-7.8-3.6c-0.4-0.4-0.4-0.4-0.6-0.2z" />
      <path className="cls-15" d="m74.8 153v6.4c0 0.8 0.8 1 1.3 0.8l6.4-2.6c0.4-0.2 0.6-0.4 0.6-0.8v-6.6c0-0.4-0.4-0.6-0.8-0.4l-6.9 2.8c-0.2 0-0.6 0.2-0.6 0.4z" />

      {/* Salesforce cloud */}
      <path className="cls-16" d="m72.2 216.4c0.6-0.9 1.7-1.4 2.8-1.4 1.3 0 2.6 0.7 3.4 2 0.5-0.2 1.3-0.4 2.1-0.4 3 0 5.4 2.4 5.4 5.2s-2.4 5.2-5.4 5.2h-0.8c-0.6 1.1-1.9 1.9-3.2 1.9-0.5 0-1.1-0.2-1.5-0.4-0.5 1.3-2 2.6-4.1 2.6-1.8 0-3.3-0.9-4-2.6h-0.8c-2.4 0-4.1-1.9-4.1-4.1 0-1.5 0.6-2.6 1.5-3.5-0.2-0.6-0.4-1.1-0.4-1.7 0-2.8 2.1-5 4.7-5 1.7 0 3.1 0.9 4.1 2" />
      <path className="cls-2" d="m65.7 222.6c0 0.7 0.4 1.1 1 1.1 0.2 0 0.4 0 0.5-0.2l-0.1-0.4c-0.2 0.2-0.8 0.2-1-0.5 0-0.8 0.8-0.8 1-0.6l0.1-0.4c-0.5-0.3-1.5 0-1.5 1zm6.9-0.2c-0.2 0-0.4-0.2-0.4-0.2 0-0.2 0.2-0.2 0.4-0.2s0.4 0 0.6 0.2l0.2-0.4c-0.2-0.2-0.4-0.2-0.8-0.2-0.5 0-0.7 0.4-0.7 0.6 0 0.4 0.3 0.5 0.7 0.5l0.2 0.2c0.2 0.2 0 0.4-0.2 0.4s-0.5 0-0.7-0.2l-0.2 0.4c0.2 0.2 0.5 0.2 0.7 0.2 0.6 0 0.8-0.2 0.8-0.6s-0.4-0.5-0.6-0.7zm2.2-0.8h-0.3v-0.2c0-0.3 0.2-0.3 0.3-0.3h0.2l0.2-0.4h-0.4c-0.3 0-0.7 0.2-0.9 0.7v0.2h-0.3v0.4h0.3l-0.3 1.5 0.3 0.7 0.4-0.5 0.4-1.7h0.3l0.2-0.4h-0.4zm4.3 0.2c-0.2-0.2-0.3-0.2-0.5-0.2-0.4 0-0.8 0-0.8 0.6l0.4 0.2c0-0.2 0.4-0.2 0.4-0.2 0.3 0 0.5 0.2 0.5 0.4-0.7 0-1.3 0-1.3 0.7 0 0.4 0.4 0.6 0.6 0.6s0.5-0.2 0.5-0.2v0.2h0.4v-1.3c0-0.4 0-0.6-0.2-0.8zm-0.5 1.7c-0.2 0-0.4 0-0.4-0.2 0-0.4 0.6-0.4 0.7-0.4v0.4s-0.1 0.2-0.3 0.2zm4.5-1.9c-0.6 0-1 0.4-1 1 0 0.7 0.4 1.1 1 1.1 0.4 0 0.6 0 0.8-0.2l-0.2-0.2c-0.2 0-0.4 0.2-0.6 0.2s-0.6-0.2-0.6-0.4h1.4c0.1-0.9-0.2-1.5-0.8-1.5zm-0.6 1c0-0.2 0.2-0.4 0.4-0.4 0.4 0 0.4 0.2 0.6 0.4h-1zm-11.7-0.8c-0.2-0.2-0.4-0.2-0.6-0.2s-0.4 0-0.6 0.2l0.2 0.4h0.6c0.2 0 0.4 0.2 0.4 0.4-0.8 0-1.3 0-1.3 0.7 0 0.4 0.3 0.6 0.5 0.6s0.6-0.2 0.6-0.2v0.2h0.3v-1.3c0-0.4 0-0.6-0.1-0.8zm-0.6 1.7c-0.2 0-0.4 0-0.4-0.2 0-0.4 0.6-0.4 0.8-0.4v0.4s-0.2 0.2-0.4 0.2zm11.2-1.7v-0.2h-0.4v2.1h0.4v-1.1c0-0.2 0.2-0.4 0.4-0.4h0.2l0.1-0.6h-0.3s-0.2 0-0.4 0.2zm-4.5-1.1c-0.6 0-0.8 0.4-0.9 0.9v0.2h-0.4v0.4h0.4l-0.4 1.5 0.2 0.5 0.3-0.5 0.4-1.5h0.6l0.2-0.4h-0.6v-0.2c0-0.2 0.2-0.3 0.4-0.3h0.2l0.1-0.4c-0.3-0.2-0.3-0.2-0.5-0.2zm-9.3 0.4h-0.4v2.6h0.4v-2.6zm1.5 0.5c-0.6 0-0.9 0.4-0.9 1 0 0.7 0.3 1.1 0.9 1.1s0.9-0.4 0.9-1.1c0-0.4-0.4-1-0.9-1zm0 1.9c-0.4 0-0.6-0.4-0.6-0.8 0-0.3 0.2-0.5 0.6-0.5 0.2 0 0.4 0.2 0.4 0.5 0 0.4 0 0.8-0.4 0.8z" />

      {/* Snowflake */}
      <path className="cls-21" d="m77.3 10.9 3.7-2.1c0.9-0.5 0.2-2-0.9-1.7l-2.7 1.5v-3.3c0-1.1-1.8-1.5-2-0.2v4.9c0 0.7 0.9 1.3 1.9 0.9zm-4.3-0.9v-4.9c0-1.3-1.9-1.3-1.9 0v2.8l-2.4-1.1c-1.1-0.6-2.4 0.9-1.6 1.5l4.2 2.6c0.8 0.8 1.7 0 1.7-0.9zm-2.1 2.2-4.2-2c-1.1-0.6-2.3 1.1-1.3 1.8l2.2 1.3-2.4 1.3c-0.9 0.4-0.2 2.3 0.9 1.9l4.7-2.2c1.1-0.4 1.1-1.5 0.1-2.1zm0.4 3.4-4.1 2.6c-0.9 0.5-0.1 2.9 1.5 1.7l2.2-1.2v3.3c0 1.3 2.1 1.5 2.3 0.2v-5.3c0.2-1.1-1-1.7-1.9-1.3zm4.1 1.3v5.3c0 1.3 1.9 1.3 1.9 0v-3.3l2.4 1.7c1.3 0.8 2.4-0.9 1.3-1.6l-4.1-2.7c-0.6-0.7-1.5-0.2-1.5 0.6zm7.3-2.1-2.2-1.3 2.2-1.1c1-0.6 0.4-2.4-0.7-2l-4.4 2.2c-0.9 0.4-0.9 1.7 0 2l4.2 2.1c0.9 0.6 2-1.1 0.9-1.9z" />
      <path className="cls-21" d="m74.5 11.5-1.7 0.9c-0.7 0.4-0.7 1.5-0.4 2.1l1.5 0.9c0.6 0.4 1.5 0 1.9-0.8l0.3-1.4c0-0.8-0.7-1.9-1.6-1.7zm0.9 1.8-2 0.6-0.4-0.9 1.5-1 0.9 1.3z" />

      {/* Animated stacks */}
      <motion.g animate={s1.animate} transition={s1.transition}>
        <path className="cls-19" d="m257.7 100.9-36.2-20.9c-0.4-0.2-1.6 0-1.7 0.3l-37.1 20.6c-1.1 0.6-1.1 1.9 0 2.5l36.5 20.3c0.7 0.4 1.5 0.4 2.3 0l36.2-20.3c1.1-0.6 1.3-1.9 0-2.5z" />
      </motion.g>
      <motion.g animate={s2.animate} transition={s2.transition}>
        <path className="cls-20" d="m257.7 116.9-35.9-20.5c-0.5-0.2-1.7 0-1.9 0.2l-37 20.3c-1.1 0.4-1.3 1.9 0 2.5l36.3 20.2c0.7 0.3 1.5 0.9 2.1 0.7 0.5 0.2 0.9 0 1.3-0.4l34.9-19.9c1.5-0.8 1.5-2.3 0.2-3.1z" />
      </motion.g>
      <motion.g animate={s3.animate} transition={s3.transition}>
        <path className="cls-17" d="m257.5 132.8-25.1-14.4-10.6 5.9c-0.7 0.3-1.5 0.3-2.2 0l-11.3-6.2-25.2 14.3c-1.9 0.9-1.9 2.2 0 3.1l36.1 19.8c0.4 0.2 1.1 0.6 1.7 0.4 0.4 0.2 0.9 0 1.3-0.2l35.1-19.6c1.7-0.9 1.7-2.2 0.2-3.1z" />
        <path className="cls-18" d="m257.5 132.8-11.6-6.8-24.1 13.6c-0.9 0.5-1.9 0-2.6-0.4l-24.8-13.6-11.5 6.6c-1.7 0.9-1.7 2.4 0 3.3l36.3 19.8c0.4 0.2 1.1 0.6 1.7 0.4 0.4 0.2 0.9 0 1.3-0.2l35.1-19.6c1.7-0.9 1.7-2.2 0.2-3.1z" />
      </motion.g>

      {/* Light trails */}
      {trails.map((trail, i) => (
        <motion.path
          key={i}
          d={trail.d}
          stroke="#c4b5fd"
          strokeWidth={1.5}
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: trail.seg, pathOffset: 0, opacity: 0 }}
          animate={{
            pathOffset: [0, 0, +(1 - trail.seg).toFixed(2), +(1 - trail.seg).toFixed(2)],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            times: [0, 0.04, 0.88, 1],
            duration: trail.duration,
            delay: trail.delay,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: CYCLE - trail.duration,
          }}
        />
      ))}
    </svg>
  );
}
