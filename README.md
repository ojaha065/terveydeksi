# Terveydeksi! - Ammattilaiset lähelläsi
**Mobiilisovellus Androidille**

## Kehitysympäristön versiotiedot
Kannattaa käyttää samoja tai uudempia versioita, niin välttyy monilta ongelmilta.

* Angular-cli 7.3.6
* Ionic-cli 4.12.0
* NodeJS 10.15.3
* npm 6.9.0

## Janin pikaopas GIT:in käyttämiseen
* Kloonaa repo omalle koneelle komennolla `git clone`
* Aina ennen muutosten tekemistä **lataa uusimmat muutokset** komennolla `git pull github master`
* Kun olet tehnyt muutoksia, committaa ne paikallisesti komennoilla `git add .` ja `git commit -am "viesti"`
  * Commit-viestiksi on hyvä kirjoittaa mitä muutoksia on tehnyt.
* Työnnä muutokset GitHubiin komennolla `git push github master`

Pääsääntöisesti on hyvä tehdä mahdollisimman pieni muutos kerrallaan ja committaa ja pushata välissä. Hyvä sääntö on myös se, että
**vain toimivaa koodia pushataan**. Eli GitHubista voi aina ladata toimivan version. (Toimiva tarkoittaa tässä yhteydessä, että
`npm start` onnistuu ja sovelluksen etusivu avautuu.)

## Kehitysympäristön käynnistys
`npm start` tai `ionic serve --devapp`

## Muutama lisähuomio
* Käytetään GitHubin issueita hyväksi. Issuen voi _assign_ tietylle henkilölle, jolloin pysytään kartalla, että kenen vastuulla on
mitäkin.
* Koodiin niin paljon kommentteja kuin jaksaa kirjoittaa.
* Tämä repo on tarkoitus muuttaa julkiseksi kurssin jälkeen, joten se kannattaa ottaa huomioon.
* 🐺 Awoo!

Tämä tiedosto päivitetty viimeksi 24.3.2019
