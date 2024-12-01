import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const template = await prisma.Template.findUnique({
      where: {
        id: params.id
      }
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    const updatedTemplate = await prisma.Template.update({
      where: {
        id: params.id
      },
      data: {
        name: data.name,
        description: data.description,
        type: data.passType,
        configuration: data,
        status: data.status || 'DRAFT',
      }
    });

    return NextResponse.json(updatedTemplate);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    );
  }
}