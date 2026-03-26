// ═══════════════════════════════════════════════════════════════════════════
// ORG-F-ENGINE-10 — FINANCE ↔ CHAT WIRING
// ═══════════════════════════════════════════════════════════════════════════
// Chat actions: submit expense, trigger approval, attach evidence, create tasks, view burn alerts
// Version: 1.0 | Build: ENGINE-10

import { ChatFinanceCommand, ChatFinanceAction } from './types';

/**
 * Execute chat finance command
 * Routes chat actions to finance operations
 */
export function executeChatFinanceCommand(
  command: ChatFinanceCommand
): { success: boolean; message: string; entityId?: string } {
  try {
    switch (command.commandType) {
      case 'submit-expense':
        return executeSubmitExpense(command);
      case 'trigger-approval':
        return executeTriggerApproval(command);
      case 'attach-evidence':
        return executeAttachEvidence(command);
      case 'create-task':
        return executeCreateTask(command);
      case 'view-burn-alert':
        return executeViewBurnAlert(command);
      default:
        return {
          success: false,
          message: 'Unknown command type',
        };
    }
  } catch (error) {
    return {
      success: false,
      message: `Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Submit expense from chat
 */
function executeSubmitExpense(command: ChatFinanceCommand): { success: boolean; message: string; entityId?: string } {
  const { expenseAmount, expenseNarration } = command.payload;

  if (!expenseAmount || !expenseNarration) {
    return {
      success: false,
      message: 'Missing expense amount or narration',
    };
  }

  // Generate expense ID
  const expenseId = `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // In real implementation, this would create a transaction in the ledger
  // For now, we simulate it
  console.log('Creating expense:', {
    id: expenseId,
    amount: expenseAmount,
    narration: expenseNarration,
    submittedFrom: 'chat',
    channelId: command.channelId,
    messageId: command.messageId,
    submittedBy: command.triggeredBy,
  });

  return {
    success: true,
    message: `Expense of $${expenseAmount.toFixed(2)} submitted successfully`,
    entityId: expenseId,
  };
}

/**
 * Trigger approval from chat
 */
function executeTriggerApproval(command: ChatFinanceCommand): { success: boolean; message: string; entityId?: string } {
  const { approvalType } = command.payload;

  if (!approvalType) {
    return {
      success: false,
      message: 'Missing approval type',
    };
  }

  const approvalId = `approval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  console.log('Triggering approval:', {
    id: approvalId,
    type: approvalType,
    channelId: command.channelId,
    messageId: command.messageId,
    triggeredBy: command.triggeredBy,
  });

  return {
    success: true,
    message: `Approval request created for ${approvalType}`,
    entityId: approvalId,
  };
}

/**
 * Attach evidence from chat
 */
function executeAttachEvidence(command: ChatFinanceCommand): { success: boolean; message: string; entityId?: string } {
  const { evidenceUrl } = command.payload;

  if (!evidenceUrl) {
    return {
      success: false,
      message: 'Missing evidence URL',
    };
  }

  const evidenceId = `evidence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  console.log('Attaching evidence:', {
    id: evidenceId,
    url: evidenceUrl,
    channelId: command.channelId,
    messageId: command.messageId,
    attachedBy: command.triggeredBy,
  });

  return {
    success: true,
    message: 'Evidence attached successfully',
    entityId: evidenceId,
  };
}

/**
 * Create task from chat
 */
function executeCreateTask(command: ChatFinanceCommand): { success: boolean; message: string; entityId?: string } {
  const { taskTitle, projectId } = command.payload;

  if (!taskTitle) {
    return {
      success: false,
      message: 'Missing task title',
    };
  }

  const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  console.log('Creating task from chat:', {
    id: taskId,
    title: taskTitle,
    projectId,
    channelId: command.channelId,
    messageId: command.messageId,
    createdBy: command.triggeredBy,
  });

  return {
    success: true,
    message: `Task "${taskTitle}" created successfully`,
    entityId: taskId,
  };
}

/**
 * View burn alert from chat
 */
function executeViewBurnAlert(command: ChatFinanceCommand): { success: boolean; message: string; entityId?: string } {
  // This would typically fetch and display burn alerts
  return {
    success: true,
    message: 'Burn alerts retrieved successfully',
  };
}

/**
 * Parse chat message for finance commands
 * Detects slash commands like /expense, /approve, /evidence, /task
 */
export function parseChatMessageForFinanceCommand(
  message: string,
  channelId: string,
  messageId: string,
  userId: string
): ChatFinanceCommand | null {
  const trimmedMessage = message.trim();

  // /expense <amount> <narration>
  const expenseMatch = trimmedMessage.match(/^\/expense\s+(\d+(?:\.\d+)?)\s+(.+)$/i);
  if (expenseMatch) {
    const [, amount, narration] = expenseMatch;
    return {
      commandType: 'submit-expense',
      channelId,
      messageId,
      triggeredBy: userId,
      payload: {
        expenseAmount: parseFloat(amount),
        expenseNarration: narration,
      },
      executedAt: new Date().toISOString(),
    };
  }

  // /approve <type>
  const approveMatch = trimmedMessage.match(/^\/approve\s+(.+)$/i);
  if (approveMatch) {
    const [, type] = approveMatch;
    return {
      commandType: 'trigger-approval',
      channelId,
      messageId,
      triggeredBy: userId,
      payload: {
        approvalType: type,
      },
      executedAt: new Date().toISOString(),
    };
  }

  // /evidence <url>
  const evidenceMatch = trimmedMessage.match(/^\/evidence\s+(.+)$/i);
  if (evidenceMatch) {
    const [, url] = evidenceMatch;
    return {
      commandType: 'attach-evidence',
      channelId,
      messageId,
      triggeredBy: userId,
      payload: {
        evidenceUrl: url,
      },
      executedAt: new Date().toISOString(),
    };
  }

  // /task <title> [project:<projectId>]
  const taskMatch = trimmedMessage.match(/^\/task\s+(.+?)(?:\s+project:(\S+))?$/i);
  if (taskMatch) {
    const [, title, projectId] = taskMatch;
    return {
      commandType: 'create-task',
      channelId,
      messageId,
      triggeredBy: userId,
      payload: {
        taskTitle: title,
        projectId: projectId || undefined,
      },
      executedAt: new Date().toISOString(),
    };
  }

  // /burn
  if (trimmedMessage.match(/^\/burn$/i)) {
    return {
      commandType: 'view-burn-alert',
      channelId,
      messageId,
      triggeredBy: userId,
      payload: {},
      executedAt: new Date().toISOString(),
    };
  }

  return null;
}

/**
 * Generate chat response for finance command
 */
export function generateChatResponseForCommand(
  command: ChatFinanceCommand,
  result: { success: boolean; message: string; entityId?: string }
): {
  messageType: 'success' | 'error' | 'info';
  title: string;
  message: string;
  actions?: Array<{ label: string; action: string; entityId?: string }>;
} {
  if (!result.success) {
    return {
      messageType: 'error',
      title: 'Command Failed',
      message: result.message,
    };
  }

  switch (command.commandType) {
    case 'submit-expense':
      return {
        messageType: 'success',
        title: 'Expense Submitted',
        message: result.message,
        actions: [
          { label: 'View Expense', action: 'view-expense', entityId: result.entityId },
          { label: 'Add Receipt', action: 'add-receipt', entityId: result.entityId },
        ],
      };

    case 'trigger-approval':
      return {
        messageType: 'success',
        title: 'Approval Requested',
        message: result.message,
        actions: [
          { label: 'View Request', action: 'view-approval', entityId: result.entityId },
        ],
      };

    case 'attach-evidence':
      return {
        messageType: 'success',
        title: 'Evidence Attached',
        message: result.message,
      };

    case 'create-task':
      return {
        messageType: 'success',
        title: 'Task Created',
        message: result.message,
        actions: [
          { label: 'View Task', action: 'view-task', entityId: result.entityId },
          { label: 'Assign Task', action: 'assign-task', entityId: result.entityId },
        ],
      };

    case 'view-burn-alert':
      return {
        messageType: 'info',
        title: 'Burn Alerts',
        message: result.message,
        actions: [
          { label: 'View Details', action: 'view-burn-details' },
          { label: 'Export Report', action: 'export-burn-report' },
        ],
      };

    default:
      return {
        messageType: 'info',
        title: 'Command Executed',
        message: result.message,
      };
  }
}

/**
 * Get available finance commands for chat
 */
export function getAvailableFinanceCommands(): Array<{
  command: string;
  description: string;
  syntax: string;
  example: string;
}> {
  return [
    {
      command: '/expense',
      description: 'Submit an expense',
      syntax: '/expense <amount> <narration>',
      example: '/expense 125.50 Client lunch at downtown restaurant',
    },
    {
      command: '/approve',
      description: 'Trigger an approval request',
      syntax: '/approve <type>',
      example: '/approve expense-reimbursement',
    },
    {
      command: '/evidence',
      description: 'Attach evidence/receipt',
      syntax: '/evidence <url>',
      example: '/evidence https://receipts.example.com/abc123.pdf',
    },
    {
      command: '/task',
      description: 'Create a task',
      syntax: '/task <title> [project:<projectId>]',
      example: '/task Review Q1 financials project:proj-001',
    },
    {
      command: '/burn',
      description: 'View burn rate alerts',
      syntax: '/burn',
      example: '/burn',
    },
  ];
}

/**
 * Validate chat finance command
 */
export function validateChatFinanceCommand(
  command: ChatFinanceCommand
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!command.channelId) {
    errors.push('Missing channel ID');
  }

  if (!command.messageId) {
    errors.push('Missing message ID');
  }

  if (!command.triggeredBy) {
    errors.push('Missing user ID');
  }

  switch (command.commandType) {
    case 'submit-expense':
      if (!command.payload.expenseAmount || command.payload.expenseAmount <= 0) {
        errors.push('Invalid expense amount');
      }
      if (!command.payload.expenseNarration) {
        errors.push('Missing expense narration');
      }
      break;

    case 'trigger-approval':
      if (!command.payload.approvalType) {
        errors.push('Missing approval type');
      }
      break;

    case 'attach-evidence':
      if (!command.payload.evidenceUrl) {
        errors.push('Missing evidence URL');
      }
      break;

    case 'create-task':
      if (!command.payload.taskTitle) {
        errors.push('Missing task title');
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
