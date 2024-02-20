import sparcLogo from '@/assets/logo-sparc-wave-primary.svg'
import rejoinLogo from '@/assets/rejoin.jpg'

const organizationsData = [
  {
    name: 'SPARC',
    id: 'N:organization:df3d6291-7fc7-4bb4-b916-5eca3a026380', // Test SPARC id
    //id: 'N:organization:618e8dd9-f8d2-4dc4-9abb-c6aaab2e78a0',
    logo: sparcLogo
  },
  {
    name: 'REJOIN',
    id: '',
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