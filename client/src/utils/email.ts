export interface EmailContent {
  to: string
  subject?: string
  body?: string
}

export const createMailtoURL = (emailContent: EmailContent): string => {
  const args = []
  if (emailContent.subject) {
    args.push('subject=' + encodeURIComponent(emailContent.subject))
  }
  if (emailContent.body) {
    args.push('body=' + encodeURIComponent(emailContent.body))
  }
  return `mailto:${encodeURIComponent(emailContent.to)}?${args.join('&')}`
}
