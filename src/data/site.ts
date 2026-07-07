/** данные сайта */

interface Site {
  name: string,
  title: string,
  description: string,
  url: string,
}

const site: Site = {
  name: 'Content Hub',
  title: 'Content Hub | Full-Stack Content Platform',
  description: "A full-stack content platform with authentication, roles, moderation, email contact form and image support.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
}

export default site;