// JEM AUTO Node.js API (Express)
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = Number(process.env.PORT) || 5000;   // Render provides PORT
const HOST = '0.0.0.0';                          // bind on all interfaces


// Allowed origins (comma-separated) e.g. "https://cars.iwatdigital.online,http://localhost:5500"
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://cars.iwatdigital.online').split(',').map(s=>s.trim());

app.use(cors({
  origin: function(origin, cb){
    // allow same-origin or tools with no origin
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS: ' + origin));
  }
}));

app.use(express.json());

// TEMP in-memory DB (replace with Mongo/Postgres)
let cars = [
  { id: 1, name: "Toyota Harrier", make: "Toyota", model: "Harrier", year: 2008, price: 12500, currency: "USD", image: "https://cars.iwatdigital.online/images/harrier.jpg", description: "2.4L, Automatic", fuel: "Petrol", transmission: "Automatic", mileage: 98000, category: "SUV", condition: "Used" },
  { id: 2, name: "Nissan X-Trail", make: "Nissan", model: "X-Trail", year: 2007, price: 9800, currency: "USD", image: "https://cars.iwatdigital.online/images/xtrail.jpg", description: "2.0L, Manual", fuel: "Petrol", transmission: "Manual", mileage: 122000, category: "SUV", condition: "Used" }
];

app.get('/api/health', (_req,res)=>{ res.json({ ok: true, time: new Date().toISOString() }); });

// List
app.get('/api/cars', (_req, res)=>{
  res.json(cars);
});

// Get by id
app.get('/api/cars/:id', (req, res)=>{
  const car = cars.find(c => String(c.id) === String(req.params.id));
  if (!car) return res.status(404).json({ message: 'Car not found' });
  res.json(car);
});

// Create listing (for Sell form)
app.post('/api/listings', (req,res)=>{
  const body = req.body || {};
  const id = (cars[cars.length-1]?.id || 0) + 1;
  const car = {
    id,
    name: body.name || [body.make, body.model, body.year].filter(Boolean).join(' '),
    make: body.make || null,
    model: body.model || null,
    year: Number(body.year) || null,
    price: Number(body.price) || null,
    currency: body.currency || 'USD',
    image: body.image || null,
    description: body.description || null,
    fuel: body.fuel || null,
    transmission: body.transmission || null,
    mileage: Number(body.mileage) || null,
    category: body.category || null,
    condition: body.condition || null,
    createdAt: new Date().toISOString()
  };
  cars.push(car);
  res.status(201).json(car);
});

// Delete
app.delete('/api/cars/:id', (req,res)=>{
  const id = String(req.params.id);
  const before = cars.length;
  cars = cars.filter(c => String(c.id) !== id);
  if (cars.length === before) return res.status(404).json({ message: 'Car not found' });
  res.status(204).end();
});

app.listen(PORT, HOST, () => {
  console.log(`JEM AUTO API listening on http://${HOST}:${PORT}`);
});

