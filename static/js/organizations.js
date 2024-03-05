import sparcLogo from '@/assets/logo-sparc-wave-primary.svg'
import rejoinLogo from '@/assets/rejoin.jpg'

const organizationsData = [
  {
    name: 'SPARC',
    id: process.env.SPARC_ORG_ID,
    logo: sparcLogo
  },
  {
    name: 'RE-JOIN',
    id: process.env.REJOIN_ORG_ID,
    logo: rejoinLogo
  }
]

export const getOrganizationInfo = id => {
  const org = organizationsData.find(org => org.id == id)
  return org ? org : null
}

export const getOrganizationStatus = org => {
  if (org.isOwner)
    return 'Owner Access'
  else if (org.isAdmin)
    return 'Admin Access'
  else if (org.isGuest)
    return 'Guest Access'
  else
    return 'Read Access'
}