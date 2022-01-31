import { createI18n } from "vue-i18n";
import en from "./en.json";
import ptbr from "./ptbr.json";

const i18n = createI18n({
  locale: "en",
  messages: {
    en,
    ptbr,
  },
});

export default i18n;
