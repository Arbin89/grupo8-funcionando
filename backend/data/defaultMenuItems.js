const menuItems = [
  {
    "name": "Bruschetta",
    "description": "Pan tostado con tomate y albahaca",
    "price": 120,
    "category": "Entradas",
    "emoji": "",
    "image_url": "https://static.bainet.es/clip/ba94ab6a-4cd6-4e45-8ce8-1623bc985a83_source-aspect-ratio_1600w_0.jpg",
    "available": true
  },
  {
    "name": "Croquetas de Jamón",
    "description": "Croquetas crujientes de jamón serrano",
    "price": 140,
    "category": "Entradas",
    "emoji": "",
    "image_url": "https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/F9D4BA2E-255F-417A-8C7C-C2DEAFA8B351/Derivates/265B15E9-7DC7-4DE3-9F70-2BD602C54BB1.jpg",
    "available": true
  },
  {
    "name": "Ensalada Caprese",
    "description": "Tomate, mozzarella y albahaca fresca",
    "price": 110,
    "category": "Entradas",
    "emoji": "",
    "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSS_WOH8VAHFbofVcYbuKDVJsQRsLm2ee5oA&s",
    "available": true
  },
  {
    "name": "Tortilla Española",
    "description": "Clásica tortilla de patatas",
    "price": 130,
    "category": "Entradas",
    "emoji": "",
    "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR75Cj-o76W8c78hePQ3yM0QMYUGeu5pOEJog&s",
    "available": true
  },
  {
    "name": "Ceviche de Camarón",
    "description": "Camarones marinados en cítricos",
    "price": 160,
    "category": "Entradas",
    "emoji": "",
    "image_url": "https://i0.wp.com/recetaskwa.com/wp-content/uploads/2023/09/ceviche_camaron.jpg?ssl=1",
    "available": true
  },
  {
    "name": "Queso Fundido",
    "description": "Queso derretido con chorizo",
    "price": 125,
    "category": "Entradas",
    "emoji": "",
    "image_url": "https://patijinich.com/es/wp-content/uploads/sites/3/2018/12/Queso-Fundido-con-Rajas-y-Chorizo-end.jpg",
    "available": true
  },
  {
    "name": "Empanadas Argentinas",
    "description": "Empanadas rellenas de carne",
    "price": 135,
    "category": "Entradas",
    "emoji": "",
    "image_url": "https://cdn7.kiwilimon.com/recetaimagen/37490/960x640/47376.jpg.jpg",
    "available": true
  },
  {
    "name": "Hummus con Pita",
    "description": "Hummus casero con pan pita",
    "price": 115,
    "category": "Entradas",
    "emoji": "",
    "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy2mu4P_7uPIrS-1j8BFgZyx62GMyUkD4Bzw&s",
    "available": true
  },
  {
    "name": "Rollitos Primavera",
    "description": "Rollitos fritos rellenos de vegetales",
    "price": 120,
    "category": "Entradas",
    "emoji": "",
    "image_url": "https://www.gastronomiaycia.com/wp-content/uploads/2021/04/rollitosprimaveraestilochin.jpg",
    "available": true
  },
  {
    "name": "Sopa de Tomate",
    "description": "Sopa cremosa de tomate y albahaca",
    "price": 110,
    "category": "Entradas",
    "emoji": "",
    "image_url": "https://img2.rtve.es/n/2093522",
    "available": true
  },
  {
    "name": "Filete de Res a la Parrilla",
    "description": "Filete jugoso con guarnición",
    "price": 350,
    "category": "Principales",
    "emoji": "",
    "image_url": "https://jetextramar.com/wp-content/uploads/2022/09/receta-de-sal-maldon.jpg",
    "available": true
  },
  {
    "name": "Pollo al Curry",
    "description": "Pollo en salsa de curry y arroz",
    "price": 280,
    "category": "Principales",
    "emoji": "",
    "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjq--NR7KYWWQtEeDV8lSY3r2O_Fc6kJA9ew&s",
    "available": true
  },
  {
    "name": "Pasta Carbonara",
    "description": "Pasta con salsa cremosa y panceta",
    "price": 220,
    "category": "Principales",
    "emoji": "",
    "image_url": "https://d1uz88p17r663j.cloudfront.net/original/b0cc0cdd37a9f4a9a3c49acdadf1d543_pasta-carbonada.png",
    "available": true
  },
  {
    "name": "Paella Valenciana",
    "description": "Arroz con mariscos y pollo",
    "price": 320,
    "category": "Principales",
    "emoji": "",
    "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNaEqt6euSodDqnsHI8aaY4vTL_wI5o4HWfg&s",
    "available": true
  },
  {
    "name": "Hamburguesa Gourmet",
    "description": "Hamburguesa de res con queso y bacon",
    "price": 210,
    "category": "Principales",
    "emoji": "",
    "image_url": "https://www.carniceriademadrid.es/wp-content/uploads/2025/01/hamburger-and-dark-beer-2025-01-09-02-45-33-utc.jpg",
    "available": true
  },
  {
    "name": "Pizza Margarita",
    "description": "Pizza clásica con tomate y mozzarella",
    "price": 190,
    "category": "Principales",
    "emoji": "",
    "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX2w-6ljxAJtEImAJ4zBsRnou1CoSAVmgvQw&s",
    "available": true
  },
  {
    "name": "Salmón al Horno",
    "description": "Salmón con hierbas y vegetales",
    "price": 330,
    "category": "Principales",
    "emoji": "",
    "image_url": "https://www.cocinacaserayfacil.net/wp-content/uploads/2023/03/salmon-a-la-naranja-al-horno.jpg",
    "available": true
  },
  {
    "name": "Tacos de Carnitas",
    "description": "Tacos de cerdo con salsa",
    "price": 180,
    "category": "Principales",
    "emoji": "",
    "image_url": "https://cielitorosado.com/wp-content/uploads/2022/11/CARNITAS-sm.jpg",
    "available": true
  },
  {
    "name": "Risotto de Champiñones",
    "description": "Arroz cremoso con champiñones",
    "price": 250,
    "category": "Principales",
    "emoji": "",
    "image_url": "https://i.blogs.es/38ad9a/risotto_setas/840_560.jpg",
    "available": true
  },
  {
    "name": "Costillas BBQ",
    "description": "Costillas de cerdo en salsa BBQ",
    "price": 340,
    "category": "Principales",
    "emoji": "",
    "image_url": "https://mandolina.co/wp-content/uploads/2023/08/costillas-bb1-1080x550-1-1200x900.png",
    "available": true
  },
  {
    "name": "Tiramisú",
    "description": "Postre italiano de café y mascarpone",
    "price": 90,
    "category": "Postres",
    "emoji": "",
    "image_url": "https://cdn.recetasderechupete.com/wp-content/uploads/2020/05/Tiramis%C3%BA-italiano.jpg",
    "available": true
  },
  {
    "name": "Cheesecake",
    "description": "Tarta de queso con salsa de frutos rojos",
    "price": 95,
    "category": "Postres",
    "emoji": "",
    "image_url": "https://i.ytimg.com/vi/kcVMt1gtXds/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCmXH7pauOiPzjuAEkPyvGkltODvg",
    "available": true
  },
  {
    "name": "Brownie con Helado",
    "description": "Brownie de chocolate con helado de vainilla",
    "price": 85,
    "category": "Postres",
    "emoji": "",
    "image_url": "https://www.recetasnestle.com.py/sites/default/files/srh_recipes/e2408aa827c4304b3feda24819922802.png",
    "available": true
  },
  {
    "name": "Flan de Coco",
    "description": "Flan cremoso de coco",
    "price": 80,
    "category": "Postres",
    "emoji": "",
    "image_url": "https://i0.wp.com/www.pardonyourfrench.com/wp-content/uploads/2020/05/Coconut-Flan-5.jpg?resize=585%2C585&ssl=1",
    "available": true
  },
  {
    "name": "Helado Artesanal",
    "description": "Helado de vainilla y chocolate",
    "price": 70,
    "category": "Postres",
    "emoji": "",
    "image_url": "https://i.ytimg.com/vi/KAm0zfSfgXk/maxresdefault.jpg",
    "available": true
  },
  {
    "name": "Crepas de Nutella",
    "description": "Crepas rellenas de Nutella",
    "price": 90,
    "category": "Postres",
    "emoji": "",
    "image_url": "https://www.pequerecetas.com/wp-content/uploads/2025/04/crepes-de-nutella-y-fresas.jpg",
    "available": true
  },
  {
    "name": "Pastel de Zanahoria",
    "description": "Pastel húmedo de zanahoria y nueces",
    "price": 85,
    "category": "Postres",
    "emoji": "",
    "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-_CnFcaT3B9r_iVNljGxTCAhgExPr5TI3jQ&s",
    "available": true
  },
  {
    "name": "Pudín de Chía",
    "description": "Pudín saludable de chía y frutas",
    "price": 75,
    "category": "Postres",
    "emoji": "",
    "image_url": "https://recetasdecocina.elmundo.es/wp-content/uploads/2025/03/pudin-de-chia.jpg",
    "available": true
  },
  {
    "name": "Gelatina de Fresa",
    "description": "Gelatina casera de fresa",
    "price": 65,
    "category": "Postres",
    "emoji": "",
    "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEw_mBPQFpobeU__JBl75RKD081X6sJbOuFA&s",
    "available": true
  },
  {
    "name": "Mousse de Limón",
    "description": "Mousse refrescante de limón",
    "price": 80,
    "category": "Postres",
    "emoji": "",
    "image_url": "https://cdn0.uncomo.com/es/posts/5/0/4/como_hacer_mousse_de_limon_24405_1200.jpg",
    "available": true
  },
  {
    "name": "Jugo de Naranja",
    "description": "Jugo natural de naranja",
    "price": 40,
    "category": "Bebidas",
    "emoji": "",
    "image_url": "https://cdn.milenio.com/uploads/media/2021/08/08/razon-debes-beber-jugo-naranja.jpg",
    "available": true
  },
  {
    "name": "Café Americano",
    "description": "Café negro recién hecho",
    "price": 35,
    "category": "Bebidas",
    "emoji": "",
    "image_url": "https://cdn.milenio.com/uploads/media/2019/10/01/cafe-americano-shutterstock_0_1_958_596.jpg",
    "available": true
  },
  {
    "name": "Té Verde",
    "description": "Té verde orgánico",
    "price": 30,
    "category": "Bebidas",
    "emoji": "",
    "image_url": "https://media.admagazine.com/photos/618a6151be961b98e9f0991c/master/w_1600%2Cc_limit/85139.jpg",
    "available": true
  },
  {
    "name": "Refresco de Cola",
    "description": "Refresco clásico de cola",
    "price": 25,
    "category": "Bebidas",
    "emoji": "",
    "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqx8zg1L83J08Kfj2BMt7jbL9GjFOT98-tDQ&s",
    "available": true
  },
  {
    "name": "Agua Mineral",
    "description": "Agua mineral con gas",
    "price": 20,
    "category": "Bebidas",
    "emoji": "",
    "image_url": "https://cdn.almacen.do/2021/12/Agua-Evian-0.5-L-Caja-24-uds-Turn-600x600.jpg",
    "available": true
  },
  {
    "name": "Cerveza Artesanal",
    "description": "Cerveza local artesanal",
    "price": 55,
    "category": "Bebidas",
    "emoji": "",
    "image_url": "https://media.plantamus.com/category/cerveza-artesanal-1024x1024.jpg?width=520",
    "available": true
  },
  {
    "name": "Vino Tinto",
    "description": "Vino tinto de la casa",
    "price": 70,
    "category": "Bebidas",
    "emoji": "",
    "image_url": "https://descorcha.com/cdn/shop/articles/1738072462758.jpg?v=1765829602",
    "available": true
  },
  {
    "name": "Mojito Cubano",
    "description": "Cóctel refrescante de menta y ron",
    "price": 60,
    "category": "Bebidas",
    "emoji": "",
    "image_url": "https://i.blogs.es/36fff4/mojito/840_560.jpg",
    "available": true
  },
  {
    "name": "Piña Colada",
    "description": "Cóctel tropical de piña y coco",
    "price": 65,
    "category": "Bebidas",
    "emoji": "",
    "image_url": "https://lostragos.com/wp-content/uploads/2012/01/pina_colada_lostragos-1.jpg",
    "available": true
  },
  {
    "name": "Batido de Fresa",
    "description": "Batido cremoso de fresa",
    "price": 50,
    "category": "Bebidas",
    "emoji": "",
    "image_url": "https://enrilemoine.com/wp-content/uploads/2014/09/Batido-de-fresas-y-avena-SAVOIR-FAIRE-by-enrilemoine-scaled.webp",
    "available": true
  }
];

module.exports = menuItems;
