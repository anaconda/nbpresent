import {WebFont, _} from "nbpresent-deps";


export const SYMB = `h1 h2 h3 h4 h5 h6 h7
    ul ol li
    blockquote pre code
    strong em a i
    table thead tbody tfoot th td`
  .split(/\s+/);

// http://clagnut.com/blog/2380/#Perfect_pangrams_in_English_.2826_letters.29
export const PANGRAMS = [
  "A zenith of Xvurj’s cwm KL Gybdq",
  "Zombies play crwth, quj FDG xvnk",
  "Blowzy night-frumps vex’d Jack Q.",
  "Dwarf mobs quiz lynx.jpg, kvetch!",
  "Frowzy things plumb vex’d Jack Q.",
  "G.B. fjords vex quick waltz nymph.",
  "Glum Schwartzkopf vex’d by NJ IQ.",
  "Gym DJ Beck vows phiz tranq flux.",
  "Jerk gawps foxy Qum Blvd. chintz.",
  "JFK got my VHS, PC and XLR web quiz.",
  "Jocks find quartz glyph, vex BMW.",
  "J.Q. Vandz struck my big fox whelp.",
  "J.Q. Schwartz flung D.V. Pike my box.",
  "Jump dogs, why vex Fritz Blank QC?",
  "Mr. Jock, TV quiz PhD, bags few lynx.",
  "New job: fix Mr. Gluck’s hazy TV, PDQ!",
  "Quartz glyph job vex’d cwm finks.",
  "Quartz jock vends BMW glyph fix.",
  "The glib czar junks my VW Fox PDQ."
];

export const FONTS_MONO = [
  "Inconsolata",
  "Source Code Pro",
  "Roboto Mono",
  "Droid Sans Mono",
  "Ubuntu Mono",
  "VT323",
  "PT Mono",
  "Cousine",
  "Oxygen Mono",
  "Anonymous Pro",
  "Fira Mono",
  "Cutive Mono",
  "Nova Mono",
  "Share Tech Mono"
];

// http://fontpair.co
export const FONTS = [
  "ABeeZee",
  "Abel",
  "Abril Fatface",
  "Alegreya",
  "Alfa Slab One",
  "Alice",
  "Allerta",
  "Amaranth",
  "Amatic SC",
  "Andika",
  "Arimo",
  "Asap",
  "Average",
  "Bevan",
  "Bitter",
  "Bree Serif",
  "Cabin",
  "Cantata One",
  "Cardo",
  "Clicker Script",
  "Crete Round",
  "Crimson Text",
  "Dancing Script",
  "Didact Gothic",
  "Domine",
  "Dosis",
  "Droid Sans",
  "EB Garamond",
  "Exo",
  "Fanwood Text",
  "Fauna One",
  "Fjalla One",
  "Flamenco",
  "Francois One",
  "Gentium Book Basic",
  "Gudea",
  "Hind",
  "Imprima",
  "Istok Web",
  "Josefin Sans",
  "Josefin Slab",
  "Judson",
  "Kameron",
  "Kreon",
  "Lato",
  "Ledger",
  "Libre Baskerville",
  "Lobster",
  "Lora",
  "Lustria",
  "Medula One",
  "Merriweather",
  "Montserrat",
  "Muli",
  "Neuton",
  "Nixie One",
  "Noto Sans",
  "Nunito",
  "Old Standard TT",
  "Open Sans",
  "Oswald",
  "Ovo",
  "Oxygen",
  "PT Sans",
  "PT Serif",
  "Pacifico",
  "Patua One",
  "Philosopher",
  "Playfair Display",
  "Playfair Display SC",
  "Pontano Sans",
  "Quando",
  "Quattrocento",
  "Quattrocento Sans",
  "Questrial",
  "Quicksand",
  "Raleway",
  "Rancho",
  "Roboto",
  "Roboto Slab",
  "Rokkitt",
  "Rufina",
  "Sacramento",
  "Sansita One",
  "Shadows Into Light",
  "Signika",
  "Sintony",
  "Slabo 13px",
  "Source Sans Pro",
  "Squada One",
  "Stint Ultra Expanded",
  "Ubuntu",
  "Ultra",
  "Unica One",
  "Vollkorn",
  "Walter Turncoat",
  "Yeseva One"
].concat(FONTS_MONO);

let _fontLoaded = {
  Lato: 1,
  "google:Lato": 1
};

/* TODO: a generalized namespace thingy for fonts, a la JSON-LD:
   - google:Lato
   - nbp:Lato
*/
export function loadFonts(fonts){
  fonts = _.difference(fonts, _.keys(_fontLoaded));
  if(!fonts.length){ return []; }
  WebFont.load({google: {families: fonts }});
  _.extend(_fontLoaded, _.object(fonts, fonts));
  return fonts;
}

loadFonts(["Lato"]);
