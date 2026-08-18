"use client";

import { motion } from "framer-motion";

export function FolderSVG() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 115 115" width="100%" height="100%">
      <defs>
        <style type="text/css">{`
          .fd-0 { fill:#E6E7E4; }
          .fd-1 { fill:#D8D9D7; }
          .fd-5 { fill:#354852; }
          .fd-3 { fill:none; stroke:#354852; stroke-width:0.8486; stroke-linecap:round; stroke-miterlimit:10; stroke-dasharray:2.9699,2.9699; }
          .fd-4 { fill:none; stroke:#354852; stroke-width:0.7714; stroke-linecap:round; stroke-miterlimit:10; stroke-dasharray:3.0063,3.0063; }
        `}</style>
        <linearGradient id="fdG1" x1="22.62" x2="82.04" y1="89.03" y2="29.6"
          gradientTransform="matrix(1 0 0 -1 0 116)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F5F5F5" offset="0" />
          <stop stopColor="#EBEBEA" offset="1" />
        </linearGradient>
      </defs>

      {/* ── 1. Background layer — static ── */}
      <g>
        <path className="fd-0" d="m104.2 47.8v0z" />
        <path className="fd-1" d="m101.5 43.2-71.8-41.2c-1.6-0.8-2.8-0.3-2.8 1.3v7.7l77.3 44.6v-7.7c0-1.5-1.2-3.8-2.7-4.7z" />
        <path className="fd-0" d="m26.9 11v35l58.1 25c5.1 2.9 13.6 8.2 19.1 11.3l2.8 1.6v-35.6l-80-37.3z" />
      </g>

      {/* ── 2. Document — slides up from behind the front face, pauses, returns ── */}
      <motion.g
        animate={{ y: [0, -26, -26, 0] }}
        transition={{
          duration: 2.8,
          times: [0, 0.28, 0.72, 1],
          ease: [
            [0.34, 1.56, 0.64, 1],
            "linear",
            [0.4, 0, 0.2, 1],
          ] as never,
          repeat: Infinity,
          repeatDelay: 2,
        }}
      >
        {/* Document face — isometric parallelogram matching folder angle */}
        <polygon
          points="27,22 74,49 74,64 27,37"
          fill="#FAFAFA"
          stroke="#C8C9C7"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        {/* Content lines on the document face */}
        <line x1="34" y1="30" x2="66" y2="48" stroke="#DDDCDB" strokeWidth="0.9" strokeLinecap="round" />
        <line x1="34" y1="36" x2="62" y2="52" stroke="#DDDCDB" strokeWidth="0.9" strokeLinecap="round" />
        <line x1="34" y1="42" x2="55" y2="55" stroke="#DDDCDB" strokeWidth="0.9" strokeLinecap="round" />
      </motion.g>

      {/* ── 3. Front face — static, naturally covers document until it peeks out ── */}
      <g>
        <path fill="url(#fdG1)" d="m104.2 55.7-91.3-39.2-1.9 1.3v48.2c0 1.6 1.1 4 2.6 5l72.4 41.3c1.2 0.7 2.4 1 3 0.7l2.8-1.7c-1.3 0.3-0.9-30.7-0.9-33.3v-14.7c-0.1-2.2-1.3-4.6-2.9-5.6l16.2-2z" />
        <path fill="#fff" d="m87.9 112.5-74.3-42.3c-1.5-0.9-2.4-2.7-2.2-5.2l-0.2-47.1 1.7-1.4 75.1 41.3c1.5 0.9 2.7 3.2 2.8 5.2s0.3 47.7 0.3 47.7l-1.7 1.4c-0.1 0.6-0.7 0.8-1.5 0.4z" />
        <path className="fd-3" d="m11.1 20.7c0-0.9 0.1-2.9 0.6-3.2l1.2-1 2.7 0.2 2.6 0.6 69.1 39.6c1.7 0.9 2.9 3.1 3.4 4.7 0.2 0.5 0.3 2.8 0.3 2.8l-0.2 45.2c-0.1 1-0.3 2.3-1.3 3.1l-2.8 0.3-72.5-41.7c-0.6-0.4-1.6-1.3-1.7-2-0.5-0.7-1.2-2.4-1.3-4.5l-0.1-44.1z" />
        <path className="fd-4" d="m11.1 23.6v2.9l77.5 43.9v-2.5" />

        <path className="fd-5" d="m31.1 7c0.4-0.2 1.3 0.4 1.6 1.2s0.1 1.6-0.5 1.5-1.7-1.4-1.1-2.7m-0.4 0c-0.9 0.6-0.1 3 1.4 3.5 1.2 0.4 1.7-0.7 1-2.1-0.5-1-1.7-2.1-2.4-1.4z" />
        <path className="fd-5" d="m35.7 10.2c0.5-0.2 1.3 0.4 1.6 1.1s0.1 1.5-0.4 1.4c-0.7-0.1-1.6-1.5-1.2-2.5m-0.4-0.5c-0.9 0.7-0.1 3 1.4 3.5 1.2 0.4 1.9-0.7 1.1-2.2-0.5-1-1.8-2-2.5-1.3z" />
        <path className="fd-5" d="m40.6 12.9c1.1-0.5 2.6 1.9 1.5 2.3-0.7 0.3-1.9-1.5-1.5-2.3m-0.4-0.4c-0.9 0.7 0.4 3.7 2.1 3.4 1-0.1 1-1.6 0.1-2.7-0.5-0.6-1.6-1.6-2.2-0.7z" />

        <path className="fd-5" d="m15.1 22.2c0.5 0.1-0.1 1.8 0.2 2-1 0.3-0.9-2.2-0.2-2z" />
        <path className="fd-5" d="m17.2 22.9-1.6-0.9c-0.2-1.2 2 0.2 1.7 0.7l-0.1 0.2z" />
        <path className="fd-5" d="m18.1 26.1c-0.7-0.2-0.3-2.5 0.1-2.1 0.3 0.2 0.1 1.8 0.1 2l-0.2 0.1z" />
        <path className="fd-5" d="m16.9 26.5-1.5-0.9 0.1-0.6 1.7 1.1-0.1 0.4h-0.2z" />
        <path className="fd-5" d="m19.5 26.9c-0.7 0-0.4-2.7 0.1-1.9l-0.1 1.9z" />
        <path className="fd-5" d="m21.8 25.6-1.7-0.9c-0.1-1.1 2.2 0.3 1.9 0.7l-0.2 0.2z" />
        <path className="fd-5" d="m22.7 28.5c-0.7 0-0.4-2.3 0-1.8 0.2 0.2 0.3 1.6 0.2 1.8h-0.2z" />
        <path className="fd-5" d="m21.6 29.1-1.4-0.6-0.1-0.4 0.2-0.3 1.6 0.9-0.1 0.3-0.2 0.1z" />
        <path className="fd-5" d="m24.1 29.4c-0.6 0-0.3-2.3-0.1-1.8 0.5-0.1 0.2 1.8 0.2 1.8h-0.1z" />
        <path className="fd-5" d="m26.4 28.3-1.8-0.8 0.1-0.6c0.8-0.1 2.7 1.2 1.7 1.4z" />
        <path className="fd-5" d="m27.3 31.3c-0.5-0.2-0.2-2.4 0.3-1.9l0.1 0.3-0.1 1.4-0.3 0.2z" />
        <path className="fd-5" d="m26.4 31.8-1.6-0.8-0.2-0.5 0.2-0.3 1.7 1.1v0.5h-0.1z" />

        <path className="fd-5" d="m42.5 60.1 1.2 0.7v7.1l1 0.6v1.2l-1-0.5v2.2l-1.3-0.8v-2.1l-4.6-2.6v-1.3l4.5-4.5h0.2zm-0.1 2-3.1 3.3 3.1 1.7v-5z" />
        <path className="fd-5" d="m48.6 63.5c2 0.5 3.8 2.8 3.9 6.5 0.3 5-1.3 6-3.8 4.3-1.7-1.2-2.7-4.1-2.7-6.8-0.1-3.2 0.8-4.5 2.6-4zm1.7 2.9c-0.3-0.7-0.9-1.3-1.5-1.4-1.3-0.3-1.6 1.6-1.3 4.5l0.1 1 2.7-4.1zm-2.3 5.6c0.2 0.6 0.8 1.4 1.6 1.6 1.1 0.4 1.7-2 1.3-5.7v-0.1l-2.9 4.2z" />
        <path className="fd-5" d="m57.9 69.1 1.3 0.8v7.1l1 0.5v1.2l-1-0.5v2.4l-1.2-0.8v-2.2l-4.4-2.8v-1.2l4.3-4.5zm0 1.9-2.9 3.2 3 1.8v-4.9l-0.1-0.1z" />
      </g>
    </svg>
  );
}
