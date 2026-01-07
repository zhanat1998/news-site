// app/api/check-admin/route.ts
import { NextRequest, NextResponse } from 'next/server';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ isAdmin: false });
    }

    // Sanity Users API менен токенди текшерүү
    const userResponse = await fetch(
      `https://api.sanity.io/v2021-06-07/users/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!userResponse.ok) {
      return NextResponse.json({ isAdmin: false });
    }

    const userData = await userResponse.json();

    // Колдонуучу Sanity'ге кирген болсо, проект мүчөсү экенин текшерүү
    if (userData && userData.id) {
      // Проектке кирүү мүмкүнчүлүгүн текшерүү
      const projectResponse = await fetch(
        `https://api.sanity.io/v2021-06-07/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (projectResponse.ok) {
        const projectData = await projectResponse.json();
        // Проектке мүчө болсо - админ
        const isMember = projectData.members?.some(
          (member: { id: string }) => member.id === userData.id
        );

        if (isMember) {
          return NextResponse.json({
            isAdmin: true,
            user: {
              id: userData.id,
              name: userData.name,
              email: userData.email,
            }
          });
        }
      }
    }

    return NextResponse.json({ isAdmin: false });
  } catch (error) {
    console.error('Admin check error:', error);
    return NextResponse.json({ isAdmin: false });
  }
}