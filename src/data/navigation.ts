/** навигация сайта */
export type AppRole = 'USER' | 'MODERATOR' | 'ADMIN';

export type NavItem = {
  label: string,
  href: string,
  authOnly?: boolean,
  roles?: AppRole[]
}

export type Navigation = NavItem[];

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
    authOnly: true,
  },

  {
    label: 'Moderation',
    href: '/moderation',
    authOnly: true,
    roles: ["MODERATOR", "ADMIN"],
  },

  {
    label: 'Admin',
    href: '/admin',
    authOnly: true,
    roles: ["ADMIN"],
  },

  {
    label: 'Contact',
    href: '/contact',
  },
]

export default navigation;
