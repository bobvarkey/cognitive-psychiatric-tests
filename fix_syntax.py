import sys

file_path = "src/components/AssessmentSelector.tsx"
with open(file_path, "r") as f:
    lines = f.readlines()

# Find the start and end indices for the 'opd-psych-eval' and 'cdr' entries
start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if "'opd-psych-eval'" in line:
        start_idx = i
    if start_idx != -1 and "'cdr'" in line:
        end_idx = i
        break

if start_idx == -1 or end_idx == -1:
    print(f"Could not find indices: {start_idx}, {end_idx}")
    sys.exit(1)

# The content to replace for opd-psych-eval
desc_text = (
    "'''Do not make any visual modifications. The phrases I write are commands to understand what I want, not to be written down. Understand their content well, then execute what is required.'''\n"
    "                                        \n"
    "                                            \n"
    "                                            For the code present, I get the error below.\n"
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
    "\n"
    "Caused by:\n"
    "    Syntax Error\n"
    "\n"
    "Stack backtrace:\n"
    "   0: <unknown>\n"
    "   1: <unknown>\n"
    "   2: <unknown>\n"
    "   3: <unknown>\n"
    "   4: <unknown>\n"
    "   5: <unknown>\n"
    "   6: <unknown>\n"
    "   7: <unknown>\n"
    "   8: <unknown>\n"
    "   9: _ZZN4node14ThreadPoolWork12ScheduleWorkEvENUlP9uv_work_sE_4_FUNES2_\n"
    "  10: worker\n"
    "  11: start_thread\n"
    "  12: __clone3\n"
    "\n"
    "{\n"
    "  \"timestamp\": 1787358229502,\n"
    "  \"error_type\": \"RUNTIME_ERROR\",\n"
    "  \"filename\": \"/dev-server/src/components/AssessmentSelector.tsx\",\n"
    "  \"lineno\": 0,\n"
    "  \"colno\": 0,\n"
    "  \"stack\": \"Unavailable\",\n"
    "  \"has_blank_screen\": true\n"
    "}\n"
    "```"
)

desc_js = desc_text.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
new_line = f"  {{ key: 'opd-psych-eval', name: 'OPD Psych Evaluation', subtitle: 'Pediatric / SLD Workup', icon: ClipboardList, gradient: 'from-emerald-500 to-teal-600', category: ['all', 'cognitive'], description: \"{desc_js}\" }},\n"

# Replace the lines from start_idx up to (but not including) end_idx
final_lines = lines[:start_idx] + [new_line] + lines[end_idx:]

with open(file_path, "w") as f:
    f.writelines(final_lines)

print("Updated successfully")
