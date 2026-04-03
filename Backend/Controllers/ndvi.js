const { fetchNDVI } = require("../service/sentinalService");

const getNDVIImage = async (req, res) => {
  try {
    const { bbox } = req.body;

    if (!bbox) {
      return res.status(400).json({ error: "bbox required" });
    }

    const imageBuffer = await fetchNDVI(bbox);

    res.set("Content-Type", "image/png");
    return res.send(imageBuffer);
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({
      error: error.message || "NDVI fetch failed",
    });
  }
};

module.exports = { getNDVIImage };
