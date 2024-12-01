import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validatePassTemplate } from '@/utils/passValidation';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validationErrors = validatePassTemplate(data);

    if (validationErrors.length > 0) {
      return NextResponse.json({ errors: validationErrors }, { status: 400 });
    }

    // Note: Template should match the exact model name in your schema
    const newTemplate = await prisma.Template.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.passType,
        configuration: data,
        organizationId: data.organizationId || 'default-org-id',
        status: 'DRAFT',
      },
    });

    return NextResponse.json(newTemplate);
  } catch (error) {
    console.error('Template creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const templates = await prisma.template.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Template fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}