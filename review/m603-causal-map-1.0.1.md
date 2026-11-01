# M6.03 Bewertungspräzisierung 1.0.1

01.11.2026, fachliche Eigenkontrolle während der ersten Implementierung,
**vor Umsetzung dieser Korrektur und vor dem ersten Prüferlauf**.
Ergänzt [1.0.0](m603-causal-map-1.0.0.md); vier Pflichtkanten und gemeinsame
D-Bedingung bleiben unverändert. Aktueller maschinenlesbarer Vertrag:
`contracts/m603-causal-map.json`, Rubrik `M6.03.C01-C04@causal-map-1.0.1`.

Die pauschale Aussage „falsche Typen auf Kernpaaren sind sicher falsch“ in 1.0.0
war zu weit: „hängt zusammen“ auf A/B behauptet z. B. keine falsche Biologie,
erklärt aber die geforderte Kausalrichtung nicht hinreichend. Solche schwachen
oder unpassenden Bedeutungen werden **clarify**, niemals allein deshalb rot.
Ebenso dürfen umgekehrte Assoziationen nicht als umgekehrte Kausalität gelten.

Rot bleibt auf konkret belegte Fehler begrenzt: exakte Umkehrung der vier
geforderten Kanten mit jeweiligem Kerntyp; Verhinderung auf einem Kernpaar;
unbedingte Verursachung von D; strikte Zeitfolge B/C; explizite falsche Claims.
Alle sonstigen bekannten, nicht ausdrücklich zugelassenen Kombinationen
bleiben clarify. Richtige zusätzliche B/C-Kopplung und konditionale A/D-
Zusammenfassung bleiben anerkannt. Es wird keine reale Druck-Volumen-
Unabhängigkeit behauptet. Das verhindert unbegründetes Rot bei wahren, aber
für den Aufgabenvertrag unzureichenden Beziehungen. Neue Vorabfälle sichern
genau diese Grenze; keine bestehenden Sollfälle wurden geändert.
