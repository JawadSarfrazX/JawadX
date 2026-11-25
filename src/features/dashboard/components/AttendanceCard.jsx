import Card from "../../../components/ui/Card";

export default function AttendanceCard({ percent }) {
  return (
    <Card className="anim-fade-up h-full">
      <h3 className="mb-4 font-bold">Attendance Overview</h3>

      {percent == null ? (
        <p className="py-10 text-center text-sm text-stone-500 dark:text-stone-400">
          Attendance module abhi bana nahi. Data aane par yahan dikhega.
        </p>
      ) : (
        <div className="flex items-center justify-center">
          <div
            className="grid size-40 place-items-center rounded-full shadow-[0_0_30px_rgba(242,140,40,0.35)]"
            style={{ background: `conic-gradient(#f28c28 ${percent}%, #e7e5e4 0)` }}
          >
            <div className="grid size-32 place-items-center rounded-full bg-white dark:bg-[#1c1c21]">
              <div className="text-center">
                <p className="text-2xl font-extrabold">{percent}%</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">Present</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}