"use client";

import { useState } from "react";

type Cookie = {
  name: string;
  description: string;
  price: number;
  image: string;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  details?: string;
  itemCount?: number;
};

const cookies: Cookie[] = [
  {
    name: "Classic Cookie",
    description: "Soft, buttery and packed with chocolate chunks.",
    price: 6,
    image: "/images/classic.jpg",
  },
  {
    name: "M&M's Cookie",
    description:
      "Chewy cookie dough, colorful M&M's and chocolate in every bite.",
    price: 6,
    image: "/images/mms.jpg",
  },
  {
    name: "Birthday Cake Cookie",
    description:
      "Sprinkles, creamy white chocolate and birthday energy.",
    price: 6,
    image: "/images/birthday-cake.jpg",
  },
  {
    name: "Red Velvet Cookie",
    description:
      "Velvety cocoa cookie with creamy white chocolate chunks.",
    price: 7,
    image: "/images/red-velvet.jpg",
  },
  {
    name: "Double Chocolate",
    description:
      "Deep chocolate flavor with a soft, fudgy middle.",
    price: 7,
    image: "/images/choc.jpg",
  },
  {
    name: "Kinder Cookie",
    description:
      "A soft cookie loaded with Kinder chocolate.",
    price: 8,
    image: "/images/kinder.jpg",
  },
  {
    name: "Cinnamon Roll Cookie",
    description:
      "Cinnamon sugar, sweet drizzle and all the cozy notes.",
    price: 8,
    image: "/images/cinnamon-roll.jpg",
  },
];

const boxOptions = [
  {
    size: 4,
    group: 6,
    label: "4 Cookie Box",
    price: 24,
    description: "Classic, M&M's & Birthday Cake",
  },
  {
    size: 6,
    group: 6,
    label: "6 Cookie Box",
    price: 35,
    description: "Classic, M&M's & Birthday Cake",
  },
  {
    size: 10,
    group: 6,
    label: "10 Cookie Box",
    price: 50,
    description: "Classic, M&M's & Birthday Cake",
  },
  {
    size: 20,
    group: 6,
    label: "20 Cookie Box",
    price: 115,
    description: "Classic, M&M's & Birthday Cake",
  },
  {
    size: 4,
    group: 7,
    label: "4 Cookie Box",
    price: 25,
    description: "Red Velvet & Brownie-Style",
  },
  {
    size: 6,
    group: 7,
    label: "6 Cookie Box",
    price: 39,
    description: "Red Velvet & Brownie-Style",
  },
  {
    size: 10,
    group: 7,
    label: "10 Cookie Box",
    price: 65,
    description: "Red Velvet & Brownie-Style",
  },
  {
    size: 20,
    group: 7,
    label: "20 Cookie Box",
    price: 130,
    description: "Red Velvet & Brownie-Style",
  },
  {
    size: 4,
    group: 8,
    label: "4 Kinder Box",
    price: 30,
    description: "Kinder cookies",
  },
  {
    size: 6,
    group: 8,
    label: "6 Kinder Box",
    price: 45,
    description: "Kinder cookies",
  },
  {
    size: 10,
    group: 8,
    label: "10 Kinder Box",
    price: 70,
    description: "Kinder cookies",
  },
  {
    size: 20,
    group: 8,
    label: "20 Kinder Box",
    price: 145,
    description: "Kinder cookies",
  },
  {
    size: 4,
    group: 9,
    label: "4 Cinnamon Roll Box",
    price: 30,
    description: "Cinnamon Roll cookies",
  },
  {
    size: 6,
    group: 9,
    label: "6 Cinnamon Roll Box",
    price: 45,
    description: "Cinnamon Roll cookies",
  },
  {
    size: 10,
    group: 9,
    label: "10 Cinnamon Roll Box",
    price: 70,
    description: "Cinnamon Roll cookies",
  },
  {
    size: 20,
    group: 9,
    label: "20 Cinnamon Roll Box",
    price: 145,
    description: "Cinnamon Roll cookies",
  },
];

const gridStyle = {
  backgroundImage:
    "linear-gradient(#e8cfd0 1px, transparent 1px), linear-gradient(90deg, #e8cfd0 1px, transparent 1px)",
  backgroundSize: "26px 26px",
};

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [toast, setToast] = useState("");
  const [orderSent, setOrderSent] = useState(false);

  const [selectedBox, setSelectedBox] = useState<
    (typeof boxOptions)[number] | null
  >(null);

  const [boxQuantities, setBoxQuantities] = useState<
    Record<string, number>
  >({});

  const [orderDetails, setOrderDetails] = useState({
    name: "",
    phone: "",
    method: "Pickup",
    area: "Within Fujairah",
    date: "",
    location: "",
    notes: "",
  });

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  const addToCart = (cookie: Cookie) => {
    setCart((current) => {
      const id = `cookie-${cookie.name}`;
      const existing = current.find((item) => item.id === id);

      if (existing) {
        return current.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...current,
        {
          id,
          name: cookie.name,
          price: cookie.price,
          quantity: 1,
          itemCount: 1,
        },
      ];
    });

    showToast(`${cookie.name} added to your bag`);
  };

  const addExtraToCart = (
    id: string,
    name: string,
    price: number,
    itemCount: number
  ) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === id);

      if (existing) {
        return current.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...current,
        {
          id,
          name,
          price,
          quantity: 1,
          itemCount,
        },
      ];
    });

    showToast(`${name} added to your bag`);
  };

  const changeQuantity = (id: string, change: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const openBoxBuilder = (
    box: (typeof boxOptions)[number]
  ) => {
    setSelectedBox(box);

    const quantities: Record<string, number> = {};

    cookies
      .filter((cookie) =>
        box.group === 9
          ? cookie.name === "Cinnamon Roll Cookie"
          : cookie.price === box.group
      )
      .forEach((cookie) => {
        quantities[cookie.name] = 0;
      });

    setBoxQuantities(quantities);
  };

  const updateBoxQuantity = (
    cookieName: string,
    change: number
  ) => {
    if (!selectedBox) return;

    setBoxQuantities((current) => {
      const total = Object.values(current).reduce(
        (sum, value) => sum + value,
        0
      );

      const value = current[cookieName] || 0;

      if (change > 0 && total >= selectedBox.size) {
        return current;
      }

      if (change < 0 && value <= 0) {
        return current;
      }

      return {
        ...current,
        [cookieName]: value + change,
      };
    });
  };

  const boxTotal = Object.values(boxQuantities).reduce(
    (sum, value) => sum + value,
    0
  );

  const addBoxToCart = () => {
    if (!selectedBox || boxTotal !== selectedBox.size) return;

    const details = Object.entries(boxQuantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([name, quantity]) => `${name} × ${quantity}`)
      .join(", ");

    setCart((current) => [
      ...current,
      {
        id: `box-${Date.now()}`,
        name: selectedBox.label,
        price: selectedBox.price,
        quantity: 1,
        details,
        itemCount: selectedBox.size,
      },
    ]);

    showToast(`${selectedBox.label} added to your bag`);
    setSelectedBox(null);
  };

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalCookies = cart.reduce(
    (total, item) =>
      total + (item.itemCount ?? 1) * item.quantity,
    0
  );

  const cartSubtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const deliveryFee =
    orderDetails.method === "Delivery"
      ? orderDetails.area === "Outside Fujairah"
        ? 25
        : 10
      : 0;

  const cartTotal = cartSubtotal + deliveryFee;

  const orderDates = Array.from(
    { length: 30 },
    (_, index) => {
      const date = new Date(
        Date.now() +
          (index + 1) * 24 * 60 * 60 * 1000
      );

      return {
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }),
      };
    }
  );

  const placeOrder = () => {
    if (
      !orderDetails.name.trim() ||
      !orderDetails.phone.trim() ||
      !orderDetails.date ||
      (orderDetails.method === "Delivery" &&
        !orderDetails.location.trim()) ||
      totalCookies < 4
    ) {
      return;
    }

    const orderLines = cart
      .map(
        (item) =>
          `- ${item.name} x${item.quantity} — AED ${
            item.price * item.quantity
          }${
            item.details
              ? ` (${item.details})`
              : ""
          }`
      )
      .join("\n");

    const message = `Hi Cookie Corner! I'd like to place an order.

Name: ${orderDetails.name}

Phone: ${orderDetails.phone}

${orderDetails.method}: ${orderDetails.date}${
      orderDetails.method === "Delivery"
        ? `\nArea: ${orderDetails.area}\nLocation: ${orderDetails.location}`
        : ""
    }

Order:

${orderLines}

Subtotal: AED ${cartSubtotal}

Delivery fee: AED ${deliveryFee}

Total: AED ${cartTotal}

Notes: ${orderDetails.notes || "None"}`;

    const whatsappUrl = `https://wa.me/971507576175?text=${encodeURIComponent(
      message
    )}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );

    setShowCart(false);
    setOrderSent(true);
  };

  return (
    <main
      className="min-h-screen overflow-hidden bg-[#fffaf7] text-[#332321] selection:bg-[#f5b8c9] selection:text-[#332321]"
    >
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
        }}
      />

      {/* NAVIGATION */}
      <nav className="sticky top-0 z-40 border-b border-[#dec3c2] bg-[#fffaf7]/90 px-3 py-3 backdrop-blur-sm md:px-12 md:py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <a
            href="#home"
            className="group flex min-w-0 flex-1 items-center gap-2 pr-3"
          >
            <img
              src="/images/logo.png"
              alt="Cookie Corner"
              className="h-10 w-10 shrink-0 object-contain transition group-hover:scale-105 md:h-14 md:w-14"
            />

            <span className="truncate font-serif text-lg font-bold tracking-[-0.06em] md:text-2xl">
              cookie corner
            </span>
          </a>

          <div className="hidden items-center justify-center gap-8 text-[11px] font-bold uppercase tracking-[0.18em] md:flex">
            <a
              href="#menu"
              className="transition hover:text-[#d65f83]"
            >
              Menu
            </a>

            <a
              href="#boxes"
              className="transition hover:text-[#d65f83]"
            >
              Boxes
            </a>

            <a
              href="#about"
              className="transition hover:text-[#d65f83]"
            >
              Our story
            </a>

            <a
              href="#contact"
              className="transition hover:text-[#d65f83]"
            >
              Contact
            </a>
          </div>

          <button
            type="button"
            onClick={() => setShowCart(true)}
            className="shrink-0 rounded-full border-2 border-[#c77d91] bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.05em] text-[#a95d73] shadow-none transition hover:-translate-y-0.5 md:px-4 md:text-xs md:tracking-[0.12em]"
          >
            Bag ({totalItems})
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section
        id="home"
        className="relative border-b border-[#efd7dc] bg-[#fff0f3] px-5 py-14 md:px-12 md:py-24"
        style={gridStyle}
      >
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-12">
          <div className="relative z-10">
            <span className="inline-block rotate-[-3deg] border-2 border-[#332321] bg-[#fffaf7] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] shadow-[3px_3px_0_#332321]">
              small batch bakery
            </span>

            <h1 className="mt-6 max-w-xl font-serif text-6xl font-black leading-[0.87] tracking-[-0.07em] md:text-8xl">
              soft cookies.
              <br />
              <span className="text-[#d9567c]">
                big feelings.
              </span>
            </h1>

            <p className="mt-7 max-w-[600px] text-lg leading-7 text-[#5d4039]">
              Chunky, gooey, freshly baked treats made for
              birthdays, bad days, and{" "}
              <span className="md:whitespace-nowrap">
                everything worth celebrating.
              </span>
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#menu"
                className="rounded-full border-0 bg-[#bd7186] px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-md transition hover:-translate-y-1"
              >
                Shop cookies
              </a>

              <a
                href="#boxes"
                className="rounded-full border-2 border-[#d9a2b0] bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[#9f6073] shadow-none transition hover:-translate-y-1"
              >
                Build a box
              </a>
            </div>
          </div>

          <div className="relative mx-auto mt-6 min-h-[360px] w-full max-w-[460px] md:mt-0 md:min-h-[490px]">
            <span className="absolute right-0 top-0 z-20 rotate-[8deg] font-serif text-3xl italic text-[#d9567c] md:right-4">
              baked with love
            </span>

            <div className="absolute left-1/2 top-12 aspect-square w-[82%] max-w-[390px] -translate-x-1/2 rotate-[-7deg] rounded-[2.25rem] border-8 border-white bg-[#f8d9df] p-3 shadow-md md:top-14 md:w-[88%] md:max-w-[420px]">
              <img
                src="/images/classic.jpg"
                alt="Fresh chocolate chip cookie"
                className="h-full w-full rounded-[1.5rem] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section
        id="menu"
        className="px-5 py-20 md:px-12 md:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="font-serif text-2xl italic text-[#d9567c]">
              the good stuff
            </p>

            <h2 className="mt-1 font-serif text-5xl font-black tracking-[-0.06em] md:text-7xl">
              pick your cookie.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-[#765852]">
              All cookies are baked fresh. Minimum
              order is 4 cookies. Mix and match your
              favorites.
            </p>
          </div>

          <div className="grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {cookies.map((cookie, index) => (
              <CookieCard
                key={cookie.name}
                cookie={cookie}
                index={index}
                addToCart={addToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* BOXES */}
      <section
        id="boxes"
        className="relative overflow-hidden border-y border-[#efd2d9] bg-[#fff0f3] px-5 py-20 md:px-12 md:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <span className="inline-block rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#bd7186] shadow-sm">
              giftable happiness
            </span>

            <h2 className="mt-5 font-serif text-6xl font-black leading-[0.88] tracking-[-0.07em] text-[#563b35]">
              build your box.
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-[#5d4039]">
              Choose a size, pick your flavors, and make
              a box that looks as good as it tastes.
            </p>
          </div>

          <div className="mx-auto max-w-5xl space-y-10">
            {[6, 7, 8, 9].map(
              (group, groupIndex) => (
                <BoxGroup
                  key={group}
                  title={
                    group === 9
                      ? "Cinnamon Roll"
                      : group === 8
                      ? "Kinder club"
                      : group === 7
                      ? "Chocolate hour"
                      : "The classics"
                  }
                  subtitle={
                    boxOptions.find(
                      (box) => box.group === group
                    )?.description || ""
                  }
                  boxes={boxOptions.filter(
                    (box) => box.group === group
                  )}
                  onSelect={openBoxBuilder}
                  accent={groupIndex}
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* SOMETHING EXTRA */}
      <section className="border-b border-[#efd7dc] bg-[#f7e8e4] px-5 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="font-serif text-2xl italic text-[#bd7186]">
              something extra
            </p>

            <h2 className="mt-2 font-serif text-5xl font-black tracking-[-0.06em] text-[#563b35] md:text-6xl">
              sweet little extras.
            </h2>
          </div>

          {/* BROWNIES */}
          <div className="mb-10 grid overflow-hidden rounded-[2rem] border border-[#ead2ce] bg-[#fffaf7] shadow-sm md:grid-cols-2">
            <div className="relative min-h-[320px] overflow-hidden bg-[#e9d1c8] md:min-h-[430px]">
              <img
                src="/images/brownie.jpg"
                alt="Brownies"
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
              />
            </div>

            <div className="flex flex-col justify-center p-7 md:p-10">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#bd7186]">
                made for sharing
              </p>

              <h3 className="mt-2 font-serif text-4xl font-black tracking-[-0.05em] text-[#563b35] md:text-5xl">
                Brownies
              </h3>

              <p className="mt-4 max-w-md leading-7 text-[#765852]">
                Rich, fudgy brownies baked fresh and cut
                into 20 generous pieces. Perfect for sharing,
                gifting, or keeping all to yourself.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="rounded-full bg-[#f8dce3] px-5 py-2 text-sm font-black text-[#a45d72]">
                  20 pieces · AED 100
                </span>

                <button
                  type="button"
                  onClick={() =>
                    addExtraToCart(
                      "brownies",
                      "Brownies",
                      100,
                      20
                    )
                  }
                  className="rounded-full bg-[#bd7186] px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#a96075]"
                >
                  Add to bag +
                </button>
              </div>
            </div>
          </div>

          {/* MINI PRODUCTS */}
          <div className="grid gap-7 md:grid-cols-2">

            {/* MINI BROWNIE BITES */}
            <article className="overflow-hidden rounded-[2rem] border border-[#ead2ce] bg-[#fffaf7] shadow-sm transition hover:-translate-y-1">
              <div className="aspect-square overflow-hidden bg-[#e9d1c8]">
                <img
                  src="/images/brownie-bites.jpg"
                  alt="Mini Brownie Bites"
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>

              <div className="p-6 text-center">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#bd7186]">
                  little bites
                </p>

                <h3 className="mt-2 font-serif text-3xl font-black text-[#563b35]">
                  Mini Brownie Bites
                </h3>

                <p className="mt-2 text-sm text-[#765852]">
                  Small, fudgy brownie bites made for sharing.
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <span className="rounded-full bg-[#f8dce3] px-4 py-2 text-xs font-black text-[#a45d72]">
                    15 pieces · AED 25
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      addExtraToCart(
                        "mini-brownie-bites",
                        "Mini Brownie Bites",
                        25,
                        15
                      )
                    }
                    className="rounded-full bg-[#bd7186] px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#a96075]"
                  >
                    Add to bag +
                  </button>
                </div>
              </div>
            </article>

            {/* MINI COOKIES */}
            <article className="overflow-hidden rounded-[2rem] border border-[#ead2ce] bg-[#fffaf7] shadow-sm transition hover:-translate-y-1">
              <div className="aspect-square overflow-hidden bg-[#f7d9dd]">
                <img
                  src="/images/mini-cookies.jpg"
                  alt="Mini Cookies"
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>

              <div className="p-6 text-center">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#bd7186]">
                  tiny & cute
                </p>

                <h3 className="mt-2 font-serif text-3xl font-black text-[#563b35]">
                  Mini Cookies
                </h3>

                <p className="mt-2 text-sm text-[#765852]">
                  Bite-sized cookies made for snacking and sharing.
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <span className="rounded-full bg-[#f8dce3] px-4 py-2 text-xs font-black text-[#a45d72]">
                    15 pieces · AED 30
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      addExtraToCart(
                        "mini-cookies",
                        "Mini Cookies",
                        30,
                        15
                      )
                    }
                    className="rounded-full bg-[#bd7186] px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#a96075]"
                  >
                    Add to bag +
                  </button>
                </div>
              </div>
            </article>

          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        className="relative px-5 py-20 md:px-12 md:py-24"
        style={gridStyle}
      >
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:items-center">
          <div className="relative mx-auto max-w-md">
            <div className="rotate-[-5deg] rounded-[2rem] border-8 border-white bg-white shadow-md">
              <img
                src="/images/choc.jpg"
                alt="Chocolate brownie cookie"
                className="aspect-square w-full object-cover"
              />
            </div>

            <span className="absolute -bottom-7 -right-4 rotate-[8deg] rounded-full bg-white px-4 py-2 font-serif text-2xl font-bold shadow-sm">
              so fudgy!
            </span>
          </div>

          <div id="about">
            <p className="font-serif text-2xl italic text-[#d9567c]">
              a little about us
            </p>

            <h2 className="mt-2 font-serif text-5xl font-black leading-[0.92] tracking-[-0.06em] md:text-6xl">
              made for
              <br />
              <span className="text-[#d9567c]">
                sweet moments.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-lg leading-8 text-[#5d4039]">
              Cookie Corner is a small home business
              made for cookie lovers. We bake soft,
              generous treats to brighten your day,
              satisfy your sweet tooth, and give you one
              more reason to look forward to something
              sweet.
            </p>

            <p className="mt-7 text-sm font-bold uppercase tracking-[0.16em] text-[#bd7186]">
              fresh daily · small batches · lots of love
            </p>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="border-y border-[#efd7dc] bg-[#fff5f6] px-5 py-16 md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-serif text-2xl italic text-[#d9567c]">
            things people say
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <Quote
              text="The cookies disappeared before the party even started."
              name="Shahad"
            />

            <Quote
              text="Soft in the middle, crispy at the edges. Perfect."
              name="Razan"
            />

            <Quote
              text="The cutest box and the most delicious brownies."
              name="Baraa"
            />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="bg-[#fff0f3] px-5 py-20 text-[#563b35] md:px-12 md:py-24"
      >
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="font-serif text-2xl italic text-[#d56f8c]">
              come say hi
            </p>

            <h2 className="mt-2 max-w-lg font-serif text-6xl font-black leading-[0.9] tracking-[-0.07em]">
              let’s make
              <br />
              your day
              <br />
              <span className="text-[#d56f8c]">
                sweeter.
              </span>
            </h2>
          </div>

          <div className="flex flex-col items-start gap-4 text-sm font-bold">
            <p className="max-w-xs leading-6 text-[#765852]">
              Questions, custom orders, or just want to
              look at cookie pictures?
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://instagram.com/cookiecorner.fuj"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-[#e2b2bd] bg-white px-5 py-3 text-[#a45d72] transition hover:bg-[#fff0f3]"
              >
                Instagram ↗
              </a>

              <a
                href="https://www.tiktok.com/@cookiecorner.fuj"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-[#e2b2bd] bg-white px-5 py-3 text-[#a45d72] transition hover:bg-[#fff0f3]"
              >
                TikTok ↗
              </a>

              <a
                href="https://wa.me/971507576175"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-[#e2b2bd] bg-white px-5 py-3 text-[#a45d72] transition hover:bg-[#fff0f3]"
              >
                WhatsApp ↗
              </a>
            </div>

            <p className="text-[#d56f8c]">
              @cookiecorner.fuj
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#efd7dc] bg-[#fffaf7] px-5 py-7 text-center text-xs font-bold uppercase tracking-[0.16em] text-[#332321]">
        <p className="font-serif text-2xl normal-case tracking-normal">
          cookie corner
        </p>

        <p className="mt-2">
          baked fresh. made with love. © 2026
        </p>
      </footer>

      {/* TOAST */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-[#563b35] px-5 py-3 text-center text-sm font-bold text-white shadow-lg"
        >
          {toast}
        </div>
      )}

      {/* ORDER SENT */}
      {orderSent && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#4b302d]/30 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-[#efd7dc] bg-[#fffaf7] p-8 text-center shadow-2xl">
            <p className="text-4xl">♡</p>

            <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-[#bd7186]">
              thank you
            </p>

            <h2 className="mt-2 font-serif text-4xl font-black text-[#563b35]">
              your order is on its way to us.
            </h2>

            <p className="mt-4 leading-7 text-[#765852]">
              WhatsApp has opened with your order details.
              Send the message there, then come back here
              — we’ll start preparing your treats once we
              receive it.
            </p>

            <button
              type="button"
              onClick={() => setOrderSent(false)}
              className="mt-7 rounded-full bg-[#bd7186] px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white"
            >
              Back to Cookie Corner
            </button>
          </div>
        </div>
      )}

      {/* BOX MODAL */}
      {selectedBox ? (
        <BoxModal
          selectedBox={selectedBox}
          boxQuantities={boxQuantities}
          boxTotal={boxTotal}
          updateBoxQuantity={updateBoxQuantity}
          addBoxToCart={addBoxToCart}
          close={() => setSelectedBox(null)}
        />
      ) : null}

      {/* CART */}
      {showCart && (
        <CartDrawer
          cart={cart}
          cartTotal={cartTotal}
          totalItems={totalItems}
          totalCookies={totalCookies}
          cartSubtotal={cartSubtotal}
          deliveryFee={deliveryFee}
          orderDates={orderDates}
          changeQuantity={changeQuantity}
          orderDetails={orderDetails}
          setOrderDetails={setOrderDetails}
          placeOrder={placeOrder}
          close={() => setShowCart(false)}
        />
      )}
    </main>
  );
}

function CookieCard({
  cookie,
  index,
  addToCart,
}: {
  cookie: Cookie;
  index: number;
  addToCart: (cookie: Cookie) => void;
}) {
  return (
    <article className="group">
      <div className="relative rounded-none border-0 border-b border-[#efd7dc] bg-transparent p-0 pb-7 transition duration-300 group-hover:-translate-y-1">
        <div className="relative mx-auto aspect-square w-[88%] overflow-hidden rounded-full bg-[#f7d9dd]">
          <img
            src={cookie.image}
            alt={cookie.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em]">
            AED {cookie.price}
          </span>
        </div>

        <div className="px-2 pb-1 pt-5 text-center">
          <h3 className="font-serif text-2xl font-black leading-none">
            {cookie.name}
          </h3>

          <p className="mt-3 min-h-[48px] text-sm leading-6 text-[#765852]">
            {cookie.description}
          </p>

          <button
            type="button"
            onClick={() => addToCart(cookie)}
            className="mx-auto mt-4 block rounded-full bg-[#bd7186] px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#a96075]"
          >
            Add to bag +
          </button>
        </div>
      </div>
    </article>
  );
}

function BoxGroup({
  title,
  subtitle,
  boxes,
  onSelect,
  accent,
}: {
  title: string;
  subtitle: string;
  boxes: typeof boxOptions;
  onSelect: (box: (typeof boxOptions)[number]) => void;
  accent: number;
}) {
  return (
    <div>
      <div className="mb-4 flex items-end justify-between border-b-2 border-[#332321] pb-3">
        <div>
          <h3 className="font-serif text-3xl font-black">
            {title}
          </h3>

          <p className="mt-1 text-sm text-[#5d4039]">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {boxes.map((box) => (
          <button
            type="button"
            key={`${box.group}-${box.size}`}
            onClick={() => onSelect(box)}
            className="rounded-2xl border border-[#efd7dc] bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#d9a2b0]"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-serif text-xl font-bold leading-none">
                {box.group === 9
                  ? "Cinnamon Roll Box"
                  : box.group === 8
                  ? "Kinder Box"
                  : box.group === 7
                  ? "Chocolate Box"
                  : "Cookie Box"}
              </span>

              <span className="text-sm font-black">
                AED {box.price}
              </span>
            </div>

            <p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-[#bd7186]">
              {box.size} cookies
            </p>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.1em] underline underline-offset-4">
              Choose flavors →
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function Quote({
  text,
  name,
}: {
  text: string;
  name: string;
}) {
  return (
    <div className="rotate-[-1deg] rounded-2xl border border-[#efd7dc] bg-white p-5 text-left shadow-sm">
      <p className="font-serif text-xl font-bold leading-6">
        “{text}”
      </p>

      <p className="mt-4 text-xs font-black uppercase tracking-[0.15em] text-[#d9567c]">
        — {name}
      </p>
    </div>
  );
}

function BoxModal({
  selectedBox,
  boxQuantities,
  boxTotal,
  updateBoxQuantity,
  addBoxToCart,
  close,
}: {
  selectedBox: (typeof boxOptions)[number];
  boxQuantities: Record<string, number>;
  boxTotal: number;
  updateBoxQuantity: (
    name: string,
    change: number
  ) => void;
  addBoxToCart: () => void;
  close: () => void;
}) {
  const availableCookies = cookies.filter(
    (cookie) =>
      selectedBox.group === 9
        ? cookie.name === "Cinnamon Roll Cookie"
        : cookie.price === selectedBox.group
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#4b302d]/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[2rem] border-4 border-[#f2cbd4] bg-[#fffaf7] p-5 shadow-2xl md:p-8">
        <div className="flex justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d9567c]">
              build your box
            </p>

            <h2 className="mt-2 font-serif text-4xl font-black">
              {selectedBox.label}
            </h2>

            <p className="mt-1 text-sm text-[#765852]">
              Choose exactly {selectedBox.size} cookies.
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            className="h-9 w-9 border-2 border-[#332321] text-xl font-black"
          >
            ×
          </button>
        </div>

        <div className="mt-7 space-y-3">
          {availableCookies.map((cookie) => (
            <div
              key={cookie.name}
              className="flex items-center justify-between border-2 border-[#dec3c2] bg-white p-3"
            >
              <div>
                <p className="font-serif text-xl font-bold">
                  {cookie.name}
                </p>

                <p className="text-xs text-[#765852]">
                  AED {cookie.price} individually
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateBoxQuantity(cookie.name, -1)
                  }
                  className="h-8 w-8 rounded-full bg-[#f8dce3] font-bold text-[#8e5265]"
                >
                  −
                </button>

                <span className="w-4 text-center font-black">
                  {boxQuantities[cookie.name] || 0}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    updateBoxQuantity(cookie.name, 1)
                  }
                  className="h-8 w-8 rounded-full bg-[#f8dce3] font-bold text-[#8e5265]"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-2 border-[#332321] bg-[#f7e8e4] p-4">
          <span className="font-black uppercase tracking-[0.12em]">
            {boxTotal} / {selectedBox.size} selected
          </span>

          <span className="font-serif text-2xl font-black">
            AED {selectedBox.price}
          </span>
        </div>

        <button
          type="button"
          onClick={addBoxToCart}
          disabled={boxTotal !== selectedBox.size}
          className="mx-auto mt-4 block rounded-full bg-[#bd7186] px-5 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {boxTotal === selectedBox.size
            ? `Add box · AED ${selectedBox.price}`
            : `Choose ${
                selectedBox.size - boxTotal
              } more`}
        </button>
      </div>
    </div>
  );
}

function CartDrawer({
  cart,
  cartTotal,
  cartSubtotal,
  deliveryFee,
  orderDates,
  totalItems,
  totalCookies,
  changeQuantity,
  orderDetails,
  setOrderDetails,
  placeOrder,
  close,
}: {
  cart: CartItem[];
  cartTotal: number;
  cartSubtotal: number;
  deliveryFee: number;
  orderDates: {
    value: string;
    label: string;
  }[];
  totalItems: number;
  totalCookies: number;
  changeQuantity: (
    id: string,
    change: number
  ) => void;
  orderDetails: {
    name: string;
    phone: string;
    method: string;
    area: string;
    date: string;
    location: string;
    notes: string;
  };
  setOrderDetails: (details: {
    name: string;
    phone: string;
    method: string;
    area: string;
    date: string;
    location: string;
    notes: string;
  }) => void;
  placeOrder: () => void;
  close: () => void;
}) {
  const updateDetails = (
    field: string,
    value: string
  ) => {
    setOrderDetails({
      ...orderDetails,
      [field]: value,
    });
  };

  const readyToOrder =
    totalCookies >= 4 &&
    orderDetails.name.trim() !== "" &&
    orderDetails.phone.trim() !== "" &&
    orderDetails.date !== "" &&
    (orderDetails.method !== "Delivery" ||
      orderDetails.location.trim() !== "");

  return (
    <div className="fixed inset-0 z-[80] flex justify-end bg-[#4b302d]/30 backdrop-blur-sm">
      <div className="h-full w-full max-w-xl overflow-y-auto bg-[#fffaf7] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#efd7dc] bg-[#fffaf7]/95 px-5 py-5 backdrop-blur-sm">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#bd7186]">
              your bag
            </p>

            <h2 className="mt-1 font-serif text-3xl font-black">
              {totalCookies}{" "}
              {totalCookies === 1
                ? "cookie"
                : "cookies"}
            </h2>

            {totalItems !== totalCookies && (
              <p className="mt-1 text-xs text-[#765852]">
                {totalItems} bag item
                {totalItems === 1 ? "" : "s"}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={close}
            className="h-10 w-10 rounded-full border-2 border-[#332321] text-xl font-black"
          >
            ×
          </button>
        </div>

        <div className="p-5 md:p-7">
          {cart.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-5xl">🍪</p>

              <h3 className="mt-5 font-serif text-3xl font-black">
                Your bag is empty
              </h3>

              <p className="mt-3 text-sm text-[#765852]">
                Add some cookies and they’ll show up
                here.
              </p>

              <button
                type="button"
                onClick={close}
                className="mt-7 rounded-full bg-[#bd7186] px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white"
              >
                Back to menu
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="border-2 border-[#efd7dc] bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-xl font-black">
                          {item.name}
                        </h3>

                        {item.details && (
                          <p className="mt-1 text-xs leading-5 text-[#765852]">
                            {item.details}
                          </p>
                        )}

                        <p className="mt-2 text-sm font-bold text-[#bd7186]">
                          AED {item.price}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            changeQuantity(
                              item.id,
                              -1
                            )
                          }
                          className="h-8 w-8 rounded-full bg-[#f8dce3] font-bold text-[#8e5265]"
                        >
                          −
                        </button>

                        <span className="w-6 text-center font-black">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            changeQuantity(
                              item.id,
                              1
                            )
                          }
                          className="h-8 w-8 rounded-full bg-[#f8dce3] font-bold text-[#8e5265]"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 border-t border-[#efd7dc] pt-3 text-right text-sm font-black">
                      AED{" "}
                      {item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {totalCookies < 4 && (
                <div className="mt-5 rounded-2xl bg-[#fff0f3] p-4 text-sm font-bold text-[#a45d72]">
                  Minimum order is 4 cookies. Add{" "}
                  {4 - totalCookies} more to continue.
                </div>
              )}

              <div className="mt-8 border-y-2 border-[#332321] py-5">
                <h3 className="font-serif text-2xl font-black">
                  Order details
                </h3>

                <div className="mt-5 space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em]">
                      Name
                    </label>

                    <input
                      type="text"
                      value={orderDetails.name}
                      onChange={(e) =>
                        updateDetails(
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="Your name"
                      className="w-full rounded-xl border-2 border-[#dec3c2] bg-white px-4 py-3 text-sm outline-none focus:border-[#bd7186]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em]">
                      Phone
                    </label>

                    <input
                      type="tel"
                      value={orderDetails.phone}
                      onChange={(e) =>
                        updateDetails(
                          "phone",
                          e.target.value
                        )
                      }
                      placeholder="05XXXXXXXX"
                      className="w-full rounded-xl border-2 border-[#dec3c2] bg-white px-4 py-3 text-sm outline-none focus:border-[#bd7186]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em]">
                      Order type
                    </label>

                    <select
                      value={orderDetails.method}
                      onChange={(e) =>
                        updateDetails(
                          "method",
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border-2 border-[#dec3c2] bg-white px-4 py-3 text-sm outline-none focus:border-[#bd7186]"
                    >
                      <option value="Pickup">
                        Pickup
                      </option>

                      <option value="Delivery">
                        Delivery
                      </option>
                    </select>
                  </div>

                  {orderDetails.method ===
                    "Delivery" && (
                    <>
                      <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em]">
                          Area
                        </label>

                        <select
                          value={orderDetails.area}
                          onChange={(e) =>
                            updateDetails(
                              "area",
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border-2 border-[#dec3c2] bg-white px-4 py-3 text-sm outline-none focus:border-[#bd7186]"
                        >
                          <option value="Within Fujairah">
                            Within Fujairah — AED 10
                          </option>

                          <option value="Outside Fujairah">
                            Outside Fujairah — AED 25
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em]">
                          Location
                        </label>

                        <input
                          type="text"
                          value={
                            orderDetails.location
                          }
                          onChange={(e) =>
                            updateDetails(
                              "location",
                              e.target.value
                            )
                          }
                          placeholder="Area / location"
                          className="w-full rounded-xl border-2 border-[#dec3c2] bg-white px-4 py-3 text-sm outline-none focus:border-[#bd7186]"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em]">
                      Order date
                    </label>

                    <select
                      value={orderDetails.date}
                      onChange={(e) =>
                        updateDetails(
                          "date",
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border-2 border-[#dec3c2] bg-white px-4 py-3 text-sm outline-none focus:border-[#bd7186]"
                    >
                      <option value="">
                        Select a date
                      </option>

                      {orderDates.map((date) => (
                        <option
                          key={date.value}
                          value={date.value}
                        >
                          {date.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em]">
                      Notes
                    </label>

                    <textarea
                      value={orderDetails.notes}
                      onChange={(e) =>
                        updateDetails(
                          "notes",
                          e.target.value
                        )
                      }
                      placeholder="Any special requests?"
                      rows={3}
                      className="w-full resize-none rounded-xl border-2 border-[#dec3c2] bg-white px-4 py-3 text-sm outline-none focus:border-[#bd7186]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#765852]">
                    Subtotal
                  </span>

                  <span className="font-bold">
                    AED {cartSubtotal}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#765852]">
                    Delivery fee
                  </span>

                  <span className="font-bold">
                    AED {deliveryFee}
                  </span>
                </div>

                <div className="flex justify-between border-t-2 border-[#332321] pt-4 text-lg">
                  <span className="font-serif font-black">
                    Total
                  </span>

                  <span className="font-black">
                    AED {cartTotal}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={placeOrder}
                disabled={!readyToOrder}
                className="mt-6 w-full rounded-full bg-[#bd7186] px-5 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#a96075] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Send order on WhatsApp
              </button>

              {!readyToOrder &&
                totalCookies >= 4 && (
                  <p className="mt-3 text-center text-xs font-bold text-[#a45d72]">
                    Please complete your order
                    details above.
                  </p>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}