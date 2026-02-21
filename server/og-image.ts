import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

let fontBoldData: ArrayBuffer | null = null;
let fontRegularData: ArrayBuffer | null = null;

async function loadFont(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`Failed to fetch font: ${res.status}`);
  return res.arrayBuffer();
}

async function loadFontBold(): Promise<ArrayBuffer> {
  if (fontBoldData) return fontBoldData;
  fontBoldData = await loadFont(
    "https://github.com/google/fonts/raw/main/ofl/mplusrounded1c/MPLUSRounded1c-Bold.ttf"
  );
  return fontBoldData;
}

async function loadFontRegular(): Promise<ArrayBuffer> {
  if (fontRegularData) return fontRegularData;
  fontRegularData = await loadFont(
    "https://github.com/google/fonts/raw/main/ofl/mplusrounded1c/MPLUSRounded1c-Regular.ttf"
  );
  return fontRegularData;
}

interface ProductInfo {
  name: string;
  price: number;
  originalPrice: number;
  category: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  description: string;
}

export async function generateOgImage(product: ProductInfo): Promise<Buffer> {
  const [boldFont, regularFont] = await Promise.all([
    loadFontBold(),
    loadFontRegular(),
  ]);

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const stars = "★".repeat(Math.floor(product.rating)) + (product.rating % 1 >= 0.5 ? "☆" : "");

  const element = {
    type: "div",
    props: {
      style: {
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#131921",
        padding: "0",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              padding: "24px 40px",
              borderBottom: "2px solid #232f3e",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "36px",
                    fontWeight: 700,
                    color: "#f59e0b",
                    fontFamily: "NotoSansBold",
                  },
                  children: "カウカウ",
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "14px",
                    color: "#9ca3af",
                    marginLeft: "8px",
                    marginTop: "12px",
                  },
                  children: ".fake",
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flex: 1,
              padding: "40px",
              gap: "40px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "280px",
                    height: "280px",
                    backgroundColor: "#1e293b",
                    borderRadius: "16px",
                    flexShrink: 0,
                  },
                  children: {
                    type: "div",
                    props: {
                      style: {
                        fontSize: "100px",
                      },
                      children: "📦",
                    },
                  },
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    gap: "12px",
                    justifyContent: "center",
                  },
                  children: [
                    product.badge
                      ? {
                          type: "div",
                          props: {
                            style: {
                              display: "flex",
                            },
                            children: {
                              type: "div",
                              props: {
                                style: {
                                  backgroundColor: "#f59e0b",
                                  color: "#000",
                                  padding: "4px 16px",
                                  borderRadius: "6px",
                                  fontSize: "18px",
                                  fontWeight: 700,
                                  fontFamily: "NotoSansBold",
                                },
                                children: product.badge,
                              },
                            },
                          },
                        }
                      : null,
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "32px",
                          fontWeight: 700,
                          color: "#ffffff",
                          lineHeight: 1.3,
                          fontFamily: "NotoSansBold",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        },
                        children: product.name,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        },
                        children: [
                          {
                            type: "div",
                            props: {
                              style: {
                                fontSize: "24px",
                                color: "#f59e0b",
                              },
                              children: stars,
                            },
                          },
                          {
                            type: "div",
                            props: {
                              style: {
                                fontSize: "20px",
                                color: "#9ca3af",
                                fontFamily: "NotoSans",
                              },
                              children: `${product.rating} (${product.reviewCount.toLocaleString()}件)`,
                            },
                          },
                        ],
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          alignItems: "baseline",
                          gap: "16px",
                          marginTop: "8px",
                        },
                        children: [
                          {
                            type: "div",
                            props: {
                              style: {
                                fontSize: "48px",
                                fontWeight: 700,
                                color: "#ffffff",
                                fontFamily: "NotoSansBold",
                              },
                              children: `¥${product.price.toLocaleString()}`,
                            },
                          },
                          {
                            type: "div",
                            props: {
                              style: {
                                fontSize: "24px",
                                color: "#ef4444",
                                fontWeight: 700,
                                fontFamily: "NotoSansBold",
                              },
                              children: `-${discount}% OFF`,
                            },
                          },
                        ],
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "18px",
                          color: "#6b7280",
                          textDecoration: "line-through",
                          fontFamily: "NotoSans",
                        },
                        children: `参考価格: ¥${product.originalPrice.toLocaleString()}`,
                      },
                    },
                  ].filter(Boolean),
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 40px",
              borderTop: "2px solid #232f3e",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "16px",
                    color: "#9ca3af",
                    fontFamily: "NotoSans",
                  },
                  children: `カテゴリ: ${product.category}`,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "14px",
                    color: "#6b7280",
                    fontFamily: "NotoSans",
                  },
                  children: "※架空の商品です",
                },
              },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(element as any, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "NotoSansBold",
        data: boldFont,
        weight: 700,
        style: "normal",
      },
      {
        name: "NotoSans",
        data: regularFont,
        weight: 400,
        style: "normal",
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });

  return resvg.render().asPng();
}
