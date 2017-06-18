// http://ilmatieteenlaitos.fi/avoin-data-saahavainnot
export default {
    // Vallitsevan sää koodiluvut:
    0: 'Ei merkittäviä sääilmiöitä',
    4: 'Auerta, savua tai ilmassa leijuvaa pölyä ja näkyvyys vähintään 1 km',
    5: 'Auerta, savua tai ilmassa leijuvaa pölyä ja näkyvyys alle 1 km',
    10: 'utua',
    // Koodeja 20-25 käytetään, kun on ollut sadetta
    // tai sumua edellisen tunnin aikana mutta ei enää havaintohetkellä.
    20: 'sumua',
    21: 'sadetta',
    22: 'tihkusadetta',
    23: 'vesisadetta',
    24: 'lumisadetta',
    25: 'jäätävää tihkua',

    // Seuraavia koodeja käytetään, kun sadetta tai sumua on havaittu havaintohetkellä.
    30: 'sumua',
    31: 'sumua',
    32: 'sumua',
    33: 'sumua',
    34: 'sumua',

    40: 'sadetta',
    41: 'heikkoa tai kohtalaista sadetta',
    42: 'kovaa sadetta',

    50: 'tihkusadetta',
    51: 'heikkoa tihkusadetta',
    52: 'kohtalaista tihkusadetta',
    53: 'kovaa tihkusadetta',
    54: 'jäätävää heikkoa tihkusadetta',
    55: 'jäätävää kohtalaista tihkusadetta',
    56: 'jäätävää kovaa tihkusadetta',

    60: 'vesisadetta',
    61: 'heikkoa vesisadetta',
    62: 'kohtalaista vesisadetta',
    63: 'kovaa vesisadetta',
    64: 'jäätävää heikkoa vesisadetta',
    65: 'jäätävää kohtalaista vesisadetta',
    66: 'jäätävää kovaa vesisadetta',
    67: 'räntää',
    68: 'räntää',

    70: 'lumisadetta',
    71: 'heikkoa lumisadetta',
    72: 'kohtalaista lumisadetta',
    73: 'tiheää lumisadetta',
    74: 'heikkoa jääjyväsadetta',
    75: 'kohtalaista jääjyväsadetta',
    76: 'kovaa jääjyväsadetta',
    77: 'lumijyväsiä',
    78: 'jääkiteitä',

    80: 'sadekuuroja',
    81: 'heikkoja sadekuuroja',
    82: 'kohtalaisia sadekuuroja',
    84: 'heikkoja lumikuuroja',
    85: 'kohtalaisia lumikuuroja',
    86: 'kovia lumikuuroja',
    87: 'raekuuroja',
};
