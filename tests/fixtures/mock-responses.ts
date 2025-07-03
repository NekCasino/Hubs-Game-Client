import { ListGamesResult, PresetResult, SessionResult } from '../../src/index';

/**
 * Mock response data for listGamesAll based on real API response
 */
export const MOCK_LIST_GAMES_RESPONSE: ListGamesResult = {
  $type: "gamehub.proto.client.service.ListGamesResult",
  categories: [],
  providers: [
    {
      $type: "gamehub.proto.client.service.ListGamesResult.ProviderResult",
      images: {},
      identity: "pragmaticplay",
      name: "Pragmatic Play"
    }
  ],
  games: [
    {
      $type: "gamehub.proto.client.service.ListGamesResult.GameResult",
      categories: [],
      supportedLang: [
        "ab", "aa", "af", "ak", "sq", "am", "ar", "an", "hy", "as", "av", "ae", "ay", "az", "bm", "ba", "eu", "be", "bn", "bh", "bi", "bs", "br", "bg", "my", "ca", "ch", "ce", "zh", "cu", "cv", "kw", "co", "cr", "cs", "da", "dv", "nl", "dz", "en", "eo", "et", "ee", "fo", "fj", "fi", "fr", "fy", "ff", "gd", "gl", "lg", "ka", "de", "el", "kl", "gn", "gu", "ht", "ha", "he", "hz", "hi", "ho", "hr", "hu", "ig", "is", "io", "ii", "iu", "ie", "ia", "id", "ik", "it", "jv", "ja", "kn", "ks", "kr", "kk", "km", "ki", "rw", "ky", "kv", "kg", "ko", "kj", "ku", "lo", "la", "lv", "li", "ln", "lt", "lb", "lu", "mk", "mg", "ms", "ml", "mt", "gv", "mi", "mr", "mh", "mn", "na", "nv", "nd", "nr", "ng", "ne", "nn", "nb", "no", "ny", "oc", "oj", "or", "om", "os", "pa", "pi", "fa", "pl", "pt", "ps", "qu", "rm", "ro", "rn", "ru", "sg", "sa", "si", "sk", "sl", "se", "sm", "sn", "sd", "so", "st", "es", "sc", "sr", "ss", "su", "sw", "sv", "ty", "tg", "ta", "tt", "te", "th", "bo", "ti", "to", "tn", "ts", "tk", "tr", "tw", "ug", "uk", "ur", "uz", "ve", "vi", "vo", "wa", "cy", "wo", "xh", "yi", "yo", "za", "zu"
      ],
      platforms: [
        "mobile",
        "web",
        "web"
      ],
      images: {
        "200x300": "/games/pragmaticplay/1746701490540-200x300-pragmaticplay-sugar-rush-1000@1x.webp",
        "200x200": "/games/pragmaticplay/1746701490346-200x200-pragmaticplay-sugar-rush-1000@1x.webp"
      },
      identity: "pragmaticplay-sugar-rush-1000",
      name: "Sugar Rush 1000",
      provider: "pragmaticplay",
      bonusBet: true,
      bonusWagering: true,
      demoEnable: false,
      freespinEnable: true,
      freechipEnable: false,
      jackpotEnable: false,
      bonusBuyEnable: false
    }
  ]
};

/**
 * Mock response for findPreset
 */
export const MOCK_PRESET_RESPONSE: PresetResult = {
  $type: "gamehub.proto.client.service.PresetResult",
  id: 'preset-001',
  name: 'Sugar Rush 1000 Preset',
  currency: 'USD',
  fields: [
    {
      $type: "gamehub.proto.client.service.PresetResult.Field",
      name: 'bet_amount',
      value: 100,
      defaultValue: 100,
      minValue: 10,
      maxValue: 1000,
      required: true
    },
    {
      $type: "gamehub.proto.client.service.PresetResult.Field",
      name: 'lines',
      value: 20,
      defaultValue: 20,
      minValue: 1,
      maxValue: 25,
      required: false
    }
  ]
};

/**
 * Mock response for createSession
 */
export const MOCK_SESSION_RESPONSE: SessionResult = {
  $type: "gamehub.proto.client.service.SessionResult",
  gameLaunchUrl: 'https://mock-game-server.example.com/launch?game=pragmaticplay-sugar-rush-1000&player=test-player&token=mock-session-token-123'
};

/**
 * Mock metadata for authentication
 */
export const MOCK_AUTH_METADATA = {
  identity: 'test',
  secret: 'secret'
}; 