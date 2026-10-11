import { useEffect, useState } from 'react';

// Checks (with a HEAD request, so nothing is downloaded) that a model file exists.
// Dev and SPA hosts answer missing files with index.html, so an HTML response also
// counts as missing. Returns true | false, or null while checking.
export default function useModelAvailable(url) {
  const [state, setState] = useState({ url: null, ok: null });

  useEffect(() => {
    if (!url) return undefined;
    const ctrl = new AbortController();
    fetch(url, { method: 'HEAD', signal: ctrl.signal })
      .then((r) => setState({ url, ok: r.ok && !(r.headers.get('content-type') ?? '').includes('text/html') }))
      .catch((e) => e.name !== 'AbortError' && setState({ url, ok: false }));
    return () => ctrl.abort();
  }, [url]);

  if (!url) return false;
  return state.url === url ? state.ok : null;
}
