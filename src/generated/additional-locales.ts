import jaDiscovery from './locale-packs/ja/discovery.json';
import jaEntity from './locale-packs/ja/entity.json';
import jaFactory from './locale-packs/ja/factory.json';
import jaHome from './locale-packs/ja/home.json';
import jaReference from './locale-packs/ja/reference.json';
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

export const additionalDiscoveryCopy = { ja: discoveryCopy(jaDiscovery), zh: discoveryCopy(zhDiscovery) };
export const additionalEntityCopy = { ja: jaEntity, zh: zhEntity };
export const additionalFactoryCopy = { ja: jaFactory, zh: zhFactory };
export const additionalHomeCopy = { ja: jaHome, zh: zhHome };
export const additionalReferenceCopy = { ja: jaReference, zh: zhReference };
