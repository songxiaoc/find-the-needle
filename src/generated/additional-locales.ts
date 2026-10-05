import zhDiscovery from './locale-packs/zh/discovery.json';
import zhEntity from './locale-packs/zh/entity.json';
import zhFactory from './locale-packs/zh/factory.json';
import zhHome from './locale-packs/zh/home.json';
import zhReference from './locale-packs/zh/reference.json';
import jaDiscovery from './locale-packs/ja/discovery.json';
import jaEntity from './locale-packs/ja/entity.json';
import jaFactory from './locale-packs/ja/factory.json';
import jaHome from './locale-packs/ja/home.json';
import jaReference from './locale-packs/ja/reference.json';
import koDiscovery from './locale-packs/ko/discovery.json';
import koEntity from './locale-packs/ko/entity.json';
import koFactory from './locale-packs/ko/factory.json';
import koHome from './locale-packs/ko/home.json';
import koReference from './locale-packs/ko/reference.json';
import plDiscovery from './locale-packs/pl/discovery.json';
import plEntity from './locale-packs/pl/entity.json';
import plFactory from './locale-packs/pl/factory.json';
import plHome from './locale-packs/pl/home.json';
import plReference from './locale-packs/pl/reference.json';
import csDiscovery from './locale-packs/cs/discovery.json';
import csEntity from './locale-packs/cs/entity.json';
import csFactory from './locale-packs/cs/factory.json';
import csHome from './locale-packs/cs/home.json';
import csReference from './locale-packs/cs/reference.json';
import trDiscovery from './locale-packs/tr/discovery.json';
import trEntity from './locale-packs/tr/entity.json';
import trFactory from './locale-packs/tr/factory.json';
import trHome from './locale-packs/tr/home.json';
import trReference from './locale-packs/tr/reference.json';
import ptDiscovery from './locale-packs/pt/discovery.json';
import ptEntity from './locale-packs/pt/entity.json';
import ptFactory from './locale-packs/pt/factory.json';
import ptHome from './locale-packs/pt/home.json';
import ptReference from './locale-packs/pt/reference.json';

function discoveryCopy<T extends { toolCards: string[][] }>(copy: T) {
  return {
    ...copy,
    toolCards: copy.toolCards.map((card) => {
      if (card.length !== 3) throw new Error('A tool card requires title, description and tag');
      return [card[0], card[1], card[2]] as const;
    }),
  };
}

export const additionalDiscoveryCopy = { zh: discoveryCopy(zhDiscovery), ja: discoveryCopy(jaDiscovery), ko: discoveryCopy(koDiscovery), pl: discoveryCopy(plDiscovery), cs: discoveryCopy(csDiscovery), tr: discoveryCopy(trDiscovery), pt: discoveryCopy(ptDiscovery) };
export const additionalEntityCopy = { zh: zhEntity, ja: jaEntity, ko: koEntity, pl: plEntity, cs: csEntity, tr: trEntity, pt: ptEntity };
export const additionalFactoryCopy = { zh: zhFactory, ja: jaFactory, ko: koFactory, pl: plFactory, cs: csFactory, tr: trFactory, pt: ptFactory };
export const additionalHomeCopy = { zh: zhHome, ja: jaHome, ko: koHome, pl: plHome, cs: csHome, tr: trHome, pt: ptHome };
export const additionalReferenceCopy = { zh: zhReference, ja: jaReference, ko: koReference, pl: plReference, cs: csReference, tr: trReference, pt: ptReference };
