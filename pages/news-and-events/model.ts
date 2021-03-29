import { Asset, ContentfulClientApi, Entry, EntryCollection } from 'contentful';
import { Route } from 'vue-router';

import { Breadcrumb } from '@/components/Breadcrumb/model.ts';


export const fetchData = async (client: ContentfulClientApi, query?: string) : Promise<AsyncData> => {
  try {
    const todaysDate = new Date()

    const upcomingEvents = await client.getEntries<Event>({
      content_type: process.env.ctf_event_id,
      order: 'fields.startDate',
      'fields.startDate[gte]': todaysDate.toISOString(),
      query,
    })

    const pastEvents = await client.getEntries<Event>({
      content_type: process.env.ctf_event_id,
      order: 'fields.startDate',
      'fields.startDate[lt]': todaysDate.toISOString(),
      query,
    })


    const news = await fetchNews(client, query, 4)

    const heroData = await client.getEntry<HeroData>(process.env.ctf_news_and_events_page_id ?? '')

    return {
      upcomingEvents: upcomingEvents.items,
      pastEvents: pastEvents.items,
      news,
      heroData
    }
  } catch (e) {
    console.error(e)
    return {
      upcomingEvents: [],
      pastEvents: [],
      news: {} as unknown as NewsCollection,
      heroData: {} as unknown as Entry<HeroData>
    }
  }
}

export const fetchNews = async (client: ContentfulClientApi, query?: string, limit?: number,  skip?: number) : Promise<NewsCollection> => {
  try {
    return await client.getEntries<NewsEntry>({
      content_type: process.env.ctf_news_id,
      order: '-fields.publishedDate',
      query,
      limit,
      skip
    })
  } catch (e) {
    console.error(e)
    return {} as unknown as NewsCollection
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

export type NewsCollection = EntryCollection<NewsEntry>

export interface Tab {
  label: string;
  type: string;
}

export interface Data {
  title: string
  breadcrumb: Breadcrumb[],
  activeTab: string,
  eventsTabs: Tab[],
  upcomingEvents: EventsEntry[],
  pastEvents: EventsEntry[],
  isShowingAllUpcomingEvents: boolean,
  isShowingAllPastEvents: boolean,
  news: NewsCollection,
  heroData: HeroDataEntry,
  pastEventChunk: number
}


export interface Computed {
  displayedUpcomingEvents: EventsEntry[],
  pastEventsChunkMax: number,
  displayedPastEvents: EventsEntry[]
}
export interface Methods {
  getAllNews: (this: NewsAndEventsComponent) => void;
}

export type NewsAndEventsComponent = Data & Computed & Methods & { $route: Route }
