import express from "express";
import { getProductById } from "../../server/product-data";
import { generateOgImage } from "../../server/og-image";

const app = express();

app.get("*", async (req, res) => {
  try {
    const productId = req.query.productId as string;
    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const png = await generateOgImage(product);
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.send(png);
  } catch (error) {
    console.error("OG image generation error:", error);
    return res.status(500).json({ message: "Failed to generate image" });
  }
});

export default app;
