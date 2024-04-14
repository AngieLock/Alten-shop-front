import { SidenavItem } from "app/base/sidenav/sidenav.model";

export const SIDENAV_ITEMS: SidenavItem[] = [

  {
    id: 'Products-admin',
    labels: {
      en: 'Admin',
      fr: 'Administration'
    },
    link: '/admin/products',
    icon: 'user'
  },

  {
    id: 'Products',
    labels: {
      en: "Products",
      fr: "Produits"
    },
    link: '/products',
    icon: 'shopping-cart'

  }

];