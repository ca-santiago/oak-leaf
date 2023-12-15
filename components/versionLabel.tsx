import { VERSION } from "@/core/constants";

export const VersionLabel = () => (
  <div className="fixed bottom-3 right-4 text-xs font-semibold text-slate-400 select-none z-50">
    v{VERSION} {process.env.NODE_ENV === "production" ? "" : "DEV"}
  </div>
);
