import { Asset, ContentfulClientApi, Entry, EntryCollection } from 'contentful';
import { Route } from 'vue-router';
import { sub } from 'date-fns'

import { Breadcrumb } from '@/components/Breadcrumb/model.ts';
import { searchQueryReplacements } from '../data/utils';

const replaceTerms = (terms?: string) => {
  let result = terms
  if (result) {
    Object.entries(searchQueryReplacements).forEach(([term, replacement]) => result = result?.replace(term, replacement))
  }
  return result
}

export const fetchData = async (client: ContentfulClientApi, terms?: string, limit?: number) : Promise<AsyncData> => {

  const query = replaceTerms(terms)

  try {
    const todaysDate = new Date()

    const upcomingEvents = await client.getEntries<EventsEntry>({
      content_type: process.env.ctf_event_id,
      order: 'fields.startDate',
      'fields.startDate[gte]': todaysDate.toISOString(),
      query,
      limit
    })

    const pastEvents = await client.getEntries<EventsEntry>({
      content_type: process.env.ctf_event_id,
      order: '-fields.startDate',
      'fields.startDate[lt]': todaysDate.toISOString(),
      'fields.startDate[gte]': sub(todaysDate, { years: 2 }).toISOString(),
      query,
      limit
    })

    const news = await fetchNews(client, query, undefined, undefined, undefined, undefined, limit)

    const page = await client.getEntry<PageData>(process.env.ctf_news_and_events_page_id ?? '')

    const stories = await fetchCommunitySpotlightItems(client, query, undefined, undefined, undefined, 2, 0)

    return {
      upcomingEvents,
      pastEvents,
      news,
      page,
      stories
    }
  } catch (e) {
    console.error(e)
    return {
      upcomingEvents: {} as unknown as EventsCollection,
      pastEvents: {} as unknown as EventsCollection,
      news: {} as unknown as NewsCollection,
      page: {} as unknown as PageEntry,
      stories: {} as unknown as CommunitySpotlightItemsCollection
    }
  }
}

export const fetchEvents = async (client: ContentfulClientApi, terms?: string, eventStartLessThanDate?: string, eventStartGreaterThanOrEqualToDate?: string, eventTypes?: Array<string>, sortOrder?: string, limit?: number, skip?: number) : Promise<EventsCollection> => {

  const query = replaceTerms(terms)

  try {
    return await client.getEntries<EventsEntry>({
      content_type: process.env.ctf_event_id,
      order: sortOrder || '-fields.startDate',
      query,
      limit,
      skip,
      'fields.startDate[lt]': eventStartLessThanDate,
      'fields.startDate[gte]': eventStartGreaterThanOrEqualToDate,
      'fields.eventType[in]': eventTypes
    })
  } catch (e) {
    console.error(e)
    return {} as unknown as EventsCollection
  }
}

export const fetchNews = async (client: ContentfulClientApi, terms?: string, publishedLessThanDate?: string, publishedGreaterThanOrEqualToDate?: string, subjects?: Array<string>, sortOrder?: string, limit?: number, skip?: number) : Promise<NewsCollection> => {

  const query = replaceTerms(terms)

  try {
    return await client.getEntries<NewsEntry>({
      content_type: process.env.ctf_news_id,
      order: sortOrder || '-fields.publishedDate',
      query,
      limit,
      skip,
      'fields.publishedDate[lt]': publishedLessThanDate,
      'fields.publishedDate[gte]': publishedGreaterThanOrEqualToDate,
      'fields.subject[in]': subjects
    })
  } catch (e) {
    console.error(e)
    return {} as unknown as NewsCollection
  }
}

export const fetchCommunitySpotlightItems = async (client: ContentfulClientApi, terms?: string, spotlightTypes?: Array<string>, anatomicalStructuresEntryIds?: Array<string>, sortOrder?: string, limit?: number, skip?: number) : Promise<CommunitySpotlightItemsCollection> => {
  const query = replaceTerms(terms)
  try {
    return await client.getEntries<CommunitySpotlightItemEntry>({
      content_type: process.env.ctf_community_spotlight_item_id,
      order: sortOrder || '-fields.publishedDate',
      query,
      limit,
      skip,
      'fields.itemType[in]': spotlightTypes?.toString(),
      // we need to use the entry ID instead of name field like we do for the projects 'anatomical focus' facet because it is a multiple references field and not a singular
      // https://www.contentfulcommunity.com/t/searching-on-multiple-reference-fields/377
      'fields.anatomicalFocus.sys.id[in]': anatomicalStructuresEntryIds?.toString(),
    })
  } catch (e) {
    console.error(e)
    return {} as unknown as CommunitySpotlightItemsCollection
  }
}

export type AsyncData = Pick<Data, "upcomingEvents" | "pastEvents" | "news" | "page" | "stories">

export interface PageData {
  featuredEvent?: EventsEntry;
  page_title?: string;
  heroCopy?: string;
  heroImage?: Asset;
}

export type PageEntry = Entry<PageData>

export interface Event {
  endDate?: string;
  eventType?: string;
  image?: Asset;
  location?: string;
  startDate?: string;
  summary?: string;
  title?: string;
  url?: string;
}

export type EventsEntry = Entry<Event>
export type EventsCollection = EntryCollection<EventsEntry>

export interface News {
  publishedDate?: string;
  summary?: string;
  title?: string;
  url?: string
}

export type NewsEntry = Entry<News>
export type NewsCollection = EntryCollection<NewsEntry>

// CommunitySpotlightItem is a wrapper model in contentful that is used to combine success stories and fireside chats so that we can query off both content types simutaneously
export interface CommunitySpotlightItem {
  publishedDate?: string;
  title?: string;
}

export type CommunitySpotlightItemEntry = Entry<CommunitySpotlightItem>
export type CommunitySpotlightItemsCollection = EntryCollection<CommunitySpotlightItemEntry>

export interface Tab {
  label: string;
  type: string;
}

export interface Data {
  title: string;
  breadcrumb: Breadcrumb[];
  activeTab: string;
  eventsTabs: Tab[];
  upcomingEvents: EventsCollection;
  pastEvents: EventsCollection;
  news: NewsCollection;
  page: PageEntry;
  stories: CommunitySpotlightItemsCollection
}

export interface Computed {
  featuredEvent: EventsEntry,
}
export interface Methods {
  getAllNews: (this: NewsAndEventsComponent) => void;
  eventsTabChanged: (newTab: { id: string }) => void;
}
export interface NewsData {
  breadcrumb: Breadcrumb[]
}
export interface NewsComputed {
  curSearchPage: number
  publishedLessThanDate?: string
  publishedGreaterThanOrEqualToDate?: string
  sortOrder: string
}
export interface NewsMethods {
  onPaginationPageChange: (page: number) => void
  onPaginationLimitChange: (limit: string) => void
  onSortOptionChange: (option: Object) => void
}
export interface EventsData {
  breadcrumb: Breadcrumb[]
}
export interface EventsComputed {
  curSearchPage: number,
  startLessThanDate?: string 
  startGreaterThanOrEqualToDate?: string
  eventTypes?: Array<string>
  sortOrder: string
}
export interface EventsMethods {
  onPaginationPageChange: (page: number) => void
  onPaginationLimitChange: (limit: string) => void
  onSortOptionChange: (option: Object) => void
}

export interface CommunitySpotlightData {
  breadcrumb: Breadcrumb[]
}
export interface CommunitySpotlightComputed {
  curSearchPage: number
  sortOrder: string
  spotlightTypes?:  Array<string>
}
export interface CommunitySpotlightMethods {
  onPaginationPageChange: (page: number) => void
  onPaginationLimitChange: (limit: string) => void
  onSortOptionChange: (option: Object) => void
  getLinkedItem: (communitySpotlightItem: Object) => Object
}

export type NewsAndEventsComponent = Data & Computed & Methods & { $route: Route }
export type NewsPage = NewsData & NewsComputed & NewsMethods & { $route: Route }
export type EventsPage = EventsData & EventsComputed & EventsMethods & { $route: Route }
export type CommunitySpotlightPage = CommunitySpotlightData & CommunitySpotlightComputed & CommunitySpotlightMethods & { $route: Route }
