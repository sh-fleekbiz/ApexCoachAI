# Quick conversion script for remaining SQLite repos to PostgreSQL
$repoPath = "H:\Repos\sh-fleekbiz\ApexCoachAI\apps\backend\search\src\db"

# Analytics Repository
$content = @"
import { withClient } from '@shared/data';

export const analyticsRepository = {
  async getAnalytics(since: string): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalChats: number;
    chatMessages: number;
    searchQueries: number;
  }> {
    return withClient(async (client) => {
      const totalUsersResult = await client.query('SELECT COUNT(*) as count FROM users');
      const totalUsers = parseInt(totalUsersResult.rows[0].count, 10);

      const activeUsersResult = await client.query(
        'SELECT COUNT(DISTINCT user_id) as count FROM usage_events WHERE created_at >= `$1',
        [since]
      );
      const activeUsers = parseInt(activeUsersResult.rows[0].count, 10);

      const totalChatsResult = await client.query('SELECT COUNT(*) as count FROM chats');
      const totalChats = parseInt(totalChatsResult.rows[0].count, 10);

      const chatMessagesResult = await client.query(
        'SELECT COUNT(*) as count FROM usage_events WHERE type = `$1 AND created_at >= `$2',
        ['chat_message', since]
      );
      const chatMessages = parseInt(chatMessagesResult.rows[0].count, 10);

      const searchQueriesResult = await client.query(
        'SELECT COUNT(*) as count FROM usage_events WHERE type = `$1 AND created_at >= `$2',
        ['search_query', since]
      );
      const searchQueries = parseInt(searchQueriesResult.rows[0].count, 10);

      return { totalUsers, activeUsers, totalChats, chatMessages, searchQueries };
    });
  },
};
"@
Set-Content "$repoPath\analytics-repository.ts" $content

# Invitation Repository
$content = @"
import { withClient } from '@shared/data';

export interface Invitation {
  id: number;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'COACH' | 'USER';
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';
  invited_by_user_id: number;
  created_at: string;
  accepted_at: string | null;
}

export const invitationRepository = {
  async createInvitation(invitation: Omit<Invitation, 'id' | 'status' | 'created_at' | 'accepted_at'>): Promise<Invitation> {
    return withClient(async (client) => {
      const result = await client.query(
        'INSERT INTO invitations (email, role, invited_by_user_id) VALUES (`$1, `$2, `$3) RETURNING *',
        [invitation.email, invitation.role, invitation.invited_by_user_id]
      );
      return result.rows[0] as Invitation;
    });
  },

  async getInvitationById(id: number): Promise<Invitation | undefined> {
    return withClient(async (client) => {
      const result = await client.query('SELECT * FROM invitations WHERE id = `$1', [id]);
      return result.rows.length > 0 ? (result.rows[0] as Invitation) : undefined;
    });
  },

  async getAllInvitations(): Promise<Invitation[]> {
    return withClient(async (client) => {
      const result = await client.query('SELECT * FROM invitations');
      return result.rows as Invitation[];
    });
  },

  async updateInvitationStatus(id: number, status: Invitation['status']): Promise<void> {
    return withClient(async (client) => {
      await client.query('UPDATE invitations SET status = `$1 WHERE id = `$2', [status, id]);
    });
  },
};
"@
Set-Content "$repoPath\invitation-repository.ts" $content

# Knowledge Base Repository
$content = @"
import { withClient } from '@shared/data';

export const knowledgeBaseRepository = {
  async getKnowledgeBaseStats(): Promise<{
    totalResources: number;
    indexed: number;
    processing: number;
    failed: number;
    documents: any[];
  }> {
    return withClient(async (client) => {
      const totalResourcesResult = await client.query('SELECT COUNT(*) as count FROM library_resources');
      const totalResources = parseInt(totalResourcesResult.rows[0].count, 10);

      const indexedResult = await client.query('SELECT COUNT(*) as count FROM kb_documents WHERE status = `$1', ['indexed']);
      const indexed = parseInt(indexedResult.rows[0].count || '0', 10);

      const processingResult = await client.query('SELECT COUNT(*) as count FROM kb_documents WHERE status = `$1', ['processing']);
      const processing = parseInt(processingResult.rows[0].count || '0', 10);

      const failedResult = await client.query('SELECT COUNT(*) as count FROM kb_documents WHERE status = `$1', ['failed']);
      const failed = parseInt(failedResult.rows[0].count || '0', 10);

      const documentsResult = await client.query('SELECT * FROM kb_documents');
      const documents = documentsResult.rows;

      return { totalResources, indexed, processing, failed, documents };
    });
  },
};
"@
Set-Content "$repoPath\knowledge-base-repository.ts" $content

Write-Host "✓ Converted analytics-repository.ts"
Write-Host "✓ Converted invitation-repository.ts"
Write-Host "✓ Converted knowledge-base-repository.ts"
Write-Host ""
Write-Host "Still need manual conversion:"
Write-Host "  - program-repository.ts"
Write-Host "  - user-settings-repository.ts"
Write-Host "  - white-label-settings-repository.ts"
