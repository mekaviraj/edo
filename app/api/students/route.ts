import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { Student, Team } from '../../../lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    
    // Fetch all created teams to find assigned roll numbers
    const teams = await Team.find({}, 'members.roll');
    const assignedRolls = teams.flatMap((team) => team.members.map((m: any) => m.roll));

    // Fetch students who are not assigned to any team
    const unassignedStudents = await Student.find({ roll: { $nin: assignedRolls } });

    // Group students by cluster
    const grouped = {
      '1': unassignedStudents.filter((s) => s.cluster === 1),
      '2': unassignedStudents.filter((s) => s.cluster === 2),
      '3': unassignedStudents.filter((s) => s.cluster === 3),
    };

    console.log("Teams:", teams.length);
    console.log("Assigned:", assignedRolls.length);
    console.log("Students:", unassignedStudents.length);
    console.log("First Student:", unassignedStudents[0]);
    console.log("Grouped counts:", {
      c1: grouped["1"].length,
      c2: grouped["2"].length,
      c3: grouped["3"].length,
    });

    return NextResponse.json(grouped);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch students' }, { status: 500 });
  }
}
