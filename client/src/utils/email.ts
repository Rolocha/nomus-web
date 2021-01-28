export interface EmailContent {
  to: string
  subject: string
  body: string
}

export const createMailtoURL = (emailContent: EmailContent): string => {
  const args = []
  args.push('subject=' + encodeURIComponent(emailContent.subject))
  args.push('body=' + encodeURIComponent(emailContent.body))
  return `mailto:${encodeURIComponent(emailContent.to)}?${args.join('&')}`
}
