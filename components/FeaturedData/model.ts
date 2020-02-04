export interface FeaturedItem {
  fields: {
    image?: {
      fields?: {
        file?: {
          url?: string
        }
      }
    },
    label: string
    link: string
  },
  sys: {
    id: string
  }
}

export interface Props {
  featuredData: FeaturedItem[]
}

export interface Methods {
  imageUrl: (item: FeaturedItem) => string
}