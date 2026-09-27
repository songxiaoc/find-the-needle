import { NextResponse } from 'next/server';

import { countryLocaleSuggestion } from '@/config/locale/suggestion';

export function GET(request: Request) {
  return NextResponse.json(
    {
      suggestedLocale: countryLocaleSuggestion(
        request.headers.get('cf-ipcountry')
      ),
    },
    { headers: { 'Cache-Control': 'private, no-store' } }
  );
}
