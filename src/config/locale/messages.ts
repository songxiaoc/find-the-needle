import cs from './messages/cs/common.json';
import de from './messages/de/common.json';
import en from './messages/en/common.json';
import es from './messages/es/common.json';
import fr from './messages/fr/common.json';
import ja from './messages/ja/common.json';
import ko from './messages/ko/common.json';
import pl from './messages/pl/common.json';
import pt from './messages/pt/common.json';
import ru from './messages/ru/common.json';
import tr from './messages/tr/common.json';
import zh from './messages/zh/common.json';

export const commonMessages = {
  en,
  fr,
  de,
  es,
  ru,
  zh,
  ja,
  ko,
  pl,
  cs,
  tr,
  pt,
};
export type CommonCopy = typeof en;

export function getCommonMessages(locale: string): CommonCopy {
  return commonMessages[locale as keyof typeof commonMessages] ?? en;
}
