const dummyUsernames = [
  "smith",
  "alex",
  "rafendrimr",
  "razzrbleet",
  "skald",
  "pgurdy",
  "fehu",
  "boot",
  "uttern",
  "otterrun",
  "fantafanatic",
];
const dummyUsernameSuffix = [
  69,
  420,
  new Date().getFullYear(),
  "backup",
  "alt",
  42,
  60,
  53,
  666,
  777,
  2525,
  "11i11",
  "l",
  "I",
];

const dummyPasswords = [
  "pen3s!",
  "blubberjaar!23",
  "norojaar!24",
  "stof!26",
  "stof!22",
  "zwembad!18",
  "geenzwembad!19",
  "somerfolk!",
  "zomervolk!",
  "zomervolkkk",
  "penis.logistiek",
  "magic!",
  "friend",
  "mélòn!",
];

export function dummyUsername(): string {
  return `${randomFrom(dummyUsernames)}.${randomFrom(dummyUsernameSuffix)}`;
}

export function dummyPassword(): string {
  return randomFrom(dummyPasswords);
}
