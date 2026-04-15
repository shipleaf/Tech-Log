const postDateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function formatPostDate(dateString: string) {
  return postDateFormatter.format(new Date(dateString));
}
