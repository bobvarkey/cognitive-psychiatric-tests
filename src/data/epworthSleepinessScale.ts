export interface EpworthItem {
  id: string;
  number: number;
  situation: string;
  description: string;
}

export const EPWORTH_ITEMS: EpworthItem[] = [
  {
    id: 'sitting_reading',
    number: 1,
    situation: 'Sitting and reading',
    description: 'How likely are you to doze off or fall asleep while sitting and reading?'
  },
  {
    id: 'watching_tv',
    number: 2,
    situation: 'Watching television',
    description: 'How likely are you to doze off or fall asleep while watching television?'
  },
  {
    id: 'sitting_inactive',
    number: 3,
    situation: 'Sitting inactive in public (e.g. a theater or meeting)',
    description: 'How likely are you to doze off or fall asleep while sitting inactive in a public place (e.g., a theater or meeting)?'
  },
  {
    id: 'car_passenger',
    number: 4,
    situation: 'As a passenger in a car for an hour without a break',
    description: 'How likely are you to doze off or fall asleep as a passenger in a car for an hour without a break?'
  },
  {
    id: 'lying_afternoon',
    number: 5,
    situation: 'Lying down to rest in the afternoon when circumstances permit',
    description: 'How likely are you to doze off or fall asleep while lying down to rest in the afternoon when circumstances permit?'
  },
  {
    id: 'sitting_talking',
    number: 6,
    situation: 'Sitting and talking to someone',
    description: 'How likely are you to doze off or fall asleep while sitting and talking to someone?'
  },
  {
    id: 'sitting_quiet_lunch',
    number: 7,
    situation: 'Sitting quietly after a lunch without alcohol',
    description: 'How likely are you to doze off or fall asleep while sitting quietly after lunch without alcohol?'
  },
  {
    id: 'car_stopped_traffic',
    number: 8,
    situation: 'In a car, while stopped for a few minutes in traffic',
    description: 'How likely are you to doze off or fall asleep in a car, while stopped for a few minutes in traffic?'
  }
];

export const EPWORTH_SCORING_GUIDE = {
  0: 'Would never doze',
  1: 'Slight chance of dozing',
  2: 'Moderate chance of dozing',
  3: 'High chance of dozing'
};

export const EPWORTH_INTERPRETATION = {
  0: {
    range: '0-5',
    level: 'Lower Normal Daytime Sleepiness',
    description: 'Patient has normal daytime sleepiness. No further evaluation needed unless clinical suspicion is high.'
  },
  1: {
    range: '6-10',
    level: 'Higher Normal Daytime Sleepiness',
    description: 'Patient has higher normal daytime sleepiness. Consider sleep hygiene counseling.'
  },
  2: {
    range: '11-12',
    level: 'Mild Excessive Daytime Sleepiness',
    description: 'Patient exhibits mild excessive daytime sleepiness. Further evaluation may be warranted.'
  },
  3: {
    range: '13-15',
    level: 'Moderate Excessive Daytime Sleepiness',
    description: 'Patient exhibits moderate excessive daytime sleepiness. Sleep study should be considered.'
  },
  4: {
    range: '16-24',
    level: 'Severe Excessive Daytime Sleepiness',
    description: 'Patient exhibits severe excessive daytime sleepiness. Sleep study is strongly recommended.'
  }
};
