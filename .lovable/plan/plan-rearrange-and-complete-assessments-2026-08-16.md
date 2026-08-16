# Plan - Rearrange and Complete Assessments

Rearrange the clinical assessment toolkit to follow a more logical clinical flow and ensure all implemented assessments are accessible in the UI.

## User Review Required

> [!IMPORTANT]
> I will be reordering all 70+ assessments into a new clinical grouping. Please verify if the proposed category order (`Cognitive -> Psychosis -> Mood -> Personality -> Substance -> Movement -> Epilepsy -> Sleep -> Adverse -> Fibromyalgia -> Brain Fog`) matches your preference.

## Proposed Changes

### Clinical Navigation & Organization
- **Reorder Categories**: Update the sidebar and main view to follow a logical clinical progression starting from core diagnostic flows (Triage, ADHD, OPD) followed by specialized psychiatric and neurological domains.
- **Consolidate Assessments**: Reconstruct the main `assessments` array in `AssessmentSelector.tsx` to include all assessments defined in the type system but currently missing from the grid (Mood, Personality, and several specialized tools).
- **Logical Grouping**:
    - **Triage**: Primary entry point.
    - **Cognitive**: Dementia staging (CDR/FAST), bedside screens (CCSA/Mini-ACE), and neuropsychiatric syndromes.
    - **Psychosis**: Severity scales (BPRS/PANSS) and early detection (SOPS/Late-Onset).
    - **Mood & Anxiety**: Standardized tools (HAM-D/HAM-A/BDI).
    - **Personality**: Cluster screens (IPDE/MSI-BPD) and unified trait models (PID-5).
    - **Substance & PUI**: Withdrawal (CIWA/COWS) and behavioral addictions (SMDS-SF).
    - **Movement & Epilepsy**: Advanced neuro-staged tools (MDS-UPDRS/ILAE).
    - **Adverse Reactions**: Safety monitoring (NMS/Hunter/Metabolic).

### UI Refinement
- **Fix Duplicates**: Remove redundant entries for Fibromyalgia and Consciousness assessments.
- **Visual Consistency**: Standardize icons and gradients across all tiles within their respective categories to improve scanability.
- **Enhanced Descriptions**: Update tile metadata to provide clear, clinician-ready summaries of each tool's purpose.

## Technical Details
- **File**: `src/components/AssessmentSelector.tsx`
- **Data Structure**: Update `assessments` array with all 79 `AssessmentKey` items.
- **Imports**: Ensure all necessary icons from `lucide-react` are imported and assigned to the correct tools.
