interface ValidateUrlOptions {
  pathname?: string
  searchParams?: Record<string, string>
}

export const validateUrl = (
  url: string,
  { pathname, searchParams }: ValidateUrlOptions,
) => {
  const _url = new URL(
    url,
    url.startsWith('http') ? undefined : 'https://nomus.me',
  )

  if (pathname) {
    expect(_url.pathname).toBe(pathname)
  }

  if (searchParams) {
    const _searchParams = new URLSearchParams(_url.search)
    for (const key in searchParams) {
      expect(_searchParams.get(key)).toBe(searchParams[key])
    }
  }
}
