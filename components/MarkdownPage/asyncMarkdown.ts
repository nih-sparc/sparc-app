import createClient from "~/plugins/contentful";

const client = createClient()

/**
 * helper to drop into the asyncData method of respective pages
 */
export const asyncMarkdown = async (entryId: string, fieldName: string): Promise<{ copy: string }> => {
  try {
    const { fields } = await client.getEntry(entryId)
    return { copy: fields[fieldName] ?? '' }
  } catch (e) {
    console.error(e)
    return { copy: '' }
  }
}