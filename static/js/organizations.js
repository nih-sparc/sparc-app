import sparcLogo from '@/assets/logo-sparc-wave-primary.svg'
import rejoinLogo from '@/assets/rejoin.jpg'
import precisionLogo from '@/assets/heal.png'

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
  },
  {
    name: 'HEAL PRECISION',
    id: process.env.PRECISION_ORG_ID,
    logo: precisionLogo
  }
]

export const getOrganizationInfo = id => {
  const org = organizationsData.find(org => org.id == id)
  return org ? org : null
}

export const getOrganizationStatus = org => {
  if (org.isOwner)
    return 'Owner'
  else if (org.isAdmin)
    return 'Admin'
  else if (org.isGuest)
    return 'Guest'
  else
    return 'Collaborator'
}
