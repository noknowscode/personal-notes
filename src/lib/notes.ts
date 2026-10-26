import { getCollection } from 'astro:content';
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const home = `${base}/`;
export const noteUrl = (id: string) => `${base}/notes/${id}/`;
export const getNotes = async () => (await getCollection('notes', ({data}) => !data.draft)).sort((a,b) => a.data.order - b.data.order);
