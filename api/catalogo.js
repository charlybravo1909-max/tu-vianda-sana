export default function handler(req, res) {
  res.status(500).json({
    error: "Catalogo temporalmente no disponible"
  });
}
