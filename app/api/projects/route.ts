import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data/projects.json');

// Helper to reliably read the JSON file
async function getProjects() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading projects.json:", error);
    return [];
  }
}

// Helper to save back to JSON file
async function saveProjects(projects: any) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(projects, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing to projects.json:", error);
    return false;
  }
}

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  try {
    const newProject = await request.json();
    const projects = await getProjects();
    
    // Generate a new ID based on the highest existing ID
    const maxId = projects.length > 0 ? Math.max(...projects.map((p: any) => p.id)) : 0;
    const projectWithId = {
      ...newProject,
      id: maxId + 1
    };

    projects.push(projectWithId);
    
    const success = await saveProjects(projects);
    if (success) {
      return NextResponse.json(projectWithId, { status: 201 });
    } else {
      throw new Error("Failed to save to database file.");
    }
  } catch (error) {
    console.error("Error adding project:", error);
    return NextResponse.json({ error: 'Failed to add project' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');

    if (!idParam) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const id = parseInt(idParam, 10);
    const projects = await getProjects();
    
    const initialLength = projects.length;
    const filteredProjects = projects.filter((p: any) => p.id !== id);

    if (filteredProjects.length === initialLength) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const success = await saveProjects(filteredProjects);
    if (success) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      throw new Error("Failed to save to database file.");
    }

  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
