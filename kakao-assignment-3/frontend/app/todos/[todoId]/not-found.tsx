import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-5 text-center">
      <div>
        <p className="text-6xl font-black text-slate-200">404</p>
        <h1 className="mt-3 text-xl font-black text-slate-950">할 일을 찾을 수 없습니다</h1>
        <Link className="mt-6 inline-flex rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white" href="/todos">
          목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
