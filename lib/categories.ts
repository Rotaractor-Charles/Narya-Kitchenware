export const CATEGORIES = [
  { slug: 'cookware',   label: 'Cookware'         },
  { slug: 'bakeware',   label: 'Bakeware'         },
  { slug: 'cutlery',    label: 'Cutlery'          },
  { slug: 'utensils',   label: 'Utensils'         },
  { slug: 'appliances', label: 'Small Appliances' },
  { slug: 'storage',    label: 'Storage & Org'    },
  { slug: 'dinnerware', label: 'Dinnerware'       },
  { slug: 'coffee-tea', label: 'Coffee & Tea'     },
  { slug: 'outdoor',    label: 'Outdoor & BBQ'    },
  { slug: 'cleaning',   label: 'Cleaning & Care'  },
]

export type Category = typeof CATEGORIES[number]
