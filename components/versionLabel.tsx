import { IS_PROD, SYS_ENV, VERSION } from "@/core/constants";

export const VersionLabel = () => (
  <div className="fixed bottom-3 right-4 text-xs font-semibold text-slate-400 select-none z-50">
    v{VERSION} {IS_PROD ? "" : "DEV"}
  </div>
);
