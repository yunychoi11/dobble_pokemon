const SYMBOLS = [
    {
        id: 0,
        name: "꼬부기",
        englishName: "squirtle",
        pokeApiId: 7,
        type: "water",
        color: "#6890f0",
        svg: null
    },
    {
        id: 1,
        name: "포니타 (가라르의 모습)",
        englishName: "ponyta-galar",
        pokeApiId: 10162,
        type: "psychic",
        color: "#f383e8",
        svg: null
    },
    {
        id: 2,
        name: "이브이",
        englishName: "eevee",
        pokeApiId: 133,
        type: "normal",
        color: "#c6a66a",
        svg: null
    },
    {
        id: 3,
        name: "블래키",
        englishName: "umbreon",
        pokeApiId: 197,
        type: "dark",
        color: "#705848",
        svg: null
    },
    {
        id: 4,
        name: "렌트라",
        englishName: "luxray",
        pokeApiId: 405,
        type: "electric",
        color: "#f8d030",
        svg: null
    },
    {
        id: 5,
        name: "님피아",
        englishName: "sylveon",
        pokeApiId: 700,
        type: "fairy",
        color: "#ee99ac",
        svg: null
    },
    {
        id: 6,
        name: "염버니",
        englishName: "scorbunny",
        pokeApiId: 813,
        type: "fire",
        color: "#f08030",
        svg: null
    },
    {
        id: 7,
        name: "지우",
        englishName: "ash",
        pokeApiId: null,
        type: "character",
        color: "#ff3b30",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M10 50 C10 25, 90 25, 90 50 C90 55, 10 55, 10 50 Z" fill="#e60012" stroke="#333" stroke-width="3"/><path d="M25 50 C25 32, 75 32, 75 50 Z" fill="#fff"/><path d="M5 50 C5 52, 95 52, 95 50 C95 58, 80 65, 50 65 C20 65, 5 58, 5 50 Z" fill="#fff" stroke="#333" stroke-width="2"/><path d="M50 36 C46 36, 43 40, 43 44 C43 48, 50 50, 50 50 C50 50, 57 48, 57 44 C57 40, 54 36, 50 36 Z" fill="none" stroke="#009944" stroke-width="4"/><path d="M20 50 L80 50" stroke="#e60012" stroke-width="3"/></svg>`
    },
    {
        id: 8,
        name: "자뭉열매",
        englishName: "sitrus-berry",
        pokeApiId: null,
        type: "item",
        color: "#ffd13b",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M50 15 C35 15, 20 25, 20 45 C20 70, 35 90, 50 90 C65 90, 80 70, 80 45 C80 25, 65 15, 50 15 Z" fill="#ffd13b" stroke="#aa8800" stroke-width="3"/><path d="M50 15 C42 15, 30 22, 30 45 C30 65, 42 75, 50 75 C58 75, 70 65, 70 45 C70 22, 58 15, 50 15 Z" fill="#4ea5ff" opacity="0.8"/><path d="M45 5 L50 18 L55 5 Z" fill="#4d8c2b"/></svg>`
    },
    {
        id: 9,
        name: "버터플",
        englishName: "butterfree",
        pokeApiId: 12,
        type: "bug",
        color: "#a8b820",
        svg: null
    },
    {
        id: 10,
        name: "야돈",
        englishName: "slowpoke",
        pokeApiId: 79,
        type: "water",
        color: "#f08030",
        svg: null
    },
    {
        id: 11,
        name: "잠만보",
        englishName: "snorlax",
        pokeApiId: 143,
        type: "normal",
        color: "#a8a878",
        svg: null
    },
    {
        id: 12,
        name: "마자용",
        englishName: "wobbuffet",
        pokeApiId: 202,
        type: "psychic",
        color: "#f383e8",
        svg: null
    },
    {
        id: 13,
        name: "한카리아스",
        englishName: "garchomp",
        pokeApiId: 445,
        type: "dragon",
        color: "#7038f8",
        svg: null
    },
    {
        id: 14,
        name: "나몰빼미",
        englishName: "rowlet",
        pokeApiId: 722,
        type: "grass",
        color: "#78c850",
        svg: null
    },
    {
        id: 15,
        name: "에이스번",
        englishName: "cinderace",
        pokeApiId: 815,
        type: "fire",
        color: "#f08030",
        svg: null
    },
    {
        id: 16,
        name: "오박사",
        englishName: "prof-oak",
        pokeApiId: null,
        type: "character",
        color: "#a0a0a0",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="40" r="22" fill="#ffe0bd" stroke="#555" stroke-width="2"/><path d="M28 40 Q25 22 50 20 Q75 22 72 40 Q80 32 80 25 Q70 12 50 12 Q30 12 20 25 Q20 32 28 40 Z" fill="#a0a0a0" stroke="#555" stroke-width="2"/><circle cx="42" cy="38" r="4" fill="none" stroke="#333" stroke-width="2"/><circle cx="58" cy="38" r="4" fill="none" stroke="#333" stroke-width="2"/><line x1="46" y1="38" x2="54" y2="38" stroke="#333" stroke-width="2"/><path d="M45 48 Q50 53 55 48" fill="none" stroke="#e06060" stroke-width="2"/><path d="M25 80 L35 62 L65 62 L75 80 Z" fill="#fff" stroke="#555" stroke-width="2"/><path d="M38 62 L50 78 L62 62 Z" fill="#e03030"/><line x1="50" y1="62" x2="50" y2="90" stroke="#555" stroke-width="2"/><rect x="63" y="66" width="6" height="10" rx="1" fill="#000"/></svg>`
    },
    {
        id: 17,
        name: "오랭열매",
        englishName: "oran-berry",
        pokeApiId: null,
        type: "item",
        color: "#306fff",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M50 12 C35 12, 18 25, 18 50 C18 75, 35 92, 50 92 C65 92, 82 75, 82 50 C82 25, 65 12, 50 12 Z" fill="#306fff" stroke="#1030aa" stroke-width="3"/><path d="M30 35 C25 45, 25 55, 30 65 M70 35 C75 45, 75 55, 70 65" stroke="#1030aa" stroke-width="3" fill="none"/><circle cx="50" cy="30" r="14" fill="#004be8"/><circle cx="34" cy="52" r="12" fill="#004be8"/><circle cx="66" cy="52" r="12" fill="#004be8"/><circle cx="50" cy="72" r="14" fill="#004be8"/><path d="M47 5 L50 15 L53 5 Z" fill="#4d8c2b"/></svg>`
    },
    {
        id: 18,
        name: "피카츄",
        englishName: "pikachu",
        pokeApiId: 25,
        type: "electric",
        color: "#f8d030",
        svg: null
    },
    {
        id: 19,
        name: "코일",
        englishName: "magnemite",
        pokeApiId: 81,
        type: "electric",
        color: "#b8b8d0",
        svg: null
    },
    {
        id: 20,
        name: "망나뇽",
        englishName: "dragonite",
        pokeApiId: 149,
        type: "dragon",
        color: "#e0a860",
        svg: null
    },
    {
        id: 21,
        name: "핫삼",
        englishName: "scizor",
        pokeApiId: 212,
        type: "bug",
        color: "#e03030",
        svg: null
    },
    {
        id: 22,
        name: "루카리오",
        englishName: "lucario",
        pokeApiId: 448,
        type: "fighting",
        color: "#c03028",
        svg: null
    },
    {
        id: 23,
        name: "이븐곰",
        englishName: "bewear",
        pokeApiId: 759,
        type: "normal",
        color: "#e06090",
        svg: null
    },
    {
        id: 24,
        name: "울머기",
        englishName: "sobble",
        pokeApiId: 816,
        type: "water",
        color: "#6890f0",
        svg: null
    },
    {
        id: 25,
        name: "불꽃타입",
        englishName: "fire-type",
        pokeApiId: null,
        type: "symbol",
        color: "#ff4d00",
        svg: `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 2C12 2 17 6.5 17 11.5C17 14.5 14.8 17 12 17C9.2 17 7 14.5 7 11.5C7 8 10 4.5 10 4.5C10 4.5 9 6.5 9 8.5C9 10.5 10 11.5 11 11.5C12 11.5 12 2 12 2Z" fill="#ff4d00"/><path d="M12 7C12 7 14.5 10 14.5 13C14.5 14.7 13.4 16 12 16C10.6 16 9.5 14.7 9.5 13C9.5 11.5 11 9.5 11 9.5C11 9.5 10.5 10.5 10.5 11.5C10.5 12.5 11 13 11.5 13C12 13 12 7 12 7Z" fill="#ff9900"/></svg>`
    },
    {
        id: 26,
        name: "포핀",
        englishName: "poffin",
        pokeApiId: null,
        type: "item",
        color: "#e6a15c",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M20 55 C20 35, 80 35, 80 55 C80 75, 20 75, 20 55 Z" fill="#e6a15c" stroke="#8a4f1a" stroke-width="3"/><path d="M25 50 Q50 40 75 50 Q60 62 25 50 Z" fill="#ff7da2" opacity="0.9"/><circle cx="35" cy="48" r="3" fill="#ff4d00"/><circle cx="45" cy="45" r="3" fill="#0099ff"/><circle cx="55" cy="46" r="3" fill="#ffcc00"/><circle cx="65" cy="49" r="3" fill="#00cc44"/></svg>`
    },
    {
        id: 27,
        name: "이상해씨",
        englishName: "bulbasaur",
        pokeApiId: 1,
        type: "grass",
        color: "#78c850",
        svg: null
    },
    {
        id: 28,
        name: "푸린",
        englishName: "jigglypuff",
        pokeApiId: 39,
        type: "fairy",
        color: "#ee99ac",
        svg: null
    },
    {
        id: 29,
        name: "팬텀",
        englishName: "gengar",
        pokeApiId: 94,
        type: "ghost",
        color: "#705898",
        svg: null
    },
    {
        id: 30,
        name: "뮤츠",
        englishName: "mewtwo",
        pokeApiId: 150,
        type: "psychic",
        color: "#f85888",
        svg: null
    },
    {
        id: 31,
        name: "마기라스",
        englishName: "tyranitar",
        pokeApiId: 248,
        type: "rock",
        color: "#b8a038",
        svg: null
    },
    {
        id: 32,
        name: "글레이시아",
        englishName: "glaceon",
        pokeApiId: 471,
        type: "ice",
        color: "#98d8d8",
        svg: null
    },
    {
        id: 33,
        name: "토게데마루",
        englishName: "togedemaru",
        pokeApiId: 777,
        type: "electric",
        color: "#f8d030",
        svg: null
    },
    {
        id: 34,
        name: "우르",
        englishName: "wooloo",
        pokeApiId: 831,
        type: "normal",
        color: "#a8a878",
        svg: null
    },
    {
        id: 35,
        name: "풀타입",
        englishName: "grass-type",
        pokeApiId: null,
        type: "symbol",
        color: "#00cc44",
        svg: `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M17 3H14C9 3 5 7 5 12C5 17 9 19 12 19H13C18 19 19 14 19 9V5C19 3.9 18.1 3 17 3ZM12 17C10.3 17 7.5 15.5 7.1 12C8 10 10 8 13 8C14.7 8 16 9.3 16 11C16 12.7 14.7 14 13 14C12 14 11 13 11 12C11 11.4 11.4 11 12 11C12.6 11 13 11.4 13 12C13 12.6 13.4 13 14 13C14.6 13 15 12.6 15 12C15 10.9 14.1 10 13 10C10.8 10 9 12 8.5 13.5C8.8 15 10.5 16 12 16C13.7 16 16.2 14.5 17 12.2C16.8 14.5 14.8 17 12 17Z" fill="#00cc44"/></svg>`
    },
    {
        id: 36,
        name: "몬스터볼",
        englishName: "pokeball",
        pokeApiId: null,
        type: "item",
        color: "#ff1f44",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="50" r="48" fill="#fff" stroke="#333" stroke-width="4"/><path d="M4 50 A 46 46 0 0 1 96 50 Z" fill="#ff1f44" stroke="#333" stroke-width="4"/><line x1="2" y1="50" x2="98" y2="50" stroke="#333" stroke-width="6"/><circle cx="50" cy="50" r="16" fill="#fff" stroke="#333" stroke-width="6"/><circle cx="50" cy="50" r="8" fill="#fff" stroke="#ddd" stroke-width="2"/></svg>`
    },
    {
        id: 37,
        name: "파이리",
        englishName: "charmander",
        pokeApiId: 4,
        type: "fire",
        color: "#f08030",
        svg: null
    },
    {
        id: 38,
        name: "나옹",
        englishName: "meowth",
        pokeApiId: 52,
        type: "normal",
        color: "#a8a878",
        svg: null
    },
    {
        id: 39,
        name: "갸라도스",
        englishName: "gyarados",
        pokeApiId: 130,
        type: "water",
        color: "#6890f0",
        svg: null
    },
    {
        id: 40,
        name: "뮤",
        englishName: "mew",
        pokeApiId: 151,
        type: "psychic",
        color: "#f85888",
        svg: null
    },
    {
        id: 41,
        name: "세레비",
        englishName: "celebi",
        pokeApiId: 251,
        type: "grass",
        color: "#78c850",
        svg: null
    },
    {
        id: 42,
        name: "기라티나 (오리진폼)",
        englishName: "giratina-origin",
        pokeApiId: 10007,
        type: "ghost",
        color: "#705898",
        svg: null
    },
    {
        id: 43,
        name: "따라큐",
        englishName: "mimikyu",
        pokeApiId: 778,
        type: "ghost",
        color: "#705898",
        svg: null
    },
    {
        id: 44,
        name: "멍파치",
        englishName: "yamper",
        pokeApiId: 835,
        type: "electric",
        color: "#f8d030",
        svg: null
    },
    {
        id: 45,
        name: "전기타입",
        englishName: "electric-type",
        pokeApiId: null,
        type: "symbol",
        color: "#ffcc00",
        svg: `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M11.5 2H5L3 13H9L7 22L19 10H13.5L15 2H11.5Z" fill="#ffcc00" stroke="#cc9900" stroke-width="1"/></svg>`
    },
    {
        id: 46,
        name: "마스터볼",
        englishName: "masterball",
        pokeApiId: null,
        type: "item",
        color: "#a040a0",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="50" r="48" fill="#fff" stroke="#333" stroke-width="4"/><path d="M4 50 A 46 46 0 0 1 96 50 Z" fill="#a040a0" stroke="#333" stroke-width="4"/><path d="M15 35 A 8 8 0 1 1 31 35 A 8 8 0 1 1 15 35 Z" fill="#ff3366"/><path d="M69 35 A 8 8 0 1 1 85 35 A 8 8 0 1 1 69 35 Z" fill="#ff3366"/><line x1="2" y1="50" x2="98" y2="50" stroke="#333" stroke-width="6"/><circle cx="50" cy="50" r="16" fill="#fff" stroke="#333" stroke-width="6"/><circle cx="50" cy="50" r="8" fill="#fff" stroke="#ddd" stroke-width="2"/><text x="50" y="32" font-family="'Impact', Arial" font-size="20" font-weight="bold" fill="#fff" text-anchor="middle">M</text></svg>`
    },
    {
        id: 47,
        name: "리자몽",
        englishName: "charizard",
        pokeApiId: 6,
        type: "fire",
        color: "#f08030",
        svg: null
    },
    {
        id: 48,
        name: "고라파덕",
        englishName: "psyduck",
        pokeApiId: 54,
        type: "water",
        color: "#fad02c",
        svg: null
    },
    {
        id: 49,
        name: "메타몽",
        englishName: "ditto",
        pokeApiId: 132,
        type: "normal",
        color: "#a890f0",
        svg: null
    },
    {
        id: 50,
        name: "토게피",
        englishName: "togepi",
        pokeApiId: 175,
        type: "fairy",
        color: "#f85888",
        svg: null
    },
    {
        id: 51,
        name: "팽도리",
        englishName: "piplup",
        pokeApiId: 393,
        type: "water",
        color: "#6890f0",
        svg: null
    },
    {
        id: 52,
        name: "아르세우스",
        englishName: "arceus",
        pokeApiId: 493,
        type: "normal",
        color: "#f8f8f8",
        svg: null
    },
    {
        id: 53,
        name: "흥나숭",
        englishName: "grookey",
        pokeApiId: 810,
        type: "grass",
        color: "#78c850",
        svg: null
    },
    {
        id: 54,
        name: "모르페코",
        englishName: "morpeko",
        pokeApiId: 877,
        type: "electric",
        color: "#f8d030",
        svg: null
    },
    {
        id: 55,
        name: "물타입",
        englishName: "water-type",
        pokeApiId: null,
        type: "symbol",
        color: "#0099ff",
        svg: `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 2.5C12 2.5 6 9.5 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9.5 12 2.5 12 2.5ZM12 18C10.3 18 9 16.7 9 15C9 13.5 10.5 11.5 12 9C13.5 11.5 15 13.5 15 15C15 16.7 13.7 18 12 18Z" fill="#0099ff"/></svg>`
    },
    {
        id: 56,
        name: "스마트로토무",
        englishName: "rotom-phone",
        pokeApiId: null,
        type: "item",
        color: "#ff3b30",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="30" y="20" width="40" height="60" rx="6" fill="#ff3b30" stroke="#333" stroke-width="3"/><rect x="35" y="28" width="30" height="40" rx="2" fill="#e1f5fe"/><path d="M20 35 Q10 25 15 15 Q25 10 32 23 Z M80 35 Q90 25 85 15 Q75 10 68 23 Z" fill="#ff3b30" stroke="#333" stroke-width="2"/><path d="M50 12 L50 20 M50 80 Q50 92 62 92" stroke="#ff3b30" stroke-width="4" stroke-linecap="round" fill="none"/><circle cx="50" cy="48" r="8" fill="#ffeb3b" stroke="#333" stroke-width="2"/><circle cx="48" cy="46" r="2" fill="#000"/><circle cx="52" cy="46" r="2" fill="#000"/></svg>`
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SYMBOLS;
}
