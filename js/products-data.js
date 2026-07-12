/* ========================================
   নূরুল ইলম শপ - Sample Product Data
   ⚠️ এটি placeholder ডেটা — আসল বই/পণ্যের তালিকা দিয়ে
      এই অ্যারে পরে replace করে দিন। প্রতিটি প্রোডাক্টের
      schema নিচের কমেন্টে দেওয়া আছে।
   ======================================== */

/*
  Product schema:
  {
    id:          string   (unique, e.g. 'bk001')
    name:        string   (পণ্যের নাম)
    author:      string   (ঐচ্ছিক — লেখক/প্রকাশনী, বই না হলে বাদ দিন)
    cat:         string   (book | quran | tasbih | jaynamaz | ator | miswak | food | dress | gift | herbal)
    price:       number   (বর্তমান মূল্য, টাকা)
    oldPrice:    number   (ঐচ্ছিক — আগের মূল্য, ছাড় দেখাতে)
    emoji:       string   (কার্ড থাম্বনেইলে দেখানো ইমোজি, ছবি না থাকলে)
    image:       string   (ঐচ্ছিক — আসল ছবির path, থাকলে emoji এর বদলে দেখাবে)
    badge:       string   (ঐচ্ছিক — 'নতুন' | 'সেল' | 'হট' | 'জনপ্রিয়')
    badgeType:   string   (new | sale | hot | popular)
    bestseller:  boolean
    sunnah:      boolean  (সুন্নাহ আইটেম সেকশনে দেখাবে কিনা)
    stock:       number   (available quantity)
    rating:      number   (0-5)
    reviews:     number   (রিভিউ সংখ্যা)
    description: string   (প্রোডাক্ট ডিটেইলস পেজে দেখানো বিবরণ)
  }
*/

const PRODUCTS = [
  {
    id: 'bk001',
    name: 'রিয়াদুস সালিহীন (১ম-৩য় খণ্ড)',
    author: 'ইমাম নববী রহ.',
    cat: 'book',
    price: 850,
    oldPrice: 1100,
    emoji: '📗',
    badge: 'সেল',
    badgeType: 'sale',
    bestseller: true,
    sunnah: false,
    stock: 24,
    rating: 4.8,
    reviews: 132,
    description: 'হাদিসের অন্যতম বিখ্যাত সংকলন। দৈনন্দিন জীবনের বিভিন্ন বিষয়ে রাসূলুল্লাহ ﷺ এর হাদিস অধ্যায়ভিত্তিক সাজানো।'
  },
  {
    id: 'bk002',
    name: 'তাফসীরে ইবনে কাসীর (সম্পূর্ণ সেট)',
    author: 'ইবনে কাসীর রহ.',
    cat: 'book',
    price: 4500,
    oldPrice: 5200,
    emoji: '📚',
    badge: 'হট',
    badgeType: 'hot',
    bestseller: true,
    sunnah: false,
    stock: 8,
    rating: 4.9,
    reviews: 87,
    description: 'বিশ্বনন্দিত তাফসীর গ্রন্থ। কুরআনের প্রতিটি আয়াতের বিস্তারিত ব্যাখ্যা ও সহীহ হাদিসের আলোকে বিশ্লেষণ।'
  },
  {
    id: 'bk003',
    name: 'জাদুল মাআদ',
    author: 'ইবনুল কাইয়্যিম রহ.',
    cat: 'book',
    price: 1200,
    emoji: '📘',
    bestseller: false,
    sunnah: false,
    stock: 15,
    rating: 4.7,
    reviews: 45,
    description: 'রাসূলুল্লাহ ﷺ এর জীবনী ও সীরাত নিয়ে একটি অনন্য গ্রন্থ।'
  },
  {
    id: 'bk004',
    name: 'মুসলিম উম্মাহর ইতিহাস',
    author: 'ড. আকরাম দিয়া উমারি',
    cat: 'book',
    price: 650,
    oldPrice: 800,
    emoji: '📙',
    badge: 'নতুন',
    badgeType: 'new',
    bestseller: false,
    sunnah: false,
    stock: 30,
    rating: 4.5,
    reviews: 21,
    description: 'ইসলামের ইতিহাস সহজ ও প্রাঞ্জল ভাষায় তুলে ধরা হয়েছে এই বইতে।'
  },
  {
    id: 'qr001',
    name: 'কুরআন শরীফ (বড় সাইজ, তাজবীদসহ)',
    author: null,
    cat: 'quran',
    price: 950,
    oldPrice: 1200,
    emoji: '📜',
    badge: 'জনপ্রিয়',
    badgeType: 'popular',
    bestseller: true,
    sunnah: true,
    stock: 40,
    rating: 4.9,
    reviews: 210,
    description: 'রঙিন তাজবীদ চিহ্নসহ সুন্দর বাঁধাইয়ে প্রিন্টেড কুরআন শরীফ।'
  },
  {
    id: 'qr002',
    name: 'কুরআন শরীফ - বাংলা অনুবাদসহ',
    author: null,
    cat: 'quran',
    price: 1100,
    emoji: '📖',
    bestseller: false,
    sunnah: true,
    stock: 22,
    rating: 4.8,
    reviews: 96,
    description: 'আরবি মূল টেক্সটের পাশাপাশি সহজবোধ্য বাংলা অনুবাদ সংযুক্ত।'
  },
  {
    id: 'qr003',
    name: 'মিনি কুরআন শরীফ (পকেট সাইজ)',
    author: null,
    cat: 'quran',
    price: 350,
    emoji: '📕',
    bestseller: false,
    sunnah: true,
    stock: 60,
    rating: 4.6,
    reviews: 34,
    description: 'ভ্রমণে সহজে বহনযোগ্য পকেট সাইজ কুরআন শরীফ।'
  },
  {
    id: 'ts001',
    name: 'কাঠের তাসবিহ (৯৯ দানা)',
    author: null,
    cat: 'tasbih',
    price: 250,
    oldPrice: 320,
    emoji: '📿',
    badge: 'সেল',
    badgeType: 'sale',
    bestseller: true,
    sunnah: true,
    stock: 55,
    rating: 4.7,
    reviews: 58,
    description: 'উন্নত মানের কাঠ দিয়ে তৈরি হাতে বানানো তাসবিহ।'
  },
  {
    id: 'ts002',
    name: 'ডিজিটাল তাসবিহ কাউন্টার',
    author: null,
    cat: 'tasbih',
    price: 180,
    emoji: '🔢',
    bestseller: false,
    sunnah: true,
    stock: 40,
    rating: 4.3,
    reviews: 19,
    description: 'জিকির গণনার জন্য ব্যাটারি চালিত ডিজিটাল কাউন্টার।'
  },
  {
    id: 'jn001',
    name: 'তুর্কি ডিজাইন জায়নামাজ',
    author: null,
    cat: 'jaynamaz',
    price: 550,
    oldPrice: 700,
    emoji: '🕌',
    badge: 'হট',
    badgeType: 'hot',
    bestseller: true,
    sunnah: true,
    stock: 33,
    rating: 4.8,
    reviews: 74,
    description: 'নরম ও আরামদায়ক কুশনযুক্ত তুর্কি ডিজাইনের জায়নামাজ।'
  },
  {
    id: 'jn002',
    name: 'ভ্রমণ জায়নামাজ (ভাঁজযোগ্য)',
    author: null,
    cat: 'jaynamaz',
    price: 380,
    emoji: '🧳',
    bestseller: false,
    sunnah: true,
    stock: 27,
    rating: 4.5,
    reviews: 22,
    description: 'হালকা ও সহজে ভাঁজ করা যায়, ব্যাগে বহন উপযোগী।'
  },
  {
    id: 'at001',
    name: 'উদ আতর (৬ মিলি)',
    author: null,
    cat: 'ator',
    price: 450,
    oldPrice: 600,
    emoji: '🧴',
    badge: 'সেল',
    badgeType: 'sale',
    bestseller: true,
    sunnah: true,
    stock: 20,
    rating: 4.6,
    reviews: 41,
    description: 'অ্যালকোহলমুক্ত খাঁটি উদ আতর, দীর্ঘস্থায়ী সুগন্ধ।'
  },
  {
    id: 'at002',
    name: 'মেশক আম্বর আতর (৩ মিলি)',
    author: null,
    cat: 'ator',
    price: 280,
    emoji: '🌸',
    bestseller: false,
    sunnah: true,
    stock: 35,
    rating: 4.4,
    reviews: 17,
    description: 'হালকা ও মিষ্টি সুবাসের অ্যালকোহলমুক্ত আতর।'
  },
  {
    id: 'ms001',
    name: 'প্রাকৃতিক মিসওয়াক (আরাক গাছ)',
    author: null,
    cat: 'miswak',
    price: 90,
    emoji: '🪥',
    bestseller: true,
    sunnah: true,
    stock: 100,
    rating: 4.5,
    reviews: 63,
    description: 'সুন্নত অনুযায়ী দাঁত পরিষ্কারের প্রাকৃতিক মিসওয়াক।'
  },
  {
    id: 'fd001',
    name: 'খাঁটি সুন্দরবন মধু (৫০০ গ্রাম)',
    author: null,
    cat: 'food',
    price: 700,
    oldPrice: 850,
    emoji: '🍯',
    badge: 'জনপ্রিয়',
    badgeType: 'popular',
    bestseller: true,
    sunnah: false,
    stock: 18,
    rating: 4.9,
    reviews: 102,
    description: '১০০% খাঁটি প্রাকৃতিক মধু, ল্যাব টেস্টেড।'
  },
  {
    id: 'fd002',
    name: 'কালোজিরা তেল (১০০ মিলি)',
    author: null,
    cat: 'food',
    price: 320,
    emoji: '🫙',
    bestseller: false,
    sunnah: false,
    stock: 25,
    rating: 4.6,
    reviews: 39,
    description: 'ঠান্ডা প্রক্রিয়ায় নিষ্কাশিত খাঁটি কালোজিরা তেল।'
  },
  {
    id: 'ds001',
    name: 'ছেলেদের পাঞ্জাবি (প্রিমিয়াম কটন)',
    author: null,
    cat: 'dress',
    price: 950,
    oldPrice: 1200,
    emoji: '🧥',
    badge: 'সেল',
    badgeType: 'sale',
    bestseller: false,
    sunnah: false,
    stock: 16,
    rating: 4.4,
    reviews: 28,
    description: 'আরামদায়ক প্রিমিয়াম কটন কাপড়ে তৈরি পাঞ্জাবি।'
  },
  {
    id: 'ds002',
    name: 'মেয়েদের হিজাব (ইনস্ট্যান্ট, ৩ পিস কম্বো)',
    author: null,
    cat: 'dress',
    price: 550,
    emoji: '🧕',
    bestseller: true,
    sunnah: false,
    stock: 42,
    rating: 4.5,
    reviews: 66,
    description: 'সহজে পরিধানযোগ্য উচ্চমানের কাপড়ের ইনস্ট্যান্ট হিজাব সেট।'
  },
  {
    id: 'gf001',
    name: 'ইসলামিক গিফট হ্যাম্পার (কম্বো)',
    author: null,
    cat: 'gift',
    price: 1500,
    oldPrice: 1800,
    emoji: '🎁',
    badge: 'নতুন',
    badgeType: 'new',
    bestseller: false,
    sunnah: false,
    stock: 12,
    rating: 4.7,
    reviews: 14,
    description: 'তাসবিহ, আতর ও ছোট বই সমন্বয়ে সাজানো সুন্দর গিফট প্যাক।'
  },
  {
    id: 'hb001',
    name: 'হারবাল কালোজিরা মধু মিশ্রণ',
    author: null,
    cat: 'herbal',
    price: 480,
    emoji: '🌿',
    bestseller: false,
    sunnah: false,
    stock: 20,
    rating: 4.3,
    reviews: 11,
    description: 'রোগ প্রতিরোধ ক্ষমতা বাড়াতে প্রাকৃতিক হারবাল মিশ্রণ।'
  }
];
