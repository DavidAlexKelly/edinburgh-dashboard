export default function handler(req, res) {
  res.status(200).json({ message: 'Hello World!', time: new Date().toISOString() });
}