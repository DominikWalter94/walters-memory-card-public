# Walter's Memory Card — veřejný export

Veřejný JSON: https://raw.githubusercontent.com/DominikWalter94/walters-memory-card-public/main/collection.json

## Jediný zdroj dat
Sbírka se upravuje výhradně v původní aplikaci. Tento repozitář je automaticky generovaná kopie jejího veřejného databázového exportu:
https://retro-sbirka-dominik.pracovn-pros-2583.chatgpt.site/collection.json
Soubor collection.json neupravujte ručně. Zdrojová aplikace a databáze nebyly změněny.

## Synchronizace
GitHub Actions načítá zdroj bez cookies či autorizace v minutách 17 a 47 každé hodiny UTC, při změně synchronizačního kódu a na ruční vyžádání. Funguje bez otevřeného prohlížeče, ChatGPT nebo zapnutého počítače.
Před zveřejněním ověří HTTP 200, JSON, schéma a typy hodnot. Povolená pole: title, platform, status, edition, manual, condition, estimatedValue, completeness. Další pole zahodí; neznámé hodnoty zůstávají null.
Při chybě provede až tři pokusy a ponechá poslední platnou kopii. Chybný běh je vidět v Actions. Prázdná sbírka je platná, pokud ji zdroj skutečně vrátí v platném schématu.
sync-status.json zaznamenává datum posledního úspěšného ověření v UTC a počet her. Datum je aktualizováno denně i bez změny her. Nejde o přesný čas posledního půlhodinového běhu; ten je v Actions.
Zápis používá krátkodobý GITHUB_TOKEN běhu, žádný osobní token ani heslo není uložen v repozitáři.

## Dostupnost a cena
Standardní GitHub-hosted runner ve veřejném repozitáři je zdarma:
https://docs.github.com/en/actions/concepts/billing-and-usage
Plánované běhy mohou být opožděny; nejde o okamžitou synchronizaci ani SLA.
GitHub může vypnout plánované workflow po 60 dnech neaktivity repozitáře. Zde běžně vzniká denní auditní commit; při dlouhodobém výpadku zdroje však nové commity nevznikají a může být nutné workflow znovu zapnout:
https://docs.github.com/en/actions/how-tos/manage-workflow-runs/disable-and-enable-workflows
Raw GitHub vrací text/plain; tělo je validní JSON. Klient má parsovat JSON z těla odpovědi.

## Ověření při nasazení
2026-11-09: první běh Actions úspěšně načetl a publikoval 48 her. Veřejná raw URL ověřena samostatným HTTP požadavkem bez cookies a přihlášení: HTTP 200, validní JSON, owned i wanted, všechna požadovaná pole a shoda s aktuálním zdrojem. Ověřeno odstranění nepovoleného pole a odmítnutí neplatného statusu.
