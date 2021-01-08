export const createMailtoURL = (
  to: string,
  subject: string,
  body: string,
): string => {
  const args = []
  args.push('subject=' + encodeURIComponent(subject))
  args.push('body=' + encodeURIComponent(body))
  return `mailto:${encodeURIComponent(to)}?${args.join('&')}`
}
