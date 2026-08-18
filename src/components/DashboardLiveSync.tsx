import { useEffect } from "react";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function DashboardLiveSync() {
  useEffect(() => {
    const sync = () => {
      const students = read<any[]>("bv_students", []);
      const teachers = read<any[]>("bv_teachers", []);
      const classes = read<any[]>("bv_classes", []);
      const attendance = read<any[]>("bv_attendance", []);
      const fees = read<any[]>("bv_fees", []);

      const stats = document.querySelectorAll<HTMLElement>(".stats .stat strong");
      if (stats.length >= 6) {
        const paid = fees.reduce((sum, fee) => sum + Number(fee.paid || 0), 0);
        const outstanding = fees.reduce((sum, fee) => sum + Math.max(Number(fee.amount || 0) - Number(fee.paid || 0), 0), 0);
        const todayPaid = paid;
        const present = attendance.filter(x => String(x.status).toLowerCase() === "present").length;
        const late = attendance.filter(x => String(x.status).toLowerCase() === "late").length;
        const absent = attendance.filter(x => String(x.status).toLowerCase() === "absent").length;
        const rate = attendance.length ? Math.round((present / attendance.length) * 100) : 0;
        const overdue = fees.reduce((sum, fee) => String(fee.status).toLowerCase() === "overdue" ? sum + Math.max(Number(fee.amount || 0) - Number(fee.paid || 0), 0) : sum, 0);

        stats[0].textContent = students.length.toLocaleString();
        stats[1].textContent = teachers.length.toLocaleString();
        stats[2].textContent = classes.length.toLocaleString();
        stats[3].textContent = `${rate}%`;
        stats[4].textContent = `PKR ${todayPaid.toLocaleString()}`;
        stats[5].textContent = `PKR ${outstanding.toLocaleString()}`;

        const attendanceBox = document.querySelector<HTMLElement>(".attendance");
        if (attendanceBox) {
          const big = attendanceBox.querySelector<HTMLElement>("b");
          const bar = attendanceBox.querySelector<HTMLElement>(".bar i");
          const small = attendanceBox.querySelector<HTMLElement>("small");
          if (big) big.textContent = `${rate}%`;
          if (bar) bar.style.width = `${rate}%`;
          if (small) small.textContent = `Present ${present} · Late ${late} · Absent ${absent}`;
        }

        const feePanel = [...document.querySelectorAll<HTMLElement>(".panel")].find(panel => panel.querySelector("h2")?.textContent?.trim() === "Fee Overview");
        if (feePanel) {
          const rows = feePanel.querySelectorAll<HTMLElement>(".fee-row b");
          if (rows[0]) rows[0].textContent = `PKR ${paid.toLocaleString()}`;
          if (rows[1]) rows[1].textContent = `PKR ${outstanding.toLocaleString()}`;
          if (rows[2]) rows[2].textContent = `PKR ${overdue.toLocaleString()}`;
        }
      }
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true });
    const timer = window.setInterval(sync, 500);
    window.addEventListener("storage", sync);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return null;
}
