import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { usePostgres, getSQL, ensureTables } from '../../../lib/db';

const dataFilePath = path.join(process.cwd(), 'data/projects.json');

// Helper to reliably read the JSON file (Local fallback)
async function getProjectsLocal() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading projects.json:", error);
    return [];
  }
}

// Helper to save back to JSON file (Local fallback)
async function saveProjectsLocal(projects: any) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(projects, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing to projects.json:", error);
    return false;
  }
}

export async function GET() {
  if (usePostgres()) {
    try {
      await ensureTables();
      const sql = getSQL();
      const rows = await sql`SELECT * FROM projects ORDER BY id ASC`;
      return NextResponse.json(rows);
    } catch (e) {
      console.error("Postgres get projects error:", e);
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
  } else {
    const projects = await getProjectsLocal();
    return NextResponse.json(projects);
  }
}

export async function POST(request: Request) {
  try {
    const newProject = await request.json();

    if (usePostgres()) {
      await ensureTables();
      const sql = getSQL();
      
      const rows = await sql`
        INSERT INTO projects (title, description, tech, link, github)
        VALUES (
          ${newProject.title},
          ${newProject.description},
          ${newProject.tech || []},
          ${newProject.link || '#'},
          ${newProject.github || '#'}
        )
        RETURNING *
      `;
      return NextResponse.json(rows[0], { status: 201 });
    } else {
      const projects = await getProjectsLocal();
      const maxId = projects.length > 0 ? Math.max(...projects.map((p: any) => p.id)) : 0;
      const projectWithId = { ...newProject, id: maxId + 1 };
      projects.push(projectWithId);
      const success = await saveProjectsLocal(projects);
      if (success) {
        return NextResponse.json(projectWithId, { status: 201 });
      } else {
        throw new Error("Failed to save to database file.");
      }
    }
  } catch (error: any) {
    console.error("Error adding project:", error);
    return NextResponse.json({ error: 'Failed to add project', details: error.message }, { status: 500 });
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

    if (usePostgres()) {
      await ensureTables();
      const sql = getSQL();
      const result = await sql`DELETE FROM projects WHERE id = ${id} RETURNING id`;
      if (result.length === 0) {
         return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      const projects = await getProjectsLocal();
      const initialLength = projects.length;
      const filteredProjects = projects.filter((p: any) => p.id !== id);

      if (filteredProjects.length === initialLength) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      const success = await saveProjectsLocal(filteredProjects);
      if (success) {
        return NextResponse.json({ success: true }, { status: 200 });
      } else {
        throw new Error("Failed to save to database file.");
      }
    }
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: 'Failed to delete project', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedProject = await request.json();
    const { id } = updatedProject;

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    if (usePostgres()) {
      await ensureTables();
      const sql = getSQL();
      const rows = await sql`
        UPDATE projects
        SET title = ${updatedProject.title},
            description = ${updatedProject.description},
            tech = ${updatedProject.tech || []},
            link = ${updatedProject.link || '#'},
            github = ${updatedProject.github || '#'}
        WHERE id = ${id}
        RETURNING *
      `;
      if (rows.length === 0) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      return NextResponse.json(rows[0]);
    } else {
      const projects = await getProjectsLocal();
      const index = projects.findIndex((p: any) => p.id === id);

      if (index === -1) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      projects[index] = { ...projects[index], ...updatedProject };
      const success = await saveProjectsLocal(projects);
      if (success) {
        return NextResponse.json(projects[index]);
      } else {
        throw new Error("Failed to save to database file.");
      }
    }
  } catch (error: any) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: 'Failed to update project', details: error.message }, { status: 500 });
  }
}

