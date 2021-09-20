export const getTemplateName = (templateId) => {
  switch (templateId) {
    case 'velia':
      return 'Velia'
    case 'rolocha':
      return 'Rolocha'
    case 'konawide':
      return 'KonaWide'
    case 'konatall':
      return 'KonaTall'
    case 'jim':
      return 'Jim'
    case 'nicole':
      return 'Nicole'
    default:
      return ''
  }
}
