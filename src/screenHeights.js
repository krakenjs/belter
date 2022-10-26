/* @flow */

export const sfvcScreens = {
  /*
   * iPhone 14 Pro Max
   */
  "932": {
    textSizeHeights: [746, 742, 738], // 732 removed as same in Safari
    textSizeHeightsNoTabs: [854, 852, 850, 848],
    zoomHeight: {
      "1.15": [746, 742, 738], // 733 removed as same in Safari
      "1.25": [746, 743], // 738, 733 removed as same in Safari
      "1.5": [746, 743], // 738, 732 removed as same in Safari
      "1.75": [746, 742, 739], // 732 removed as same in Safari
      "2": [746, 742], // 738, 732 removed as same in Safari
      "2.5": [745, 743], // 738, 733 removed as same in Safari
      "3": [749], // 743, 740, 734 removed as same in Safari
      "3.01": [749], // 743, 740, 734 removed as same in Safari
    },
    maybeSafari: {
      "1": [732],
      "1.15": [733],
      "1.25": [738, 733],
      "1.5": [738, 732],
      "1.75": [732],
      "2": [738, 732],
      "2.5": [738, 733],
      "3": [743, 740, 734],
      "3.01": [743, 740, 734],
    },
  },

  /*
   * iPhone 12 Pro Max
   * iPhone 13 Pro Max
   * iPhone 14 Plus
   */
  "926": {
    textSizeHeights: [752, 748, 744, 738],
    textSizeHeightsNoTabs: [860, 858, 856, 854],
    zoomHeight: {
      "1.15": [752, 747, 744, 738],
      "1.25": [753, 748, 744, 738],
      "1.5": [752, 749, 744, 738],
      "1.75": [753, 747, 744, 739],
      "2": [752, 748, 744], // 738 removed as same in Safari
      "2.5": [753, 748], // 745, 738 removed as same in Safari
      "3": [753, 744], // 747, 738 removed as same in Safari
    },
    maybeSafari: {
      "2": [738],
      "2.5": [745, 738],
      "3": [747, 738],
    },
  },

  /*
   * iPhone XS Max
   * iPhone 11 Pro Max
   * iPhone XR
   * iPhone 11
   */
  "896": {
    textSizeHeights: [721, 717, 713, 707],
    textSizeHeightsNoTabs: [829, 827, 825, 823],
    zoomHeight: {
      "1.15": [721, 716, 713, 707],
      "1.25": [721, 718, 713, 708],
      "1.5": [722, 717, 713], // 707 removed as same in Safari
      "1.75": [721, 718, 712, 707],
      "2": [722, 718, 714, 708],
      "2.5": [720, 718, 713, 708],
      "3": [720, 717, 708], // 714 removed as same in Safari
    },
    maybeSafari: {
      "1.5": [707],
      "3": [714],
    },
  },

  /*
   * iPhone 14 Pro
   */
  "852": {
    textSizeHeights: [666, 662, 658], // 652 removed as same in Safari
    textSizeHeightsNoTabs: [774, 772, 770, 768],
    zoomHeight: {
      "1.15": [666, 662, 658], // 652 removed as same in Safari
      "1.25": [665, 661, 658], // 651 removed as same in Safari
      "1.5": [666, 662, 659], // 653 removed as same in Safari
      "1.75": [667, 662], // 658, 653 removed as same in Safari
      "1.99": [663, 659], // 655, 649 removed as same in Safari
      "2": [663, 659], // 655, 649 removed as same in Safari
      "2.5": [665, 663], // 658, 653 removed as same in Safari
      "3": [666, 663], // 657, 651 removed as same in Safari
    },
    maybeSafari: {
      "1": [652],
      "1.15": [652],
      "1.25": [651],
      "1.5": [653],
      "1.75": [658, 653],
      "1.99": [655, 649],
      "2": [655, 649],
      "2.5": [658, 653],
      "3": [657, 651],
    },
  },

  /*
   * iPhone 12
   * iPhone 12 Pro
   * iPhone 13
   * iPhone 14
   */
  "844": {
    textSizeHeights: [670, 666, 662, 656],
    textSizeHeightsNoTabs: [778, 776, 774, 772],
    zoomHeight: {
      "1.15": [670, 666, 662], // 656 removed as same in Safari
      "1.25": [670, 666, 663, 656],
      "1.5": [671, 666, 662], // 656 removed as same in Safari
      "1.75": [670, 667, 662, 656],
      "2": [670, 666, 662], // 656 removed as same in Safari
      "2.5": [670, 663], // 665, 655 removed as same in Safari
      "3": [669, 666, 663, 657], // 663 removed as same in Safari
    },
    maybeSafari: {
      "1.15": [656],
      "1.5": [656],
      "2": [656],
      "2.5": [665, 655],
      "3": [663],
    },
  },

  /*
   * iPhone X
   * iPhone XS
   * iPhone 11 Pro
   * iPhone 12 Mini
   */
  "812": {
    textSizeHeights: [641, 637, 633, 627],
    textSizeHeightsNoTabs: [749, 747, 745, 743],
    zoomHeight: {
      "1.15": [641, 637, 633, 627],
      "1.25": [641, 638, 633, 628],
      "1.5": [641, 638, 633, 627],
      "1.75": [641, 637, 634], // 627 removed as same in Safari
      "2": [642, 638, 634, 628],
      "2.5": [640, 638, 633, 628],
      "3": [642, 633], // 636, 627 removed as same in Safari
    },
    maybeSafari: {
      "1.75": [627],
      "3": [636, 627],
    },
  },

  /*
   * iPhone 6 Plus
   * iPhone 6S Plus
   * iPhone 7 Plus
   * iPhone 8 Plus
   */
  "736": {
    textSizeHeights: [628, 624, 620, 614],
    textSizeHeightsNoTabs: [736, 734, 732, 730],
    zoomHeight: {
      "1.15": [628, 624, 620, 614],
      "1.25": [628, 624, 620, 614],
      "1.5": [629, 624, 620], // 614
      "1.75": [628, 625, 620, 614],
      "2": [628, 624, 620], // 614
      "2.5": [628, 625, 620, 615],
      "3": [627, 624, 615], // 621
    },
    maybeSafari: {
      "1.5": [614],
      "2": [614],
      "3": [621],
    },
  },

  /*
   * iPhone 6
   * iPhone 6S
   * iPhone 7
   * iPhone 8
   * iPhone SE2
   */
  "667": {
    textSizeHeights: [559, 555, 551, 545],
    textSizeHeightsNoTabs: [667, 665, 663, 661],
    zoomHeight: {
      "1.15": [559, 555, 551, 545],
      "1.25": [559, 555, 551, 545],
      "1.5": [560, 555, 551], // 545
      "1.75": [558, 555, 551], // 544
      "2": [560, 556, 552, 546],
      "2.5": [560, 555, 550], // 545
      "3": [558, 555, 546], // 552
    },
    maybeSafari: {
      "1.5": [545],
      "1.75": [544],
      "2.5": [545],
      "3": [552],
    },
  },
};
