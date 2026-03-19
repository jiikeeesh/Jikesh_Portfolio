import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Define the path to our JSON "database"
const dataFilePath = path.join(process.cwd(), 'data', 'products.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const products = JSON.parse(fileContents);
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error reading products data:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newProduct = await request.json();

    // Read existing products
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const products = JSON.parse(fileContents);

    // Assign a new ID based on the highest existing ID
    const newId = products.length > 0 ? Math.max(...products.map((p: any) => p.id)) + 1 : 1;
    const productToSave = { ...newProduct, id: newId };

    // Append to array and save
    products.push(productToSave);
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2), 'utf8');

    return NextResponse.json(productToSave, { status: 201 });
  } catch (error) {
    console.error('Error saving new product:', error);
    return NextResponse.json({ error: 'Failed to save product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Read existing products
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const products = JSON.parse(fileContents);

    // Filter out the product with the matching ID
    const updatedProducts = products.filter((p: any) => p.id !== id);

    // Check if a product was actually removed
    if (products.length === updatedProducts.length) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Save the updated array
    await fs.writeFile(dataFilePath, JSON.stringify(updatedProducts, null, 2), 'utf8');

    return NextResponse.json({ success: true, message: 'Product deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedProduct = await request.json();
    const { id } = updatedProduct;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Read existing products
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const products = JSON.parse(fileContents);

    // Find and update the product
    const index = products.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    products[index] = { ...products[index], ...updatedProduct };

    // Save back to file
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2), 'utf8');

    return NextResponse.json(products[index]);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
