import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { Student, Team } from '../../../lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    // Return all teams sorted by creation time (ascending)
    const teams = await Team.find({}).sort({ createdAt: 1 });
    return NextResponse.json(teams);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch teams' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { cluster1, cluster2, cluster3, mentor } = body;

    // 1. Basic check for presence
    if (!cluster1 || !cluster2 || !cluster3) {
      return NextResponse.json({ error: 'All three student roll numbers are required.' }, { status: 400 });
    }

    // 2. Validate uniqueness of roll numbers in the request
    if (cluster1 === cluster2 || cluster1 === cluster3 || cluster2 === cluster3) {
      return NextResponse.json({ error: 'Roll numbers must be distinct.' }, { status: 400 });
    }

    // 3. Retrieve student documents
    const s1 = await Student.findOne({ roll: cluster1 });
    const s2 = await Student.findOne({ roll: cluster2 });
    const s3 = await Student.findOne({ roll: cluster3 });

    if (!s1 || !s2 || !s3) {
      return NextResponse.json({ error: 'One or more students not found in database.' }, { status: 400 });
    }

    // 4. Validate cluster assignments
    if (s1.cluster !== 1 || s2.cluster !== 2 || s3.cluster !== 3) {
      return NextResponse.json({ error: 'Students must belong to their respective clusters (1, 2, and 3).' }, { status: 400 });
    }

    // 5. Verify that none of these students are already assigned to a team
    const alreadyAssigned = await Team.findOne({
      'members.roll': { $in: [cluster1, cluster2, cluster3] }
    });

    if (alreadyAssigned) {
      return NextResponse.json({ error: 'One or more of the selected students are already in a team.' }, { status: 400 });
    }

    // 6. Create and save the new team
    const newTeam = new Team({
      mentor: mentor || '',
      members: [
        { roll: s1.roll, name: s1.name, cluster: s1.cluster },
        { roll: s2.roll, name: s2.name, cluster: s2.cluster },
        { roll: s3.roll, name: s3.name, cluster: s3.cluster }
      ]
    });

    await newTeam.save();
    return NextResponse.json(newTeam, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create team' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const id = body.id || body._id;

    if (!id) {
      return NextResponse.json({ error: 'Team ID is required for deletion.' }, { status: 400 });
    }

    const deletedTeam = await Team.findByIdAndDelete(id);

    if (!deletedTeam) {
      return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Team deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete team' }, { status: 500 });
  }
}
