# Show Schooler–Kane criteria in Dyskinesia assessment

## What will change
- Add a dedicated Schooler–Kane criteria panel near the top of the AIMS Dyskinesia assessment.
- Show the existing Schooler–Kane infographic with tap-to-enlarge behavior.
- Summarize the three criteria beside the image:
  1. Neuroleptic/antipsychotic exposure for at least 3 months.
  2. AIMS threshold: at least 3 in one body area or at least 2 in two body areas.
  3. No alternative cause for the abnormal movements.
- Include the existing publication citation and clearly label the criteria as clinical interpretation guidance.

## What will remain unchanged
- AIMS questions, responses, scoring, interpretations, exports, and saved data.
- The separate full Schooler–Kane assessment remains available.
- All other clinical assessments and navigation.

## Technical details
- Reuse the existing `schooler-kane-criteria.png` asset and Schooler–Kane constants so the criteria are not duplicated inconsistently.
- Use the existing dialog and button components for accessible image enlargement and a 44px minimum image control target.
- Keep the panel responsive and prevent horizontal overflow on mobile.

## Verification
- Confirm the Dyskinesia/AIMS screen displays the criteria and image.
- Confirm the image opens at a readable size and closes correctly.
- Confirm AIMS completion and results still work without console or build errors.
