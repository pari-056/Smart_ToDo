import { useState, useEffect } from "react";

export default function useCountdown(deadline, completed) {
  const [timeLeft, setTimeLeft] = useState({});
  const [urgency, setUrgency] = useState("safe"); // safe, warning, urgent
  const [overdue, setOverdue] = useState(false);

  useEffect(() => {
    if (!deadline) return;

    function updateTime() {
      if (completed) {
        setTimeLeft({});
        setUrgency(null);
        setOverdue(false);
        return;
      }

      const now = new Date().getTime();
      const target = new Date(deadline).getTime();
      const diff = target - now;

      if (diff < 0) {
        setOverdue(true);
        setUrgency(null);
        setTimeLeft({});
        return;
      }

      setOverdue(false);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });

      if (days >= 3) setUrgency("safe");
      else if (days >= 1) setUrgency("warning");
      else setUrgency("urgent");
    }

    updateTime(); // initial call
    const timerId = setInterval(updateTime, 1000);

    return () => clearInterval(timerId);
  }, [deadline, completed]);

  function formatTime() {
    if (overdue) return null;

    const { days, hours, minutes, seconds } = timeLeft || {};
    if (
      days === undefined ||
      hours === undefined ||
      minutes === undefined ||
      seconds === undefined
    )
      return "";

    return `${days}d ${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return { timeStr: formatTime(), urgency, overdue };
}
