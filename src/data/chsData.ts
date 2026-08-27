// Cannabinoid Hyperemesis Syndrome (CHS) — clinical reference data.
// Educational/reference content (no scoring). Structured from the
// gut-brain axis disorder seen in chronic, heavy cannabis users.

export interface ChsMechanism {
  name: string;
  description: string;
}

export interface ChsClinicalPhase {
  phaseNumber: number;
  name: string;
  duration: string;
  clinicalFeatures: string[];
}

export interface ChsDrugExample {
  drug: string;
  dose: string;
}

export interface ChsIntervention {
  intervention: string;
  dose?: string;
  administration?: string;
  mechanism?: string;
  examples?: ChsDrugExample[];
  example?: ChsDrugExample;
  indication?: string;
  note?: string;
}

export interface ChsData {
  condition: string;
  definition: string;
  pathophysiology: {
    overview: string;
    mechanisms: ChsMechanism[];
  };
  clinicalPhases: ChsClinicalPhase[];
  romeIvDiagnosticCriteria: {
    criteria: string[];
  };
  management: {
    acuteHyperemeticPhase: {
      firstLineSymptomaticRelief: ChsIntervention[];
      conventionalAntiemetics: {
        note: string;
        examples: string[];
      };
      supportiveCare: string[];
    };
    longTermManagement: {
      definitiveTreatment: ChsIntervention;
      prophylaxis: ChsIntervention;
    };
  };
}

export const CHS_DATA: ChsData = {
  condition: 'Cannabinoid Hyperemesis Syndrome (CHS)',
  definition:
    'A disorder of the gut-brain axis seen in chronic, heavy cannabis users, characterized by recurrent paroxysms of severe nausea, intractable vomiting, and colicky abdominal pain, often accompanied by learned compulsive hot-water bathing for temporary symptom relief.',
  pathophysiology: {
    overview: 'Paradoxical reaction to chronic cannabinoid exposure',
    mechanisms: [
      {
        name: 'Receptor Desensitization and Downregulation',
        description:
          'Exogenous Δ9-THC activates central and peripheral cannabinoid type 1 (CB1) and type 2 (CB2) receptors. While low-dose central CB1 activation is antiemetic, chronic overstimulation downregulates and desensitizes CB1 receptors in the enteric nervous system, leading to delayed gastric emptying and dysmotility.',
      },
      {
        name: 'TRPV1 Involvement',
        description:
          'THC also acts on transient receptor potential vanilloid 1 (TRPV1) receptors in the gut and the area postrema. Prolonged exposure impairs TRPV1 signaling. Exposure to heat (e.g., hot showers > 41 °C) or topical capsaicin activates cutaneous TRPV1 channels, transiently restoring homeostasis in the thermoregulatory and emetic centers of the hypothalamus and brainstem.',
      },
      {
        name: 'Lipophilic Pharmacokinetics',
        description:
          "Cannabinoids accumulate heavily in adipose tissue. Stress, fasting, or lipolysis can trigger transient surges of systemic cannabinoids ('re-intoxication'), precipitating emetic flare-ups.",
      },
    ],
  },
  clinicalPhases: [
    {
      phaseNumber: 1,
      name: 'Prodromal',
      duration: 'Months to years',
      clinicalFeatures: [
        'Early morning nausea',
        'Epigastric discomfort',
        'Fear of vomiting',
        'Patients often increase cannabis intake believing it treats the nausea',
      ],
    },
    {
      phaseNumber: 2,
      name: 'Hyperemetic',
      duration: '24–48 hours (cyclical)',
      clinicalFeatures: [
        'Paroxysmal severe vomiting (up to 5+ times/hr)',
        'Retching',
        "Screaming during emesis ('scromiting')",
        'Severe abdominal pain',
        'Compulsive hot showers/baths',
      ],
    },
    {
      phaseNumber: 3,
      name: 'Recovery',
      duration: 'Days to months',
      clinicalFeatures: [
        'Begins only after complete cessation of cannabinoid use',
        'Symptoms gradually resolve',
        'Appetite normalizes',
      ],
    },
  ],
  romeIvDiagnosticCriteria: {
    criteria: [
      'Stereotypical episodic vomiting resembling Cyclic Vomiting Syndrome (CVS) in onset, duration, and frequency.',
      'Fulfillment of criteria for at least 3 months, with symptom onset at least 6 months before diagnosis.',
      'Onset of symptoms preceded by prolonged, excessive cannabis use (typically > 1 year, multiple times per week).',
      'Definitive Criterion: Complete resolution of symptoms after sustained cannabis cessation (minimum 6–12 weeks).',
      'Supportive feature: Compulsive hot-water bathing behavior.',
    ],
  },
  management: {
    acuteHyperemeticPhase: {
      firstLineSymptomaticRelief: [
        {
          intervention: 'Topical Capsaicin',
          dose: '0.075% cream',
          administration: 'Applied to the abdomen or back',
          mechanism: 'Acts as a TRPV1 agonist to terminate nausea cascades',
        },
        {
          intervention: 'Butyrophenones / Antipsychotics',
          mechanism:
            'Targeting central dopamine-D2 receptors in the chemoreceptor trigger zone',
          examples: [
            { drug: 'Haloperidol', dose: '0.05–0.1 mg/kg IV/IM' },
            { drug: 'Droperidol', dose: '0.625–1.25 mg IV' },
          ],
        },
        {
          intervention: 'Benzodiazepines',
          mechanism: 'Anxiolysis, central antiemesis, and muscle relaxation',
          example: { drug: 'Lorazepam', dose: '1–2 mg IV' },
        },
      ],
      conventionalAntiemetics: {
        note: 'Frequently ineffective in CHS',
        examples: [
          '5-HT3 antagonists (e.g., ondansetron)',
          'Standard dopamine antagonists (e.g., metoclopramide)',
        ],
      },
      supportiveCare: [
        'Aggressive IV crystalloid hydration (monitoring for acute prerenal azotemia/electrolyte wasting)',
        'Acid suppression',
      ],
    },
    longTermManagement: {
      definitiveTreatment: {
        intervention: 'Complete Cannabinoid Abstinence',
        note: 'The only definitive cure. Resuming cannabis—even in trace amounts or alternative forms (edibles, oils)—reliably leads to recurrence.',
      },
      prophylaxis: {
        intervention: 'Low-dose Tricyclic Antidepressants',
        example: { drug: 'Amitriptyline', dose: '25–50 mg qHS' },
        indication:
          'May be used during the transition phase if cyclical symptoms persist',
      },
    },
  },
};
