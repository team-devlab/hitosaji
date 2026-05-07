// 端末のローカルタイムゾーンで今日の日付を YYYY-MM-DD として返す。
// Date.toISOString() は UTC 基準で、日本時間 0:00〜9:00 の保存が前日扱いになる
// バグを避けるため、しおりの日付はこのヘルパーを通して取得する。
export function getTodayLocalDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatMonth(month: string): string {
  const [year, rawMonth] = month.split("-");
  return `${year} 年 ${Number(rawMonth)} 月`;
}

export function formatDay(date: string): string {
  const [, rawMonth, rawDay] = date.split("-");
  return `${Number(rawMonth)}/${Number(rawDay)}`;
}
