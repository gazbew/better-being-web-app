import 'dotenv/config';

const DATA_API_BASE = process.env.NEON_DATA_API_ENDPOINT || 'https://app-small-voice-41387981.dpl.myneon.app';

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const url = `${DATA_API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = json?.message || `Data API error ${res.status}`;
    throw new Error(message);
  }
  return json;
}

export const dataApi = {
  // Example: list rows from a table without RLS
  list: (table, params = {}) => request(`/rest/v1/${table}?${new URLSearchParams(params)}`),
  // Example: insert row
  insert: (table, row) => request(`/rest/v1/${table}`, { method: 'POST', body: row }),
  // Example: update row by filter (use eq params)
  update: (table, filter, row) => request(`/rest/v1/${table}?${new URLSearchParams(filter)}`, { method: 'PATCH', body: row }),
  // Example: delete by filter
  remove: (table, filter) => request(`/rest/v1/${table}?${new URLSearchParams(filter)}`, { method: 'DELETE' }),
};

export default dataApi;

