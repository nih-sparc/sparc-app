import { Asset, ContentfulClientApi, Entry, EntryCollection } from 'contentful';
import { Route } from 'vue-router';

import { Breadcrumb } from '@/components/Breadcrumb/model.ts';


export const fetchData = async (client: ContentfulClientApi, query?: string, limit?: number) : Promise<AsyncData> => {
  try {
    const todaysDate = new Date()

    const upcomingEvents = await client.getEntries<Event>({
      content_type: process.env.ctf_event_id,
      order: 'fields.startDate',
      'fields.startDate[gte]': todaysDate.toISOString(),
      query,
      limit
    })

    const pastEvents = await client.getEntries<Event>({
      content_type: process.env.ctf_event_id,
      order: 'fields.startDate',
      'fields.startDate[lt]': todaysDate.toISOString(),
      query,
      limit
    })

    const news = await fetchNews(client, query, limit)

    const page = await client.getEntry<PageData>(process.env.ctf_news_and_events_page_id ?? '')

    return {
      upcomingEvents: upcomingEvents.items,
      pastEvents: pastEvents.items,
      news,
      page
    }
  } catch (e) {
    console.error(e)
    return {
      upcomingEvents: [],
      pastEvents: [],
      news: {} as unknown as NewsCollection,
      page: {} as unknown as PageEntry
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

export type AsyncData = Pick<Data, "upcomingEvents" | "pastEvents" | "news" | "page">

export interface PageData {
  featuredEvent?: Entry<Event>;
  page_title?: string;
  heroCopy?: string;
  heroImage?: Asset;
}

export type PageEntry = Entry<PageData>


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
  news: NewsCollection,
  page: PageEntry
}

export interface Computed {
  featuredEvent: Entry<Event>
}
export interface Methods {
  getAllNews: (this: NewsAndEventsComponent) => void;
}
export interface NewsData {
  breadcrumb: Breadcrumb[]
}
export interface NewsComputed {
  curSearchPage: number
}

export interface NewsMethods {
  onPaginationPageChange: (page: number) => void
}

export type NewsAndEventsComponent = Data & Computed & Methods & { $route: Route }
export type NewsPage = NewsData & NewsComputed & NewsMethods & { $route: Route }
