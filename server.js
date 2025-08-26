const express = require('express');
const cors = require('cors');

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const HOST = '0.0.0.0';

const ALLOWED = (process.env.ALLOWED_ORIGINS || 'https://cars.iwatdigital.online,http://localhost:5500')
  .split(',').map(s=>s.trim());

app.use(cors({
  origin: (origin, cb) => (!origin || ALLOWED.includes(origin)) ? cb(null, true) : cb(new Error('CORS: '+origin))
}));
app.use(express.json());

// Currency config (editable later)
const RATES = { UGX: 3800 }; // 1 USD -> 3800 UGX (adjust whenever you like)

// Demo data — prices in USD (frontend can convert to UGX using RATES)
let cars = [
  { id: 1, name: "Toyota Harrier", make: "Toyota", model: "Harrier", year: 2008, price: 12500, currency: "USD", image: "https://cars.iwatdigital.online/images/harrier.jpg", description: "2.4L, Automatic", fuel: "Petrol", transmission: "Automatic", mileage: 98000, category: "SUV", condition: "Used" },
  { id: 2, name: "Nissan X-Trail", make: "Nissan", model: "X-Trail", year: 2007, price: 9800,  currency: "USD", image: "https://cars.iwatdigital.online/images/xtrail.jpg",  description: "2.0L, Manual",     fuel: "Petrol", transmission: "Manual",    mileage: 122000, category: "SUV", condition: "Used" },
  { id: 3, name: "Toyota Vitz", make: "Toyota", model: "Vitz", year: 2009, price: 5200, currency: "USD", image: "https://cars.iwatdigital.online/images/vitz.jpg", description: "1.0L, Automatic", fuel: "Petrol", transmission: "Automatic", mileage: 85000, category: "Hatchback", condition: "Used" },
  { id: 4, name: "Toyota Passo", make: "Toyota", model: "Passo", year: 2011, price: 5600, currency: "USD", image: "https://cars.iwatdigital.online/images/passo.jpg", description: "1.0L, Automatic", fuel: "Petrol", transmission: "Automatic", mileage: 78000, category: "Hatchback", condition: "Used" },
  { id: 5, name: "Toyota Premio", make: "Toyota", model: "Premio", year: 2008, price: 9800, currency: "USD", image: "https://cars.iwatdigital.online/images/premio.jpg", description: "1.8L, Automatic", fuel: "Petrol", transmission: "Automatic", mileage: 110000, category: "Sedan", condition: "Used" },
  { id: 6, name: "Toyota Noah", make: "Toyota", model: "Noah", year: 2010, price: 10500, currency: "USD", image: "https://cars.iwatdigital.online/images/noah.jpg", description: "2.0L, Automatic, 7 seats", fuel: "Petrol", transmission: "Automatic", mileage: 130000, category: "Van", condition: "Used" },
  { id: 7, name: "Toyota Mark X", make: "Toyota", model: "Mark X", year: 2008, price: 11500, currency: "USD", image: "https://cars.iwatdigital.online/images/markx.jpg", description: "2.5L, Automatic", fuel: "Petrol", transmission: "Automatic", mileage: 125000, category: "Sedan", condition: "Used" },
  { id: 8, name: "Subaru Forester", make: "Subaru", model: "Forester", year: 2009, price: 8900, currency: "USD", image: "https://cars.iwatdigital.online/images/forester.jpg", description: "2.0L, Automatic, AWD", fuel: "Petrol", transmission: "Automatic", mileage: 140000, category: "SUV", condition: "Used" },
  { id: 9, name: "Honda Fit", make: "Honda", model: "Fit", year: 2012, price: 6200, currency: "USD", image: "https://cars.iwatdigital.online/images/fit.jpg", description: "1.3L, Automatic, Hybrid", fuel: "Hybrid", transmission: "Automatic", mileage: 90000, category: "Hatchback", condition: "Used" },
  { id: 10, name: "Toyota Alphard", make: "Toyota", model: "Alphard", year: 2007, price: 14500, currency: "USD", image: "https://cars.iwatdigital.online/images/alphard.jpg", description: "2.4L, Automatic, Luxury", fuel: "Petrol", transmission: "Automatic", mileage: 150000, category: "Van", condition: "Used" },
  { id: 11, name: "Toyota Prado", make: "Toyota", model: "Prado", year: 2006, price: 24000, currency: "USD", image: "https://cars.iwatdigital.online/images/prado.jpg", description: "4.0L, Automatic, 4x4", fuel: "Petrol", transmission: "Automatic", mileage: 170000, category: "SUV", condition: "Used" },
  { id: 12, name: "Mazda Demio", make: "Mazda", model: "Demio", year: 2010, price: 5500, currency: "USD", image: "https://cars.iwatdigital.online/images/demio.jpg", description: "1.3L, Automatic", fuel: "Petrol", transmission: "Automatic", mileage: 98000, category: "Hatchback", condition: "Used" },
  { id: 13, name: "Toyota Wish", make: "Toyota", model: "Wish", year: 2009, price: 8700, currency: "USD", image: "https://cars.iwatdigital.online/images/wish.jpg", description: "1.8L, Automatic, 7 seats", fuel: "Petrol", transmission: "Automatic", mileage: 120000, category: "MPV", condition: "Used" }
];

app.get('/api/health', (_req,res)=> res.json({ ok: true, time: new Date().toISOString() }));
app.get('/api/config', (_req,res)=> res.json({ currencyRates: RATES }));

app.get('/api/cars', (_req,res)=> res.json(cars));

app.get('/api/cars/:id', (req,res)=>{
  const id = String(req.params.id);
  const car = cars.find(c => String(c.id) === id);
  if (!car) return res.status(404).json({ message: 'Car not found' });
  res.json(car);
});

app.post('/api/listings', (req,res)=>{
  const b = req.body || {};
  const id = (cars[cars.length-1]?.id || 0) + 1;
  const car = {
    id,
    name: b.name || [b.make,b.model,b.year].filter(Boolean).join(' '),
    make: b.make ?? null, model: b.model ?? null, year: b.year? Number(b.year): null,
    price: b.price? Number(b.price): null, currency: b.currency || 'USD',
    image: b.image || null, description: b.description || null,
    fuel: b.fuel || null, transmission: b.transmission || null,
    mileage: b.mileage? Number(b.mileage): null, category: b.category || null, condition: b.condition || null,
    createdAt: new Date().toISOString()
  };
  cars.push(car);
  res.status(201).json(car);
});

app.delete('/api/cars/:id', (req,res)=>{
  const id = String(req.params.id);
  const before = cars.length;
  cars = cars.filter(c=> String(c.id) !== id);
  if (cars.length === before) return res.status(404).json({ message: 'Car not found' });
  res.status(204).end();
});

app.listen(PORT, HOST, ()=> console.log(`JEM AUTO API listening on http://${HOST}:${PORT}`));
