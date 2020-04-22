export const downloadFile = (url: string, name?: string) => {
  const a = document.createElement('a')
  a.href = url
  if (name) {
    a.download = name
  }
  a.hidden = true
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
