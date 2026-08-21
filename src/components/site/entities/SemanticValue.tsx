import { getSemanticTone, type SemanticDomain } from '@/config/game-semantics';

const DOMAIN_MARKERS: Record<SemanticDomain, string> = {
  rarity: '◆',
  difficulty: '▲',
  roles: '■',
};

export function SemanticValue({
  domain,
  value,
}: {
  domain: SemanticDomain;
  value: string;
}) {
  const tone = getSemanticTone(domain, value);

  return (
    <span
      className="semantic-value"
      data-semantic-domain={domain}
      data-semantic-tone={tone}
    >
      <span className="semantic-value__marker" aria-hidden="true">
        {DOMAIN_MARKERS[domain]}
      </span>
      <span>{value}</span>
    </span>
  );
}
