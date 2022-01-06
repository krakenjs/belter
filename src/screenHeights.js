/* @flow */

// iOS 14 and below
export const iOS14 = {
    '926': {
        device:          'iPhone 13 Pro Max, iPhone 12 Pro Max',
        textSizeHeights: [
            752, 748, 744, 738
        ],
        zoomHeight: {
            '1.15': [ 654, 650, 647, 641 ], // 641
            '1.25': [ 601, 598, 595, 590 ], // 590
            '1.5':  [ 501, 498, 495, 491 ], // 495, 491
            '1.75': [ 430, 427, 425, 422 ], // 425, 422
            '2':    [ 376, 374, 372, 369 ]  // 372, 369
        },
        maybeSafari: {
            '1.15': [ 641 ],
            '1.25': [ 590 ],
            '1.5':  [ 495, 491 ],
            '1.75': [ 425, 422 ],
            '2':    [ 372, 369 ]
        }
    },
    '896': {
        device:          'iPhone XS Max, iPhone 11 Pro Max, iPhone XR, iPhone 11',
        textSizeHeights: [
            721, 717, 713, 707
        ],
        zoomHeight: {
            '1.15': [ 627, 623, 620, 615 ],
            '1.25': [ 576, 573, 570 ], // 565 removed as same in Safari
            '1.5':  [ 481, 478 ], // 475, 471 removed as same in Safari
            '1.75': [ 412, 410 ], // 404, 407 removed as same in Safari
            '2':    [ 361, 359, 354 ]  // 357  removed as same in Safari
        },
        maybeSafari: {
            '1.25': [ 565 ],
            '1.5':  [ 475, 471 ],
            '1.75': [ 407, 404 ],
            '2':    [ 357 ]
        }
    },
    '844': {
        device:          'iPhone 13, iPhone 13 Pro, iPhone 12, iPhone 12 Pro',
        textSizeHeights: [
            670, 666, 662, 656
        ],
        zoomHeight: {
            '1.15': [ 670, 666, 662 ], // 656 removed as same in Safari
            '1.25': [ 670, 666, 663, 656 ],
            '1.5':  [ 671, 666, 662 ], // 656 removed as same in Safari
            '1.75': [ 670, 667, 662, 656 ],
            '2':    [ 670, 666, 662 ]  // 656 removed as same in Safari
        },
        maybeSafari: {
            '1.15': [ 656 ],
            '1.5':  [ 656 ],
            '2':    [ 656 ]
        }
    },
    '812': {
        device:          'iPhone 13 mini, iPhone 12 Mini, iPhone 11 Pro, iPhone X, iPhone XS',
        textSizeHeights: [
            641, 637, 633, 627
        ],
        zoomHeight: {
            '1.15': [ 641, 637, 633, 627 ],
            '1.25': [ 641, 638, 633, 628 ],
            '1.5':  [ 641, 638, 633, 627 ],
            '1.75': [ 641, 637, 634 ], // 627 removed as same in Safari
            '2':    [ 642, 638, 634, 628 ]
        },
        maybeSafari: {
            '1.75': [ 627 ]
        }
    },
    '736': {
        device:          'iPhone 6 Plus, iPhone 6S Plus, iPhone 7 Plus, iPhone 8 Plus',
        textSizeHeights: [
            628, 624, 620, 614
        ],
        zoomHeight: {
            '1.15': [ 628, 624, 620, 614 ],
            '1.25': [ 628, 624, 620, 614 ],
            '1.5':  [ 629, 624, 620 ], // 614
            '1.75': [ 628, 625, 620, 614 ],
            '2':    [ 628, 624, 620 ] // 614
        },
        maybeSafari: {
            '1.5':  [ 614 ],
            '2':    [ 614 ]
        }
    },
    '667': {
        device:          'iPhone 6, iPhone 6S, iPhone 7, iPhone 8,  iPhone SE2',
        textSizeHeights: [
            559, 555, 551, 545
        ],
        zoomHeight: {
            '1.15': [ 559, 555, 551, 545 ],
            '1.25': [ 559, 555, 551, 545 ],
            '1.5':  [ 560, 555, 551 ], // 545
            '1.75': [ 558, 555, 551 ], // 544
            '2':    [ 560, 556, 552, 546 ]
        },
        maybeSafari: {
            '1.5':  [ 545 ],
            '1.75': [ 544 ]
        }
    }
};

// iOS 15+
export const iOS15 = {
    '926': {
        device:          'iPhone 13 Pro Max, iPhone 12 Pro Max',
        textSizeHeights: ([] : $ReadOnlyArray<empty>),
        zoomHeight: {
            '1.15': [ 654, 650, 647 ],      // 641 removed because same as Safari
            '1.25': [ 601, 598, 595 ],      // 590 removed because same as Safari
            '1.5':  [ 501, 498 ],           // 495, 491 removed because same as Safari
            '1.75': [ 430, 427 ],           // 425, 422 removed because same as Safari
            '2':    [ 376, 374, 372, 369 ]  // 372, 369 removed because same as Safari
        },
        maybeSafari: {
            '1':    [ 752, 748, 738 ],
            '1.15': [ 641 ],
            '1.25': [ 590 ],
            '1.5':  [ 495, 491 ],
            '1.75': [ 425, 422 ],
            '2':    [ 372, 369 ]
        }
    },
    '896': {
        device:          'iPhone XS Max, iPhone 11 Pro Max, iPhone XR, iPhone 11',
        textSizeHeights: ([] : $ReadOnlyArray<empty>),
        zoomHeight: {
            '1.15': [ 721, 716, 713, 707 ],
            '1.25': [ 721, 718, 713, 708 ],
            '1.5':  [ 722, 717, 713 ], // 707 removed as same in Safari
            '1.75': [ 721, 718, 712, 707 ],
            '2':    [ 722, 718, 714, 708 ]
        },
        maybeSafari: {
            '1':    [ 721, 717, 713, 707 ],
            '1.5':  [ 707 ]
        }
    },
    '844': {
        device:          'iPhone 13, iPhone 13 Pro, iPhone 12, iPhone 12 Pro',
        textSizeHeights: ([] : $ReadOnlyArray<empty>),
        zoomHeight: {
            '1.15': [ 582, 579 ],           // 575, 570 removed as same in Safari
            '1.25': [ 536, 533, 530 ],      // 525
            '1.5':  [ 447, 444, 441, 437 ],
            '1.75': [ 383, 381, 378, 375 ], // 378, 375
            '2':    [ 335, 333, 331, 328 ]  // 331, 328
        },
        maybeSafari: {
            '1':    [ 670, 666, 662, 656 ],
            '1.15': [ 575, 570 ],
            '1.25': [ 525 ],
            '1.75': [ 378, 375 ],
            '2':    [ 331, 328 ]
        }
    },
    '812': {
        device:          'iPhone 13 mini, iPhone 12 Mini, iPhone 11 Pro, iPhone X, iPhone XS',
        textSizeHeights: ([] : $ReadOnlyArray<empty>),
        zoomHeight:      {
            '1.15': [ 641, 637, 633, 627 ],
            '1.25': [ 641, 638, 633, 628 ],
            '1.5':  [ 641, 638, 633, 627 ],
            '1.75': [ 641, 637, 634 ], // 627 removed as same in Safari
            '2':    [ 642, 638, 634, 628 ],
            '2.5':  [ 640, 638, 633, 628 ],
            '3':    [ 642, 633 ] // 636, 627 removed as same in Safari
        },
        maybeSafari: {
            '1':    [ 641, 637, 633, 627 ],
            '1.75': [ 627 ],
            '3':    [ 636, 627 ]
        }
    },
    '736': {
        device:          'iPhone 6 Plus, iPhone 6S Plus, iPhone 7 Plus, iPhone 8 Plus',
        textSizeHeights: ([] : $ReadOnlyArray<empty>),
        zoomHeight:      {
            '1.15': [ 628, 624, 620, 614 ],
            '1.25': [ 628, 624, 620, 614 ],
            '1.5':  [ 629, 624, 620 ], // 614
            '1.75': [ 628, 625, 620, 614 ],
            '2':    [ 628, 624, 620 ], // 614
            '2.5':  [ 628, 625, 620, 615 ],
            '3':    [ 627, 624, 615 ] // 621
        },
        maybeSafari: {
            '1':    [ 628, 624, 620, 614 ],
            '1.5':  [ 614 ],
            '2':    [ 614 ],
            '3':    [ 621 ]
        }
    },
    '667': {
        device:          'iPhone 6, iPhone 6S, iPhone 7, iPhone 8,  iPhone SE2',
        textSizeHeights: ([] : $ReadOnlyArray<empty>),
        zoomHeight:      {
            '1.15': [ 559, 555, 551, 545 ],
            '1.25': [ 559, 555, 551, 545 ],
            '1.5':  [ 560, 555, 551 ], // 545
            '1.75': [ 558, 555, 551 ], // 544
            '2':    [ 560, 556, 552, 546 ],
            '2.5':  [ 560, 555, 550 ], // 545
            '3':    [ 558, 555, 546 ] // 552
        },
        maybeSafari: {
            '1':    [ 559, 555, 551, 545 ],
            '1.5':  [ 545 ],
            '1.75': [ 544 ],
            '2.5':  [ 545 ],
            '3':    [ 552 ]
        }
    }
};
