"use client";

import {
  Briefcase01Icon,
  User02Icon,
  BookOpen01Icon,
  GridIcon,
  PenTool01Icon,
  CodeIcon,
  Film01Icon,
  BrainIcon,
  ColorsIcon,
  CubeIcon,
  Notebook01Icon,
  Certificate01Icon,
  Mail01Icon,
  FileEditIcon,
  Medal01Icon,
  Calendar01Icon,
  ArtboardIcon,
  CodeSimpleIcon,
  FlowerIcon,
  Airplane01Icon,
  Layers01Icon,
  BulbIcon,
  PencilRulerIcon,
  Login01Icon,
} from "@hugeicons/core-free-icons";
import BottomNavbar, { LoginPanel, NavItem } from "../subitem-navbar";

const SETTINGS_ROWS = [
  [
    { label: "Notifications", wide: false },
    { label: "Appearance", wide: false },
    { label: "Language & Region", wide: true },
  ],
  [
    { label: "Account", wide: false },
    { label: "Privacy & Security", wide: true },
    { label: "Connected Apps", wide: false },
  ],
  [
    { label: "Storage", wide: false },
    { label: "Help & Support", wide: false },
  ],
];

const NAV_ITEMS: NavItem[] = [
  {
    label: "Work",
    icon: Briefcase01Icon,
    subs: [
      { label: "All", icon: GridIcon },
      { label: "Design", icon: PenTool01Icon },
      { label: "Dev", icon: CodeIcon },
      { label: "Motion", icon: Film01Icon },
      { label: "Research", icon: BrainIcon },
      { label: "Branding", icon: ColorsIcon },
      { label: "3D", icon: CubeIcon },
    ],
  },
  {
    label: "About",
    icon: User02Icon,
    subs: [
      { label: "Story", icon: Notebook01Icon },
      { label: "Skills", icon: Certificate01Icon },
      { label: "Contact", icon: Mail01Icon },
      { label: "Resume", icon: FileEditIcon },
      { label: "Awards", icon: Medal01Icon },
      { label: "Timeline", icon: Calendar01Icon },
    ],
  },
  {
    label: "Journal",
    icon: BookOpen01Icon,
    subs: [
      { label: "All", icon: GridIcon },
      { label: "Design", icon: ArtboardIcon },
      { label: "Code", icon: CodeSimpleIcon },
      { label: "Life", icon: FlowerIcon },
      { label: "Travel", icon: Airplane01Icon },
      { label: "Process", icon: Layers01Icon },
      { label: "Insights", icon: BulbIcon },
      { label: "Tools", icon: PencilRulerIcon },
    ],
  },
  {
    label: "Login",
    icon: Login01Icon,
    panel: <LoginPanel />,
  },
];

export default function SubitemNavbarPreview() {
  return (
    <div className="flex items-center justify-center pt-10">
      <div
        className="relative h-[600px] w-[340px] overflow-hidden rounded-[15px]"
        style={{
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.08), 0 40px 80px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.4)",
        }}
      >
        <div className="absolute top-0 right-0 left-0 z-30 flex h-10 items-center justify-between px-8">
          <span className="text-xs font-semibold text-white antialiased">
            9:41
          </span>
          <div className="flex items-center gap-1">
            <div className="flex h-2.5 w-4 items-center rounded-sm border border-white/40 p-[1.5px]">
              <div className="h-full w-1/2 rounded-[1px] bg-white/40" />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden bg-[#f2f2f7] px-5 pt-14 pb-28">
          <div className="mb-6 h-7 w-24 rounded-lg bg-black/10" />
          <div className="mb-5 flex items-center gap-3.5 rounded-2xl bg-white px-4 py-3.5 shadow-sm">
            <div className="h-11 w-11 flex-shrink-0 rounded-full bg-black/10" />
            <div className="flex flex-col gap-1.5">
              <div className="h-3 w-28 rounded-full bg-black/15" />
              <div className="h-2.5 w-20 rounded-full bg-black/[0.07]" />
            </div>
            <div className="ml-auto h-4 w-4 rounded-full bg-black/10" />
          </div>
          {SETTINGS_ROWS.map((group, gi) => (
            <div key={gi} className="mb-3 overflow-hidden rounded-2xl bg-white">
              {group.map((row, ri) => (
                <div key={ri}>
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    <div className="h-7 w-7 flex-shrink-0 rounded-lg bg-black/[0.07]" />
                    <div
                      className="h-2.5 rounded-full bg-black/[0.12]"
                      style={{ width: row.wide ? "52%" : "38%" }}
                    />
                    <div className="ml-auto flex items-center gap-2">
                      <div className="h-2 w-8 rounded-full bg-black/[0.07]" />
                      <div className="h-3 w-3 rounded-full bg-black/[0.06]" />
                    </div>
                  </div>
                  {ri < group.length - 1 && (
                    <div className="ml-[60px] h-px bg-black/[0.06]" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <BottomNavbar items={NAV_ITEMS} />
      </div>
    </div>
  );
}
