import sys

file_path = "src/components/AssessmentSelector.tsx"
with open(file_path, "r") as f:
    lines = f.readlines()

start_idx = -1
for i, line in enumerate(lines):
    if "{ key: 'opd-psych-eval'" in line:
        start_idx = i
        break

if start_idx == -1:
    print("Could not find start index")
    sys.exit(1)

# Find the next valid assessment entry to know where the garbage ends
end_idx = -1
for i in range(start_idx + 1, len(lines)):
    if "{ key: 'cdr'" in lines[i]:
        end_idx = i
        break

if end_idx == -1:
    print("Could not find end index")
    sys.exit(1)

desc_text = (
    "'''Do not make any visual modifications. The phrases I write are commands to understand what I want, not to be written down. Understand their content well, then execute what is required.'''\n"
    "\n"
    "For the code present, I get the error below.\n"
    "\n"
    "Please think step-by-step in order to resolve it.\n"
    "```\n"
    "  x Unterminated string constant\n"
    "     ,-[/dev-server/src/components/AssessmentSelector.tsx:163:1]\n"
    " 160 |   { key: 'adhd-outpatient', name: 'ADHD Outpatient Flow', subtitle: 'Treatment Algorithm', icon: Activity, gradient: 'from-blue-600 to-indigo-700', category: ['all', 'cognitive'], description: 'Adolescent and adult ADHD outpatient treatment algorithm — capturing patient profile, symptoms, comorbidities, prior treatments, and risks to generate recommended pharmacologic and non-pharmacologic plans.' },\n"
    " 161 |   { key: 'adhd', name: 'ADHD (DSM-5)', subtitle: 'Diagnostic Criteria', icon: Focus, gradient: 'from-amber-500 to-orange-600', category: ['all', 'cognitive'], description: 'DSM-5-TR ADHD diagnostic criteria checklist for inattention and hyperactivity-impulsivity domains.' },\n"
    " 162 |   { key: 'adhdScreener', name: 'ADHD Screeners', subtitle: 'ASRS & Vanderbilt', icon: ClipboardCheck, gradient: 'from-emerald-500 to-teal-600', category: ['all', 'cognitive'], description: 'Access the ASRS-v1.1 (6 & 18 items) for adults and the NICHQ Vanderbilt Parent Scale for children.' },\n"
    " 163 |   { key: 'opd-psych-eval', name: 'OPD Psych Evaluation', subtitle: 'Pediatric / SLD Workup', icon: ClipboardList, gradient: 'from-emerald-500 to-teal-600', category: ['all', 'cognitive'], description: \"'''Do not make any visual modifications. The phrases I write are commands to understand what I want, not to be written down. Understand their content well, then execute what is required.'''\n"
    "     :                                                                                                                                                                                                          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n"
    " 164 |                                         \n"
    " 165 |                                             \n"
    " 166 |                                             For the code present, I get the error below.\n"
    "     `----\n"
    "  x Expected ',', got 'For'\n"
    "     ,-[/dev-server/src/components/AssessmentSelector.tsx:166:1]\n"
    " 163 |   { key: 'opd-psych-eval', name: 'OPD Psych Evaluation', subtitle: 'Pediatric / SLD Workup', icon: ClipboardList, gradient: 'from-emerald-500 to-teal-600', category: ['all', 'cognitive'], description: \"'''Do not make any visual modifications. The phrases I write are commands to understand what I want, not to be written down. Understand their content well, then execute what is required.'''\n"
    " 164 |                                         \n"
    " 165 |                                             \n"
    " 166 |                                             For the code present, I get the error below.\n"
    "     :                                             ^^^\n"
    " 167 | \n"
    " 168 | Please think step-by-step in order to resolve it.\n"
    " 169 | '''\n"
    "     `----\n"
    "\n"
    "Caused by:\n"
    "    Syntax Error\n"
    "```"
)

# Minimal escaping for single line
desc_escaped = desc_text.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
new_entry = f"  {{ key: 'opd-psych-eval', name: 'OPD Psych Evaluation', subtitle: 'Pediatric / SLD Workup', icon: ClipboardList, gradient: 'from-emerald-500 to-teal-600', category: ['all', 'cognitive'], description: \"{desc_escaped}\" }},\n"

final_lines = lines[:start_idx] + [new_entry] + lines[end_idx:]

with open(file_path, "w") as f:
    f.writelines(final_lines)

print("Cleaned successfully")
