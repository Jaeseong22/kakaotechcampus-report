"use client";

import { CircleAlert, RotateCcw } from "lucide-react";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="grid min-h-[70vh] place-items-center px-5 text-center">
      <div>
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-rose-50 text-rose-500">
          <CircleAlert size={26} />
        </span>
        <h1 className="mt-5 text-xl font-black text-slate-950">Todo를 불러오지 못했습니다</h1>
        <p className="mt-2 text-sm text-slate-500">FastAPI 서버가 실행 중인지 확인한 뒤 다시 시도해 주세요.</p>
        <button
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white"
          type="button"
          onClick={reset}
        >
          <RotateCcw size={15} />
          다시 시도
        </button>
      </div>
    </div>
  );
}
