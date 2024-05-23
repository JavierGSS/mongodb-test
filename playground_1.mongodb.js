const database = "test";
const collection = "products";

use(database);

const productsData = [
  {
    name: "Samsung Galaxy XV",
    category: "Smartphone",
    price: 68.35,
    description: "High-end smartphone, very light.",
  },
  {
    name: "Apple MacBook XVIII",
    category: "Laptop",
    price: 137.45,
    description: "High-end laptop, very light, good RAM.",
  },
  {
    name: "Moleskine HC-I",
    category: "Notebook",
    price: 25.32,
    description: "Excellent notebook, hard cover.",
  },
  {
    name: "Communist Manifesto",
    category: "Book",
    price: 12.99,
    description: "A Marx/Engels classic.",
  },
  {
    name: "Samsung MJ2020",
    category: "Printer",
    price: 40.5,
    description: "Reliable, hard working, B/W printer",
  },
  {
    name: "Apple Magic Mouse II",
    category: "Mouse",
    price: 42.7,
    description: "Very light and functional mouse.",
  },
];

db.products.insertMany(productsData);

console.log(
  `${database}.${collection} has ${db.products.countDocuments()} documents.`
);

const inStock = db.products.find({ price: { $gte: 25 } }).toArray();

use("test");

db.products.createIndex({ category: 1 });

// db.products.explain().find({ category: "Laptop" });
