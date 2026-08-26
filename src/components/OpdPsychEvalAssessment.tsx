import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Printer } from 'lucide-react';
import { ProgressIndicator } from './ProgressIndicator';
import { CopyTextButton } from './CopyTextButton';


interface Props { onBack: () => void }

type YN = '' | 'yes' | 'no';

const complaintList = [
  'Poor academic performance since childhood',
  'Difficulty in English',
  'Difficulty with calculation',
  'Difficulty in Malayalam',
  'Difficulty in reading',
  'Difficulty in Hindi',
  'Difficulty in writing (including spellings)',
];

const readingSkills = [
  'Reading skills', 'Identification of alphabets', 'Know sounds of letters',
  'Reading words', 'Reading Sentences', 'Speed of reading',
  'Reading word by word', 'Adds words', 'Omits words',
  'Substitution', 'Reading Comprehension',
];

const writingSkills = [
  'Writing skills', 'Writing of alphabets', 'Writing Words', 'Writing Sentences',
  'No space between words', 'Missed out letter', 'Missed out word',
  'Substitution of letter', 'Writing paragraph', 'Comprehension of paragraph',
];

const calcSkills = [
  'Identification of numbers up to 100', 'Identification of mathematical symbols',
  'Counting', 'Addition', 'Subtraction', 'Multiplication', 'Division', 'Fraction',
];

const familyList = ['Developmental delays', 'Seizure disorder', 'Mental Illness', 'Learning disorder'];

const diagnoses = [
  'Intellectual Disability', 'Borderline intellectual functioning',
  'SLD — Dyslexia', 'SLD — Dysgraphia', 'SLD — Dyscalculia', 'Normal Profile',
];

const medicalIssues = [
  'Injury during Birth', 'Respiratory Distress', 'Meningitis', 'Congenital Heart Defect',
  'Admission at NICU', 'Any medical complication or illness', 'Cord around Neck',
  'Jaundice Marked', 'Microcephaly / Macrocephaly', 'Any other Congenital Anomalies',
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3"><CardTitle className="text-lg text-black">{title}</CardTitle></CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}

function Choice({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label className="text-sm font-medium text-black">{label}</Label>
      <RadioGroup value={value} onValueChange={onChange} className="flex flex-wrap gap-3 mt-1">
        {options.map(o => (
          <div key={o} className="flex items-center gap-2">
            <RadioGroupItem value={o} id={`${label}-${o}`} />
            <Label htmlFor={`${label}-${o}`} className="text-sm text-black cursor-pointer">{o}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

function YNGrid({ label, items, state, setState }: { label: string; items: string[]; state: Record<string, { primary: YN; english: YN }>; setState: (s: any) => void }) {
  return (
    <div>
      <h4 className="font-medium text-black mb-2">{label}</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2 text-left text-black">Skill</th>
              <th className="p-2 text-black">Primary Language</th>
              <th className="p-2 text-black">English</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const row = state[item] || { primary: '', english: '' };
              const set = (k: 'primary' | 'english', v: YN) =>
                setState({ ...state, [item]: { ...row, [k]: v } });
              return (
                <tr key={item} className="border-t">
                  <td className="p-2 text-black">{item}</td>
                  {(['primary', 'english'] as const).map(lang => (
                    <td key={lang} className="p-2 text-center">
                      <div className="flex justify-center gap-3">
                        {(['yes', 'no'] as const).map(v => (
                          <label key={v} className="flex items-center gap-1 text-black">
                            <input
                              type="radio"
                              name={`${label}-${item}-${lang}`}
                              checked={row[lang] === v}
                              onChange={() => set(lang, v)}
                            />
                            {v}
                          </label>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const OpdPsychEvalAssessment = ({ onBack }: Props) => {
  // Identification
  const [ident, setIdent] = useState({
    name: '', dateTime: '', dob: '', address: '', ageSex: '',
    klass: '', school: '', handedness: '', informant: '',
  });
  const [complaints, setComplaints] = useState<Record<string, boolean>>({});
  const [complaintsOther, setComplaintsOther] = useState('');

  // Clinical
  const [obs, setObs] = useState({
    appearance: '', consciousness: '', rapport: '', attention: '', concentration: '',
    behavioral: '',
  });

  // History
  const [prenatal, setPrenatal] = useState({ maternal: '', maternalDetail: '' });
  const [perinatal, setPerinatal] = useState({
    motherAge: '', delivery: '', birthType: '', childBirth: '',
    birthWeight: '', birthCry: '',
  });
  const [medical, setMedical] = useState<Record<string, YN>>({});
  const [medicalDetail, setMedicalDetail] = useState('');
  const [otherPerinatal, setOtherPerinatal] = useState('');

  const [postnatal, setPostnatal] = useState({
    headInjury: '', seizure: '', seizureType: '',
    seizureNumber: '', seizureFrequency: '', notes: '',
  });

  const [dev, setDev] = useState({
    motor: '', speech: '', receptive: '', expressive: '', social: '', selfHelp: '',
  });

  const [family, setFamily] = useState<Record<string, boolean>>({});

  // Tests
  const [tests, setTests] = useState({
    misic: '', bkt: '', vsms: '', isaa: '', nimhans: '',
    pq: '', vq: '', iq: '',
  });

  const [reading, setReading] = useState<Record<string, { primary: YN; english: YN }>>({});
  const [readingImpression, setReadingImpression] = useState('');
  const [writing, setWriting] = useState<Record<string, { primary: YN; english: YN }>>({});
  const [writingImpression, setWritingImpression] = useState('');
  const [calc, setCalc] = useState<Record<string, boolean>>({});
  const [calcImpression, setCalcImpression] = useState('');

  const [diagnosis, setDiagnosis] = useState<Record<string, boolean>>({});

  const report = useMemo(() => {
    const lines: string[] = [];
    const push = (s = '') => lines.push(s);
    push('PSYCHOLOGICAL EVALUATION PERFORMA');
    push('='.repeat(50));
    push('\nIDENTIFICATION');
    push(`Name: ${ident.name}`);
    push(`Date & Time: ${ident.dateTime}`);
    push(`DOB: ${ident.dob}   Age/Sex: ${ident.ageSex}`);
    push(`Address & Phone: ${ident.address}`);
    push(`Class: ${ident.klass}   School: ${ident.school}`);
    push(`Handedness: ${ident.handedness}`);
    push(`Informant: ${ident.informant}`);

    push('\nPRESENTING COMPLAINTS');
    Object.entries(complaints).filter(([, v]) => v).forEach(([k]) => push(`• ${k}`));
    if (complaintsOther) push(`• Other: ${complaintsOther}`);

    push('\nCLINICAL OBSERVATION');
    push(`Appearance: ${obs.appearance}`);
    push(`Consciousness: ${obs.consciousness}`);
    push(`Rapport: ${obs.rapport}`);
    push(`Attention: ${obs.attention}`);
    push(`Concentration: ${obs.concentration}`);
    if (obs.behavioral) push(`Behavioral/Emotional: ${obs.behavioral}`);

    push('\nPRENATAL');
    push(`Maternal complication: ${prenatal.maternal}${prenatal.maternalDetail ? ' — ' + prenatal.maternalDetail : ''}`);

    push('\nPERINATAL');
    push(`Mother age at birth: ${perinatal.motherAge} yrs`);
    push(`Delivery: ${perinatal.delivery} | Type: ${perinatal.birthType} | Births: ${perinatal.childBirth}`);
    push(`Birth weight: ${perinatal.birthWeight} kg | Cry: ${perinatal.birthCry}`);
    const medPos = Object.entries(medical).filter(([, v]) => v === 'yes').map(([k]) => k);
    if (medPos.length) push(`Medical problems (Yes): ${medPos.join(', ')}`);
    if (medicalDetail) push(`Details: ${medicalDetail}`);
    if (otherPerinatal) push(`Other: ${otherPerinatal}`);

    push('\nPOSTNATAL');
    push(`Head injury: ${postnatal.headInjury} | Seizure: ${postnatal.seizure} (${postnatal.seizureType})`);
    if (postnatal.seizureNumber || postnatal.seizureFrequency)
      push(`Seizure # ${postnatal.seizureNumber}, freq ${postnatal.seizureFrequency}`);
    if (postnatal.notes) push(`Notes: ${postnatal.notes}`);

    push('\nDEVELOPMENTAL / CURRENT FUNCTION');
    push(`Motor: ${dev.motor} | Speech: ${dev.speech}`);
    push(`Receptive: ${dev.receptive} | Expressive: ${dev.expressive}`);
    push(`Socialization: ${dev.social} | Self-help: ${dev.selfHelp}`);

    const famPos = Object.entries(family).filter(([, v]) => v).map(([k]) => k);
    if (famPos.length) push(`\nFAMILY HISTORY: ${famPos.join(', ')}`);

    push('\nPSYCHOLOGICAL TESTS');
    push(`MISIC: ${tests.misic} | BKT: ${tests.bkt} | VSMS: ${tests.vsms}`);
    push(`ISAA/INCLEN: ${tests.isaa} | NIMHANS SLD: ${tests.nimhans}`);
    push(`PQ: ${tests.pq} | VQ: ${tests.vq} | IQ: ${tests.iq}`);

    const fmtGrid = (state: Record<string, { primary: YN; english: YN }>) =>
      Object.entries(state)
        .filter(([, v]) => v.primary || v.english)
        .map(([k, v]) => `  ${k}: L1=${v.primary || '-'}, Eng=${v.english || '-'}`)
        .join('\n');

    push('\nREADING');
    push(fmtGrid(reading) || '  (not assessed)');
    if (readingImpression) push(`Impression: ${readingImpression}`);
    push('\nWRITING');
    push(fmtGrid(writing) || '  (not assessed)');
    if (writingImpression) push(`Impression: ${writingImpression}`);
    push('\nCALCULATION');
    const cPos = Object.entries(calc).filter(([, v]) => v).map(([k]) => k);
    push(cPos.length ? cPos.map(x => '  • ' + x).join('\n') : '  (none marked)');
    if (calcImpression) push(`Impression: ${calcImpression}`);

    const dxPos = Object.entries(diagnosis).filter(([, v]) => v).map(([k]) => k);
    push('\nDIAGNOSIS');
    push(dxPos.length ? dxPos.map(x => '• ' + x).join('\n') : '(pending)');

    return lines.join('\n');
  }, [ident, complaints, complaintsOther, obs, prenatal, perinatal, medical, medicalDetail,
      otherPerinatal, postnatal, dev, family, tests, reading, readingImpression,
      writing, writingImpression, calc, calcImpression, diagnosis]);

  const impressionOpts = ['Age Appropriate', 'Age inappropriate', 'Other observation'];

  return (
    <div className="max-w-5xl mx-auto p-4 pt-16">
      <ProgressIndicator 
        sections={[
          { id: 'sec-ident', label: 'Identification' },
          { id: 'sec-complaints', label: 'Complaints' },
          { id: 'sec-obs', label: 'Observation' },
          { id: 'sec-prenatal', label: 'Prenatal' },
          { id: 'sec-perinatal', label: 'Perinatal' },
          { id: 'sec-tests', label: 'Tests' },
          { id: 'sec-reading', label: 'Reading' },
          { id: 'sec-writing', label: 'Writing' },
          { id: 'sec-calc', label: 'Calculation' },
          { id: 'sec-dx', label: 'Diagnosis' },
        ]} 
      />

      <div className="flex items-center justify-between mb-4 print:hidden">
        <Button variant="ghost" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
        <div className="flex gap-2">
          <CopyTextButton text={report} label="Copy all" />
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-1" />Print / PDF
          </Button>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-black mb-4">OPD Psychological Evaluation</h1>

      <div id="sec-ident"><Section title="Identification Data">
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            ['name', 'Name'], ['dateTime', 'Date & Time'], ['dob', 'Date of Birth'],
            ['address', 'Address & Phone'], ['ageSex', 'Age & Sex'],
            ['klass', 'Class'], ['school', 'School'], ['informant', 'Informant (relation, duration)'],
          ].map(([k, label]) => (
            <div key={k}>
              <Label className="text-sm text-black">{label}</Label>
              <Input value={(ident as any)[k]} onChange={e => setIdent({ ...ident, [k]: e.target.value })} />
            </div>
          ))}
          <Choice label="Handedness" options={['Right', 'Left']}
            value={ident.handedness}
            onChange={v => setIdent({ ...ident, handedness: v })} />
        </div>
      </Section></div>
      
      <div id="sec-complaints"><Section title="Presenting Complaints">
        <div className="grid sm:grid-cols-2 gap-2">
          {complaintList.map(c => (
            <label key={c} className="flex items-center gap-2 text-black">
              <Checkbox checked={!!complaints[c]}
                onCheckedChange={v => setComplaints({ ...complaints, [c]: !!v })} />
              <span className="text-sm">{c}</span>
            </label>
          ))}
        </div>
        <div>
          <Label className="text-sm text-black">Others</Label>
          <Input value={complaintsOther} onChange={e => setComplaintsOther(e.target.value)} />
        </div>
      </Section></div>

      <div id="sec-obs"><Section title="Clinical Observation">
        <Choice label="General Appearance" options={['Well Kempt', 'Unkempt', 'Sickly']}
          value={obs.appearance} onChange={v => setObs({ ...obs, appearance: v })} />
        <Choice label="Consciousness" options={['Present', 'Partial', 'Absent']}
          value={obs.consciousness} onChange={v => setObs({ ...obs, consciousness: v })} />
        <Choice label="Rapport" options={['Easily established', 'Established with difficulty', 'Could not be established']}
          value={obs.rapport} onChange={v => setObs({ ...obs, rapport: v })} />
        <Choice label="Attention" options={['Easily aroused', 'Difficult to arouse', 'Impaired']}
          value={obs.attention} onChange={v => setObs({ ...obs, attention: v })} />
        <Choice label="Concentration" options={['Sustained', 'Temporary', 'Not at all present']}
          value={obs.concentration} onChange={v => setObs({ ...obs, concentration: v })} />
        <div>
          <Label className="text-sm text-black">Any behavioural / emotional problem</Label>
          <Textarea value={obs.behavioral} onChange={e => setObs({ ...obs, behavioral: e.target.value })} />
        </div>
      </Section></div>


      <div id="sec-prenatal"><Section title="Prenatal History">
        <Choice label="Maternal complications during pregnancy"
          options={['Yes', 'No']} value={prenatal.maternal}
          onChange={v => setPrenatal({ ...prenatal, maternal: v })} />
        <div>
          <Label className="text-sm text-black">If yes, specify</Label>
          <Textarea value={prenatal.maternalDetail}
            onChange={e => setPrenatal({ ...prenatal, maternalDetail: e.target.value })} />
        </div>
      </Section></div>


      <div id="sec-perinatal"><Section title="Perinatal History">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-black">Mother's age when child was born (yrs)</Label>
            <Input type="number" value={perinatal.motherAge}
              onChange={e => setPerinatal({ ...perinatal, motherAge: e.target.value })} />
          </div>
          <div>
            <Label className="text-sm text-black">Birth weight (kg)</Label>
            <Input type="number" value={perinatal.birthWeight}
              onChange={e => setPerinatal({ ...perinatal, birthWeight: e.target.value })} />
          </div>
        </div>
        <Choice label="Delivery" options={['Mature', 'Premature', 'Post mature']}
          value={perinatal.delivery} onChange={v => setPerinatal({ ...perinatal, delivery: v })} />
        <Choice label="Type of Birth"
          options={['Spontaneous vaginal', 'Complicated (Forceps/Vacuum)', 'Cesarean section']}
          value={perinatal.birthType} onChange={v => setPerinatal({ ...perinatal, birthType: v })} />
        <Choice label="Number of children in birth" options={['Single', 'Twice', 'Multiple']}
          value={perinatal.childBirth} onChange={v => setPerinatal({ ...perinatal, childBirth: v })} />
        <Choice label="Birth Cry" options={['Immediate', 'Delayed']}
          value={perinatal.birthCry} onChange={v => setPerinatal({ ...perinatal, birthCry: v })} />

        <div>
          <h4 className="font-medium text-black mt-3 mb-1">Medical Problems</h4>
          <div className="grid sm:grid-cols-2 gap-2">
            {medicalIssues.map(m => (
              <div key={m} className="flex items-center justify-between border rounded p-2">
                <span className="text-sm text-black">{m}</span>
                <div className="flex gap-2">
                  {(['yes', 'no'] as const).map(v => (
                    <label key={v} className="flex items-center gap-1 text-black text-sm">
                      <input type="radio" name={`med-${m}`}
                        checked={medical[m] === v}
                        onChange={() => setMedical({ ...medical, [m]: v })} />
                      {v}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label className="text-sm text-black">Details of positive findings</Label>
          <Textarea value={medicalDetail} onChange={e => setMedicalDetail(e.target.value)} />
        </div>
        <div>
          <Label className="text-sm text-black">Any other relevant information</Label>
          <Textarea value={otherPerinatal} onChange={e => setOtherPerinatal(e.target.value)} />
        </div>
      </Section></div>

      <Section title="Postnatal History">
        <Choice label="Head Injury" options={['Yes', 'No']}
          value={postnatal.headInjury} onChange={v => setPostnatal({ ...postnatal, headInjury: v })} />
        <Choice label="Seizure" options={['Yes', 'No']}
          value={postnatal.seizure} onChange={v => setPostnatal({ ...postnatal, seizure: v })} />
        <Choice label="Seizure type" options={['Febrile', 'Afebrile']}
          value={postnatal.seizureType} onChange={v => setPostnatal({ ...postnatal, seizureType: v })} />
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-black">Number</Label>
            <Input value={postnatal.seizureNumber}
              onChange={e => setPostnatal({ ...postnatal, seizureNumber: e.target.value })} />
          </div>
          <div>
            <Label className="text-sm text-black">Frequency</Label>
            <Input value={postnatal.seizureFrequency}
              onChange={e => setPostnatal({ ...postnatal, seizureFrequency: e.target.value })} />
          </div>
        </div>
        <div>
          <Label className="text-sm text-black">Any other relevant information</Label>
          <Textarea value={postnatal.notes}
            onChange={e => setPostnatal({ ...postnatal, notes: e.target.value })} />
        </div>
      </Section>

      <Section title="Developmental History & Current Functional Status">
        <Choice label="Motor Development" options={['Age appropriate', 'Delayed']}
          value={dev.motor} onChange={v => setDev({ ...dev, motor: v })} />
        <Choice label="Speech Development" options={['Age appropriate', 'Delayed']}
          value={dev.speech} onChange={v => setDev({ ...dev, speech: v })} />
        <Choice label="Receptive Communication" options={['Age appropriate', 'Not appropriate']}
          value={dev.receptive} onChange={v => setDev({ ...dev, receptive: v })} />
        <Choice label="Expressive Communication" options={['Age appropriate', 'Not appropriate']}
          value={dev.expressive} onChange={v => setDev({ ...dev, expressive: v })} />
        <Choice label="Socialization" options={['Age appropriate', 'Not appropriate']}
          value={dev.social} onChange={v => setDev({ ...dev, social: v })} />
        <Choice label="Self Help Skills" options={['Age appropriate', 'Not appropriate']}
          value={dev.selfHelp} onChange={v => setDev({ ...dev, selfHelp: v })} />
      </Section>

      <Section title="Family History">
        <div className="grid sm:grid-cols-2 gap-2">
          {familyList.map(f => (
            <label key={f} className="flex items-center gap-2 text-black">
              <Checkbox checked={!!family[f]}
                onCheckedChange={v => setFamily({ ...family, [f]: !!v })} />
              <span className="text-sm">{f}</span>
            </label>
          ))}
        </div>
      </Section>

      <div id="sec-tests"><Section title="Psychological Test Results">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            ['misic', 'MISIC'], ['bkt', 'BKT'], ['vsms', 'VSMS'],
            ['isaa', 'ISAA / INCLEN'], ['nimhans', 'NIMHANS SLD'],
            ['pq', 'PQ'], ['vq', 'VQ'], ['iq', 'IQ'],
          ].map(([k, label]) => (
            <div key={k}>
              <Label className="text-sm text-black">{label}</Label>
              <Input value={(tests as any)[k]}
                onChange={e => setTests({ ...tests, [k]: e.target.value })} />
            </div>
          ))}
        </div>
      </Section></div>

      <div id="sec-reading"><Section title="Reading">
        <YNGrid label="Reading" items={readingSkills} state={reading} setState={setReading} />
        <Choice label="Impression" options={impressionOpts}
          value={readingImpression} onChange={setReadingImpression} />
      </Section></div>

      <div id="sec-writing"><Section title="Writing">
        <YNGrid label="Writing" items={writingSkills} state={writing} setState={setWriting} />
        <Choice label="Impression" options={impressionOpts}
          value={writingImpression} onChange={setWritingImpression} />
      </Section></div>

      <div id="sec-calc"><Section title="Calculation">
        <div className="grid sm:grid-cols-2 gap-2">
          {calcSkills.map(c => (
            <label key={c} className="flex items-center gap-2 text-black">
              <Checkbox checked={!!calc[c]}
                onCheckedChange={v => setCalc({ ...calc, [c]: !!v })} />
              <span className="text-sm">{c}</span>
            </label>
          ))}
        </div>
        <Choice label="Impression" options={impressionOpts}
          value={calcImpression} onChange={setCalcImpression} />
      </Section></div>

      <div id="sec-dx"><Section title="Diagnosis">
        <div className="grid sm:grid-cols-2 gap-2">
          {diagnoses.map(d => (
            <label key={d} className="flex items-center gap-2 text-black">
              <Checkbox checked={!!diagnosis[d]}
                onCheckedChange={v => setDiagnosis({ ...diagnosis, [d]: !!v })} />
              <span className="text-sm">{d}</span>
            </label>
          ))}
        </div>
      </Section></div>

      <Card>
        <CardHeader><CardTitle className="text-lg text-black">Generated Report</CardTitle></CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap text-xs text-black bg-slate-50 p-3 rounded border max-h-96 overflow-auto">{report}</pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default OpdPsychEvalAssessment;
