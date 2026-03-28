import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { usePostgres, getSQL, ensureTables } from '../../../lib/db';

const dataFilePath = path.join(process.cwd(), 'data', 'products.json');

// Helper to reliably read the JSON file (Local fallback)
async function getProductsLocal() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading products.json:", error);
    return [];
  }
}

// Helper to save back to JSON file (Local fallback)
async function saveProductsLocal(products: any) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error("Error writing to products.json:", error);
    return false;
  }
}

export async function GET() {
  if (usePostgres()) {
    try {
      await ensureTables();
      const sql = getSQL();
      const rows = await sql`SELECT * FROM products ORDER BY id ASC`;
      return NextResponse.json(rows);
    } catch (e) {
      console.error("Postgres get products error:", e);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
  } else {
    const products = await getProductsLocal();
    return NextResponse.json(products);
  }
}

export async function POST(request: Request) {
  try {
    const newProduct = await request.json();
    const { image, icon, ...restOfProduct } = newProduct;
    const productImage = image || "";

    if (usePostgres()) {
      await ensureTables();
      const sql = getSQL();
      
      const rows = await sql`
        INSERT INTO products (name, description, price, image)
        VALUES (
          ${restOfProduct.name},
          ${restOfProduct.description || ''},
          ${restOfProduct.price || 0},
          ${productImage}
        )
        RETURNING *
      `;
      return NextResponse.json(rows[0], { status: 201 });
    } else {
      const products = await getProductsLocal();
      const newId = products.length > 0 ? Math.max(...products.map((p: any) => p.id)) + 1 : 1;
      const productToSave = { ...restOfProduct, image: productImage, id: newId };
      products.push(productToSave);
      const success = await saveProductsLocal(products);
      if (success) {
        return NextResponse.json(productToSave, { status: 201 });
      } else {
        throw new Error("Failed to save to database file.");
      }
    }
  } catch (error: any) {
    console.error('Error saving new product:', error);
    return NextResponse.json({ error: 'Failed to save product', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    if (usePostgres()) {
      await ensureTables();
      const sql = getSQL();
      const result = await sql`DELETE FROM products WHERE id = ${id} RETURNING id`;
      if (result.length === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'Product deleted' }, { status: 200 });
    } else {
      const products = await getProductsLocal();
      const updatedProducts = products.filter((p: any) => p.id !== id);

      if (products.length === updatedProducts.length) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      const success = await saveProductsLocal(updatedProducts);
      if (success) {
        return NextResponse.json({ success: true, message: 'Product deleted' }, { status: 200 });
      } else {
        throw new Error("Failed to save to database file.");
      }
    }
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedProduct = await request.json();
    const { id, image, icon, ...restOfUpdate } = updatedProduct;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    if (usePostgres()) {
      await ensureTables();
      const sql = getSQL();
      
      let rows;
      if (image !== undefined) {
         rows = await sql`
          UPDATE products
          SET name = COALESCE(${restOfUpdate.name}, name),
              description = COALESCE(${restOfUpdate.description}, description),
              price = COALESCE(${restOfUpdate.price}, price),
              image = ${image}
          WHERE id = ${id}
          RETURNING *
        `;
      } else {
         rows = await sql`
          UPDATE products
          SET name = COALESCE(${restOfUpdate.name}, name),
              description = COALESCE(${restOfUpdate.description}, description),
              price = COALESCE(${restOfUpdate.price}, price)
          WHERE id = ${id}
          RETURNING *
        `;
      }

      if (rows.length === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json(rows[0]);
    } else {
      const products = await getProductsLocal();
      const index = products.findIndex((p: any) => p.id === id);
      
      if (index === -1) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      products[index] = { ...products[index], ...restOfUpdate, ...(image ? { image } : {}) };
      const success = await saveProductsLocal(products);
      if (success) {
        return NextResponse.json(products[index]);
      } else {
        throw new Error("Failed to save to database file.");
      }
    }
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product', details: error.message }, { status: 500 });
  }
}
