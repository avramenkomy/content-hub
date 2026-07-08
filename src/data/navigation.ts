/** навигация сайта */

interface NavItem {
  label: string,
  href: string,
}

type Navigation = NavItem[];

const navigation: Navigation = [
  {
    label: 'Home',
    href: '/',
  },

  {
    label: 'Posts',
    href: '/posts',
  },

  {
    label: 'Dashboard',
    href: '/dashboard',
  },

  {
    label: 'Moderation',
    href: '/moderation',
  },

  {
    label: 'Admin',
    href: '/admin',
  },

  {
    label: 'Contact',
    href: '/contact',
  },
]

export default navigation;
