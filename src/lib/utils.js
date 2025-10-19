import { clsx, } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}


export function formatTime(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()

  const isSameDay = date.toDateString() === now.toDateString()
  const isSameYear = date.getFullYear() === now.getFullYear()
  const isSameMonth = date.getMonth() === now.getMonth()

  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]


  if (isSameDay) {
    // 🕒 Trong cùng ngày → hiển thị giờ:phút
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    })
  } else if (diffDays < 7 && isSameMonth) {
    // 📅 Trong cùng tuần
    return daysOfWeek[date.getDay()]
  } else if (isSameYear) {
    // 🗓️ Khác tháng nhưng cùng năm
    return `${date.getDate()} thg${date.getMonth() + 1}`
  } else {
    // 📆 Khác năm
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  }
}