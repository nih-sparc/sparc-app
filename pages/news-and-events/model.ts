import {Asset, Entry, ContentfulClientApi} from "contentful"

export const fetchData = async (client: ContentfulClientApi) : Promise<AsyncData | void> => {
  try {
    const todaysDate = new Date()

    const upcomingEvents = await client.getEntries<Event>({
      content_type: process.env.ctf_event_id,
      order: 'fields.startDate',
      'fields.startDate[gte]': todaysDate.toISOString()
    })

    const pastEvents = await client.getEntries<Event>({
      content_type: process.env.ctf_event_id,
      order: 'fields.startDate',
      'fields.startDate[lt]': todaysDate.toISOString()
    })

    const news = await client.getEntries<News>({
      content_type: process.env.ctf_news_id,
      order: '-fields.publishedDate'
    })

    const heroData = await client.getEntry<HeroData>('4IoMamTLRlN3OpxT1zgnU')

    return {
      upcomingEvents: upcomingEvents.items,
      pastEvents: pastEvents.items,
      news: news.items,
      heroData
    }
  } catch (e) {
    console.error(e)
  }
}

export type AsyncData = Pick<Data, "upcomingEvents" | "pastEvents" | "news" | "heroData">

export interface HeroData {
  page_title?: string;
  heroCopy?: string;
  heroImage?: Asset;
}

export type HeroDataEntry = Entry<HeroData>


export interface Event {
  endDate?: string;
  eventType?: string;
  hasSparcEvent?: boolean;
  image?: Asset;
  location?: string;
  sparcRepresentatives?: string[];
  startDate?: string;
  summary?: string;
  title?: string;
  url?: string;
}

export type EventsEntry = Entry<Event>

export interface News {
  publishedDate?: string;
  summary?: string;
  title?: string;
  url?: string
}

export type NewsEntry = Entry<News>

export interface Tab {
  label: string;
  type: string;
}

export interface Breadcrumb {
  name: string;
  parent: string;
}

export interface Data {
  title: string
  breadcrumb: Breadcrumb,
  activeTab: string,
  eventsTabs: Tab[],
  upcomingEvents: EventsEntry[],
  pastEvents: EventsEntry[],
  isShowingAllUpcomingEvents: boolean,
  news: NewsEntry[],
  heroData: HeroDataEntry
}


export interface Computed {
  displayedUpcomingEvents: EventsEntry[]
}
