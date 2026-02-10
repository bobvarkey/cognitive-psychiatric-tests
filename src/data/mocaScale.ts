import { MocaItem } from '@/types/moca';

export const mocaScaleEnglish: MocaItem[] = [
  // Visuospatial/Executive (5 points)
  {
    id: 'cube',
    domain: 'visuospatial',
    title: 'Copy Cube',
    description: 'Copy the cube drawing exactly as shown',
    type: 'drawing',
    maxScore: 1,
    instructions: 'Copy this cube drawing. All lines must be present with no line added.',
    imageUrl: '/src/assets/moca-cube.png'
  },
  {
    id: 'rectangle',
    domain: 'visuospatial',
    title: 'Copy Rectangle',
    description: 'Copy the rectangle drawing exactly as shown',
    type: 'drawing',
    maxScore: 1,
    instructions: 'Copy this rectangle drawing. All lines must be present with no line added.',
    imageUrl: '/src/assets/moca-rectangle.png'
  },
  {
    id: 'clock',
    domain: 'visuospatial', 
    title: 'Draw Clock',
    description: 'Draw a clock showing ten past eleven',
    type: 'drawing',
    maxScore: 3,
    instructions: 'Draw a clock. Put in all the numbers and set the time to ten past eleven.',
    imageUrl: '/src/assets/moca-clock.png'
  },
  {
    id: 'trail',
    domain: 'visuospatial',
    title: 'Trail Making',
    description: 'Connect the circles in ascending order, alternating between numbers and letters',
    type: 'visual',
    maxScore: 1,
    instructions: 'Please draw a line, going from a number to a letter in ascending order. Begin here (1) then B then 2 then C and so on. End here (E).',
    imageUrl: '/src/assets/moca-trail.png'
  },
  
  // Naming (3 points)
  {
    id: 'naming',
    domain: 'naming',
    title: 'Naming',
    description: 'Name the three animals shown',
    type: 'verbal',
    maxScore: 3,
    instructions: 'Please name these animals.',
    imageUrl: '/src/assets/moca-animals.png'
  },

  // Memory (0 points - just registration)
  {
    id: 'memory',
    domain: 'memory',
    title: 'Memory Registration',
    description: 'Repeat the following words: FACE, VELVET, CHURCH, DAISY, RED (Malayalam: മുഖം, വെൽവെറ്റ്, പള്ളി, പൂവ്, ചുവപ്പ്)',
    type: 'recall',
    maxScore: 0,
    instructions: 'I am going to read a list of words that you will have to remember now and later on. Listen carefully. When I am through, tell me as many words as you can remember in any order. Do 2 trials even if the first trial is successful. No points given, but test recall after 5 minutes.'
  },

  // Attention (6 points)
  {
    id: 'attention_forward',
    domain: 'attention',
    title: 'Forward Digit Span',
    description: 'Repeat these numbers in the same order: 2-1-8-5-4',
    type: 'numeric',
    maxScore: 1,
    instructions: 'I am going to say some numbers and when I am through, repeat them to me exactly as I said them.'
  },
  {
    id: 'attention_backward',
    domain: 'attention',
    title: 'Backward Digit Span', 
    description: 'Repeat these numbers in reverse order: 7-4-2',
    type: 'numeric',
    maxScore: 1,
    instructions: 'Now I am going to say some more numbers, but when I am through, I want you to tell them to me backwards.'
  },
  {
    id: 'attention_vigilance',
    domain: 'attention',
    title: 'Vigilance',
    description: 'Tap when you hear the letter A',
    type: 'verbal',
    maxScore: 1,
    instructions: 'I am going to read a sequence of letters. Every time I say the letter A, tap your hand on the table. F-B-A-C-M-N-A-A-J-K-L-B-A-F-A-K-D-E-A-A-A-J-A-M-O-F-A-A-B. No points if more than 2 errors.'
  },
  {
    id: 'attention_subtraction',
    domain: 'attention',
    title: 'Serial 7 Subtraction',
    description: 'Starting at 100, subtract 7 each time: 93, 86, 79, 72, 65',
    type: 'numeric',
    maxScore: 3,
    instructions: 'Now, I will ask you to count by subtracting seven from 100, and then, keep subtracting seven from your answer until I tell you to stop.\n\n4 or 5 correct subtractions: 3 pts, 2 or 3 correct: 2 pts, 1 correct: 1 pt, 0 correct: 0 pt'
  },

  // Language (3 points)
  {
    id: 'language_repetition',
    domain: 'language',
    title: 'Sentence Repetition',
    description: 'Repeat: "The children gathered around the camp fire" and "The wealthy merchant decided to help the poor" (Malayalam: "കുട്ടികൾ ക്യാമ്പ് ഫയറിന് ചുറ്റും ഒത്തുകൂടി", "സമ്പന്നനായ വ്യാപാരി പാവപ്പെട്ടവരെ സഹായിക്കാൻ തീരുമാനിച്ചു")',
    type: 'verbal',
    maxScore: 2,
    instructions: 'I am going to read you a sentence. Repeat it after me, exactly as I say it.'
  },
  {
    id: 'language_fluency',
    domain: 'language',
    title: 'Verbal Fluency',
    description: 'Say as many words as you can that begin with the letter F (≥11 words)',
    type: 'verbal',
    maxScore: 1,
    instructions: 'Tell me as many words as you can think of that begin with a certain letter of the alphabet. I will tell you to stop after one minute. Any word is fine except for proper nouns, numbers, and words that begin with the same sound but have a different suffix. The letter is F.\n\nNormal is 11 or more words.'
  },

  // Abstraction (2 points)
  {
    id: 'abstraction',
    domain: 'abstraction',
    title: 'Abstraction',
    description: 'How are these similar? Train-bicycle, Watch-ruler',
    type: 'verbal',
    maxScore: 2,
    instructions: 'Now I will tell you two objects and I want you to tell me what they have in common. In what way are they alike?'
  },

  // Delayed Recall (5 points)
  {
    id: 'delayed_recall',
    domain: 'delayedRecall',
    title: 'Delayed Recall',
    description: 'Recall the words from earlier: FACE, VELVET, CHURCH, DAISY, RED (Malayalam: മുഖം, വെൽവെറ്റ്, പള്ളി, പൂവ്, ചുവപ്പ്)',
    type: 'recall',
    maxScore: 5,
    instructions: 'I read some words to you earlier, which I asked you to remember. Tell me as many of those words as you can remember.'
  },

  // Orientation (6 points)
  {
    id: 'orientation',
    domain: 'orientation',
    title: 'Orientation',
    description: 'What is the date, month, year, day, place, and city?',
    type: 'verbal',
    maxScore: 6,
    instructions: 'Tell me the date today. What is the month? Year? Day of the week? What place is this? What city are we in?'
  }
];

export const mocaScaleMalayalam: MocaItem[] = [
  // Visuospatial/Executive (5 points)
  {
    id: 'cube',
    domain: 'visuospatial',
    title: 'കൂബ് പകർത്തുക',
    description: 'കാണിച്ചിരിക്കുന്നതുപോലെ കൂബ് ചിത്രം പകർത്തുക',
    type: 'drawing',
    maxScore: 1,
    instructions: 'ഈ കൂബ് ചിത്രം പകർത്തുക. എല്ലാ വരികളും ഉണ്ടായിരിക്കണം, പുതിയ വരികൾ ചേർക്കരുത്.',
    imageUrl: '/src/assets/moca-cube.png'
  },
  {
    id: 'rectangle',
    domain: 'visuospatial',
    title: 'ദീർഘചതുരം പകർത്തുക',
    description: 'കാണിച്ചിരിക്കുന്നതുപോലെ ദീർഘചതുരം ചിത്രം പകർത്തുക',
    type: 'drawing',
    maxScore: 1,
    instructions: 'ഈ ദീർഘചതുരം ചിത്രം പകർത്തുക. എല്ലാ വരികളും ഉണ്ടായിരിക്കണം, പുതിയ വരികൾ ചേർക്കരുത്.',
    imageUrl: '/src/assets/moca-rectangle.png'
  },
  {
    id: 'clock',
    domain: 'visuospatial', 
    title: 'ക്ലോക്ക് വരയ്ക്കുക',
    description: 'പത്തു മിനിറ്റ് കഴിഞ്ഞ് പതിനൊന്ന് മണി കാണിക്കുന്ന ഒരു ക്ലോക്ക് വരയ്ക്കുക',
    type: 'drawing',
    maxScore: 3,
    instructions: 'ഒരു ക്ലോക്ക് വരയ്ക്കുക. എല്ലാ സംഖ്യകളും ചേർക്കുക, സമയം പത്തു മിനിറ്റ് കഴിഞ്ഞ് പതിനൊന്ന് മണി ആക്കുക.',
    imageUrl: '/src/assets/moca-clock.png'
  },
  {
    id: 'trail',
    domain: 'visuospatial',
    title: 'ട്രെയിൽ മേക്കിംഗ്',
    description: 'സംഖ്യകളും അക്ഷരങ്ങളും മാറി മാറി വരുന്ന രീതിയിൽ വൃത്തങ്ങൾ ആരോഹണ ക്രമത്തിൽ ബന്ധിപ്പിക്കുക',
    type: 'visual',
    maxScore: 1,
    instructions: 'ഒരു സംഖ്യയിൽ നിന്ന് ഒരു അക്ഷരത്തിലേക്ക് ആരോഹണ ക്രമത്തിൽ വര വരയ്ക്കുക. ഇവിടെ ആരംഭിക്കുക (1), പിന്നെ B, പിന്നെ 2, പിന്നെ C എന്നിങ്ങനെ. ഇവിടെ അവസാനിക്കുക (E).',
    imageUrl: '/src/assets/moca-trail.png'
  },
  
  // Naming (3 points)
  {
    id: 'naming',
    domain: 'naming',
    title: 'പേരിടൽ',
    description: 'കാണിച്ചിരിക്കുന്ന മൂന്ന് മൃഗങ്ങളുടെ പേര് പറയുക',
    type: 'verbal',
    maxScore: 3,
    instructions: 'ഈ മൃഗങ്ങളുടെ പേര് പറയുക.',
    imageUrl: '/src/assets/moca-animals.png'
  },

  // Memory (0 points - just registration)
  {
    id: 'memory',
    domain: 'memory',
    title: 'മെമ്മറി രജിസ്ട്രേഷൻ',
    description: 'താഴെ പറയുന്ന വാക്കുകൾ ആവർത്തിക്കുക: മുഖം, വെൽവെറ്റ്, പള്ളി, പൂവ്, ചുവപ്പ്',
    type: 'recall',
    maxScore: 0,
    instructions: 'ഞാൻ നിങ്ങൾക്ക് ഇപ്പോഴും പിന്നീടും ഓർക്കേണ്ട വാക്കുകളുടെ ഒരു പട്ടിക വായിക്കാൻ പോകുന്നു. ശ്രദ്ധയോടെ കേൾക്കുക. ഞാൻ പൂർത്തിയാക്കുമ്പോൾ, ഏതെങ്കിലും ക്രമത്തിൽ നിങ്ങൾക്ക് ഓർമ്മയുള്ള എത്ര വാക്കുകളും എന്നോട് പറയുക. ആദ്യ പരീക്ഷണം വിജയകരമാണെങ്കിൽ പോലും 2 പരീക്ഷണങ്ങൾ നടത്തുക. പോയിന്റുകൾ നൽകില്ല, പക്ഷേ 5 മിനിറ്റിന് ശേഷം തിരിച്ചുവിളിക്കുക.'
  },

  // Attention (6 points)
  {
    id: 'attention_forward',
    domain: 'attention',
    title: 'മുന്നോട്ട് അക്ക വിസ്താരം',
    description: 'ഈ സംഖ്യകൾ അതേ ക്രമത്തിൽ ആവർത്തിക്കുക: 2-1-8-5-4',
    type: 'numeric',
    maxScore: 1,
    instructions: 'ഞാൻ ചില സംഖ്യകൾ പറയാൻ പോകുന്നു, ഞാൻ പൂർത്തിയാക്കുമ്പോൾ, ഞാൻ പറഞ്ഞതുപോലെ തന്നെ അവ എന്നോട് ആവർത്തിക്കുക.'
  },
  {
    id: 'attention_backward',
    domain: 'attention',
    title: 'പിന്നോട്ട് അക്ക വിസ്താരം', 
    description: 'ഈ സംഖ്യകൾ വിപരീത ക്രമത്തിൽ ആവർത്തിക്കുക: 7-4-2',
    type: 'numeric',
    maxScore: 1,
    instructions: 'ഇപ്പോൾ ഞാൻ കുറച്ചുകൂടി സംഖ്യകൾ പറയാൻ പോകുന്നു, പക്ഷേ ഞാൻ പൂർത്തിയാക്കുമ്പോൾ, അവ പിന്നിലേക്ക് എന്നോട് പറയണം.'
  },
  {
    id: 'attention_vigilance',
    domain: 'attention',
    title: 'ജാഗ്രത',
    description: 'A എന്ന അക്ഷരം കേൾക്കുമ്പോൾ തട്ടുക',
    type: 'verbal',
    maxScore: 1,
    instructions: 'ഞാൻ അക്ഷരങ്ങളുടെ ഒരു ശ്രേണി വായിക്കാൻ പോകുന്നു. ഞാൻ A എന്ന അക്ഷരം പറയുമ്പോഴെല്ലാം, മേശപ്പുറത്ത് നിങ്ങളുടെ കൈ തട്ടുക. F-B-A-C-M-N-A-A-J-K-L-B-A-F-A-K-D-E-A-A-A-J-A-M-O-F-A-A-B. 2-ൽ കൂടുതൽ പിശകുകൾ ഉണ്ടെങ്കിൽ പോയിന്റുകൾ ഇല്ല.'
  },
  {
    id: 'attention_subtraction',
    domain: 'attention',
    title: 'സീരിയൽ 7 കുറയ്ക്കൽ',
    description: '100-ൽ നിന്ന് ആരംഭിച്ച്, ഓരോ തവണയും 7 കുറയ്ക്കുക: 93, 86, 79, 72, 65',
    type: 'numeric',
    maxScore: 3,
    instructions: 'ഇപ്പോൾ, ഞാൻ നിങ്ങളോട് 100-ൽ നിന്ന് ഏഴ് കുറച്ച് എണ്ണാൻ ആവശ്യപ്പെടും, പിന്നെ, ഞാൻ നിർത്താൻ പറയുന്നത് വരെ നിങ്ങളുടെ ഉത്തരത്തിൽ നിന്ന് ഏഴ് കുറച്ചുകൊണ്ടിരിക്കുക.\n\n4 അല്ലെങ്കിൽ 5 ശരിയായ കുറവുകൾ: 3 പോയിന്റ്, 2 അല്ലെങ്കിൽ 3 ശരി: 2 പോയിന്റ്, 1 ശരി: 1 പോയിന്റ്, 0 ശരി: 0 പോയിന്റ്'
  },

  // Language (3 points)
  {
    id: 'language_repetition',
    domain: 'language',
    title: 'വാക്യം ആവർത്തിക്കൽ',
    description: 'ആവർത്തിക്കുക: "കുട്ടികൾ ക്യാമ്പ് ഫയറിന് ചുറ്റും ഒത്തുകൂടി" ഒപ്പം "സമ്പന്നനായ വ്യാപാരി പാവപ്പെട്ടവരെ സഹായിക്കാൻ തീരുമാനിച്ചു"',
    type: 'verbal',
    maxScore: 2,
    instructions: 'ഞാൻ നിങ്ങൾക്ക് ഒരു വാക്യം വായിക്കാൻ പോകുന്നു. ഞാൻ പറയുന്നതുപോലെ തന്നെ എന്റെ പിന്നാലെ ആവർത്തിക്കുക.'
  },
  {
    id: 'language_fluency',
    domain: 'language',
    title: 'വാക്കാലുള്ള പ്രവാഹം',
    description: 'F എന്ന അക്ഷരം കൊണ്ട് ആരംഭിക്കുന്ന എത്ര വാക്കുകൾ പറയാൻ കഴിയുമോ അത്ര പറയുക (≥11 വാക്കുകൾ)',
    type: 'verbal',
    maxScore: 1,
    instructions: 'അക്ഷരമാലയുടെ ഒരു പ്രത്യേക അക്ഷരം കൊണ്ട് ആരംഭിക്കുന്ന നിങ്ങൾക്ക് ചിന്തിക്കാൻ കഴിയുന്ന എത്ര വാക്കുകൾ എന്നോട് പറയുക. ഒരു മിനിറ്റിന് ശേഷം ഞാൻ നിങ്ങളോട് നിർത്താൻ പറയും. ശരിയായ നാമങ്ങൾ, സംഖ്യകൾ, ഒരേ ശബ്ദം കൊണ്ട് ആരംഭിക്കുന്നതും എന്നാൽ വ്യത്യസ്ത പ്രത്യയം ഉള്ളതുമായ വാക്കുകൾ ഒഴികെ ഏതൊരു വാക്കും നല്ലതാണ്. അക്ഷരം F ആണ്.\n\nസാധാരണം 11 അല്ലെങ്കിൽ അതിലധികം വാക്കുകളാണ്.'
  },

  // Abstraction (2 points)
  {
    id: 'abstraction',
    domain: 'abstraction',
    title: 'അമൂർത്തീകരണം',
    description: 'ഇവ എങ്ങനെ സമാനമാണ്? ട്രെയിൻ-സൈക്കിൾ, വാച്ച്-റൂളർ',
    type: 'verbal',
    maxScore: 2,
    instructions: 'ഇപ്പോൾ ഞാൻ നിങ്ങളോട് രണ്ട് വസ്തുക്കൾ പറയും, അവയ്ക്ക് എന്താണ് പൊതുവായുള്ളതെന്ന് എന്നോട് പറയണം. അവ ഏത് വിധത്തിൽ സമാനമാണ്?'
  },

  // Delayed Recall (5 points)
  {
    id: 'delayed_recall',
    domain: 'delayedRecall',
    title: 'വൈകിയ ഓർമ്മപ്പെടുത്തൽ',
    description: 'നേരത്തെയുള്ള വാക്കുകൾ തിരിച്ചുവിളിക്കുക: മുഖം, വെൽവെറ്റ്, പള്ളി, പൂവ്, ചുവപ്പ്',
    type: 'recall',
    maxScore: 5,
    instructions: 'ഞാൻ നേരത്തെ നിങ്ങൾക്ക് ചില വാക്കുകൾ വായിച്ചു, അത് ഓർക്കാൻ ആവശ്യപ്പെട്ടു. നിങ്ങൾക്ക് ഓർമ്മയുള്ള ആ വാക്കുകളിൽ എത്ര എണ്ണം എന്നോട് പറയുക.'
  },

  // Orientation (6 points)
  {
    id: 'orientation',
    domain: 'orientation',
    title: 'ഓറിയന്റേഷൻ',
    description: 'തീയതി, മാസം, വർഷം, ദിവസം, സ്ഥലം, നഗരം എന്തൊക്കെയാണ്?',
    type: 'verbal',
    maxScore: 6,
    instructions: 'ഇന്നത്തെ തീയതി എന്നോട് പറയുക. ഏതു മാസമാണ്? വർഷം? ആഴ്ചയിലെ ദിവസം? ഇതെന്ത് സ്ഥലമാണ്? ഏതു നഗരത്തിലാണ് നാം?'
  }
];
