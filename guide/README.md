# Japonsko 2026 – sprievodca

Aktuálna stránka: https://japonsko-2026-one.vercel.app

Pôvodný repozitár obsahoval iba staršiu stránku `japan.html`. Aktuálny Vercel deployment bol nahraný ako hotový build bez Git prepojenia. Tento priečinok zachováva jeho aplikáciu a verejné súbory z deploymentu `dpl_DMpzeAaXfxGkU1bL76d9714qYedh` (15. 10. 2026). Pôvodné komponentové zdroje nie sú k dispozícii.

Texty miest sa upravujú v `content/places.json`, itinerár v `content/itinerary.json`. Súbory `content/places-*.json` môžu prepísať vybrané miesta. Zachovaj identifikátory a štruktúru dát.

Build bez externých závislostí:

```sh
node guide/scripts/build.mjs
```

Výsledok je v `.vercel/output`. Build nahradí vložené dáta, zmení hash JS súboru a aktualizuje offline cache. Vzhľad a funkcie aplikácie pochádzajú zo zachovaného buildu.

Pred nasadením over prepojenie na Vercel projekt `japonsko-2026`, tím `teapot-agencys-projects`. Nasadenie cez CLI používa `vercel deploy --prebuilt --prod`. GitHub zatiaľ automaticky nenasadzuje.

Google Maps používa verejný browser key. Pri builde ho poskytni cez `GOOGLE_MAPS_BROWSER_KEY` alebo ignorovaný súbor `.vercel/maps-browser-key.txt`. Kľúč sa do GitHubu neukladá; v nasadenej stránke ho prehliadač potrebuje. Súkromný potvrdzovací odkaz Booking bol nahradený odkazom na správu rezervácií.
