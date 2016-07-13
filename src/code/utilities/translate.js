import translations from './lang';

const defaultLang = "en_us";

export default function translate(key, vars={}, lang=defaultLang) {
  let translation = translations[lang][key];
  if (!translation) {
    return key;
  }

  return translation;
}
