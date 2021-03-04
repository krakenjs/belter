export var iPhoneScreenHeightMatrix = {
  '926': {
    device: 'iPhone 12 Pro Max',
    textSizeHeights: [752, 748, 744, 738],
    zoomHeight: {
      '1.15': [752, 747, 744, 738],
      '1.25': [753, 748, 744, 738],
      '1.5': [752, 749, 744, 738],
      '1.75': [753, 747, 744, 739],
      '2': [752, 748, 744],
      // 738 removed as same in Safari
      '2.5': [753, 748],
      // 745, 738 removed as same in Safari
      '3': [753, 744] // 747, 738 removed as same in Safari

    },
    maybeSafari: {
      '2': [738],
      '2.5': [745, 738],
      '3': [747, 738]
    }
  },
  '896': {
    device: 'iPhone XS Max, iPhone 11 Pro Max, iPhone XR, iPhone 11',
    textSizeHeights: [721, 717, 713, 707],
    zoomHeight: {
      '1.15': [721, 716, 713, 707],
      '1.25': [721, 718, 713, 708],
      '1.5': [722, 717, 713],
      // 707 removed as same in Safari
      '1.75': [721, 718, 712, 707],
      '2': [722, 718, 714, 708],
      '2.5': [720, 718, 713, 708],
      '3': [720, 717, 708] // 714 removed as same in Safari

    },
    maybeSafari: {
      '1.5': [707],
      '3': [714]
    }
  },
  '844': {
    device: 'iPhone 12, iPhone 12 Pro',
    textSizeHeights: [670, 666, 662, 656],
    zoomHeight: {
      '1.15': [670, 666, 662],
      // 656 removed as same in Safari
      '1.25': [670, 666, 663, 656],
      '1.5': [671, 666, 662],
      // 656 removed as same in Safari
      '1.75': [670, 667, 662, 656],
      '2': [670, 666, 662],
      // 656 removed as same in Safari
      '2.5': [670, 663],
      // 665, 655 removed as same in Safari
      '3': [669, 666, 663, 657] // 663 removed as same in Safari

    },
    maybeSafari: {
      '1.15': [656],
      '1.5': [656],
      '2': [656],
      '2.5': [665, 655],
      '3': [663]
    }
  },
  '812': {
    device: 'iPhone X, iPhone XS, iPhone 11 Pro, iPhone 12 Mini',
    textSizeHeights: [641, 637, 633, 627],
    zoomHeight: {
      '1.15': [641, 637, 633, 627],
      '1.25': [641, 638, 633, 628],
      '1.5': [641, 638, 633, 627],
      '1.75': [641, 637, 634],
      // 627 removed as same in Safari
      '2': [642, 638, 634, 628],
      '2.5': [640, 638, 633, 628],
      '3': [642, 633] // 636, 627 removed as same in Safari

    },
    maybeSafari: {
      '1.75': [627],
      '3': [636, 627]
    }
  },
  '736': {
    device: 'iPhone 6 Plus, iPhone 6S Plus, iPhone 7 Plus, iPhone 8 Plus',
    textSizeHeights: [628, 624, 620, 614],
    zoomHeight: {
      '1.15': [628, 624, 620, 614],
      '1.25': [628, 624, 620, 614],
      '1.5': [629, 624, 620],
      // 614
      '1.75': [628, 625, 620, 614],
      '2': [628, 624, 620],
      // 614
      '2.5': [628, 625, 620, 615],
      '3': [627, 624, 615] // 621

    },
    maybeSafari: {
      '1.5': [614],
      '2': [614],
      '3': [621]
    }
  },
  '667': {
    device: 'iPhone 6, iPhone 6S, iPhone 7, iPhone 8,  iPhone SE2',
    textSizeHeights: [559, 555, 551, 545],
    zoomHeight: {
      '1.15': [559, 555, 551, 545],
      '1.25': [559, 555, 551, 545],
      '1.5': [560, 555, 551],
      // 545
      '1.75': [558, 555, 551],
      // 544
      '2': [560, 556, 552, 546],
      '2.5': [560, 555, 550],
      // 545
      '3': [558, 555, 546] // 552

    },
    maybeSafari: {
      '1.5': [545],
      '1.75': [544],
      '2.5': [545],
      '3': [552]
    }
  }
};