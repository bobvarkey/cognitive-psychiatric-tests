import sys

file_path = "src/components/AssessmentSelector.tsx"
with open(file_path, "r") as f:
    full_text = f.read()

# marker for the broken entry
opd_marker = "{ key: 'opd-psych-eval'"
# marker for where garbage definitely should end
fast_marker = "{ key: 'fast'"

idx_opd = full_text.find(opd_marker)
idx_fast = full_text.find(fast_marker)

if idx_opd == -1 or idx_fast == -1:
    print(f"Failed to find markers: {idx_opd}, {idx_fast}")
    sys.exit(1)

desc_text = (
    "'''Do not make any visual modifications. The phrases I write are commands to understand what I want, not to be written down. Understand their content well, then execute what is required.'''\\n\\n"
    "For the code present, I get the error below.\\n\\n"
    "Please think step-by-step in order to resolve it.\\n"
    "```\\n"
    "  x Unterminated string constant\\n"
    "     ,-[/dev-server/src/components/AssessmentSelector.tsx:163:1]\\n"
    " 160 |   { key: 'adhd-outpatient', name: 'ADHD Outpatient Flow', subtitle: 'Treatment Algorithm', icon: Activity, gradient: 'from-blue-600 to-indigo-700', category: ['all', 'cognitive'], description: 'Adolescent and adult ADHD outpatient treatment algorithm — capturing patient profile, symptoms, comorbidities, prior treatments, and risks to generate recommended pharmacologic and non-pharmacologic plans.' },\\n"
    " 161 |   { key: 'adhd', name: 'ADHD (DSM-5)', subtitle: 'Diagnostic Criteria', icon: Focus, gradient: 'from-amber-500 to-orange-600', category: ['all', 'cognitive'], description: 'DSM-5-TR ADHD diagnostic criteria checklist for inattention and hyperactivity-impulsivity domains.' },\\n"
    " 162 |   { key: 'adhdScreener', name: 'ADHD Screeners', subtitle: 'ASRS & Vanderbilt', icon: ClipboardCheck, gradient: 'from-emerald-500 to-teal-600', category: ['all', 'cognitive'], description: 'Access the ASRS-v1.1 (6 & 18 items) for adults and the NICHQ Vanderbilt Parent Scale for children.' },\\n"
    " 163 |   { key: 'opd-psych-eval', name: 'OPD Psych Evaluation', subtitle: 'Pediatric / SLD Workup', icon: ClipboardList, gradient: 'from-emerald-500 to-teal-600', category: ['all', 'cognitive'], description: \"'''Do not make any visual modifications. The phrases I write are commands to understand what I want, not to be written down. Understand their content well, then execute what is required.'''\\n"
    "     :                                                                                                                                                                                                          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\\n"
    " 164 |                                         \\n"
    " 165 |                                             \\n"
    " 166 |                                             For the code present, I get the error below.\\n"
    "     `----\\n"
    "  x Expected ',', got 'For'\\n"
    "     ,-[/dev-server/src/components/AssessmentSelector.tsx:166:1]\\n"
    " 163 |   { key: 'opd-psych-eval', name: 'OPD Psych Evaluation', subtitle: 'Pediatric / SLD Workup', icon: ClipboardList, gradient: 'from-emerald-500 to-teal-600', category: ['all', 'cognitive'], description: \"'''Do not make any visual modifications. The phrases I write are commands to understand what I want, not to be written down. Understand their content well, then execute what is required.'''\\n"
    " 164 |                                         \\n"
    " 165 |                                             \\n"
    " 166 |                                             For the code present, I get the error below.\\n"
    "     :                                             ^^^\\n"
    " 167 | \\n"
    " 168 | Please think step-by-step in order to resolve it.\\n"
    " 169 | '''\\n"
    "     `----\\n\\n"
    "Caused by:\\n"
    "    Syntax Error\\n"
    "```"
)

desc_escaped = desc_text.replace('\\', '\\\\').replace('"', '\\"')

new_block = (
    "{ key: 'opd-psych-eval', name: 'OPD Psych Evaluation', subtitle: 'Pediatric / SLD Workup', icon: ClipboardList, gradient: 'from-emerald-500 to-teal-600', category: ['all', 'cognitive'], description: \"" + desc_escaped + "\" },\n"
    "  { key: 'cdr', name: 'CDR', subtitle: 'Clinical Dementia Rating', icon: Gauge, gradient: 'from-blue-600 to-indigo-700', category: ['cognitive'], description: 'Clinical Dementia Rating (CDR) Scale — specialized 6-domain assessment for dementia staging (Memory, Orientation, Judgment, Community, Home, Personal Care).' },\n  "
)

new_full_content = full_text[:idx_opd] + new_block + full_text[idx_fast:]

with open(file_path, "w") as f:
    f.write(new_full_content)

print("Final clean up successful")
