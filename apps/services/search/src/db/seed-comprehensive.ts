import type { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

/**
 * Comprehensive seed script for ApexCoachAI
 * Populates database with realistic marriage coaching data based on research
 * from Gottman Institute and Positive Psychology resources
 */

export async function seedComprehensiveData(prisma: PrismaClient): Promise<void> {
  console.log('🌱 Starting comprehensive data seeding...');

  // 1. Seed Meta Prompts (Coaching Personalities)
  await seedMetaPrompts(prisma);

  // 2. Seed Users (Coaches, Clients, Admins)
  const users = await seedUsers(prisma);

  // 3. Seed Programs
  const programs = await seedPrograms(prisma, users);

  // 4. Seed Knowledge Base Documents
  await seedKnowledgeBase(prisma, programs);

  // 5. Seed Library Resources
  await seedLibraryResources(prisma, programs);

  // 6. Seed Goals and Milestones
  await seedGoals(prisma, users);

  // 7. Seed Chats and Messages
  await seedChats(prisma, users);

  // 8. Seed Session Summaries
  await seedSessionSummaries(prisma);

  // 9. Seed Usage Events
  await seedUsageEvents(prisma, users);

  console.log('✅ Comprehensive seeding completed!');
}

// Allow running as standalone script
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  const prisma = new PrismaClient();
  seedComprehensiveData(prisma)
    .then(() => {
      console.log('Seeding complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}

async function seedMetaPrompts(prisma: PrismaClient) {
  const prompts = [
    {
      name: 'Tim – Inside Out Marriage Coach',
      promptText: `You are Tim, an empathetic and direct marriage coach specializing in the Inside Out Method from Apex Coach AI.

Your approach is:
- Empathetic yet direct, never sugar-coating issues
- Focused on personal accountability and emotional ownership
- Grounded in the principles of turning anger into calm leadership
- Committed to helping individuals rebuild connection and trust in their relationships

You speak with authority but compassion, asking tough questions that lead to breakthrough moments. You use language that resonates with men who are struggling but ready to change. You emphasize the importance of looking inward first before expecting external change.

Remember: Real transformation starts from the inside out.`,
      isDefault: true,
    },
    {
      name: 'Gottman Method Specialist',
      promptText: `You are a marriage coach trained in the Gottman Method, one of the most research-backed approaches to couples therapy.

Your expertise includes:
- The Four Horsemen (criticism, contempt, defensiveness, stonewalling) and how to combat them
- Building the Sound Relationship House with trust, commitment, and shared meaning
- The importance of turning toward bids for connection
- Creating rituals of connection and maintaining emotional intimacy
- Managing conflict through repair attempts and de-escalation

You help couples understand their relationship dynamics through research-based insights and practical exercises.`,
      isDefault: false,
    },
    {
      name: 'Communication Expert',
      promptText: `You specialize in helping couples improve their communication skills.

Your focus areas:
- Active listening techniques and reflective dialogue
- Using "I" statements to express needs without blame
- Creating safe spaces for open dialogue
- Managing emotional flooding and taking productive time-outs
- Building empathy and understanding between partners

You teach couples practical communication exercises that can transform their relationship dynamics.`,
      isDefault: false,
    },
  ];

  for (const prompt of prompts) {
    await prisma.metaPrompt.upsert({
      where: { name: prompt.name },
      update: prompt,
      create: prompt,
    });
  }

  console.log(`✓ Seeded ${prompts.length} meta prompts`);
}

async function seedUsers(prisma: PrismaClient) {
  const users = [
    // Admins
    {
      email: 'admin@apexcoachai.com',
      password: 'admin123',
      name: 'Sarah Chen',
      role: 'ADMIN' as const,
      isDemo: false,
    },
    {
      email: 'demo.admin@apexcoachai.com',
      password: 'demo123',
      name: 'Alex Morgan',
      role: 'ADMIN' as const,
      isDemo: true,
      demoRole: 'admin',
      demoLabel: 'Admin Demo - Full Platform Access',
    },
    // Coaches
    {
      email: 'tim.johnson@apexcoachai.com',
      password: 'coach123',
      name: 'Tim Johnson',
      role: 'COACH' as const,
      isDemo: false,
    },
    {
      email: 'demo.coach@apexcoachai.com',
      password: 'demo123',
      name: 'Tim Johnson',
      role: 'COACH' as const,
      isDemo: true,
      demoRole: 'coach',
      demoLabel: 'Coach Demo - Inside Out Method Expert',
    },
    {
      email: 'maria.rodriguez@apexcoachai.com',
      password: 'coach123',
      name: 'Maria Rodriguez',
      role: 'COACH' as const,
      isDemo: false,
    },
    // Clients
    {
      email: 'michael.roberts@example.com',
      password: 'client123',
      name: 'Michael Roberts',
      role: 'USER' as const,
      isDemo: false,
    },
    {
      email: 'demo.client@apexcoachai.com',
      password: 'demo123',
      name: 'Michael Roberts',
      role: 'USER' as const,
      isDemo: true,
      demoRole: 'client',
      demoLabel: 'Client Demo - Seeking Relationship Help',
    },
    {
      email: 'jennifer.smith@example.com',
      password: 'client123',
      name: 'Jennifer Smith',
      role: 'USER' as const,
      isDemo: false,
    },
    {
      email: 'david.williams@example.com',
      password: 'client123',
      name: 'David Williams',
      role: 'USER' as const,
      isDemo: false,
    },
    {
      email: 'lisa.anderson@example.com',
      password: 'client123',
      name: 'Lisa Anderson',
      role: 'USER' as const,
      isDemo: false,
    },
  ];

  const createdUsers = [];
  for (const userData of users) {
    const passwordHash = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        passwordHash,
        name: userData.name,
        role: userData.role,
        isDemo: userData.isDemo || false,
        demoRole: (userData as any).demoRole || null,
        demoLabel: (userData as any).demoLabel || null,
      },
    });
    createdUsers.push(user);
  }

  console.log(`✓ Seeded ${createdUsers.length} users`);
  return createdUsers;
}

async function seedPrograms(prisma: PrismaClient, users: any[]) {
  const coach = users.find((u) => u.role === 'COACH' && !u.isDemo);
  if (!coach) throw new Error('No coach found');

  const programs = [
    {
      name: 'Communication Mastery Program',
      description: `A comprehensive 8-week program based on Gottman Method research to help couples transform their communication patterns. Learn active listening, conflict resolution, and emotional intimacy skills.`,
      createdByUserId: coach.id,
    },
    {
      name: 'Rebuilding Trust & Connection',
      description: `A 12-week intensive program for couples who have experienced betrayal or emotional distance. Focus on rebuilding trust, creating safety, and restoring emotional intimacy through proven exercises.`,
      createdByUserId: coach.id,
    },
    {
      name: 'Inside Out Transformation',
      description: `The signature program based on the Inside Out Method. Learn to take personal accountability, manage anger constructively, and create lasting change from within.`,
      createdByUserId: coach.id,
    },
    {
      name: 'Conflict Resolution Workshop',
      description: `A 6-week program teaching couples how to navigate disagreements productively. Learn to identify the Four Horsemen, use repair attempts, and de-escalate conflicts before they spiral.`,
      createdByUserId: coach.id,
    },
    {
      name: 'Emotional Intimacy Deep Dive',
      description: `An 8-week program focused on deepening emotional connection. Includes exercises on love maps, rituals of connection, and building a strong friendship foundation.`,
      createdByUserId: coach.id,
    },
  ];

  const createdPrograms = [];
  for (const programData of programs) {
    const program = await prisma.program.create({
      data: programData,
    });
    createdPrograms.push(program);

    // Assign clients to programs
    const clients = users.filter((u) => u.role === 'USER' && !u.isDemo);
    for (let i = 0; i < Math.min(3, clients.length); i++) {
      await prisma.programAssignment.create({
        data: {
          programId: program.id,
          userId: clients[i].id,
          role: 'PARTICIPANT' as const,
        },
      });
    }
  }

  console.log(`✓ Seeded ${createdPrograms.length} programs`);
  return createdPrograms;
}

async function seedKnowledgeBase(prisma: PrismaClient, programs: any[]) {
  const documents = [
    {
      programId: programs[0]?.id,
      title: '10 Communication Exercises for Couples',
      type: 'url',
      source: 'https://www.gottman.com/blog/10-communication-exercises-for-couples-to-have-better-relationships/',
      status: 'indexed',
      trainingStatus: 'trained',
      metadata: {
        description: 'Research-based communication exercises from the Gottman Institute',
        author: 'The Gottman Institute',
        category: 'Communication',
        content: `Communication is the heartbeat of any relationship. These 10 exercises help couples enhance connection by focusing on empathy and understanding. Key exercises include: Active Listening, Reflective Dialogue, Use of "I" Statements, Open-Ended Questions, Time-Out Strategy, Love Maps, Regular Check-Ins, Stress-Reducing Conversation, Emotion Validation, and Turning Toward. Each exercise includes specific techniques and benefits for strengthening your relationship.`,
      },
    },
    {
      programId: programs[0]?.id,
      title: '21 Couples Therapy Worksheets and Activities',
      type: 'url',
      source: 'https://positivepsychology.com/couples-therapy-worksheets-activities/',
      status: 'indexed',
      trainingStatus: 'trained',
      metadata: {
        description: 'Comprehensive collection of couples therapy exercises and worksheets',
        author: 'Positive Psychology',
        category: 'Therapy Exercises',
        content: `This comprehensive guide includes 21 couples therapy worksheets and activities including: Soul Gazing, Extended Cuddle Time, 7 Breath-Forehead Connection Exercise, Uninterrupted Listening, The Miracle Question, The Weekly CEO Meeting, Five Things Go Exercise, About Your Partner Worksheet, Good Qualities Worksheet, Appreciative Inquiry of Relationships, and Apologizing Effectively. Each activity is designed to improve communication, build intimacy, and strengthen your bond.`,
      },
    },
    {
      programId: programs[0]?.id,
      title: 'Gottman Resources: Small Things Often',
      type: 'url',
      source: 'https://naturalstatecounselingcenters.com/gottman-resources/',
      status: 'indexed',
      trainingStatus: 'trained',
      metadata: {
        description: 'Free Gottman exercises including Small Things Often, Four Horsemen, and Love Maps',
        author: 'Natural State Counseling Centers',
        category: 'Gottman Method',
        content: `Small Things Often emphasizes that successful long-term relationships are created through small words, small gestures, and small acts. This resource includes exercises on: Avoiding the Four Horsemen (criticism, contempt, defensiveness, stonewalling), Aftermath of a Fight, Being a Great Listener, Fondness & Admiration, Relaxation techniques, Conflict Resolution with Softened Startup, Love Maps exercises, and I Statements.`,
      },
    },
    {
      programId: programs[0]?.id,
      title: 'The Sound Relationship House',
      type: 'url',
      source: 'https://thecounselinghub.com/printables-and-pdfs',
      status: 'indexed',
      trainingStatus: 'trained',
      metadata: {
        description: 'Gottman Sound Relationship House framework and printable resources',
        author: 'The Counseling Hub',
        category: 'Relationship Framework',
        content: `The Sound Relationship House is Drs. John and Julie Gottman's framework for building healthy relationships. It includes: Building Love Maps, Sharing Fondness and Admiration, Turning Toward Each Other, The Positive Perspective, Managing Conflict, Making Life Dreams Come True, and Creating Shared Meaning. Resources include: Gottman-Rapaport speaker/listener activity, Feeling Wheel, Four Horsemen guide, Aftermath of a Fight worksheet, Art of Compromise, and Repair Checklist.`,
      },
    },
    {
      programId: programs[1]?.id,
      title: 'Rebuilding Trust After Betrayal',
      type: 'txt',
      source: 'internal://trust-rebuilding-guide.txt',
      status: 'indexed',
      trainingStatus: 'trained',
      metadata: {
        description: 'Step-by-step guide to rebuilding trust in relationships',
        category: 'Trust Building',
        content: `Rebuilding Trust After Betrayal: A Comprehensive Guide

Trust is the foundation of any healthy relationship. When trust is broken, rebuilding it requires time, patience, and consistent effort from both partners.

Phase 1: Acknowledgment and Responsibility
- The person who broke trust must take full responsibility without excuses
- Acknowledge the pain caused to your partner
- Commit to transparency and honesty moving forward
- Understand that rebuilding trust is a process, not an event

Phase 2: Creating Safety
- Establish clear boundaries and expectations
- Be completely transparent about your actions
- Answer questions honestly, even when uncomfortable
- Give your partner space to process their emotions
- Avoid defensiveness when your partner expresses hurt

Phase 3: Consistent Actions Over Time
- Follow through on all commitments, no matter how small
- Be where you say you'll be, when you say you'll be there
- Share information proactively, don't wait to be asked
- Show through actions, not just words, that you've changed
- Understand that trust is rebuilt through many small moments

Phase 4: Rebuilding Intimacy
- Gradually rebuild emotional and physical intimacy
- Create new positive memories together
- Establish new rituals of connection
- Continue to show appreciation and affection
- Work together on shared goals and dreams

Remember: Rebuilding trust typically takes 6-24 months of consistent effort. Be patient with yourself and your partner.`,
      },
    },
    {
      programId: programs[2]?.id,
      title: 'Inside Out Method: Personal Accountability Framework',
      type: 'txt',
      source: 'internal://inside-out-framework.txt',
      status: 'indexed',
      trainingStatus: 'trained',
      metadata: {
        description: 'Core principles of the Inside Out Method for relationship transformation',
        category: 'Methodology',
        content: `The Inside Out Method: Personal Accountability Framework

The Inside Out Method is based on the principle that real transformation starts from within. Before expecting external change in your relationship, you must first look inward and take personal accountability.

Core Principle: You cannot control your partner's behavior, but you can control your own response and how you show up in the relationship.

The Three Pillars:

1. Personal Accountability
   - Take ownership of your emotions and reactions
   - Recognize that your partner doesn't "make" you feel anything
   - Understand that your response is your responsibility
   - Stop blaming and start taking action

2. Emotional Ownership
   - Identify your triggers and understand why they affect you
   - Process your emotions before reacting
   - Communicate your feelings without blame or accusation
   - Take responsibility for your emotional state

3. Calm Leadership
   - Transform anger into calm, assertive communication
   - Lead by example in how you want to be treated
   - Create safety through your own emotional regulation
   - Make decisions from a place of calm, not reactivity

The Transformation Process:

Step 1: Awareness
   - Notice your patterns and reactions
   - Identify what triggers you
   - Understand your emotional responses

Step 2: Acceptance
   - Accept responsibility for your part
   - Stop waiting for your partner to change first
   - Embrace that change starts with you

Step 3: Action
   - Make conscious choices about how you respond
   - Practice new behaviors consistently
   - Lead by example in the relationship

Step 4: Integration
   - Make these practices a natural part of who you are
   - Maintain accountability even when it's difficult
   - Continue growing and evolving

Remember: Real change happens when you stop trying to change your partner and start changing yourself.`,
      },
    },
    {
      programId: programs[3]?.id,
      title: 'The Four Horsemen: Recognizing Destructive Patterns',
      type: 'txt',
      source: 'internal://four-horsemen-guide.txt',
      status: 'indexed',
      trainingStatus: 'trained',
      metadata: {
        description: 'Guide to recognizing and avoiding the Four Horsemen of relationship apocalypse',
        category: 'Conflict Resolution',
        content: `The Four Horsemen: Recognizing and Avoiding Destructive Patterns

Dr. John Gottman's research identified four communication patterns that predict relationship failure. Learning to recognize and replace these patterns is crucial for relationship health.

1. CRITICISM
   What it is: Attacking your partner's character or personality
   Example: "You're so selfish. You never think about anyone but yourself."
   Antidote: Use a gentle startup - express your feelings and needs without blame
   Better: "I feel hurt when plans change without me knowing. I'd appreciate it if we could discuss schedule changes together."

2. CONTEMPT
   What it is: Treating your partner with disrespect, mockery, or superiority
   Example: "You're such an idiot. I can't believe you did that."
   Antidote: Build a culture of appreciation and respect
   Better: Focus on your partner's positive qualities and express appreciation regularly

3. DEFENSIVENESS
   What it is: Making excuses, playing the victim, or counter-attacking
   Example: "It's not my fault. You're the one who..."
   Antidote: Take responsibility, even for part of the problem
   Better: "I can see how my actions contributed to this. Let me understand your perspective better."

4. STONEWALLING
   What it is: Withdrawing from the conversation, shutting down
   Example: Silent treatment, leaving the room, refusing to engage
   Antidote: Take a break when flooded, then return to the conversation
   Better: "I'm feeling overwhelmed right now. Can we take a 20-minute break and come back to this?"

Remember: All couples experience these patterns occasionally. The key is recognizing them quickly and replacing them with healthier alternatives.`,
      },
    },
  ];

  for (const doc of documents) {
    await prisma.knowledgeBaseDocument.create({
      data: doc,
    });
  }

  console.log(`✓ Seeded ${documents.length} knowledge base documents with actual content`);
}

async function seedLibraryResources(prisma: PrismaClient, programs: any[]) {
  const resources = [
    {
      programId: programs[0]?.id,
      title: 'Active Listening Masterclass',
      type: 'video',
      source: 'https://www.youtube.com/watch?v=qzR62JJCMBQ', // Real YouTube video on active listening
      status: 'indexed',
      durationSeconds: 1800, // 30 minutes
      transcriptJson: JSON.stringify({
        segments: [
          { 
            start: 0, 
            end: 300, 
            text: 'Welcome to Active Listening Masterclass. Today we\'ll explore how to truly hear and understand your partner. Active listening is more than just hearing words - it\'s about understanding the emotions, needs, and intentions behind what your partner is saying.' 
          },
          { 
            start: 300, 
            end: 900, 
            text: 'The key techniques include: giving your full attention without distractions, making eye contact, using body language that shows you\'re engaged, asking clarifying questions, and reflecting back what you\'ve heard. Remember, the goal isn\'t to solve problems immediately, but to ensure your partner feels heard and understood.' 
          },
          { 
            start: 900, 
            end: 1800, 
            text: 'Practice exercises: Try the speaker-listener technique where one person speaks for 3-5 minutes while the other only listens. Then switch roles. Notice how this changes the quality of your communication. Remember, active listening is a skill that improves with practice. Start with small conversations and gradually apply it to more challenging topics.' 
          },
        ],
      }),
      thumbnailUrl: 'https://img.youtube.com/vi/qzR62JJCMBQ/maxresdefault.jpg',
    },
    {
      programId: programs[0]?.id,
      title: 'I Statements Workshop: Expressing Feelings Without Blame',
      type: 'video',
      source: 'https://www.youtube.com/watch?v=example-i-statements',
      status: 'indexed',
      durationSeconds: 1200, // 20 minutes
      transcriptJson: JSON.stringify({
        segments: [
          {
            start: 0,
            end: 600,
            text: 'I Statements are a powerful tool for expressing your feelings without triggering defensiveness in your partner. The formula is: "I feel [emotion] when [specific behavior] because [why it matters to you]." For example, instead of saying "You never listen to me," try "I feel unheard when I share my feelings and you look at your phone, because it makes me feel like what I\'m saying isn\'t important to you."',
          },
          {
            start: 600,
            end: 1200,
            text: 'Practice identifying your true emotions - are you really angry, or are you hurt, disappointed, or scared? Use specific emotion words. Avoid "I feel like" which often leads to opinions rather than feelings. Remember, I Statements take ownership of your emotions and invite understanding rather than defensiveness.',
          },
        ],
      }),
      thumbnailUrl: 'https://via.placeholder.com/1280x720?text=I+Statements+Workshop',
    },
    {
      programId: programs[1]?.id,
      title: 'Trust Building Exercises: Reconnecting After Betrayal',
      type: 'video',
      source: 'https://www.youtube.com/watch?v=example-trust',
      status: 'indexed',
      durationSeconds: 2400, // 40 minutes
      transcriptJson: JSON.stringify({
        segments: [
          {
            start: 0,
            end: 800,
            text: 'Rebuilding trust after betrayal is one of the most challenging journeys in relationships. This process requires patience, consistency, and genuine commitment from both partners. We\'ll explore exercises that help create safety, establish transparency, and gradually rebuild the foundation of trust.',
          },
          {
            start: 800,
            end: 1600,
            text: 'Key exercises include: transparency practices where you proactively share information, consistency checks where you follow through on all commitments no matter how small, and rebuilding rituals where you create new positive experiences together. Remember, trust is rebuilt through many small moments over time, typically 6-24 months.',
          },
          {
            start: 1600,
            end: 2400,
            text: 'The betrayed partner needs space to process, and the person who broke trust needs to show through consistent actions that they\'ve changed. Both partners must be committed to the process. This isn\'t about perfection, but about showing up consistently and authentically.',
          },
        ],
      }),
      thumbnailUrl: 'https://via.placeholder.com/1280x720?text=Trust+Building',
    },
    {
      programId: programs[2]?.id,
      title: 'Inside Out Method: Transforming Anger into Calm Leadership',
      type: 'video',
      source: 'https://www.youtube.com/watch?v=example-inside-out',
      status: 'indexed',
      durationSeconds: 2100, // 35 minutes
      transcriptJson: JSON.stringify({
        segments: [
          {
            start: 0,
            end: 700,
            text: 'The Inside Out Method teaches us that real transformation starts from within. Instead of trying to change your partner, you focus on changing yourself. When you get angry, your nervous system floods and you can\'t think clearly. The key is recognizing this early and taking responsibility for your emotional state.',
          },
          {
            start: 700,
            end: 1400,
            text: 'Learn to transform anger into calm leadership. This means: recognizing your triggers before you explode, taking a time-out when flooded, self-soothing during the break, and returning to communicate from a place of calm. The goal isn\'t to suppress anger, but to understand it and channel it constructively.',
          },
          {
            start: 1400,
            end: 2100,
            text: 'Practice the three pillars: Personal Accountability - taking ownership of your emotions and reactions; Emotional Ownership - understanding your triggers and processing feelings; and Calm Leadership - leading by example in how you want to be treated. Remember, you can\'t control your partner, but you can control how you show up.',
          },
        ],
      }),
      thumbnailUrl: 'https://via.placeholder.com/1280x720?text=Inside+Out+Method',
    },
  ];

  for (const resource of resources) {
    await prisma.libraryResource.create({
      data: resource,
    });
  }

  console.log(`✓ Seeded ${resources.length} library resources with transcripts and thumbnails`);
}

async function seedGoals(prisma: PrismaClient, users: any[]) {
  const clients = users.filter((u) => u.role === 'USER' && !u.isDemo);

  const goalTemplates = [
    {
      title: 'Improve Daily Communication',
      description: 'Practice active listening and use "I" statements in daily conversations',
      status: 'ACTIVE' as const,
      milestones: [
        { title: 'Complete active listening exercise', status: 'COMPLETED' as const },
        { title: 'Practice I statements for one week', status: 'IN_PROGRESS' as const },
        { title: 'Have stress-reducing conversation daily', status: 'PENDING' as const },
      ],
    },
    {
      title: 'Build Emotional Intimacy',
      description: 'Deepen connection through love maps and rituals of connection',
      status: 'ACTIVE' as const,
      milestones: [
        { title: 'Complete love maps questionnaire', status: 'COMPLETED' as const },
        { title: 'Establish daily check-in ritual', status: 'IN_PROGRESS' as const },
        { title: 'Plan weekly date night', status: 'PENDING' as const },
      ],
    },
    {
      title: 'Manage Conflict Productively',
      description: 'Learn to de-escalate conflicts and use repair attempts',
      status: 'ACTIVE' as const,
      milestones: [
        { title: 'Identify personal conflict triggers', status: 'COMPLETED' as const },
        { title: 'Learn time-out technique', status: 'IN_PROGRESS' as const },
        { title: 'Practice repair attempts', status: 'PENDING' as const },
      ],
    },
    {
      title: 'Rebuild Trust',
      description: 'Work through trust issues and create safety in the relationship',
      status: 'ACTIVE' as const,
      milestones: [
        { title: 'Acknowledge past hurts', status: 'COMPLETED' as const },
        { title: 'Establish transparency practices', status: 'IN_PROGRESS' as const },
        { title: 'Create trust-building rituals', status: 'PENDING' as const },
      ],
    },
  ];

  for (const client of clients) {
    for (const template of goalTemplates) {
      const goal = await prisma.goal.create({
        data: {
          userId: client.id,
          title: template.title,
          description: template.description,
          status: template.status,
          targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
          milestones: {
            create: template.milestones.map((m) => ({
              title: m.title,
              status: m.status,
              targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            })),
          },
        },
      });
    }
  }

  console.log(`✓ Seeded goals for ${clients.length} clients`);
}

async function seedChats(prisma: PrismaClient, users: any[]) {
  const clients = users.filter((u) => u.role === 'USER' && !u.isDemo);

  const chatScenarios = [
    {
      title: 'Struggling with Communication',
      messages: [
        {
          role: 'USER' as const,
          content: "I feel like my partner never listens to me. When I try to talk about my feelings, they just get defensive or change the subject. How can I get them to actually hear me?",
        },
        {
          role: 'ASSISTANT' as const,
          content: `I hear your frustration, and it's completely valid to want to feel heard in your relationship. This is a common challenge that many couples face.

The key isn't necessarily about getting your partner to listen—it's about creating the conditions where listening can happen. Let me share a few strategies:

1. **Use "I" statements**: Instead of "You never listen," try "I feel unheard when I share my feelings." This reduces defensiveness.

2. **Timing matters**: Choose moments when both of you are calm and not distracted. Avoid trying to have important conversations when either of you is stressed or tired.

3. **Active listening exercise**: Try the speaker-listener technique. One person speaks for 3-5 minutes while the other only listens (no interrupting, no defending). Then switch roles.

4. **Express your need clearly**: "I need to feel heard and understood. Can we set aside 20 minutes tonight to talk about this?"

Would you like to start with one of these approaches? Which feels most doable for your situation right now?`,
        },
        {
          role: 'USER' as const,
          content: 'The "I" statements make sense, but I'm worried my partner will still get defensive. What if they don't respond well?',
        },
        {
          role: 'ASSISTANT' as const,
          content: `That's a real concern, and it shows you're thinking ahead about how to make this work. The truth is, you can't control how your partner responds—but you can control how you show up.

Here's what I want you to remember: **Your job isn't to make them respond perfectly. Your job is to communicate clearly and with care.**

If they still get defensive, that's information. It tells you something about where they're at emotionally. In that moment, you have choices:

1. **Take a time-out**: "I can see this is getting heated. Can we pause for 20 minutes and come back to this when we're both calmer?"

2. **Validate their feelings**: "I can see this is hard for you to hear. I'm not trying to attack you—I'm trying to share what I'm experiencing."

3. **Stay curious**: "I'm noticing you're getting defensive. What's coming up for you right now?"

The goal isn't to have a perfect conversation on the first try. It's to create a pattern where both of you feel safe enough to be vulnerable.

What's your biggest fear about trying this?`,
        },
      ],
    },
    {
      title: 'Rebuilding After Trust Issues',
      messages: [
        {
          role: 'USER' as const,
          content: 'My partner broke my trust, and even though they've apologized, I can't seem to move past it. I keep bringing it up, and it's causing more fights.',
        },
        {
          role: 'ASSISTANT' as const,
          content: `Trust rebuilding is one of the most challenging journeys in relationships, and what you're experiencing is completely normal. The fact that you keep bringing it up tells me the wound hasn't fully healed—and that's okay.

Let's think about this differently. When you keep bringing it up, what are you really trying to accomplish? Are you:
- Trying to make sure they understand how much they hurt you?
- Testing to see if they're truly sorry?
- Looking for reassurance that it won't happen again?
- Processing the pain that's still there?

Understanding your deeper need will help us figure out what you actually need from your partner to move forward.

Rebuilding trust requires:
1. **Consistent actions over time** - Words aren't enough; you need to see changed behavior
2. **Transparency** - Your partner needs to be willing to be open and accountable
3. **Space to heal** - You need time, and your partner needs to give you that without getting defensive
4. **Clear boundaries** - What needs to happen for you to feel safe again?

What would need to happen for you to start feeling like you can trust again?`,
        },
      ],
    },
    {
      title: 'Managing Anger in Conflicts',
      messages: [
        {
          role: 'USER' as const,
          content: 'I have a really hard time controlling my anger during arguments. I say things I don't mean, and then I feel terrible afterward. How do I stop this cycle?',
        },
        {
          role: 'ASSISTANT' as const,
          content: `This is the core of the Inside Out Method—turning anger into calm leadership. The fact that you recognize this pattern and feel terrible afterward shows you're already on the right path.

Here's what's happening: When you get angry during conflict, your nervous system is flooding. Your brain literally can't think clearly—it's in fight-or-flight mode. That's why you say things you don't mean.

**The solution isn't to suppress your anger. It's to understand it and channel it differently.**

Let's break this down:

1. **Recognize the early warning signs**: What happens in your body before you explode? Racing heart? Clenched jaw? That's your signal to pause.

2. **Take a time-out**: "I'm getting flooded. I need 20 minutes to calm down, and then I want to come back and talk about this." This isn't running away—it's being responsible.

3. **Self-soothe**: During that break, do something that calms your nervous system—deep breathing, a walk, whatever works for you.

4. **Come back and repair**: When you're calm, acknowledge what happened: "I'm sorry I got so angry. That wasn't helpful. Can we talk about what I was really trying to say?"

The goal is to transform anger from something that destroys into something that protects—protecting your relationship, protecting your values, protecting what matters.

What triggers your anger most during arguments?`,
        },
      ],
    },
  ];

  for (const client of clients) {
    for (const scenario of chatScenarios) {
      const chat = await prisma.chat.create({
        data: {
          userId: client.id,
          title: scenario.title,
          messages: {
            create: scenario.messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          },
        },
      });
    }
  }

  console.log(`✓ Seeded chats for ${clients.length} clients`);
}

async function seedSessionSummaries(prisma: PrismaClient) {
  const chats = await prisma.chat.findMany({
    where: {
      messages: {
        some: {},
      },
    },
    take: 5,
  });

  for (const chat of chats) {
    await prisma.sessionSummary.create({
      data: {
        chatId: chat.id,
        userId: chat.userId,
        summary: `Session focused on ${chat.title.toLowerCase()}. Client explored key relationship challenges and received guidance on practical communication strategies.`,
        keyInsights: {
          mainTopics: ['Communication', 'Trust', 'Conflict Resolution'],
          emotionalState: 'Engaged and reflective',
          readiness: 'High',
        },
        actionItems: [
          'Practice active listening exercise this week',
          'Schedule daily check-in with partner',
          'Complete love maps questionnaire',
        ],
        topics: ['Communication', 'Relationship Skills', 'Personal Growth'],
      },
    });
  }

  console.log(`✓ Seeded ${chats.length} session summaries`);
}

async function seedUsageEvents(prisma: PrismaClient, users: any[]) {
  const events = [];
  const eventTypes = ['login', 'chat_started', 'program_viewed', 'goal_created', 'resource_accessed'];

  for (const user of users) {
    // Create 5-10 events per user
    const numEvents = Math.floor(Math.random() * 6) + 5;
    for (let i = 0; i < numEvents; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      await prisma.usageEvent.create({
        data: {
          userId: user.id,
          type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
          metaJson: JSON.stringify({
            timestamp: createdAt.toISOString(),
            source: 'web',
          }),
          createdAt,
        },
      });
    }
  }

  console.log(`✓ Seeded usage events for ${users.length} users`);
}

