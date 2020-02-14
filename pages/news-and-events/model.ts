import {Asset, Entry, ContentfulClientApi } from "contentful";

const fetchData = (client: ContentfulClientApi) : Promise<AsyncData> => {
  const todaysDate = new Date()
  return Promise.all([
    // Fetch upcoming events
    client.getEntries<EventsEntry>({
      content_type: process.env.ctf_event_id,
      order: 'fields.startDate',
      'fields.startDate[gte]': todaysDate.toISOString()
    }),

    // Fetch past events
    client.getEntries<EventsEntry>({
      content_type: process.env.ctf_event_id,
      order: 'fields.startDate',
      'fields.startDate[lt]': todaysDate.toISOString()
    }),

    // Fetch news
    client.getEntries<NewsEntry>({
      content_type: process.env.ctf_news_id,
      order: 'fields.publishedDate'
    })
  ]).then(([upcomingEvents, pastEvents, news]) => {
    // return data that should be available
    // in the template
    return {
      upcomingEvents: upcomingEvents.items,
      pastEvents: pastEvents.items,
      news: news.items
    }
  })
}

export type AsyncData = Pick<Data, "upcomingEvents" | "pastEvents" | "news">

export type EventsEntry = {
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

export type NewsEntry = {
  publishedDate?: string;
  summary?: string;
  title?: string;
  url?: string
}

export interface Tab {
  label: string;
  type: string;
}

export interface Breadcrumb {
  name: string;
  parent: string;
}

export interface Data {
  isLoadingSearch: boolean;
  searchTerms?: string;
  title: string
  breadcrumb: Breadcrumb,
  activeTab: string,
  eventsTabs: Tab[],
  upcomingEvents: EventsEntry[],
  pastEvents: EventsEntry[],
  isShowingAllUpcomingEvents: boolean,
  news: Partial<NewsEntry>
}


export interface Computed {
  displayedUpcomingEvents: (isShowingAllUpcomingEvents: boolean) => EventsEntry
}
