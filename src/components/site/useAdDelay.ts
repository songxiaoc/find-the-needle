'use client';

import { useEffect, useState } from 'react';

import { afterDocumentAdDelay } from '@/shared/lib/ad-delay';

export function useAdDelay() {
  const [ready, setReady] = useState(false);

  useEffect(() => afterDocumentAdDelay(() => setReady(true)), []);

  return ready;
}
