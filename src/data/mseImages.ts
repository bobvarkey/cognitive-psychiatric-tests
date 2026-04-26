// Maps MSE item id → illustrative diagram for the "Learn more" panel.
// Medical-textbook style images, generated as static assets.

import tapA from '@/assets/mse/tap-a.jpg';
import mariePaper from '@/assets/mse/marie-paper.jpg';
import luria from '@/assets/mse/luria.jpg';
import tol from '@/assets/mse/tol.jpg';
import stroop from '@/assets/mse/stroop.jpg';
import trailB from '@/assets/mse/trail-b.jpg';
import wcst from '@/assets/mse/wcst.jpg';
import clock from '@/assets/mse/clock.jpg';
import lineBisect from '@/assets/mse/line-bisect.jpg';
import pentagons from '@/assets/mse/pentagons.jpg';
import cube from '@/assets/mse/cube.jpg';
import ishihara from '@/assets/mse/ishihara.jpg';
import pyramids from '@/assets/mse/pyramids.jpg';
import cookieTheft from '@/assets/mse/cookie-theft.jpg';
import benton from '@/assets/mse/benton.jpg';

export interface MseImage {
  src: string;
  alt: string;
  caption: string;
}

export const mseImages: Record<string, MseImage> = {
  'att-tapA': {
    src: tapA,
    alt: "Diagram of the bedside Tap 'A' vigilance test",
    caption: "Examiner reads a random letter string; patient responds only to the target letter 'A'.",
  },
  'lang-marie': {
    src: mariePaper,
    alt: "Diagram of Marie's three-paper test",
    caption: 'Three papers of differing size — crumple the big one, hand over the medium, pocket the small.',
  },
  'fr-fep': {
    src: luria,
    alt: "Luria's fist–edge–palm hand sequence",
    caption: 'Three repeating hand positions: fist → edge → palm.',
  },
  'fr-tol': {
    src: tol,
    alt: 'Tower of London planning task',
    caption: 'Move colored balls between pegs to reach the goal configuration in the fewest moves.',
  },
  'fr-stroop': {
    src: stroop,
    alt: 'Stroop colour-word interference test',
    caption: 'Name the ink colour, suppressing the printed colour word.',
  },
  'fr-trailb': {
    src: trailB,
    alt: 'Trail Making Test Part B',
    caption: 'Connect circles in alternating numeric and alphabetic order: 1-A-2-B-3-C…',
  },
  'fr-wcst': {
    src: wcst,
    alt: 'Wisconsin Card Sorting Test',
    caption: 'Sort cards by shifting rules — colour, number, then shape — without explicit instruction.',
  },
  'rp-clock': {
    src: clock,
    alt: 'Clock drawing — normal vs left hemineglect',
    caption: 'In left hemineglect, numbers and hands cluster on the right side of the clock face.',
  },
  'rp-clockc': {
    src: clock,
    alt: 'Clock construction task',
    caption: 'Patient draws a clock face and sets hands to a requested time.',
  },
  'rp-bisect': {
    src: lineBisect,
    alt: 'Line bisection task for hemispatial neglect',
    caption: 'Patients with left neglect place the bisecting mark to the right of true centre.',
  },
  'rp-pent': {
    src: pentagons,
    alt: 'Interlocking pentagons copy',
    caption: 'Two five-sided figures must intersect to form a four-sided overlap.',
  },
  'rp-necker': {
    src: cube,
    alt: 'Necker cube copy task',
    caption: 'Reproduce a transparent 3-D wireframe cube — tests constructional praxis.',
  },
  'oc-color': {
    src: ishihara,
    alt: 'Ishihara colour-vision plate',
    caption: 'Embedded numerals visible only when red-green discrimination is intact.',
  },
  'oc-assoc': {
    src: pyramids,
    alt: 'Pyramids and Palm Trees test',
    caption: 'Match the target (pyramid) to the semantically associated item (palm tree).',
  },
  'oc-simult': {
    src: cookieTheft,
    alt: "BDAE 'Cookie Theft' picture",
    caption: 'Used to elicit narrative description; simultanagnosia limits reporting to local elements.',
  },
  'oc-proso': {
    src: benton,
    alt: 'Benton Facial Recognition Test',
    caption: 'Match a target face to one of several alternatives shown in different lighting and view.',
  },
};
