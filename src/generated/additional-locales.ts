import zhDiscovery from './locale-packs/zh/discovery.json';
import zhEntity from './locale-packs/zh/entity.json';
import zhFactory from './locale-packs/zh/factory.json';
import zhHome from './locale-packs/zh/home.json';
import zhReference from './locale-packs/zh/reference.json';

function discoveryCopy<T extends { toolCards: string[][] }>(copy: T) {
  return {
    ...copy,
    toolCards: copy.toolCards.map((card) => {
      if (card.length !== 3) throw new Error('A tool card requires title, description and tag');
      return [card[0], card[1], card[2]] as const;
    }),
  };
}

export const additionalDiscoveryCopy = { zh: discoveryCopy(zhDiscovery) };
export const additionalEntityCopy = { zh: zhEntity };
export const additionalFactoryCopy = { zh: zhFactory };
export const additionalHomeCopy = { zh: zhHome };
export const additionalReferenceCopy = { zh: zhReference };
