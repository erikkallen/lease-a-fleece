/**
 * Lessee references. Written in the register of genuine B2B procurement
 * testimonials — earnest, specific, faintly defensive — and never funny on
 * purpose. All names and firms are invented.
 */
export interface Testimonial {
  quote: string
  name: string
  role: string
  since: string
}

/** The featured reference. Carries the forty-year heritage on its own. */
export const FEATURED: Testimonial = {
  quote:
    'My father leased from them. I lease from them. It is not the same unit, though I did ask.',
  name: 'Pieter Vos',
  role: 'Lessee, Utrecht',
  since: 'Contract held since 1994',
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'We carried blankets on the balance sheet for eleven years. Moving to a lease released capital we had not understood was trapped.',
    name: 'Marieke de Wit',
    role: 'Head of Procurement, Vantor Group',
    since: 'Contract held since 2018',
  },
  {
    quote:
      'I have never once had to think about washing it. That was the whole of the pitch and they have honoured it completely.',
    name: 'Joost Brinkman',
    role: 'Lessee, Rotterdam',
    since: 'Contract held since 2019',
  },
  {
    quote:
      'Our auditors raised no objection to the arrangement. That is the highest praise I am in a position to offer.',
    name: 'Annika Lindqvist',
    role: 'Financial Controller, Nordhavn BV',
    since: 'Contract held since 2021',
  },
]
