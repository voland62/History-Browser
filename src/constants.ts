import { History } from './types';

export const DEFAULT_HISTORIES: History[] = [
  {
    id: 'global-history',
    name: 'Global History',
    color: 'bg-green-500/50 border-green-400',
    events: [
      { id: 'gh1', date: new Date('-200000-01-01').getTime(), title: 'Early Homo Sapiens', description: 'Approximate emergence of anatomically modern humans.' },
      { id: 'gh2', date: new Date('-009000-01-01').getTime(), title: 'Agricultural Revolution', description: 'The transition from hunting and gathering to agriculture.' },
      { id: 'gh3', date: new Date('0001-01-01').getTime(), title: 'Start of Common Era', description: 'The beginning of the year 1 AD in the Gregorian calendar.' },
      { id: 'gh4', date: new Date('1969-07-20').getTime(), title: 'Moon Landing', description: 'Apollo 11 mission lands the first humans on the Moon.' },
      { id: 'gh5', date: new Date('2030-01-01').getTime(), title: 'The Near Future', description: 'A point in the near future.' },
    ],
  },
  {
    id: 'roman-empire',
    name: 'Roman Empire',
    color: 'bg-red-500/50 border-red-400',
    events: [
      { id: 're1', date: new Date('0070-01-01').getTime(), title: 'Colosseum Construction Begins', description: 'Construction of the Flavian Amphitheatre begins under Emperor Vespasian.' },
      { id: 're2', date: new Date('0079-08-24').getTime(), title: 'Eruption of Mount Vesuvius', description: 'The catastrophic eruption that buried Pompeii and Herculaneum.' },
      { id: 're3', date: new Date('0313-01-01').getTime(), title: 'Edict of Milan', description: 'Constantine the Great and Licinius proclaim religious tolerance throughout the Roman Empire.' },
      { id: 're4', date: new Date('0476-09-04').getTime(), title: 'Fall of the Western Roman Empire', description: 'Romulus Augustulus is deposed by the Germanic chieftain Odoacer.' },
    ],
  },
  {
    id: 'renaissance-art',
    name: 'Renaissance Art',
    color: 'bg-blue-500/50 border-blue-400',
    events: [
      { id: 'ra1', date: new Date('1486-01-01').getTime(), title: 'Birth of Venus', description: 'Sandro Botticelli completes his masterpiece, The Birth of Venus.' },
      { id: 'ra2', date: new Date('1504-09-08').getTime(), title: 'Michelangelo\'s David Unveiled', description: 'The iconic marble statue is unveiled in Florence.' },
      { id: 'ra3', date: new Date('1506-01-01').getTime(), title: 'Mona Lisa', description: 'Leonardo da Vinci is thought to have begun painting the Mona Lisa around this time.' },
      { id: 'ra4', date: new Date('1512-11-01').getTime(), title: 'Sistine Chapel Ceiling', description: 'Michelangelo completes his frescoes on the ceiling of the Sistine Chapel.' },
    ],
  },
];

export const PREDEFINED_HISTORIES: Omit<History, 'id' | 'events'>[] = [
    { name: 'Ancient Egypt', color: 'bg-yellow-500/50 border-yellow-400' },
    { name: 'The Viking Age', color: 'bg-cyan-500/50 border-cyan-400' },
    { name: 'World War II', color: 'bg-gray-500/50 border-gray-400' },
    { name: 'The Space Race', color: 'bg-indigo-500/50 border-indigo-400' },
];

export const COLORS = [
    'bg-green-500/50 border-green-400',
    'bg-purple-500/50 border-purple-400',
    'bg-pink-500/50 border-pink-400',
    'bg-orange-500/50 border-orange-400',
];
