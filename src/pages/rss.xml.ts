import type { APIRoute } from 'astro';
import { getNotes, noteUrl, home } from '../lib/notes';
const escape=(value:string)=>value.replace(/[<>&"']/g,char=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[char]!));
export const GET: APIRoute = async ({site}) => new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Notes</title><description>Matt’s personal notepad</description><link>${new URL(home,site)}</link>${(await getNotes()).map(note=>`<item><title>${escape(note.data.title)}</title><description>${escape(note.data.description)}</description><link>${new URL(noteUrl(note.id),site)}</link><guid>${new URL(noteUrl(note.id),site)}</guid></item>`).join('')}</channel></rss>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
