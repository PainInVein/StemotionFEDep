export function getUserKey() {
  try {
    const raw = localStorage.getItem("user");
    const u = raw ? JSON.parse(raw) : null;

    return (
      u?.userId ||
      u?.id ||
      u?.studentId ||
      u?.email ||
      u?.username ||
      "guest"
    );
  } catch {
    return "guest";
  }
}
