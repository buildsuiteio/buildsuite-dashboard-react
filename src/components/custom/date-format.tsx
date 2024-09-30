export function formatDate(dateString?: string) {
  if (dateString == null) {
    return "NA";
  }

  if (dateString.length == 0) {
    return "NA";
  }

  const date = new Date(dateString);

  // Array of month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Extract the day, month, and year from the date
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  // Return the formatted date
  return `${month} ${day}, ${year}`;
}

export function formatDate2(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function getDaysLeft(dateString?: string): number {
  if (!dateString) return 0;

  const targetDate = new Date(dateString);
  const today = new Date();

  // Set both dates to midnight to ignore the time part
  targetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const timeDiff = targetDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  return daysDiff > 0 ? daysDiff : 0;
}
