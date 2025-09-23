import { del, head, list, put } from '@vercel/blob';

const token = process.env.BLOB_READ_WRITE_TOKEN;

function options(contentType?: string) {
  const base: { access: 'public'; token?: string; contentType?: string } = {
    access: 'public'
  };
  if (token) base.token = token;
  if (contentType) base.contentType = contentType;
  return base;
}

export async function putJson(path: string, data: unknown) {
  const payload = JSON.stringify(data, null, 2);
  return put(path, payload, options('application/json'));
}

export async function getJson<T = unknown>(path: string): Promise<T | null> {
  try {
    const result = await head(path, token ? { token } : undefined);
    const response = await fetch(result.downloadUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch blob: ${response.statusText}`);
    }
    const text = await response.text();
    return JSON.parse(text) as T;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[blob] failed to read ${path}`, error);
    }
    return null;
  }
}

export async function appendProofFile(path: string, file: File) {
  return put(path, file, options());
}

export async function listByPrefix(prefix: string) {
  return list({ prefix, token });
}

export async function headBlob(path: string) {
  return head(path, token ? { token } : undefined);
}

export async function deleteBlob(path: string) {
  return del(path, token ? { token } : undefined);
}
