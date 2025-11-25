/**
 * Script to ingest coaching content into ApexCoachAI knowledge base
 * Run with: node scripts/ingest-coaching-content.js
 */

const coachingDocuments = [
  {
    title:
      'The 6 Principles of Leadership Coaching - Assessment, Challenge, Support Model',
    type: 'url',
    source:
      'https://www.ccl.org/articles/leading-effectively-articles/the-six-principles-of-leadership-coaching/',
    description:
      "Comprehensive guide covering the ACS (Assessment-Challenge-Support) coaching framework and 6 core principles: creating safe yet challenging environments, working within coachee's agenda, facilitation and collaboration, self-awareness advocacy, experiential learning, and modeling leadership.",
    metadata: {
      author: 'Center for Creative Leadership',
      readingTime: '6 minutes',
      topics: [
        'Leadership Coaching',
        'ACS Model',
        'Coaching Principles',
        'Professional Development',
      ],
    },
  },
  {
    title:
      '10 Principles of Coaching for 2025 - Trust, Empathy, and Strengths-Based Development',
    type: 'url',
    source:
      'https://www.togetherplatform.com/blog/principles-of-coaching-a-guide-for-2024',
    description:
      'Modern coaching guide covering 10 essential principles: reflective learning, trust and empathy, clear communication, feedback and accountability, continuous learning, inclusive leadership, empowerment, influence over authority, blame-free environments, and strengths utilization. Includes real-world examples from Microsoft, PepsiCo, Google, and other leading organizations.',
    metadata: {
      author: 'Together Platform',
      readingTime: '12 minutes',
      topics: [
        'Coaching Culture',
        'Emotional Intelligence',
        'Team Development',
        'Modern Leadership',
      ],
    },
  },
  {
    title:
      'Ultimate Guide to Coaching Methods and Techniques - 7 Effective Models',
    type: 'url',
    source: 'https://coactive.com/blog/coaching-methods-and-techniques',
    description:
      'Comprehensive overview of coaching methodologies including Co-Active Model, GROW Model, CLEAR Model, OSKAR Model, FUEL Model, STEPPA Model, and ACHIEVE Model. Covers coaching styles from directive to transformational, with practical applications for each approach.',
    metadata: {
      author: 'Co-Active Training Institute',
      readingTime: '12 minutes',
      topics: [
        'Coaching Models',
        'Co-Active Coaching',
        'GROW Model',
        'Coaching Techniques',
      ],
    },
  },
  {
    title: '10 Coaching Models and Styles for Workplace Success',
    type: 'url',
    source: 'https://www.aihr.com/blog/coaching-models/',
    description:
      'Detailed guide to workplace coaching covering GROW, OSKAR, CLEAR, FUEL, and Peer Coaching models. Explores five coaching styles: directive, non-directive, autocratic, democratic/collaborative, and laissez-faire. Includes pros, cons, and ideal applications for each approach.',
    metadata: {
      author: 'AIHR (Academy to Innovate HR)',
      readingTime: '11 minutes',
      topics: [
        'Workplace Coaching',
        'HR Development',
        'Performance Management',
        'Coaching Styles',
      ],
    },
  },
  {
    title:
      'Effective Coaching Techniques - 5 Tips to Ignite Employee Potential',
    type: 'url',
    source:
      'https://hsi.com/blog/effective-coaching-techniques-in-the-workplace-tips-to-ignite-potential',
    description:
      'Practical coaching guide covering five key techniques: building mutual trust, personalizing coaching approaches, fostering self-awareness over criticism, challenging employee thinking, and being open to feedback. Explains the difference between managing and coaching for new managers.',
    metadata: {
      author: 'Health & Safety Institute (HSI)',
      readingTime: '8 minutes',
      topics: [
        'Employee Coaching',
        'Management Skills',
        'Performance Improvement',
        'Workplace Development',
      ],
    },
  },
];

async function ingestDocuments() {
  console.log('🚀 ApexCoachAI Knowledge Base Content Ingestion');
  console.log('================================================\n');

  const API_BASE =
    process.env.API_BASE_URL || 'https://api.apexcoachai.shtrial.com';
  const AUTH_TOKEN = process.env.AUTH_TOKEN;

  if (!AUTH_TOKEN) {
    console.error('❌ Error: AUTH_TOKEN environment variable not set');
    console.log('\nUsage:');
    console.log('  $env:AUTH_TOKEN="your-admin-token"');
    console.log('  node scripts/ingest-coaching-content.js');
    process.exit(1);
  }

  console.log(`📡 API Base URL: ${API_BASE}`);
  console.log(`📄 Documents to ingest: ${coachingDocuments.length}\n`);

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < coachingDocuments.length; i++) {
    const doc = coachingDocuments[i];
    console.log(
      `\n[${i + 1}/${coachingDocuments.length}] Ingesting: ${doc.title}`
    );
    console.log(`   Source: ${doc.source}`);

    try {
      const response = await fetch(`${API_BASE}/admin/knowledge-base`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          title: doc.title,
          type: doc.type,
          source: doc.source,
          description: doc.description,
          metadata: doc.metadata,
          program_id: null, // Available to all programs
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(
          `   ✅ Success! Document ID: ${result.document?.id || 'N/A'}`
        );
        successCount++;
      } else {
        const error = await response.text();
        console.log(`   ❌ Failed: ${response.status} ${response.statusText}`);
        console.log(`   Error: ${error}`);
        failureCount++;
      }
    } catch (error) {
      console.log(`   ❌ Exception: ${error.message}`);
      failureCount++;
    }

    // Small delay between requests
    if (i < coachingDocuments.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  console.log('\n================================================');
  console.log('📊 Ingestion Summary');
  console.log('================================================');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);
  console.log(`📈 Total: ${coachingDocuments.length}`);
  console.log('\n💡 Next Steps:');
  console.log('1. Visit https://apexcoachai.shtrial.com/admin/knowledge-base');
  console.log('2. Monitor training status for each document');
  console.log('3. Once trained, test RAG responses in chat');
  console.log('4. Verify citations appear in responses\n');
}

ingestDocuments().catch((error) => {
  console.error('\n❌ Fatal Error:', error);
  process.exit(1);
});
